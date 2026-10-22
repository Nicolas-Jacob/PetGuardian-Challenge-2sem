import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { HistoryRecord } from "../types";
import { ThemeColors } from "../constants/colors";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { SPACING, RADIUS, SHADOWS } from "../constants/spacing";
import { FONT_SIZE, FONT_WEIGHT } from "../constants/typography";
import { formatReminder } from "../utils/dateTime";

interface Props {
    record: HistoryRecord;
    highlighted?: boolean;
    onPress?: () => void;
    onDelete?: () => void;
}

export default function HistoryRecordCard({
    record,
    highlighted = false,
    onPress,
    onDelete
}: Props) {
    const styles = useThemedStyles(createStyles);

    return (
        <TouchableOpacity
            style={[styles.card, highlighted && styles.cardHighlighted]}
            activeOpacity={0.85}
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={[styles.iconWrapper, highlighted && styles.iconWrapperHighlighted]}>
                <Text style={styles.icon}>
                    📋
                </Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.description} numberOfLines={2}>
                    {record.description}
                </Text>

                <Text style={styles.date}>
                    {record.date}
                </Text>

                {record.reminderAt ? (
                    <Text style={styles.reminder}>
                        🔔 Lembrete: {formatReminder(record.reminderAt)}
                    </Text>
                ) : null}
            </View>

            {onDelete && (
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={onDelete}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Text style={styles.deleteText}>
                        🗑️
                    </Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({

    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.card,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.md,
        ...SHADOWS.subtle
    },

    cardHighlighted: {
        borderWidth: 2,
        borderColor: colors.primary,
        backgroundColor: colors.primaryMuted
    },

    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.full,
        backgroundColor: colors.primaryMuted,
        alignItems: "center",
        justifyContent: "center",
        marginRight: SPACING.md
    },

    iconWrapperHighlighted: {
        backgroundColor: colors.card
    },

    icon: {
        fontSize: 18
    },

    content: {
        flex: 1
    },

    description: {
        fontSize: FONT_SIZE.body,
        fontWeight: FONT_WEIGHT.semibold,
        color: colors.text
    },

    date: {
        fontSize: FONT_SIZE.caption,
        color: colors.textSecondary,
        marginTop: 2
    },

    reminder: {
        fontSize: FONT_SIZE.caption,
        fontWeight: FONT_WEIGHT.medium,
        color: colors.primary,
        marginTop: 2
    },

    deleteButton: {
        padding: SPACING.xs,
        marginLeft: SPACING.sm
    },

    deleteText: {
        fontSize: 16
    }
});
