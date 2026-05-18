import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Pet {
    name: string;
    species: string;
    age: string;
}

const PET_KEY = "@petguardian_pet";

export async function savePet(
    pet: Pet
) {
    try {
        await AsyncStorage.setItem(
            PET_KEY,
            JSON.stringify(pet)
        );
        return true;
    }
    catch (error) {
        console.log(
            "Erro ao salvar:",
            error
        );
        return false;
    }
}

export async function getPet() {
    try {
        const data =
            await AsyncStorage.getItem(
                PET_KEY
            );
        if (data) {
            return JSON.parse(data);
        }
        return null;
    }
    catch (error) {
        console.log(
            "Erro ao buscar:",
            error
        );
        return null;
    }
}

export async function removePet() {
    try {
        await AsyncStorage.removeItem(
            PET_KEY
        );
    }
    catch (error) {
        console.log(error);
    }
}