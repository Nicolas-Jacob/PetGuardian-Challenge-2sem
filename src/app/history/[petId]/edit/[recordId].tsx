import { View, Text, StyleSheet, Alert, ActivityIndicator, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useHistoryByPet, useUpdateHistoryRecord } from "../../../../hooks/useHistory";
import { usePetById } from "../../../../hooks/usePets";
import BackButton from "../../../../components/BackButton";
import HistoryRecordForm from "../../../../components/HistoryRecordForm";
import { ThemeColors } from "../../../../constants/colors";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useThemedStyles } from "../../../../hooks/useThemedStyles";
import { SPACING } from "../../../../constants/spacing";
import { FONT_SIZE, TYPOGRAPHY } from "../../../../constants/typography";
import { getReminderFeedback } from "../../../../utils/reminder";
import { historyRecordToFormValues, HistoryRecordFormData } from "../../../../utils/historyRecordValidation";

export default function EditHistoryRecord() {

    const { colors } = useTheme();
    const styles = useThemedStyles(createStyles);

    const { petId, recordId } = useLocalSearchParams<{ petId: string; recordId: string }>();
    const { data: history = [], isPending: isLoadingHistory } = useHistoryByPet(petId);
    const pet = usePetById(petId);
    const updateRecord = useUpdateHistoryRecord();

    const record = history.find((item) => item.id === recordId);

    async function handleSubmit({ description, date, reminderAt }: HistoryRecordFormData) {

        if (!recordId) return;

        try {
            const result = await updateRecord.mutateAsync({
                recordId,
                petId,
                petName: pet?.name ?? "seu pet",
                previousReminderAt: record?.reminderAt,
                data: { description, date, reminderAt }
            });

            const feedback = getReminderFeedback(
                "Registro atualizado com sucesso",
                result,
                reminderAt
            );

            Alert.alert(feedback.title, feedback.message);

            router.back();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Não foi possível atualizar o registro. Tente novamente.";

            Alert.alert("Erro", message);
        }
    }

    if (isLoadingHistory && !record) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!record) {
        return (
            <View style={styles.container}>
                <BackButton />
                <Text style={styles.title}>
                    Registro não encontrado
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <BackButton />

            <Text style={styles.title}>
                Editar Registro
            </Text>

            <Text style={styles.subtitle}>
                Atualize a descrição ou a data deste registro
            </Text>

            {/* key remonta o formulário com os dados do registro, sem copiar props para estado */}
            <HistoryRecordForm
                key={record.id}
                initialValues={historyRecordToFormValues(record)}
                originalReminderAt={record.reminderAt}
                submitLabel="Salvar Alterações"
                loading={updateRecord.isPending}
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

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
