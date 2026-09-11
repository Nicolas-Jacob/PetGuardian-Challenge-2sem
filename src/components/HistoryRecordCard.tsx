import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { HistoryRecord } from "../types";
import { COLORS } from "../constants/colors";
import { SPACING, RADIUS, SHADOWS } from "../constants/spacing";
import { FONT_SIZE, FONT_WEIGHT } from "../constants/typography";

interface Props {
    record: HistoryRecord;
    onPress?: () => void;
    onDelete?: () => void;
}

export default function HistoryRecordCard({
    record,
    onPress,
    onDelete
}: Props) {
    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={styles.iconWrapper}>
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

const styles = StyleSheet.create({

    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.card,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.md,
        ...SHADOWS.subtle
    },

    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.primaryMuted,
        alignItems: "center",
        justifyContent: "center",
        marginRight: SPACING.md
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
        color: COLORS.text
    },

    date: {
        fontSize: FONT_SIZE.caption,
        color: COLORS.textSecondary,
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
