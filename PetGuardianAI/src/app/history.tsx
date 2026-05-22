import { View, Text, TextInput, StyleSheet, ScrollView, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { getPets, saveHistory, getHistory, Pet, HistoryRecord } from "../storage/storage";
import CustomButton from "../components/CustomButton";
import BackButton from "../components/BackButton";
import { COLORS } from "../constants/colors";

export default function History() {

    const [pets, setPets] = useState<Pet[]>([]);
    const [history, setHistory] = useState<HistoryRecord[]>([]);
    const [selectedPet, setSelectedPet] = useState("");
    const [description, setDescription] = useState("");
    const [screen, setScreen] = useState<"menu" | "view" | "create">("menu");

    function isSelected(petName: string) {
        return selectedPet === petName;
    }

    async function loadData() {
        const petData = await getPets();
        const historyData = await getHistory();

        setPets(petData);
        setHistory(historyData);
    }

    async function handleSave() {

        if (!selectedPet || !description.trim()) {
            return;
        }

        const success = await saveHistory({
            petName: selectedPet,
            description,
            date: new Date().toLocaleDateString()
        });

        if (success) {
            setDescription("");
            loadData();
            setScreen("menu");
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <BackButton />

            <Text style={styles.title}>
                Histórico Clínico
            </Text>

            {screen === "menu" && (
                <>
                    <CustomButton
                        title="Ver Histórico Clínico"
                        backgroundColor="#2196F3"
                        onPress={() => setScreen("view")}
                    />

                    <CustomButton
                        title="Nova Ação Clínica"
                        backgroundColor="#E91E63"
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
                        <Pressable
                            key={pet.name}
                            onPress={() => setSelectedPet(pet.name)}
                            style={[
                                styles.petSelector,
                                isSelected(pet.name) && styles.selectedPet
                            ]}
                        >
                            <Text style={styles.petName}>
                                🐾 {pet.name}
                            </Text>

                            <Text style={styles.petInfo}>
                                {pet.species} • {pet.age} anos
                            </Text>
                        </Pressable>
                    ))}

                    {history
                        .filter(item => item.petName === selectedPet)
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
                        title="Menu"
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
                        <Pressable
                            key={pet.name}
                            onPress={() => setSelectedPet(pet.name)}
                            style={[
                                styles.petSelector,
                                isSelected(pet.name) && styles.selectedPet
                            ]}
                        >
                            <Text style={styles.petName}>
                                🐾 {pet.name}
                            </Text>

                            <Text style={styles.petInfo}>
                                {pet.species} • {pet.age} anos
                            </Text>
                        </Pressable>
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
                        title="Menu"
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

    petSelector: {
        backgroundColor: COLORS.card,
        padding: 18,
        borderRadius: 15,
        marginBottom: 12,

        borderWidth: 2,
        borderColor: "transparent",

        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3
    },

    selectedPet: {
        borderColor: "#2196F3",
        backgroundColor: "#E3F2FD",
        shadowOpacity: 0.35,
        elevation: 6
    },

    petName: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.text
    },

    petInfo: {
        marginTop: 5,
        color: COLORS.gray
    }
});