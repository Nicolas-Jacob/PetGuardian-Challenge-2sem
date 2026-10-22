import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { ThemeColors } from "../constants/colors";

const queryClient = new QueryClient();

function RootLayoutNav() {

    const { colors, isDark } = useTheme();
    const styles = useThemedStyles(createStyles);

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
                <StatusBar style={isDark ? "light" : "dark"} />
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <>
            <StatusBar style={isDark ? "light" : "dark"} />

            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: {
                        backgroundColor: colors.background
                    }
                }}
            />
        </>
    );
}

export default function Layout() {
    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <RootLayoutNav />
                </AuthProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background
    }
});
