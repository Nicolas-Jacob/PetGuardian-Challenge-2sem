import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useHistoryByPet, useUpdateHistoryRecord } from "../../../../hooks/useHistory";
import CustomButton from "../../../../components/CustomButton";
import BackButton from "../../../../components/BackButton";
import { ThemeColors } from "../../../../constants/colors";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useThemedStyles } from "../../../../hooks/useThemedStyles";
import { SPACING, RADIUS } from "../../../../constants/spacing";
import { FONT_SIZE, FONT_WEIGHT, TYPOGRAPHY } from "../../../../constants/typography";

type FocusableField = "description" | "date";

export default function EditHistoryRecord() {

    const { colors } = useTheme();
    const styles = useThemedStyles(createStyles);

    const { petId, recordId } = useLocalSearchParams<{ petId: string; recordId: string }>();
    const { data: history = [], isPending: isLoadingHistory } = useHistoryByPet(petId);
    const updateRecord = useUpdateHistoryRecord();

    const record = history.find((item) => item.id === recordId);

    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [focusedField, setFocusedField] = useState<FocusableField | null>(null);

    useEffect(() => {
        if (record) {
            setDescription(record.description);
            setDate(record.date);
        }
    }, [record]);

    async function handleSave() {

        if (!recordId) return;

        if (!description.trim() || !date.trim()) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        try {
            await updateRecord.mutateAsync({
                recordId,
                petId,
                data: {
                    description: description.trim(),
                    date: date.trim()
                }
            });

            Alert.alert(
                "Sucesso",
                "Registro atualizado com sucesso"
            );

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
        <View style={styles.container}>
            <BackButton />

            <Text style={styles.title}>
                Editar Registro
            </Text>

            <Text style={styles.subtitle}>
                Atualize a descrição ou a data deste registro
            </Text>

            <View style={styles.form}>

                <Text style={styles.label}>
                    Descrição
                </Text>

                <TextInput
                    style={[
                        styles.input,
                        focusedField === "description" && styles.inputFocused
                    ]}
                    placeholder="Ex: Vacina V10 aplicada"
                    placeholderTextColor={colors.placeholder}
                    value={description}
                    onChangeText={setDescription}
                    onFocus={() => setFocusedField("description")}
                    onBlur={() => setFocusedField(null)}
                    editable={!updateRecord.isPending}
                />

                <Text style={styles.label}>
                    Data
                </Text>

                <TextInput
                    style={[
                        styles.input,
                        focusedField === "date" && styles.inputFocused
                    ]}
                    placeholder="dd/mm/aaaa"
                    placeholderTextColor={colors.placeholder}
                    value={date}
                    onChangeText={setDate}
                    onFocus={() => setFocusedField("date")}
                    onBlur={() => setFocusedField(null)}
                    editable={!updateRecord.isPending}
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

            </View>

            <CustomButton
                title="Salvar Alterações"
                onPress={handleSave}
                loading={updateRecord.isPending}
            />
        </View>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
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
    },

    form: {
        marginBottom: SPACING.xs
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
        marginBottom: SPACING.md,
        fontSize: FONT_SIZE.body,
        color: colors.text
    },

    inputFocused: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryMuted
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
