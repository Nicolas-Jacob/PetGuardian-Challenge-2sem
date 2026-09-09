import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import {
    getHistoryByPet,
    addHistoryRecord,
    updateHistoryRecord,
    deleteHistoryRecord
} from "../services/historyService";
import { HistoryRecord } from "../types";

export function useHistoryByPet(petId: string) {

    const { user } = useAuth();

    return useQuery({
        queryKey: ["history", user?.uid, petId],
        queryFn: () => getHistoryByPet(user!.uid, petId),
        enabled: !!user && !!petId
    });
}

export function useAddHistoryRecord() {

    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Omit<HistoryRecord, "id" | "createdAt">) =>
            addHistoryRecord(user!.uid, data),

        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["history", user?.uid, variables.petId]
            });
        }
    });
}

export function useUpdateHistoryRecord() {

    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            recordId,
            data
        }: {
            recordId: string;
            petId: string;
            data: Partial<HistoryRecord>;
        }) => updateHistoryRecord(user!.uid, recordId, data),

        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["history", user?.uid, variables.petId]
            });
        }
    });
}

export function useDeleteHistoryRecord() {

    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            recordId
        }: {
            recordId: string;
            petId: string;
        }) => deleteHistoryRecord(user!.uid, recordId),

        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["history", user?.uid, variables.petId]
            });
        }
    });
}
