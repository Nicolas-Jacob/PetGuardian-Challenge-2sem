import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import FormInput from "./FormInput";
import CustomButton from "./CustomButton";
import ReminderFields from "./ReminderFields";
import { ThemeColors } from "../constants/colors";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { SPACING, RADIUS } from "../constants/spacing";
import { FONT_SIZE, FONT_WEIGHT } from "../constants/typography";
import {
    HistoryRecordFormData,
    HistoryRecordFormValues,
    validateHistoryRecordForm
} from "../utils/historyRecordValidation";

interface Props {
    initialValues: HistoryRecordFormValues;
    // Lembrete salvo antes da edição (data passada só é erro quando ele muda)
    originalReminderAt?: number | null;
    submitLabel: string;
    loading: boolean;
    onSubmit: (data: HistoryRecordFormData) => Promise<void>;
}

export default function HistoryRecordForm({
    initialValues,
    originalReminderAt,
    submitLabel,
    loading,
    onSubmit
}: Props) {

    const styles = useThemedStyles(createStyles);

    // Estado inicial lido uma vez; a tela de edição remonta o formulário via key
    const [values, setValues] = useState<HistoryRecordFormValues>(() => initialValues);

    function setField(field: keyof HistoryRecordFormValues) {
        return (text: string) => setValues((previous) => ({ ...previous, [field]: text }));
    }

    async function handleSubmit() {

        const result = validateHistoryRecordForm(values, originalReminderAt);

        if (!result.ok) {
            Alert.alert(result.title, result.message);
            return;
        }

        await onSubmit(result.data);
    }

    const { description, date, reminderDate, reminderTime } = values;

    return (
        <>
            <View style={styles.form}>

                <FormInput
                    label="Descrição"
                    placeholder="Ex: Vacina V10 aplicada"
                    value={description}
                    onChangeText={setField("description")}
                    editable={!loading}
                />

                <FormInput
                    label="Data"
                    placeholder="dd/mm/aaaa"
                    value={date}
                    onChangeText={setField("date")}
                    editable={!loading}
                />

                <ReminderFields
                    date={reminderDate}
                    time={reminderTime}
                    onChangeDate={setField("reminderDate")}
                    onChangeTime={setField("reminderTime")}
                    editable={!loading}
                />

            </View>

            <View style={styles.previewCard}>

                <Text style={styles.previewTitle}>
                    Pré-visualização
                </Text>

                <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Descrição</Text>
                    <Text style={styles.previewValue}>{description || "—"}</Text>
                </View>

                <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Data</Text>
                    <Text style={styles.previewValue}>{date || "—"}</Text>
                </View>

                <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Lembrete</Text>
                    <Text style={styles.previewValue}>
                        {reminderDate || reminderTime ? `${reminderDate} ${reminderTime}`.trim() : "—"}
                    </Text>
                </View>

            </View>

            <CustomButton
                title={submitLabel}
                onPress={handleSubmit}
                loading={loading}
            />
        </>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    form: {
        marginBottom: SPACING.xs
    },

    previewCard: {
        backgroundColor: colors.card,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginVertical: SPACING.lg
    },

    previewTitle: {
        fontSize: FONT_SIZE.caption,
        fontWeight: FONT_WEIGHT.bold,
        color: colors.textSecondary,
        marginBottom: SPACING.sm,
        textTransform: "uppercase"
    },

    previewRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: SPACING.xs
    },

    previewLabel: {
        fontSize: FONT_SIZE.body,
        color: colors.textSecondary
    },

    previewValue: {
        fontSize: FONT_SIZE.body,
        fontWeight: FONT_WEIGHT.semibold,
        color: colors.text
    }
});
