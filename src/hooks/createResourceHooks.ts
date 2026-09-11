import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";

export function useResourceMutation<TVariables, TData = void>(
    mutationFn: (uid: string, variables: TVariables) => Promise<TData>,
    invalidateKey: (uid: string | undefined, variables: TVariables) => readonly unknown[]
) {

    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: TVariables) => mutationFn(user!.uid, variables),

        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: invalidateKey(user?.uid, variables)
            });
        }
    });
}
