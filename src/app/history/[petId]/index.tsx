import { Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import BackButton from "../../../components/BackButton";
import CustomButton from "../../../components/CustomButton";
import EmptyState from "../../../components/EmptyState";
import HistoryRecordCard from "../../../components/HistoryRecordCard";
import { COLORS } from "../../../constants/colors";
import { SPACING } from "../../../constants/spacing";
import { FONT_SIZE, TYPOGRAPHY } from "../../../constants/typography";
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

            <Text style={styles.subtitle}>
                Vacinas, consultas e exames registrados
            </Text>

            {isPending ? (

                <ActivityIndicator
                    size="large"
                    color={COLORS.primary}
                    style={styles.loading}
                />

            ) : isError ? (

                <EmptyState
                    icon="⚠️"
                    title="Não foi possível carregar o histórico"
                    description="Verifique sua conexão e tente novamente."
                />

            ) : history.length > 0 ? (

                history.map((record) => (
                    <HistoryRecordCard
                        key={record.id}
                        record={record}
                        onPress={() =>
                            router.push({
                                pathname: "/history/[petId]/edit/[recordId]",
                                params: { petId, recordId: record.id }
                            })
                        }
                        onDelete={() => confirmDelete(record.id)}
                    />
                ))

            ) : (

                <EmptyState
                    icon="📋"
                    title="Nenhum registro encontrado"
                    description='Toque em "Nova Ação Clínica" para registrar o primeiro.'
                />

            )}

            <CustomButton
                title="Nova Ação Clínica"
                variant="secondary"
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

    loading: {
        marginVertical: SPACING.xl
    }
});
