import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from "react";

import {
    getPets,
    saveHistory,
    getHistory,
    Pet,
    HistoryRecord
} from "../storage/storage";

import CustomButton from "../components/CustomButton";
import { COLORS } from "../constants/colors";

export default function History() {

    const [pets, setPets] = useState<Pet[]>([]);
    const [history, setHistory] = useState<HistoryRecord[]>([]);
    const [selectedPet, setSelectedPet] = useState("");
    const [description, setDescription] = useState("");

    const [screen, setScreen] =
        useState<"menu" | "view" | "create">(
            "menu"
        );

    function isSelected(
        petName: string
    ) {

        return selectedPet === petName;
    }

    async function loadData() {
        const petData =
            await getPets();

        const historyData =
            await getHistory();

        setPets(petData);
        setHistory(historyData);
    }

    async function handleSave() {
        if (
            !selectedPet ||
            !description.trim()
        ) {
            return;
        }

        const success =
            await saveHistory({

                petName: selectedPet,
                description,
                date:
                    new Date()
                        .toLocaleDateString()
            });

        if (success) {
            setDescription("");
            loadData();
            setScreen(
                "menu"
            );
        }
    }

    useEffect(() => {

        loadData();

    }, []);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>
                Histórico Clínico
            </Text>

            {screen === "menu" && (
                <>
                    <CustomButton
                        title="Ver Histórico Clínico"
                        onPress={() => setScreen("view")}
                    />

                    <CustomButton
                        title="Nova Ação Clínica"
                        onPress={() => setScreen("create")}
                    />

                </>
            )}
            {screen === "view" && (
                <>
                    <Text style={styles.subtitle}>
                        Selecione o pet
                    </Text>

                    {pets.map((pet) => (
                        <View key={pet.name}>
                            <CustomButton
                                title={pet.name}
                                onPress={() => setSelectedPet(pet.name)}
                            />

                            {isSelected(pet.name) && (

                                <View style={styles.selectedCard}>

                                    <Text style={styles.selectedText}>
                                        Pet selecionado: {pet.name}
                                    </Text>

                                </View>
                            )}
                        </View>
                    ))}
                    {history
                        .filter(item =>
                            item.petName === selectedPet
                        )
                        .map((item, index) => (
                            <View
                                key={index}
                                style={styles.card}
                            >

                                <Text style={styles.recordTitle}>
                                    {item.description}
                                </Text>

                                <Text>
                                    {item.date}
                                </Text>

                            </View>
                        ))}
                    <CustomButton
                        title="Voltar"
                        onPress={() => setScreen("menu")}
                    />
                </>
            )}
            {screen === "create" && (
                <>
                    <Text style={styles.subtitle}>
                        Escolha o pet
                    </Text>
                    {pets.map((pet) => (
                        <View key={pet.name}>
                            <CustomButton
                                title={pet.name}
                                onPress={() => setSelectedPet(pet.name)}
                            />

                            {isSelected(pet.name) && (

                                <View style={styles.selectedCard}>

                                    <Text style={styles.selectedText}>
                                        Pet selecionado: {pet.name}
                                    </Text>

                                </View>
                            )}
                        </View>
                    ))}
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Vacina V10 aplicada"
                        value={description}
                        onChangeText={setDescription}
                    />

                    <CustomButton
                        title="Salvar"
                        onPress={handleSave}
                    />

                    <CustomButton
                        title="Voltar"
                        onPress={() => setScreen("menu")}
                    />
                </>
            )}
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

    subtitle: {
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10
    },

    input: {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 12,
        marginVertical: 20
    },

    card: {
        backgroundColor: COLORS.card,
        padding: 15,
        borderRadius: 15,
        marginBottom: 15
    },

    recordTitle: {
        fontWeight: "bold",
        marginBottom: 5
    },

    selectedCard: {
        backgroundColor: COLORS.primary,
        padding: 12,
        borderRadius: 12,
        marginBottom: 15
    },

    selectedText: {
        color: COLORS.white,
        fontWeight: "bold",
        textAlign: "center"
    }
});