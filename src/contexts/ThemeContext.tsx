import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightColors, darkColors, ThemeColors } from "../constants/colors";

export type ThemeMode = "system" | "light" | "dark";
export type ColorScheme = "light" | "dark";

interface ThemeContextData {
    mode: ThemeMode;
    scheme: ColorScheme;
    colors: ThemeColors;
    isDark: boolean;
    setMode: (mode: ThemeMode) => void;
    toggleTheme: () => void;
}

const STORAGE_KEY = "@petguardian:themeMode";

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

function isThemeMode(value: string | null): value is ThemeMode {
    return value === "system" || value === "light" || value === "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {

    const systemScheme: ColorScheme = useColorScheme() === "dark" ? "dark" : "light";

    // Enquanto a preferência salva não carrega, "system" segue o aparelho
    const [mode, setModeState] = useState<ThemeMode>("system");

    useEffect(() => {

        let active = true;

        async function loadStoredMode() {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);

                if (active && isThemeMode(stored)) {
                    setModeState(stored);
                }
            } catch {
                // Sem preferência salva: mantém o tema do sistema
            }
        }

        loadStoredMode();

        return () => {
            active = false;
        };

    }, []);

    const setMode = useCallback((nextMode: ThemeMode) => {
        setModeState(nextMode);
        AsyncStorage.setItem(STORAGE_KEY, nextMode).catch(() => {});
    }, []);

    const scheme: ColorScheme = mode === "system" ? systemScheme : mode;
    const isDark = scheme === "dark";

    const toggleTheme = useCallback(() => {
        setMode(isDark ? "light" : "dark");
    }, [isDark, setMode]);

    const value = useMemo<ThemeContextData>(() => ({
        mode,
        scheme,
        colors: isDark ? darkColors : lightColors,
        isDark,
        setMode,
        toggleTheme
    }), [mode, scheme, isDark, setMode, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
