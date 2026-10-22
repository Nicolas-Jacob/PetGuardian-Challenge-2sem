import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { ThemeColors } from "../constants/colors";
import { useTheme } from "../contexts/ThemeContext";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { SPACING, RADIUS } from "../constants/spacing";
import { FONT_SIZE, FONT_WEIGHT } from "../constants/typography";
import { maskDate, maskTime } from "../utils/dateTime";

interface Props {
    date: string;
    time: string;
    onChangeDate: (value: string) => void;
    onChangeTime: (value: string) => void;
    editable?: boolean;
}

export default function ReminderFields({
    date,
    time,
    onChangeDate,
    onChangeTime,
    editable = true
}: Props) {

    const { colors } = useTheme();
    const styles = useThemedStyles(createStyles);

    const [focusedField, setFocusedField] = useState<"date" | "time" | null>(null);

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                🔔 Lembrete
            </Text>

            <View style={styles.row}>

                <View style={styles.dateColumn}>
                    <Text style={styles.label}>
                        Data do lembrete
                    </Text>

                    <TextInput
                        style={[
                            styles.input,
                            focusedField === "date" && styles.inputFocused
                        ]}
                        placeholder="dd/mm/aaaa"
                        placeholderTextColor={colors.placeholder}
                        value={date}
                        onChangeText={(text) => onChangeDate(maskDate(text))}
                        onFocus={() => setFocusedField("date")}
                        onBlur={() => setFocusedField(null)}
                        keyboardType="number-pad"
                        maxLength={10}
                        editable={editable}
                    />
                </View>

                <View style={styles.timeColumn}>
                    <Text style={styles.label}>
                        Hora
                    </Text>

                    <TextInput
                        style={[
                            styles.input,
                            focusedField === "time" && styles.inputFocused
                        ]}
                        placeholder="HH:mm"
                        placeholderTextColor={colors.placeholder}
                        value={time}
                        onChangeText={(text) => onChangeTime(maskTime(text))}
                        onFocus={() => setFocusedField("time")}
                        onBlur={() => setFocusedField(null)}
                        keyboardType="number-pad"
                        maxLength={5}
                        editable={editable}
                    />
                </View>

            </View>

            <Text style={styles.helper}>
                Opcional: você será notificado neste dia e horário. Deixe em branco para não receber lembrete.
            </Text>

        </View>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        marginBottom: SPACING.md
    },

    title: {
        fontSize: FONT_SIZE.body,
        fontWeight: FONT_WEIGHT.bold,
        color: colors.text,
        marginBottom: SPACING.sm
    },

    row: {
        flexDirection: "row"
    },

    dateColumn: {
        flex: 3,
        marginRight: SPACING.sm
    },

    timeColumn: {
        flex: 2
    },

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
        marginTop: SPACING.sm,
        lineHeight: 18
    }
});
