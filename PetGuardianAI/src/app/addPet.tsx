import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

import { savePet } from "../storage/storage";

import CustomButton from "../components/CustomButton";

export default function AddPet() {
    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [age, setAge] = useState("");

    async function handleSave() {
        if (!name || !species || !age) {
            Alert.alert(
                "Erro",
                "Preencha todos os campos"
            );
            return;
        }

        await savePet({
            name,
            species,
            age
        });

        Alert.alert(
            "Sucesso",
            "Pet salvo"
        );

        router.back();
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Cadastrar Pet
            </Text>

            <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName}/>

            <TextInput style={styles.input} placeholder="Espécie" value={species} onChangeText={setSpecies}/>

            <TextInput style={styles.input} placeholder="Idade" value={age} onChangeText={setAge} keyboardType="numeric"/>

            <Text> Preview: </Text>

            <Text>{name}</Text>
            <Text>{species}</Text>
            <Text>{age}</Text>

            <CustomButton
                title="Salvar"
                onPress={handleSave}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20
    },
    input: {
        backgroundColor: "#fff",
        padding: 15,
        marginBottom: 10,
        borderRadius: 10
    }
});