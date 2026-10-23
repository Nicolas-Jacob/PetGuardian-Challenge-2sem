import { useCallback, useEffect, useRef } from "react";
import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import {
    NotificationTarget,
    addNotificationTargetListener,
    consumeInitialNotificationTarget
} from "../services/notificationService";

const AUTH_ROUTES = ["login", "register"];

export function useNotificationNavigation() {

    const { user, loading } = useAuth();
    const router = useRouter();
    const segments = useSegments();
    const rootState = useRootNavigationState();

    const pendingTargetRef = useRef<NotificationTarget | null>(null);
    const canNavigateRef = useRef(false);

    // null até o primeiro usuário ser carregado
    const previousUidRef = useRef<string | null>(null);
    const uid = user?.uid ?? null;

    // Só navega com sessão resolvida, navegador montado e fora do fluxo de login.
    // segments vazio é a rota index, que ainda vai redirecionar para /home.
    const canNavigate =
        !loading &&
        !!user &&
        !!rootState?.key &&
        segments.length > 0 &&
        !AUTH_ROUTES.includes(segments[0]);

    const flushPendingTarget = useCallback(() => {

        const target = pendingTargetRef.current;

        if (!target || !canNavigateRef.current) return;

        pendingTargetRef.current = null;

        router.push({
            pathname: "/history/[petId]",
            params: target.recordId
                ? { petId: target.petId, highlight: target.recordId }
                : { petId: target.petId }
        });
    }, [router]);

    // Destino pendente pertence à sessão em que o toque ocorreu: descarta no logout
    // ou na troca de usuário. Antes do primeiro login (cold start sem sessão) mantém.
    useEffect(() => {

        const previousUid = previousUidRef.current;

        if (previousUid !== null && previousUid !== uid) {
            pendingTargetRef.current = null;
        }

        previousUidRef.current = uid;

    }, [uid]);

    useEffect(() => {
        canNavigateRef.current = canNavigate;
        flushPendingTarget();
    }, [canNavigate, flushPendingTarget]);

    useEffect(() => {

        function handleTarget(target: NotificationTarget) {
            pendingTargetRef.current = target;
            flushPendingTarget();
        }

        const initialTarget = consumeInitialNotificationTarget();

        if (initialTarget) handleTarget(initialTarget);

        return addNotificationTargetListener(handleTarget);

    }, [flushPendingTarget]);
}
