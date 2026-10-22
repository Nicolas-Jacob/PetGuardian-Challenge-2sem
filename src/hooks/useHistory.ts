import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { useResourceMutation } from "./createResourceHooks";
import {
    getHistoryByPet,
    addHistoryRecord,
    updateHistoryRecord,
    deleteHistoryRecord
} from "../services/historyService";
import {
    scheduleHistoryReminder,
    cancelHistoryReminder,
    hasNotificationPermission
} from "../services/notificationService";
import { HistoryRecord } from "../types";

interface ReminderResult {
    reminderRequested: boolean;
    reminderScheduled: boolean;
}

interface ReminderTarget {
    recordId: string;
    petId: string;
    petName: string;
    description: string;
    reminderAt: number;
}

// Falhas de notificação nunca devem desfazer o que já foi salvo no Firestore
async function safeSchedule({ reminderAt, ...target }: ReminderTarget): Promise<boolean> {
    try {
        return await scheduleHistoryReminder({ ...target, at: new Date(reminderAt) });
    } catch {
        return false;
    }
}

async function safeCancel(recordId: string): Promise<void> {
    try {
        await cancelHistoryReminder(recordId);
    } catch {
        // Nada agendado para este registro
    }
}

export function useHistoryByPet(petId: string) {

    const { user } = useAuth();

    return useQuery({
        queryKey: ["history", user?.uid, petId],
        queryFn: () => getHistoryByPet(user!.uid, petId),
        enabled: !!user && !!petId
    });
}

export function useAddHistoryRecord() {
    return useResourceMutation(
        async (
            uid,
            { petName, reminderAt, ...data }: Omit<HistoryRecord, "id" | "createdAt"> & { petName: string }
        ): Promise<ReminderResult & { id: string }> => {

            const hasReminder = typeof reminderAt === "number";

            // Sem lembrete a chave é omitida: o Firestore rejeita undefined
            const id = await addHistoryRecord(
                uid,
                hasReminder ? { ...data, reminderAt } : data
            );

            const reminderScheduled = hasReminder
                ? await safeSchedule({
                    recordId: id,
                    petId: data.petId,
                    petName,
                    description: data.description,
                    reminderAt
                })
                : false;

            return { id, reminderRequested: hasReminder, reminderScheduled };
        },
        (uid, variables) => ["history", uid, variables.petId]
    );
}

export function useUpdateHistoryRecord() {

    const queryClient = useQueryClient();

    return useResourceMutation(
        async (
            uid,
            {
                recordId,
                petId,
                data,
                petName,
                previousReminderAt
            }: {
                recordId: string;
                petId: string;
                data: Partial<HistoryRecord>;
                petName: string;
                previousReminderAt?: number | null;
            }
        ): Promise<ReminderResult> => {

            // Versão anterior do registro, lida do cache antes da invalidação
            const cachedRecord = queryClient
                .getQueryData<HistoryRecord[]>(["history", uid, petId])
                ?.find((record) => record.id === recordId);

            const { reminderAt, ...rest } = data;

            // reminderAt undefined = lembrete não foi tocado; null = removido
            const reminderChanged =
                reminderAt !== undefined &&
                (reminderAt ?? null) !== (previousReminderAt ?? null);

            await updateHistoryRecord(
                uid,
                recordId,
                reminderChanged ? { ...rest, reminderAt } : rest
            );

            if (!reminderChanged) {

                const activeReminderAt = previousReminderAt ?? cachedRecord?.reminderAt ?? null;
                const descriptionChanged =
                    rest.description !== undefined &&
                    rest.description !== cachedRecord?.description;

                // Mesmo identificador: o novo agendamento substitui o texto antigo.
                // Sem permissão já concedida não reagenda (e nunca pede permissão aqui).
                if (
                    descriptionChanged &&
                    typeof activeReminderAt === "number" &&
                    activeReminderAt > Date.now() &&
                    await hasNotificationPermission()
                ) {
                    await safeSchedule({
                        recordId,
                        petId,
                        petName,
                        description: rest.description ?? "",
                        reminderAt: activeReminderAt
                    });
                }

                return { reminderRequested: false, reminderScheduled: false };
            }

            await safeCancel(recordId);

            if (typeof reminderAt !== "number") {
                return { reminderRequested: false, reminderScheduled: false };
            }

            const reminderScheduled = await safeSchedule({
                recordId,
                petId,
                petName,
                description: rest.description ?? "",
                reminderAt
            });

            return { reminderRequested: true, reminderScheduled };
        },
        (uid, variables) => ["history", uid, variables.petId]
    );
}

export function useDeleteHistoryRecord() {
    return useResourceMutation(
        async (uid, { recordId }: { recordId: string; petId: string }) => {
            await deleteHistoryRecord(uid, recordId);
            await safeCancel(recordId);
        },
        (uid, variables) => ["history", uid, variables.petId]
    );
}
