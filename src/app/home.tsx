import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import PetCard from "../components/PetCard";
import EmptyState from "../components/EmptyState";
import { ThemeColors } from "../constants/colors";
import { useTheme } from "../contexts/ThemeContext";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { SPACING, RADIUS, SHADOWS } from "../constants/spacing";
import { FONT_SIZE, FONT_WEIGHT, TYPOGRAPHY } from "../constants/typography";
import { useAuth } from "../contexts/AuthContext";
import { usePets, useDeletePet } from "../hooks/usePets";

export default function Home() {

    const { colors, isDark, toggleTheme } = useTheme();
    const styles = useThemedStyles(createStyles);

    const { signOut } = useAuth();
    const { data: pets = [], isPending, isError } = usePets();
    const deletePet = useDeletePet();

    async function handleLogout() {
        try {
            await signOut();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Não foi possível sair. Tente novamente.";

            Alert.alert("Erro", message);
        }
    }

    function confirmDelete(petId: string, petName: string) {
        Alert.alert(
            "Excluir pet",
            `Tem certeza que deseja excluir ${petName}?`,
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deletePet.mutateAsync(petId);
                        } catch (error) {
                            const message =
                                error instanceof Error
                                    ? error.message
                                    : "Não foi possível excluir o pet.";

                            Alert.alert("Erro", message);
                        }
                    }
                }
            ]
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <View style={styles.header}>
                <View style={styles.greetingWrapper}>
                    <Text style={styles.greeting}>
                        Olá! 👋
                    </Text>

                    <Text style={styles.subtitle}>
                        Gerencie informações dos seus pets
                    </Text>
                </View>

                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.themeButton}
                        activeOpacity={0.8}
                        onPress={toggleTheme}
                        accessibilityRole="button"
                        accessibilityLabel={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
                    >
                        <Text style={styles.themeIcon}>
                            {isDark ? "☀️" : "🌙"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Text style={styles.logoutText}>
                            Sair
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.sectionTitle}>
                Meus Pets
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
                    <PetCard
                        key={pet.id}
                        pet={pet}
                        onPress={() =>
                            router.push({
                                pathname: "/editPet/[id]",
                                params: { id: pet.id }
                            })
                        }
                        onDelete={() => confirmDelete(pet.id, pet.name)}
                    />
                ))

            ) : (

                <EmptyState
                    icon="🐾"
                    title="Nenhum pet cadastrado"
                    description="Cadastre seu primeiro pet para começar a acompanhar a saúde dele."
                    actionLabel="Cadastrar Pet"
                    onAction={() => router.push("/addPet")}
                />

            )}

            <Text style={styles.sectionTitle}>
                Ações rápidas
            </Text>

            <TouchableOpacity
                style={styles.navCard}
                activeOpacity={0.8}
                onPress={() => router.push("/addPet")}
            >
                <View style={[styles.navIconWrapper, { backgroundColor: colors.successMuted }]}>
                    <Text style={styles.navIcon}>
                        🐾
                    </Text>
                </View>

                <Text style={styles.navLabel}>
                    Cadastrar Pet
                </Text>

                <Text style={styles.navChevron}>
                    ›
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navCard}
                activeOpacity={0.8}
                onPress={() => router.push("/history")}
            >
                <View style={[styles.navIconWrapper, { backgroundColor: colors.warningMuted }]}>
                    <Text style={styles.navIcon}>
                        📋
                    </Text>
                </View>

                <Text style={styles.navLabel}>
                    Histórico Clínico
                </Text>

                <Text style={styles.navChevron}>
                    ›
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navCard}
                activeOpacity={0.8}
                onPress={() => router.push("/chat")}
            >
                <View style={[styles.navIconWrapper, { backgroundColor: colors.primaryMuted }]}>
                    <Text style={styles.navIcon}>
                        💬
                    </Text>
                </View>

                <Text style={styles.navLabel}>
                    Chat IA
                </Text>

                <Text style={styles.navChevron}>
                    ›
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navCard}
                activeOpacity={0.8}
                onPress={() => router.push("/about")}
            >
                <View style={[styles.navIconWrapper, { backgroundColor: colors.border }]}>
                    <Text style={styles.navIcon}>
                        ℹ️
                    </Text>
                </View>

                <Text style={styles.navLabel}>
                    Sobre o App
                </Text>

                <Text style={styles.navChevron}>
                    ›
                </Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        padding: SPACING.lg,
        backgroundColor: colors.background,
        flexGrow: 1
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginTop: SPACING.lg,
        marginBottom: SPACING.lg
    },

    greetingWrapper: {
        flex: 1,
        marginRight: SPACING.md
    },

    greeting: {
        fontSize: TYPOGRAPHY.title.fontSize,
        fontWeight: TYPOGRAPHY.title.fontWeight,
        color: colors.text
    },

    subtitle: {
        fontSize: FONT_SIZE.body,
        color: colors.textSecondary,
        marginTop: 2
    },

    headerActions: {
        flexDirection: "row",
        alignItems: "center"
    },

    themeButton: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.full,
        backgroundColor: colors.primaryMuted,
        borderWidth: 1.5,
        borderColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        marginRight: SPACING.sm
    },

    themeIcon: {
        fontSize: 18
    },

    logoutButton: {
        backgroundColor: colors.card,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: RADIUS.md
    },

    logoutText: {
        color: colors.danger,
        fontWeight: FONT_WEIGHT.bold
    },

    sectionTitle: {
        fontSize: FONT_SIZE.subtitle,
        fontWeight: FONT_WEIGHT.bold,
        color: colors.text,
        marginTop: SPACING.lg,
        marginBottom: SPACING.sm
    },

    loading: {
        marginVertical: SPACING.xl
    },

    navCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.card,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.sm,
        ...SHADOWS.subtle
    },

    navIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.full,
        alignItems: "center",
        justifyContent: "center",
        marginRight: SPACING.md
    },

    navIcon: {
        fontSize: 18
    },

    navLabel: {
        flex: 1,
        fontSize: FONT_SIZE.body,
        fontWeight: FONT_WEIGHT.semibold,
        color: colors.text
    },

    navChevron: {
        fontSize: FONT_SIZE.title,
        color: colors.textSecondary
    }
});
