import { useQuery, useQueryClient } from "@tanstack/react-query";
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
    return useResourceMutation(
        (uid, petId: string) => deletePet(uid, petId),
        (uid) => ["pets", uid]
    );
}
