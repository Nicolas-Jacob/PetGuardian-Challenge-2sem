import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { useResourceMutation } from "./createResourceHooks";
import { getPets, addPet, updatePet, deletePet } from "../services/petsService";
import { getHistoryByPet, deleteHistoryRecord } from "../services/historyService";
import { cancelHistoryReminder } from "../services/notificationService";
import { Pet } from "../types";

export function usePets() {

    const { user } = useAuth();

    return useQuery({
        queryKey: ["pets", user?.uid],
        queryFn: () => getPets(user!.uid),
        enabled: !!user
    });
}

// Lê o pet do cache já carregado por usePets, sem disparar nova busca
export function usePetById(petId: string): Pet | undefined {

    const { user } = useAuth();
    const queryClient = useQueryClient();

    return queryClient
        .getQueryData<Pet[]>(["pets", user?.uid])
        ?.find((pet) => pet.id === petId);
}

export function useAddPet() {
    return useResourceMutation(
        (uid, data: Omit<Pet, "id" | "createdAt">) => addPet(uid, data),
        (uid) => ["pets", uid]
    );
}

export function useUpdatePet() {
    return useResourceMutation(
        (uid, { petId, data }: { petId: string; data: Partial<Pet> }) =>
            updatePet(uid, petId, data),
        (uid) => ["pets", uid]
    );
}

export function useDeletePet() {

    const queryClient = useQueryClient();

    return useResourceMutation(
        async (uid, petId: string) => {
            try {
                // Remove o histórico antes do pet para não deixar registros nem lembretes órfãos
                const records = await getHistoryByPet(uid, petId);

                const results = await Promise.allSettled(
                    records.map(async (record) => {
                        await deleteHistoryRecord(uid, record.id);

                        // Só cancela o lembrete de um registro que realmente saiu do Firestore
                        await cancelHistoryReminder(record.id).catch((error) => {
                            console.warn(`Não foi possível cancelar o lembrete ${record.id}.`, error);
                        });
                    })
                );

                const failure = results.find(
                    (result): result is PromiseRejectedResult => result.status === "rejected"
                );

                // Algum registro ficou: o pet não pode ser excluído
                if (failure) throw failure.reason;

                await deletePet(uid, petId);
            } finally {
                // Reflete o estado real do histórico mesmo quando a exclusão falha
                queryClient.invalidateQueries({ queryKey: ["history", uid, petId] });
            }
        },
        (uid) => ["pets", uid]
    );
}
