import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { usePets } from "./usePets";
import { getAllHistory } from "../services/historyService";
import { ChatDataStatus } from "../utils/chatEngine";

export function useChatData() {

    const { user } = useAuth();
    const petsQuery = usePets();

    // As mutations de histórico invalidam só ["history", uid, petId], que não atinge
    // esta chave: por isso ela sempre rebusca ao abrir o chat.
    const historyQuery = useQuery({
        queryKey: ["history", user?.uid, "all"],
        queryFn: () => getAllHistory(user!.uid),
        enabled: !!user,
        staleTime: 0,
        refetchOnMount: "always"
    });

    let status: ChatDataStatus = "ready";

    if (petsQuery.isError || historyQuery.isError) {
        status = "error";
    } else if (petsQuery.isPending || historyQuery.isPending) {
        status = "loading";
    }

    return {
        pets: petsQuery.data ?? [],
        history: historyQuery.data ?? [],
        status
    };
}
