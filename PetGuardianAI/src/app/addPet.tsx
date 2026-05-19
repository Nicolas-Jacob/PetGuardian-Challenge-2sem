import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { savePet } from "../storage/storage";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../constants/colors";

export default function AddPet() {
    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [age, setAge] = useState("");

    async function handleSave() {

        if (!name.trim() || !species.trim() || !age.trim()) {
            Alert.alert(
                "Erro",
                "Preencha todos os campos"
            );
            return;
        }

        if (isNaN(Number(age))) {
            Alert.alert(
                "Erro",
                "Digite uma idade válida"
            );
            return;
        }

        const success = await savePet({
            name,
            species,
            age
        });

        if (success) {

            Alert.alert(
                "Sucesso",
                "Pet cadastrado com sucesso"
            );

            setName("");
            setSpecies("");
            setAge("");

            router.back();
        }
    }

    return (

        <View style={styles.container}>

            <Text style={styles.title}>
                Cadastrar Pet
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Nome do pet"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Espécie"
                value={species}
                onChangeText={setSpecies}
            />

            <TextInput
                style={styles.input}
                placeholder="Idade"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
            />

            <View style={styles.previewCard}>

                <Text style={styles.previewTitle}>
                    Preview
                </Text>

                <Text>
                    Nome: {name || "-"}
                </Text>

                <Text>
                    Espécie: {species || "-"}
                </Text>

                <Text>
                    Idade: {age || "-"}
                </Text>

            </View>

            <CustomButton
                title="Salvar Pet"
                onPress={handleSave}
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