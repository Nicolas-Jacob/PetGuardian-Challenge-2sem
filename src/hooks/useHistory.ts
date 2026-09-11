import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { useResourceMutation } from "./createResourceHooks";
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
    return useResourceMutation(
        (uid, data: Omit<HistoryRecord, "id" | "createdAt">) =>
            addHistoryRecord(uid, data),
        (uid, data) => ["history", uid, data.petId]
    );
}

export function useUpdateHistoryRecord() {
    return useResourceMutation(
        (
            uid,
            { recordId, data }: { recordId: string; petId: string; data: Partial<HistoryRecord> }
        ) => updateHistoryRecord(uid, recordId, data),
        (uid, variables) => ["history", uid, variables.petId]
    );
}

export function useDeleteHistoryRecord() {
    return useResourceMutation(
        (uid, { recordId }: { recordId: string; petId: string }) =>
            deleteHistoryRecord(uid, recordId),
        (uid, variables) => ["history", uid, variables.petId]
    );
}
