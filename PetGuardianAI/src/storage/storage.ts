import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Pet {
    name: string;
    species: string;
    age: string;
}

export interface HistoryRecord {
    petName: string;
    description: string;
    date: string;
}

const PET_KEY = "@petguardian_pet";
const HISTORY_KEY = "@petguardian_history";

export async function savePet(
    pet: Pet
): Promise<boolean> {

    try {

        const existingPets =
            await getPets();

        const updatedPets = [
            ...existingPets,
            pet
        ];

        await AsyncStorage.setItem(
            PET_KEY,
            JSON.stringify(updatedPets)
        );

        return true;

    } catch (error) {
        console.log(
            "Erro ao salvar pet:",
            error
        );
        return false;
    }
}

export async function getPets(): Promise<Pet[]> {

    try {
        const data =
            await AsyncStorage.getItem(
                PET_KEY
            );

        if (!data) return [];

        const parsedData =
            JSON.parse(data);

        return Array.isArray(parsedData)
            ? parsedData
            : [parsedData];

    } catch (error) {
        console.log(
            "Erro ao buscar pets:",
            error
        );
        return [];
    }
}

export async function saveHistory(
    history: HistoryRecord
): Promise<boolean> {

    try {
        const existingHistory =
            await getHistory();

        const updatedHistory = [
            ...existingHistory,
            history
        ];

        await AsyncStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(updatedHistory)
        );

        return true;

    } catch (error) {

        console.log(
            "Erro ao salvar histórico:",
            error
        );
        return false;
    }
}

export async function getHistory():
Promise<HistoryRecord[]> {

    try {
        const data =
            await AsyncStorage.getItem(
                HISTORY_KEY
            );

        if (!data) return [];

        return JSON.parse(data);

    } catch {

        return [];
    }
}

export async function removePet(
    index: number
): Promise<boolean> {

    try {
        const pets =
            await getPets();

        pets.splice(index, 1);

        await AsyncStorage.setItem(
            PET_KEY,
            JSON.stringify(pets)
        );

        return true;

    } catch {

        return false;
    }
}