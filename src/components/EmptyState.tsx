import { View, Text, StyleSheet } from "react-native";
import CustomButton from "./CustomButton";
import { ThemeColors } from "../constants/colors";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { SPACING, RADIUS } from "../constants/spacing";
import { FONT_SIZE, FONT_WEIGHT } from "../constants/typography";

interface Props {
    icon?: string;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function EmptyState({
    icon = "🐾",
    title,
    description,
    actionLabel,
    onAction
}: Props) {
    const styles = useThemedStyles(createStyles);

    return (
        <View style={styles.container}>
            <View style={styles.iconWrapper}>
                <Text style={styles.icon}>
                    {icon}
                </Text>
            </View>

            <Text style={styles.title}>
                {title}
            </Text>

            {description && (
                <Text style={styles.description}>
                    {description}
                </Text>
            )}

            {actionLabel && onAction && (
                <CustomButton
                    title={actionLabel}
                    onPress={onAction}
                />
            )}
        </View>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: colors.card,
        padding: SPACING.xl,
        borderRadius: RADIUS.xl,
        marginVertical: SPACING.lg
    },

    iconWrapper: {
        width: 64,
        height: 64,
        borderRadius: RADIUS.full,
        backgroundColor: colors.primaryMuted,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: SPACING.md
    },

    icon: {
        fontSize: 32
    },

    title: {
        fontSize: FONT_SIZE.subtitle,
        fontWeight: FONT_WEIGHT.bold,
        color: colors.text,
        textAlign: "center"
    },

    description: {
        fontSize: FONT_SIZE.body,
        color: colors.textSecondary,
        textAlign: "center",
        marginTop: SPACING.xs,
        marginBottom: SPACING.md
    }
});
