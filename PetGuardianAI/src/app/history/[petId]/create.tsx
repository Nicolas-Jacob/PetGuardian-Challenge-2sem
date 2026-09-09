import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useAddHistoryRecord } from "../../../hooks/useHistory";
import CustomButton from "../../../components/CustomButton";
import BackButton from "../../../components/BackButton";
import { COLORS } from "../../../constants/colors";

export default function CreateHistoryRecord() {

    const { petId } = useLocalSearchParams<{ petId: string }>();
    const addRecord = useAddHistoryRecord();

    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date().toLocaleDateString("pt-BR"));

    async function handleSave() {

        if (!description.trim() || !date.trim()) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        try {
            await addRecord.mutateAsync({
                petId,
                description: description.trim(),
                date: date.trim()
            });

            Alert.alert(
                "Sucesso",
                "Registro salvo com sucesso"
            );

            router.back();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Não foi possível salvar o registro. Tente novamente.";

            Alert.alert("Erro", message);
        }
    }

    return (
        <View style={styles.container}>
            <BackButton />

            <Text style={styles.title}>
                Nova Ação Clínica
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Ex: Vacina V10 aplicada"
                value={description}
                onChangeText={setDescription}
                editable={!addRecord.isPending}
            />

            <TextInput
                style={styles.input}
                placeholder="Data (dd/mm/aaaa)"
                value={date}
                onChangeText={setDate}
                editable={!addRecord.isPending}
            />

            <CustomButton
                title="Salvar"
                onPress={handleSave}
                loading={addRecord.isPending}
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
