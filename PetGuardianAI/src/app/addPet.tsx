import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useAddPet } from "../hooks/usePets";
import CustomButton from "../components/CustomButton";
import BackButton from "../components/BackButton";
import { COLORS } from "../constants/colors";

export default function AddPet() {

    const addPet = useAddPet();

    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [age, setAge] = useState("");

    async function handleSave() {

        if (!name.trim() || !species.trim() || !age.trim()) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        if (isNaN(Number(age))) {
            Alert.alert("Erro", "Digite uma idade válida");
            return;
        }

        try {
            await addPet.mutateAsync({
                name: name.trim(),
                species: species.trim(),
                age: Number(age)
            });

            Alert.alert(
                "Sucesso",
                "Pet cadastrado com sucesso"
            );

            setName("");
            setSpecies("");
            setAge("");

            router.back();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Não foi possível cadastrar o pet. Tente novamente.";

            Alert.alert("Erro", message);
        }
    }

    return (
        <View style={styles.container}>
            <BackButton />
            <Text style={styles.title}>
                Cadastrar Pet
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Nome do pet"
                value={name}
                onChangeText={setName}
                editable={!addPet.isPending}
            />

            <TextInput
                style={styles.input}
                placeholder="Espécie"
                value={species}
                onChangeText={setSpecies}
                editable={!addPet.isPending}
            />

            <TextInput
                style={styles.input}
                placeholder="Idade"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                editable={!addPet.isPending}
            />

            <View style={styles.previewCard}>

                <Text style={styles.previewTitle}>
                    Preview
                </Text>

                <Text>Nome: {name || "-"}</Text>
                <Text>Espécie: {species || "-"}</Text>
                <Text>Idade: {age || "-"}</Text>

            </View>

            <CustomButton
                title="Salvar Pet"
                onPress={handleSave}
                loading={addPet.isPending}
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
    },

    previewCard: {
        backgroundColor: COLORS.card,
        padding: 20,
        borderRadius: 15,
        marginVertical: 20
    },

    previewTitle: {
        fontWeight: "bold",
        marginBottom: 10
    }
});
