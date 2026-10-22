import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { AndroidImportance } from "expo-notifications";

const REMINDER_CHANNEL_ID = "lembretes";

let initialized = false;

function reminderIdentifier(recordId: string): string {
    return `history-reminder-${recordId}`;
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
            data: { petId, type: "history-reminder" }
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
