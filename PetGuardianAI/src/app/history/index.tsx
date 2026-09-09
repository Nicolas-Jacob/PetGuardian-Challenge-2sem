import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import BackButton from "../../components/BackButton";
import { COLORS } from "../../constants/colors";
import { usePets } from "../../hooks/usePets";

export default function HistoryPetList() {

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
                    <Pressable
                        key={pet.id}
                        style={styles.petSelector}
                        onPress={() =>
                            router.push({
                                pathname: "/history/[petId]",
                                params: { petId: pet.id }
                            })
                        }
                    >
                        <Text style={styles.petName}>
                            🐾 {pet.name}
                        </Text>

                        <Text style={styles.petInfo}>
                            {pet.species} • {pet.age} anos
                        </Text>
                    </Pressable>
                ))

            ) : (

                <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>
                        Nenhum pet cadastrado. Cadastre um pet primeiro.
                    </Text>
                </View>

            )}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.background
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10
    },

    subtitle: {
        color: COLORS.gray,
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
    },

    petSelector: {
        backgroundColor: COLORS.card,
        padding: 18,
        borderRadius: 15,
        marginBottom: 12,

        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3
    },

    petName: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.text
    },

    petInfo: {
        marginTop: 5,
        color: COLORS.gray
    }
});
