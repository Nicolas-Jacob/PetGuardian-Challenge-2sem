import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useAddPet } from "../hooks/usePets";
import CustomButton from "../components/CustomButton";
import BackButton from "../components/BackButton";
import { COLORS } from "../constants/colors";
import { SPACING, RADIUS } from "../constants/spacing";
import { FONT_SIZE, FONT_WEIGHT, TYPOGRAPHY } from "../constants/typography";

type FocusableField = "name" | "species" | "age";

export default function AddPet() {

    const addPet = useAddPet();

    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [age, setAge] = useState("");
    const [focusedField, setFocusedField] = useState<FocusableField | null>(null);

    async function handleSave() {

        if (!name.trim() || !species.trim() || !age.trim()) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        if (isNaN(Number(age))) {
            Alert.alert("Erro", "Digite uma idade válida");
            return;
        }

        try {
            await addPet.mutateAsync({
                name: name.trim(),
                species: species.trim(),
                age: Number(age)
            });

            Alert.alert(
                "Sucesso",
                "Pet cadastrado com sucesso"
            );

            setName("");
            setSpecies("");
            setAge("");

            router.back();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Não foi possível cadastrar o pet. Tente novamente.";

            Alert.alert("Erro", message);
        }
    }

    return (
        <View style={styles.container}>
            <BackButton />

            <Text style={styles.title}>
                Cadastrar Pet
            </Text>

            <Text style={styles.subtitle}>
                Preencha os dados do seu novo companheiro
            </Text>

            <View style={styles.form}>

                <Text style={styles.label}>
                    Nome
                </Text>

                <TextInput
                    style={[
                        styles.input,
                        focusedField === "name" && styles.inputFocused
                    ]}
                    placeholder="Ex: Rex"
                    placeholderTextColor={COLORS.textSecondary}
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    editable={!addPet.isPending}
                />

                <Text style={styles.label}>
                    Espécie
                </Text>

                <TextInput
                    style={[
                        styles.input,
                        focusedField === "species" && styles.inputFocused
                    ]}
                    placeholder="Ex: Cachorro"
                    placeholderTextColor={COLORS.textSecondary}
                    value={species}
                    onChangeText={setSpecies}
                    onFocus={() => setFocusedField("species")}
                    onBlur={() => setFocusedField(null)}
                    editable={!addPet.isPending}
                />

                <Text style={styles.label}>
                    Idade
                </Text>

                <TextInput
                    style={[
                        styles.input,
                        focusedField === "age" && styles.inputFocused
                    ]}
                    placeholder="Ex: 3"
                    placeholderTextColor={COLORS.textSecondary}
                    value={age}
                    onChangeText={setAge}
                    onFocus={() => setFocusedField("age")}
                    onBlur={() => setFocusedField(null)}
                    keyboardType="numeric"
                    editable={!addPet.isPending}
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
                title="Salvar Pet"
                onPress={handleSave}
                loading={addPet.isPending}
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
