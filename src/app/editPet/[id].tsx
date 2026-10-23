import { View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { usePets, useUpdatePet } from "../../hooks/usePets";
import BackButton from "../../components/BackButton";
import PetForm from "../../components/PetForm";
import { ThemeColors } from "../../constants/colors";
import { useTheme } from "../../contexts/ThemeContext";
import { useThemedStyles } from "../../hooks/useThemedStyles";
import { SPACING } from "../../constants/spacing";
import { FONT_SIZE, TYPOGRAPHY } from "../../constants/typography";
import { PetFormData, petToFormValues } from "../../utils/petValidation";

export default function EditPet() {

    const { colors } = useTheme();
    const styles = useThemedStyles(createStyles);

    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: pets = [], isPending: isLoadingPets } = usePets();
    const updatePet = useUpdatePet();

    const pet = pets.find((item) => item.id === id);

    async function handleSubmit(data: PetFormData): Promise<boolean> {

        if (!id) return false;

        try {
            await updatePet.mutateAsync({ petId: id, data });

            Alert.alert(
                "Sucesso",
                "Pet atualizado com sucesso"
            );

            router.back();

            return true;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Não foi possível atualizar o pet. Tente novamente.";

            Alert.alert("Erro", message);

            return false;
        }
    }

    if (isLoadingPets && !pet) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!pet) {
        return (
            <View style={styles.container}>
                <BackButton />
                <Text style={styles.title}>
                    Pet não encontrado
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <BackButton />

            <Text style={styles.title}>
                Editar Pet
            </Text>

            <Text style={styles.subtitle}>
                Atualize os dados de {pet.name}
            </Text>

            {/* key remonta o formulário com os dados do pet, sem copiar props para estado */}
            <PetForm
                key={pet.id}
                initialValues={petToFormValues(pet)}
                submitLabel="Salvar Alterações"
                loading={updatePet.isPending}
                onSubmit={handleSubmit}
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
    }
});
