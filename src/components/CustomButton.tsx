import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import { ThemeColors } from "../constants/colors";
import { useTheme } from "../contexts/ThemeContext";
import { useThemedStyles } from "../hooks/useThemedStyles";
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

const createVariantStyles = (colors: ThemeColors): Record<Variant, { background: string; text: string; border?: string }> => ({
    primary: { background: colors.primary, text: colors.textOnPrimary },
    secondary: { background: colors.secondary, text: colors.textOnPrimary },
    danger: { background: colors.danger, text: colors.textOnPrimary },
    outline: { background: "transparent", text: colors.primary, border: colors.primary }
});

export default function CustomButton({
    title,
    onPress,
    variant = "primary",
    backgroundColor,
    loading = false,
    disabled = false
}: Props) {

    const { colors } = useTheme();
    const styles = useThemedStyles(createStyles);

    const variantStyle = createVariantStyles(colors)[variant];
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

const createStyles = () => StyleSheet.create({
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
