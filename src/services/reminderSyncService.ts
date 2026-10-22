import { getPets } from "./petsService";
import { getAllHistory } from "./historyService";
import {
    hasNotificationPermission,
    cancelAllHistoryReminders,
    scheduleHistoryReminder
} from "./notificationService";

// O iOS aceita no máximo 64 notificações locais pendentes
const MAX_SCHEDULED_REMINDERS = 50;

// Recria no aparelho os lembretes futuros do usuário a partir do Firestore.
// shouldContinue permite interromper se a sessão mudar no meio da sincronização.
export async function syncUserReminders(
    uid: string,
    shouldContinue: () => boolean = () => true
): Promise<number> {

    if (!(await hasNotificationPermission())) return 0;

    const [pets, history] = await Promise.all([getPets(uid), getAllHistory(uid)]);

    if (!shouldContinue()) return 0;

    const petNames = new Map(pets.map((pet) => [pet.id, pet.name]));
    const now = Date.now();

    const upcoming = history
        .filter((record): record is typeof record & { reminderAt: number } =>
            typeof record.reminderAt === "number" && record.reminderAt > now
        )
        .sort((a, b) => a.reminderAt - b.reminderAt)
        .slice(0, MAX_SCHEDULED_REMINDERS);

    await cancelAllHistoryReminders();

    let scheduled = 0;

    for (const record of upcoming) {

        if (!shouldContinue()) break;

        try {
            const ok = await scheduleHistoryReminder({
                recordId: record.id,
                petId: record.petId,
                petName: petNames.get(record.petId) ?? "seu pet",
                description: record.description,
                at: new Date(record.reminderAt)
            });

            if (ok) scheduled++;
        } catch (error) {
            console.warn(`Não foi possível reagendar o lembrete ${record.id}.`, error);
        }
    }

    return scheduled;
}
