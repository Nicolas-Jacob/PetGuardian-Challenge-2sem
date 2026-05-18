import { View, Text, StyleSheet, ScrollView } from "react-native";
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

    useFocusEffect(
        useCallback(() => {
            loadPet();
        }, [])
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <Text style={styles.title}>
                Dashboard
            </Text>

            <Text style={styles.subtitle}>
                Gerencie informações do seu pet
            </Text>

            {pet ? (
                <PetCard pet={pet} />
            ) : (
                <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>
                        Nenhum pet cadastrado
                    </Text>
                </View>
            )}

            <CustomButton
                title="Cadastrar Pet"
                onPress={() => router.push("/addPet")}
            />

            <CustomButton
                title="Histórico Clínico"
                onPress={() => router.push("/history")}
            />

            <CustomButton
                title="Chat IA"
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

    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 20,
        color: COLORS.text
    },

    subtitle: {
        fontSize: 15,
        color: COLORS.gray,
        marginBottom: 20
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