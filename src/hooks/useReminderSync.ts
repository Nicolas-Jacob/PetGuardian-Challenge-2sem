import { useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { syncUserReminders } from "../services/reminderSyncService";

export function useReminderSync() {

    const { user } = useAuth();
    const uid = user?.uid;

    // uid já sincronizado nesta sessão, para não repetir a cada render
    const syncedUidRef = useRef<string | null>(null);

    useEffect(() => {

        if (!uid) {
            // Logout: no próximo login (mesmo que do mesmo usuário) sincroniza de novo
            syncedUidRef.current = null;
            return;
        }

        if (syncedUidRef.current === uid) return;

        syncedUidRef.current = uid;

        let cancelled = false;
        let completed = false;

        async function runSync(currentUid: string) {
            try {
                await syncUserReminders(currentUid, () => !cancelled);
            } catch (error) {
                console.warn("Não foi possível sincronizar os lembretes.", error);
            } finally {
                completed = true;
            }
        }

        runSync(uid);

        return () => {
            cancelled = true;

            // Interrompida antes de terminar: permite que a próxima execução tente de novo
            if (!completed) syncedUidRef.current = null;
        };

    }, [uid]);
}
