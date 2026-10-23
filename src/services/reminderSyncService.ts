import { getPets } from "./petsService";
import { getAllHistory } from "./historyService";
import {
    hasNotificationPermission,
    cancelAllHistoryReminders,
    cancelHistoryReminder,
    scheduleHistoryReminder
} from "./notificationService";

// O iOS aceita no máximo 64 notificações locais pendentes
const MAX_SCHEDULED_REMINDERS = 50;

// Cada stopReminderSync invalida as execuções em andamento (ex.: no logout)
let syncEpoch = 0;

export function stopReminderSync(): void {
    syncEpoch++;
}

// Recria no aparelho os lembretes futuros do usuário a partir do Firestore.
// shouldContinue permite interromper se a sessão mudar no meio da sincronização.
export async function syncUserReminders(
    uid: string,
    shouldContinue: () => boolean = () => true
): Promise<number> {

    const epoch = syncEpoch;
    const isValid = () => epoch === syncEpoch && shouldContinue();

    if (!(await hasNotificationPermission())) return 0;
    if (!isValid()) return 0;

    // Cancela antes de ler: um lembrete criado durante a leitura não é apagado
    // por uma lista velha, e uma leitura que falha não deixa lembretes de outro usuário
    await cancelAllHistoryReminders();

    const [pets, history] = await Promise.all([getPets(uid), getAllHistory(uid)]);

    if (!isValid()) return 0;

    const petNames = new Map(pets.map((pet) => [pet.id, pet.name]));
    const now = Date.now();

    const upcoming = history
        .filter((record): record is typeof record & { reminderAt: number } =>
            typeof record.reminderAt === "number" && record.reminderAt > now
        )
        .sort((a, b) => a.reminderAt - b.reminderAt)
        .slice(0, MAX_SCHEDULED_REMINDERS);

    // Ids agendados por esta execução; só eles podem ser desfeitos por ela
    const scheduledByThisRun = new Set<string>();

    for (const record of upcoming) {

        if (!isValid()) break;

        try {
            const ok = await scheduleHistoryReminder({
                recordId: record.id,
                petId: record.petId,
                petName: petNames.get(record.petId) ?? "seu pet",
                description: record.description,
                at: new Date(record.reminderAt)
            });

            if (ok) scheduledByThisRun.add(record.id);
        } catch (error) {
            console.warn(`Não foi possível reagendar o lembrete ${record.id}.`, error);
        }

        // Invalidada enquanto agendava: o cancelamento do logout já passou,
        // então desfaz o agendamento que acabou de terminar
        if (!isValid()) {
            if (scheduledByThisRun.has(record.id)) {
                scheduledByThisRun.delete(record.id);
                await cancelHistoryReminder(record.id).catch((error) => {
                    console.warn(`Não foi possível desfazer o lembrete ${record.id}.`, error);
                });
            }
            break;
        }
    }

    return scheduledByThisRun.size;
}
