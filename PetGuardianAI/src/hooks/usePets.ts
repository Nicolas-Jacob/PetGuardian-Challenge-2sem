import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
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

    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Omit<Pet, "id" | "createdAt">) =>
            addPet(user!.uid, data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["pets", user?.uid]
            });
        }
    });
}

export function useUpdatePet() {

    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ petId, data }: { petId: string; data: Partial<Pet> }) =>
            updatePet(user!.uid, petId, data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["pets", user?.uid]
            });
        }
    });
}

export function useDeletePet() {

    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (petId: string) => deletePet(user!.uid, petId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["pets", user?.uid]
            });
        }
    });
}
