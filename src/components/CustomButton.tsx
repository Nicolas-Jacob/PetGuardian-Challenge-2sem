import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";
import { SPACING, RADIUS, SHADOWS } from "../constants/spacing";
import { FONT_SIZE, FONT_WEIGHT } from "../constants/typography";

type Variant = "primary" | "secondary" | "danger" | "outline";

interface Props {
    title: string;
    onPress: () => void;
    variant?: Variant;
    backgroundColor?: string;
    loading?: boolean;
    disabled?: boolean;
}

const VARIANT_STYLES: Record<Variant, { background: string; text: string; border?: string }> = {
    primary: { background: COLORS.primary, text: COLORS.white },
    secondary: { background: COLORS.secondary, text: COLORS.white },
    danger: { background: COLORS.danger, text: COLORS.white },
    outline: { background: "transparent", text: COLORS.primary, border: COLORS.primary }
};

export default function CustomButton({
    title,
    onPress,
    variant = "primary",
    backgroundColor,
    loading = false,
    disabled = false
}: Props) {

    const variantStyle = VARIANT_STYLES[variant];
    const resolvedBackground = backgroundColor ?? variantStyle.background;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: resolvedBackground,
                    borderWidth: variantStyle.border ? 1.5 : 0,
                    borderColor: variantStyle.border ?? "transparent"
                },
                (disabled || loading) && styles.buttonDisabled
            ]}
            activeOpacity={0.75}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={variantStyle.text} />
            ) : (
                <Text style={[styles.text, { color: variantStyle.text }]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginVertical: SPACING.sm,
        alignItems: "center",
        justifyContent: "center",
        ...SHADOWS.subtle
    },

    buttonDisabled: {
        opacity: 0.6
    },

    text: {
        fontSize: FONT_SIZE.body,
        fontWeight: FONT_WEIGHT.bold,
        textAlign: "center"
    }
});
