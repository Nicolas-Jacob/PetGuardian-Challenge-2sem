import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Pet {
    name: string;
    species: string;
    age: string;
}

const PET_KEY = "@petguardian_pet";

export async function savePet(
    pet: Pet
): Promise<boolean> {

    try {
        const petData = JSON.stringify(pet);

        await AsyncStorage.setItem(
            PET_KEY,
            petData
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

export async function getPet(): Promise<Pet | null> {

    try {
        const data =
            await AsyncStorage.getItem(
                PET_KEY
            );

        if (!data) {
            return null;
        }
        return JSON.parse(data);

    } catch (error) {
        console.log(
            "Erro ao buscar pet:",
            error
        );
        return null;
    }
}

export async function removePet(): Promise<boolean> {

    try {
        await AsyncStorage.removeItem(
            PET_KEY
        );
        return true;

    } catch (error) {
        console.log(
            "Erro ao remover pet:",
            error
        );
        return false;
    }
}

export async function petExists(): Promise<boolean> {
    try {

        const data =
            await AsyncStorage.getItem(
                PET_KEY
            );

        return !!data;

    } catch {
        return false;
    }
}