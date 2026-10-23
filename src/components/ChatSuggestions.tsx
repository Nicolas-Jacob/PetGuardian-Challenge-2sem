import { ScrollView, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ThemeColors } from "../constants/colors";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { SPACING, RADIUS } from "../constants/spacing";
import { FONT_SIZE, FONT_WEIGHT } from "../constants/typography";

interface Props {
    suggestions: string[];
    onSelect: (suggestion: string) => void;
}

export default function ChatSuggestions({ suggestions, onSelect }: Props) {

    const styles = useThemedStyles(createStyles);

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={styles.scroll}
            contentContainerStyle={styles.content}
        >
            {suggestions.map((suggestion) => (
                <TouchableOpacity
                    key={suggestion}
                    style={styles.chip}
                    activeOpacity={0.8}
                    onPress={() => onSelect(suggestion)}
                    accessibilityRole="button"
                >
                    <Text style={styles.chipText}>
                        {suggestion}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    scroll: {
        marginBottom: SPACING.sm,
        flexGrow: 0
    },

    content: {
        paddingVertical: SPACING.xs
    },

    chip: {
        backgroundColor: colors.primaryMuted,
        borderWidth: 1,
        borderColor: colors.primary,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.md,
        borderRadius: RADIUS.full,
        marginRight: SPACING.sm
    },

    chipText: {
        color: colors.primary,
        fontSize: FONT_SIZE.caption,
        fontWeight: FONT_WEIGHT.semibold
    }
});
