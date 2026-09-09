import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useHistoryByPet, useUpdateHistoryRecord } from "../../../../hooks/useHistory";
import CustomButton from "../../../../components/CustomButton";
import BackButton from "../../../../components/BackButton";
import { COLORS } from "../../../../constants/colors";

export default function EditHistoryRecord() {

    const { petId, recordId } = useLocalSearchParams<{ petId: string; recordId: string }>();
    const { data: history = [], isPending: isLoadingHistory } = useHistoryByPet(petId);
    const updateRecord = useUpdateHistoryRecord();

    const record = history.find((item) => item.id === recordId);

    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        if (record) {
            setDescription(record.description);
            setDate(record.date);
        }
    }, [record]);

    async function handleSave() {

        if (!recordId) return;

        if (!description.trim() || !date.trim()) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        try {
            await updateRecord.mutateAsync({
                recordId,
                petId,
                data: {
                    description: description.trim(),
                    date: date.trim()
                }
            });

            Alert.alert(
                "Sucesso",
                "Registro atualizado com sucesso"
            );

            router.back();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Não foi possível atualizar o registro. Tente novamente.";

            Alert.alert("Erro", message);
        }
    }

    if (isLoadingHistory && !record) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!record) {
        return (
            <View style={styles.container}>
                <BackButton />
                <Text style={styles.title}>
                    Registro não encontrado
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <BackButton />

            <Text style={styles.title}>
                Editar Registro
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Ex: Vacina V10 aplicada"
                value={description}
                onChangeText={setDescription}
                editable={!updateRecord.isPending}
            />

            <TextInput
                style={styles.input}
                placeholder="Data (dd/mm/aaaa)"
                value={date}
                onChangeText={setDate}
                editable={!updateRecord.isPending}
            />

            <CustomButton
                title="Salvar Alterações"
                onPress={handleSave}
                loading={updateRecord.isPending}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.background
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 25
    },

    input: {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 12,
        marginBottom: 15
    }
});
