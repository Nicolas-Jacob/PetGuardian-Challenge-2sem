import { View, Text, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { useAddPet } from "../hooks/usePets";
import BackButton from "../components/BackButton";
import PetForm from "../components/PetForm";
import { ThemeColors } from "../constants/colors";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { SPACING } from "../constants/spacing";
import { FONT_SIZE, TYPOGRAPHY } from "../constants/typography";
import { EMPTY_PET_FORM, PetFormData } from "../utils/petValidation";

export default function AddPet() {

    const styles = useThemedStyles(createStyles);

    const addPet = useAddPet();

    async function handleSubmit(data: PetFormData): Promise<boolean> {
        try {
            await addPet.mutateAsync(data);

            Alert.alert(
                "Sucesso",
                "Pet cadastrado com sucesso"
            );

            router.back();

            return true;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Não foi possível cadastrar o pet. Tente novamente.";

            Alert.alert("Erro", message);

            return false;
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

            <PetForm
                initialValues={EMPTY_PET_FORM}
                submitLabel="Salvar Pet"
                loading={addPet.isPending}
                onSubmit={handleSubmit}
                resetOnSuccess
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
    }
});
