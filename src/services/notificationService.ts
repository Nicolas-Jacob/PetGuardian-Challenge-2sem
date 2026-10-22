import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { AndroidImportance } from "expo-notifications";

const REMINDER_CHANNEL_ID = "lembretes";

// recordId é opcional: lembretes agendados antes dele existir não o trazem
export type NotificationTarget = { petId: string; recordId?: string };

const REMINDER_ID_PREFIX = "history-reminder-";

let initialized = false;

function reminderIdentifier(recordId: string): string {
    return `${REMINDER_ID_PREFIX}${recordId}`;
}

export function initNotifications(): void {

    if (initialized) return;
    initialized = true;

    // Exibe a notificação mesmo com o app aberto
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: true,
            shouldSetBadge: false
        })
    });

    if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
            name: "Lembretes de saúde",
            importance: AndroidImportance.HIGH
        }).catch(() => {
            initialized = false;
        });
    }
}

// Só consulta; nunca abre o diálogo de permissão
export async function hasNotificationPermission(): Promise<boolean> {
    try {
        const current = await Notifications.getPermissionsAsync();

        return current.granted;
    } catch {
        return false;
    }
}

export async function ensureNotificationPermission(): Promise<boolean> {

    const current = await Notifications.getPermissionsAsync();

    if (current.granted) return true;
    if (!current.canAskAgain) return false;

    const requested = await Notifications.requestPermissionsAsync();

    return requested.granted;
}

interface HistoryReminderInput {
    recordId: string;
    petId: string;
    petName: string;
    description: string;
    at: Date;
}

export async function scheduleHistoryReminder({
    recordId,
    petId,
    petName,
    description,
    at
}: HistoryReminderInput): Promise<boolean> {

    if (at.getTime() <= Date.now()) return false;

    const hasPermission = await ensureNotificationPermission();

    if (!hasPermission) return false;

    // Mesmo identificador substitui o agendamento anterior do registro
    await Notifications.scheduleNotificationAsync({
        identifier: reminderIdentifier(recordId),
        content: {
            title: `Lembrete de saúde: ${petName}`,
            body: `Hora de cuidar: ${description}`,
            data: { petId, recordId, type: "history-reminder" }
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: at,
            channelId: REMINDER_CHANNEL_ID
        }
    });

    return true;
}

export async function cancelHistoryReminder(recordId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(reminderIdentifier(recordId));
}

// Cancela apenas os lembretes de histórico, preservando outros tipos de notificação
export async function cancelAllHistoryReminders(): Promise<void> {
    try {
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();

        const reminders = scheduled.filter((request) =>
            request.identifier.startsWith(REMINDER_ID_PREFIX) ||
            request.content.data?.type === "history-reminder"
        );

        await Promise.all(
            reminders.map((request) =>
                Notifications.cancelScheduledNotificationAsync(request.identifier)
            )
        );
    } catch (error) {
        console.warn("Não foi possível cancelar os lembretes agendados.", error);
    }
}

// Função pura: só interpreta o toque, não navega
export function parseNotificationTarget(
    response: Notifications.NotificationResponse
): NotificationTarget | null {

    const data = response.notification.request.content.data;

    if (!data || data.type !== "history-reminder") return null;
    if (typeof data.petId !== "string" || data.petId.length === 0) return null;

    const recordId =
        typeof data.recordId === "string" && data.recordId.length > 0
            ? data.recordId
            : undefined;

    return recordId ? { petId: data.petId, recordId } : { petId: data.petId };
}

// Respostas já tratadas nesta execução; clearLastNotificationResponse cobre recargas
const handledResponses = new Set<string>();

function consumeResponse(
    response: Notifications.NotificationResponse | null
): NotificationTarget | null {

    if (!response) return null;
    if (response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return null;

    const key = `${response.notification.request.identifier}:${response.notification.date}`;

    if (handledResponses.has(key)) return null;

    const target = parseNotificationTarget(response);

    if (!target) return null;

    handledResponses.add(key);
    Notifications.clearLastNotificationResponse();

    return target;
}

// Toque que abriu o app a partir do estado fechado (cold start)
export function consumeInitialNotificationTarget(): NotificationTarget | null {
    return consumeResponse(Notifications.getLastNotificationResponse());
}

// Toques com o app em foreground ou background
export function addNotificationTargetListener(
    listener: (target: NotificationTarget) => void
): () => void {

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
        const target = consumeResponse(response);

        if (target) listener(target);
    });

    return () => subscription.remove();
}
