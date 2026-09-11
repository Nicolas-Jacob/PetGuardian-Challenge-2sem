import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useHistoryByPet, useUpdateHistoryRecord } from "../../../../hooks/useHistory";
import CustomButton from "../../../../components/CustomButton";
import BackButton from "../../../../components/BackButton";
import { COLORS } from "../../../../constants/colors";
import { SPACING, RADIUS } from "../../../../constants/spacing";
import { FONT_SIZE, FONT_WEIGHT, TYPOGRAPHY } from "../../../../constants/typography";

type FocusableField = "description" | "date";

export default function EditHistoryRecord() {

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
                <ActivityIndicator size="large" color={COLORS.primary} />
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
                    placeholderTextColor={COLORS.textSecondary}
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
                    placeholderTextColor={COLORS.textSecondary}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SPACING.lg,
        backgroundColor: COLORS.background
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background
    },

    title: {
        fontSize: TYPOGRAPHY.title.fontSize,
        fontWeight: TYPOGRAPHY.title.fontWeight,
        color: COLORS.text,
        marginBottom: SPACING.xs
    },

    subtitle: {
        fontSize: FONT_SIZE.body,
        color: COLORS.textSecondary,
        marginBottom: SPACING.lg
    },

    form: {
        marginBottom: SPACING.xs
    },

    label: {
        fontSize: FONT_SIZE.caption,
        fontWeight: FONT_WEIGHT.semibold,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
        marginLeft: SPACING.xs
    },

    input: {
        backgroundColor: COLORS.card,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.md,
        fontSize: FONT_SIZE.body,
        color: COLORS.text
    },

    inputFocused: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryMuted
    },

    previewCard: {
        backgroundColor: COLORS.card,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginVertical: SPACING.lg
    },

    previewTitle: {
        fontSize: FONT_SIZE.caption,
        fontWeight: FONT_WEIGHT.bold,
        color: COLORS.textSecondary,
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
        color: COLORS.textSecondary
    },

    previewValue: {
        fontSize: FONT_SIZE.body,
        fontWeight: FONT_WEIGHT.semibold,
        color: COLORS.text
    }
});
