import { useMemo } from "react";
import { ThemeColors } from "../constants/colors";
import { useTheme } from "../contexts/ThemeContext";

export function useThemedStyles<T>(createStyles: (colors: ThemeColors) => T): T {

    const { colors } = useTheme();

    return useMemo(() => createStyles(colors), [createStyles, colors]);
}
