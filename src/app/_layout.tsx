import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { COLORS } from "../constants/colors";

const queryClient = new QueryClient();

function RootLayoutNav() {

    const { user, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {

        if (loading) return;

        const inAuthGroup =
            segments[0] === "login" ||
            segments[0] === "register";

        if (!user && !inAuthGroup) {
            router.replace("/login");
        } else if (user && inAuthGroup) {
            router.replace("/home");
        }

    }, [user, loading, segments]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}
        />
    );
}

export default function Layout() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RootLayoutNav />
            </AuthProvider>
        </QueryClientProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background
    }
});
