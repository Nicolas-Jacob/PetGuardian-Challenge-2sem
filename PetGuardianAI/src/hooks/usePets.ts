import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { useResourceMutation } from "./createResourceHooks";
import { getPets, addPet, updatePet, deletePet } from "../services/petsService";
import { Pet } from "../types";

export function usePets() {

    const { user } = useAuth();

    return useQuery({
        queryKey: ["pets", user?.uid],
        queryFn: () => getPets(user!.uid),
        enabled: !!user
    });
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
    return useResourceMutation(
        (uid, petId: string) => deletePet(uid, petId),
        (uid) => ["pets", uid]
    );
}
