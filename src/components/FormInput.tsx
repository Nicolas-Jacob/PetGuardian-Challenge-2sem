import { useState } from "react";
import { Text, TextInput, TextInputProps, StyleSheet } from "react-native";
import { ThemeColors } from "../constants/colors";
import { useTheme } from "../contexts/ThemeContext";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { SPACING, RADIUS } from "../constants/spacing";
import { FONT_SIZE, FONT_WEIGHT } from "../constants/typography";

interface Props extends TextInputProps {
    label: string;
    helperText?: string;
}

// Label + campo com destaque de foco; as demais props vão direto para o TextInput
export default function FormInput({
    label,
    helperText,
    style,
    onFocus,
    onBlur,
    ...inputProps
}: Props) {

    const { colors } = useTheme();
    const styles = useThemedStyles(createStyles);

    const [focused, setFocused] = useState(false);

    return (
        <>
            <Text style={styles.label}>
                {label}
            </Text>

            <TextInput
                {...inputProps}
                style={[styles.input, focused && styles.inputFocused, style]}
                placeholderTextColor={colors.placeholder}
                onFocus={(event) => {
                    setFocused(true);
                    onFocus?.(event);
                }}
                onBlur={(event) => {
                    setFocused(false);
                    onBlur?.(event);
                }}
            />

            {helperText ? (
                <Text style={styles.helper}>
                    {helperText}
                </Text>
            ) : null}
        </>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    label: {
        fontSize: FONT_SIZE.caption,
        fontWeight: FONT_WEIGHT.semibold,
        color: colors.textSecondary,
        marginBottom: SPACING.xs,
        marginLeft: SPACING.xs
    },

    input: {
        backgroundColor: colors.inputBackground,
        borderWidth: 1.5,
        borderColor: colors.border,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.md,
        fontSize: FONT_SIZE.body,
        color: colors.text
    },

    inputFocused: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryMuted
    },

    helper: {
        fontSize: FONT_SIZE.caption,
        color: colors.textSecondary,
        marginTop: -SPACING.sm,
        marginBottom: SPACING.md,
        marginLeft: SPACING.xs
    }
});
