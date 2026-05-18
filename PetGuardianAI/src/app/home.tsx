import { View, Text, StyleSheet } from "react-native";
import { useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { Pet, getPet } from "../storage/storage";
import PetCard from "../components/PetCard";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../constants/colors";

export default function Home() {
    const [pet, setPet] = useState<Pet | null>(null);

    async function loadPet() {
        const data = await getPet();
        setPet(data);
    }

    useFocusEffect(useCallback(() => {
        loadPet();
    }, []));

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>
            {pet ? (
                <PetCard pet={pet} />
            ) : (
                <Text style={styles.emptyText}>Nenhum pet cadastrado</Text>
            )}
            <CustomButton title="Cadastrar Pet" onPress={() => router.push("/addPet")} />
            <CustomButton title="Histórico" onPress={() => router.push("/history")} />
            <CustomButton title="Chat IA" onPress={() => router.push("/chat")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.background,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 16,
        marginBottom: 20,
        color: COLORS.gray,
    },
});