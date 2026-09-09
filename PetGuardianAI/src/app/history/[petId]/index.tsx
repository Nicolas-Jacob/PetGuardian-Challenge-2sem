import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import BackButton from "../../../components/BackButton";
import CustomButton from "../../../components/CustomButton";
import { COLORS } from "../../../constants/colors";
import { useHistoryByPet, useDeleteHistoryRecord } from "../../../hooks/useHistory";

export default function HistoryList() {

    const { petId } = useLocalSearchParams<{ petId: string }>();
    const { data: history = [], isPending, isError } = useHistoryByPet(petId);
    const deleteRecord = useDeleteHistoryRecord();

    function confirmDelete(recordId: string) {
        Alert.alert(
            "Excluir registro",
            "Tem certeza que deseja excluir este registro do histórico?",
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
                            await deleteRecord.mutateAsync({ recordId, petId });
                        } catch (error) {
                            const message =
                                error instanceof Error
                                    ? error.message
                                    : "Não foi possível excluir o registro.";

                            Alert.alert("Erro", message);
                        }
                    }
                }
            ]
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <BackButton />

            <Text style={styles.title}>
                Histórico Clínico
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
                        Não foi possível carregar o histórico. Tente novamente.
                    </Text>
                </View>

            ) : history.length > 0 ? (

                history.map((record) => (
                    <TouchableOpacity
                        key={record.id}
                        style={styles.card}
                        activeOpacity={0.85}
                        onPress={() =>
                            router.push({
                                pathname: "/history/[petId]/edit/[recordId]",
                                params: { petId, recordId: record.id }
                            })
                        }
                    >
                        <View style={styles.cardHeader}>
                            <Text style={styles.recordTitle}>
                                {record.description}
                            </Text>

                            <TouchableOpacity
                                onPress={() => confirmDelete(record.id)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Text style={styles.deleteText}>
                                    🗑️
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.recordDate}>
                            {record.date}
                        </Text>
                    </TouchableOpacity>
                ))

            ) : (

                <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>
                        Nenhum registro encontrado
                    </Text>
                </View>

            )}

            <CustomButton
                title="Nova Ação Clínica"
                backgroundColor="#E91E63"
                onPress={() =>
                    router.push({
                        pathname: "/history/[petId]/create",
                        params: { petId }
                    })
                }
            />

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

    card: {
        backgroundColor: COLORS.card,
        padding: 15,
        borderRadius: 15,
        marginBottom: 15
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5
    },

    recordTitle: {
        fontWeight: "bold",
        flexShrink: 1,
        marginRight: 10
    },

    recordDate: {
        color: COLORS.gray
    },

    deleteText: {
        fontSize: 16
    }
});
