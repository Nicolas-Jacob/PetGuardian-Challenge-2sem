import { Text, StyleSheet, Alert, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useAddHistoryRecord } from "../../../hooks/useHistory";
import { usePetById } from "../../../hooks/usePets";
import BackButton from "../../../components/BackButton";
import HistoryRecordForm from "../../../components/HistoryRecordForm";
import { ThemeColors } from "../../../constants/colors";
import { useThemedStyles } from "../../../hooks/useThemedStyles";
import { SPACING } from "../../../constants/spacing";
import { FONT_SIZE, TYPOGRAPHY } from "../../../constants/typography";
import { getReminderFeedback } from "../../../utils/reminder";
import { emptyHistoryRecordFormValues, HistoryRecordFormData } from "../../../utils/historyRecordValidation";

export default function CreateHistoryRecord() {

    const styles = useThemedStyles(createStyles);

    const { petId } = useLocalSearchParams<{ petId: string }>();
    const pet = usePetById(petId);
    const addRecord = useAddHistoryRecord();

    async function handleSubmit({ description, date, reminderAt }: HistoryRecordFormData) {
        try {
            const result = await addRecord.mutateAsync({
                petId,
                petName: pet?.name ?? "seu pet",
                description,
                date,
                reminderAt
            });

            const feedback = getReminderFeedback(
                "Registro salvo com sucesso",
                result,
                reminderAt
            );

            Alert.alert(feedback.title, feedback.message);

            router.back();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Não foi possível salvar o registro. Tente novamente.";

            Alert.alert("Erro", message);
        }
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <BackButton />

            <Text style={styles.title}>
                Nova Ação Clínica
            </Text>

            <Text style={styles.subtitle}>
                Registre uma vacina, consulta ou exame
            </Text>

            <HistoryRecordForm
                initialValues={emptyHistoryRecordFormValues()}
                submitLabel="Salvar"
                loading={addRecord.isPending}
                onSubmit={handleSubmit}
            />
        </ScrollView>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: SPACING.lg,
        backgroundColor: colors.background
    },

    title: {
        fontSize: TYPOGRAPHY.title.fontSize,
        fontWeight: TYPOGRAPHY.title.fontWeight,
        color: colors.text,
        marginBottom: SPACING.xs
    },

    subtitle: {
        fontSize: FONT_SIZE.body,
        color: colors.textSecondary,
        marginBottom: SPACING.lg
    }
});
