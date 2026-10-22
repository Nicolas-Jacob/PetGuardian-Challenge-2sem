import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import BackButton from "../../components/BackButton";
import EmptyState from "../../components/EmptyState";
import { ThemeColors } from "../../constants/colors";
import { useTheme } from "../../contexts/ThemeContext";
import { useThemedStyles } from "../../hooks/useThemedStyles";
import { SPACING, RADIUS, SHADOWS } from "../../constants/spacing";
import { FONT_SIZE, FONT_WEIGHT, TYPOGRAPHY } from "../../constants/typography";
import { usePets } from "../../hooks/usePets";

export default function HistoryPetList() {

    const { colors } = useTheme();
    const styles = useThemedStyles(createStyles);

    const { data: pets = [], isPending, isError } = usePets();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <BackButton />

            <Text style={styles.title}>
                Histórico Clínico
            </Text>

            <Text style={styles.subtitle}>
                Selecione um pet para ver o histórico
            </Text>

            {isPending ? (

                <ActivityIndicator
                    size="large"
                    color={colors.primary}
                    style={styles.loading}
                />

            ) : isError ? (

                <EmptyState
                    icon="⚠️"
                    title="Não foi possível carregar seus pets"
                    description="Verifique sua conexão e tente novamente."
                />

            ) : pets.length > 0 ? (

                pets.map((pet) => (
                    <TouchableOpacity
                        key={pet.id}
                        style={styles.petRow}
                        activeOpacity={0.8}
                        onPress={() =>
                            router.push({
                                pathname: "/history/[petId]",
                                params: { petId: pet.id }
                            })
                        }
                    >
                        <View style={styles.iconWrapper}>
                            <Text style={styles.icon}>
                                🐾
                            </Text>
                        </View>

                        <View style={styles.info}>
                            <Text style={styles.petName}>
                                {pet.name}
                            </Text>

                            <Text style={styles.petInfo}>
                                {pet.species} • {pet.age} {pet.age === 1 ? "ano" : "anos"}
                            </Text>
                        </View>

                        <Text style={styles.chevron}>
                            ›
                        </Text>
                    </TouchableOpacity>
                ))

            ) : (

                <EmptyState
                    icon="🐾"
                    title="Nenhum pet cadastrado"
                    description="Cadastre um pet primeiro para começar a registrar o histórico clínico."
                    actionLabel="Cadastrar Pet"
                    onAction={() => router.push("/addPet")}
                />

            )}

        </ScrollView>
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

    loading: {
        marginVertical: SPACING.xl
    },

    petRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.card,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.sm,
        ...SHADOWS.subtle
    },

    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: RADIUS.full,
        backgroundColor: colors.primaryMuted,
        alignItems: "center",
        justifyContent: "center",
        marginRight: SPACING.md
    },

    icon: {
        fontSize: 20
    },

    info: {
        flex: 1
    },

    petName: {
        fontSize: FONT_SIZE.body,
        fontWeight: FONT_WEIGHT.bold,
        color: colors.text
    },

    petInfo: {
        fontSize: FONT_SIZE.caption,
        color: colors.textSecondary,
        marginTop: 2
    },

    chevron: {
        fontSize: FONT_SIZE.title,
        color: colors.textSecondary
    }
});
