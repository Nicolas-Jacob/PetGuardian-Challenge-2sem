import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import PetCard from "../components/PetCard";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";
import { usePets, useDeletePet } from "../hooks/usePets";

export default function Home() {

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
                <Text style={styles.title}>
                    Dashboard
                </Text>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutText}>
                        Sair
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>
                Gerencie informações dos seus pets
            </Text>

            {isPending ? (

                <ActivityIndicator
                    size="large"
                    color={COLORS.primary}
                    style={styles.loading}
                />

            ) : isError ? (

                <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>
                        Não foi possível carregar seus pets. Tente novamente.
                    </Text>
                </View>

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

                <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>
                        Nenhum pet cadastrado
                    </Text>
                </View>

            )}

            <CustomButton
                title="Cadastrar Pet"
                backgroundColor="#4CAF50"
                onPress={() => router.push("/addPet")}
            />

            <CustomButton
                title="Histórico Clínico"
                backgroundColor="#FF9800"
                onPress={() => router.push("/history")}
            />

            <CustomButton
                title="Chat IA"
                backgroundColor="#9C27B0"
                onPress={() => router.push("/chat")}
            />

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: COLORS.background,
        flexGrow: 1
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20
    },

    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: COLORS.text
    },

    logoutButton: {
        backgroundColor: COLORS.card,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 12
    },

    logoutText: {
        color: COLORS.danger,
        fontWeight: "bold"
    },

    subtitle: {
        fontSize: 15,
        color: COLORS.gray,
        marginTop: 15,
        marginBottom: 20
    },

    loading: {
        marginVertical: 30
    },

    emptyCard: {
        backgroundColor: COLORS.card,
        padding: 20,
        borderRadius: 15,
        marginVertical: 20
    },

    emptyText: {
        textAlign: "center",
        color: COLORS.gray
    }
});
