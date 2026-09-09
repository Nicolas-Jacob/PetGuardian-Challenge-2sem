import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { usePets, useUpdatePet } from "../../hooks/usePets";
import CustomButton from "../../components/CustomButton";
import BackButton from "../../components/BackButton";
import { COLORS } from "../../constants/colors";

export default function EditPet() {

    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: pets = [], isPending: isLoadingPets } = usePets();
    const updatePet = useUpdatePet();

    const pet = pets.find((item) => item.id === id);

    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [age, setAge] = useState("");

    useEffect(() => {
        if (pet) {
            setName(pet.name);
            setSpecies(pet.species);
            setAge(String(pet.age));
        }
    }, [pet]);

    async function handleSave() {

        if (!id) return;

        if (!name.trim() || !species.trim() || !age.trim()) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        if (isNaN(Number(age))) {
            Alert.alert("Erro", "Digite uma idade válida");
            return;
        }

        try {
            await updatePet.mutateAsync({
                petId: id,
                data: {
                    name: name.trim(),
                    species: species.trim(),
                    age: Number(age)
                }
            });

            Alert.alert(
                "Sucesso",
                "Pet atualizado com sucesso"
            );

            router.back();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Não foi possível atualizar o pet. Tente novamente.";

            Alert.alert("Erro", message);
        }
    }

    if (isLoadingPets && !pet) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!pet) {
        return (
            <View style={styles.container}>
                <BackButton />
                <Text style={styles.title}>
                    Pet não encontrado
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <BackButton />
            <Text style={styles.title}>
                Editar Pet
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Nome do pet"
                value={name}
                onChangeText={setName}
                editable={!updatePet.isPending}
            />

            <TextInput
                style={styles.input}
                placeholder="Espécie"
                value={species}
                onChangeText={setSpecies}
                editable={!updatePet.isPending}
            />

            <TextInput
                style={styles.input}
                placeholder="Idade"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                editable={!updatePet.isPending}
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
                title="Salvar Alterações"
                onPress={handleSave}
                loading={updatePet.isPending}
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
