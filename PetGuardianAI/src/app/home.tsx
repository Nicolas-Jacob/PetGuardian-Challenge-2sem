import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { Pet, getPets } from "../storage/storage";
import PetCard from "../components/PetCard";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {

    const { signOut } = useAuth();

    const [pets, setPets] =
        useState<Pet[]>([]);

    async function loadPets() {
        const data =
            await getPets();

        setPets(data);
    }

    useFocusEffect(
        useCallback(() => {
            loadPets();
        }, [])
    );

    async function handleLogout() {
        try {
            await signOut();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Não foi possível sair. Tente novamente.";

            Alert.alert("Erro", message);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <View style={styles.header}>
                <Text style={styles.title}>
                    Dashboard
                </Text>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutText}>
                        Sair
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>
                Gerencie informações dos seus pets
            </Text>

            {pets.length > 0 ? (

                pets.map((pet, index) => (
                    <PetCard
                        key={index}
                        pet={pet}
                    />
                ))

            ) : (

                <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>
                        Nenhum pet cadastrado
                    </Text>
                </View>

            )}

            <CustomButton
                title="Cadastrar Pet"
                backgroundColor="#4CAF50"
                onPress={() => router.push("/addPet")}
            />

            <CustomButton
                title="Histórico Clínico"
                backgroundColor="#FF9800"
                onPress={() => router.push("/history")}
            />

            <CustomButton
                title="Chat IA"
                backgroundColor="#9C27B0"
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

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20
    },

    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: COLORS.text
    },

    logoutButton: {
        backgroundColor: COLORS.card,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 12
    },

    logoutText: {
        color: COLORS.danger,
        fontWeight: "bold"
    },

    subtitle: {
        fontSize: 15,
        color: COLORS.gray,
        marginTop: 15,
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