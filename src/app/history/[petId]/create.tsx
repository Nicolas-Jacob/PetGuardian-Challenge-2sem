import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useAddHistoryRecord } from "../../../hooks/useHistory";
import CustomButton from "../../../components/CustomButton";
import BackButton from "../../../components/BackButton";
import { ThemeColors } from "../../../constants/colors";
import { useTheme } from "../../../contexts/ThemeContext";
import { useThemedStyles } from "../../../hooks/useThemedStyles";
import { SPACING, RADIUS } from "../../../constants/spacing";
import { FONT_SIZE, FONT_WEIGHT, TYPOGRAPHY } from "../../../constants/typography";

type FocusableField = "description" | "date";

export default function CreateHistoryRecord() {

    const { colors } = useTheme();
    const styles = useThemedStyles(createStyles);

    const { petId } = useLocalSearchParams<{ petId: string }>();
    const addRecord = useAddHistoryRecord();

    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date().toLocaleDateString("pt-BR"));
    const [focusedField, setFocusedField] = useState<FocusableField | null>(null);

    async function handleSave() {

        if (!description.trim() || !date.trim()) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        try {
            await addRecord.mutateAsync({
                petId,
                description: description.trim(),
                date: date.trim()
            });

            Alert.alert(
                "Sucesso",
                "Registro salvo com sucesso"
            );

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
        <View style={styles.container}>
            <BackButton />

            <Text style={styles.title}>
                Nova Ação Clínica
            </Text>

            <Text style={styles.subtitle}>
                Registre uma vacina, consulta ou exame
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
                    editable={!addRecord.isPending}
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
                    editable={!addRecord.isPending}
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
                title="Salvar"
                onPress={handleSave}
                loading={addRecord.isPending}
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
