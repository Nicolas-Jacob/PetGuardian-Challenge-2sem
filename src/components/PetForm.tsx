import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import FormInput from "./FormInput";
import CustomButton from "./CustomButton";
import { ThemeColors } from "../constants/colors";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { SPACING, RADIUS } from "../constants/spacing";
import { FONT_SIZE, FONT_WEIGHT } from "../constants/typography";
import { EMPTY_PET_FORM, PetFormData, PetFormValues, validatePetForm } from "../utils/petValidation";

interface Props {
    initialValues: PetFormValues;
    submitLabel: string;
    loading: boolean;
    // Resolve true quando salvou; com resetOnSuccess o formulário volta a ficar vazio
    onSubmit: (data: PetFormData) => Promise<boolean>;
    resetOnSuccess?: boolean;
}

export default function PetForm({
    initialValues,
    submitLabel,
    loading,
    onSubmit,
    resetOnSuccess = false
}: Props) {

    const styles = useThemedStyles(createStyles);

    // Estado inicial lido uma vez; a tela de edição remonta o formulário via key
    const [values, setValues] = useState<PetFormValues>(() => initialValues);

    function setField(field: keyof PetFormValues) {
        return (text: string) => setValues((previous) => ({ ...previous, [field]: text }));
    }

    async function handleSubmit() {

        const result = validatePetForm(values);

        if (!result.ok) {
            Alert.alert("Erro", result.message);
            return;
        }

        const saved = await onSubmit(result.data);

        if (saved && resetOnSuccess) {
            setValues(EMPTY_PET_FORM);
        }
    }

    const { name, species, age } = values;

    return (
        <>
            <View style={styles.form}>

                <FormInput
                    label="Nome"
                    placeholder="Ex: Rex"
                    value={name}
                    onChangeText={setField("name")}
                    editable={!loading}
                />

                <FormInput
                    label="Espécie"
                    placeholder="Ex: Cachorro"
                    value={species}
                    onChangeText={setField("species")}
                    editable={!loading}
                />

                <FormInput
                    label="Idade"
                    placeholder="Ex: 3"
                    value={age}
                    onChangeText={setField("age")}
                    keyboardType="numeric"
                    editable={!loading}
                />

            </View>

            <View style={styles.previewCard}>

                <Text style={styles.previewTitle}>
                    Pré-visualização
                </Text>

                <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Nome</Text>
                    <Text style={styles.previewValue}>{name || "—"}</Text>
                </View>

                <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Espécie</Text>
                    <Text style={styles.previewValue}>{species || "—"}</Text>
                </View>

                <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Idade</Text>
                    <Text style={styles.previewValue}>
                        {age ? `${age} ${age === "1" ? "ano" : "anos"}` : "—"}
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
