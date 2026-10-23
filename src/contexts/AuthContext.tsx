import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    User
} from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { cancelAllHistoryReminders, dismissPresentedHistoryReminders } from "../services/notificationService";
import { stopReminderSync } from "../services/reminderSyncService";

interface AuthContextData {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

function getAuthErrorMessage(error: unknown): string {

    const code = (error as { code?: string })?.code;

    switch (code) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
            return "E-mail ou senha inválidos.";

        case "auth/email-already-in-use":
            return "Este e-mail já está cadastrado.";

        case "auth/weak-password":
            return "A senha deve ter no mínimo 6 caracteres.";

        case "auth/invalid-email":
            return "Digite um e-mail válido.";

        case "auth/too-many-requests":
            return "Muitas tentativas. Tente novamente mais tarde.";

        case "auth/network-request-failed":
            return "Falha de conexão. Verifique sua internet.";

        default:
            return "Não foi possível concluir a operação. Tente novamente.";
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    async function signIn(email: string, password: string) {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            throw new Error(getAuthErrorMessage(error));
        }
    }

    async function signUp(email: string, password: string) {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            throw new Error(getAuthErrorMessage(error));
        }
    }

    async function signOut() {
        // Lembretes deste usuário não podem disparar para o próximo que entrar no aparelho
        try {
            // Para a sincronização antes de cancelar, para ela não reagendar depois
            stopReminderSync();
            await cancelAllHistoryReminders();
            await dismissPresentedHistoryReminders();
        } catch (error) {
            console.warn("Falha ao cancelar lembretes no logout.", error);
        }

        try {
            await firebaseSignOut(auth);
        } catch (error) {
            throw new Error(getAuthErrorMessage(error));
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signIn,
                signUp,
                signOut
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }

    return context;
}
