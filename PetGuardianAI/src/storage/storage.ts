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
    }
    catch (error) {
        console.log(
            "Erro ao salvar:",
            error
        );
    }
}

export async function getPet() {
    try {
        const data =
            await AsyncStorage.getItem(
                PET_KEY
            );
        return data
            ? JSON.parse(data)
            : null;
    }

    catch (error) {
        console.log(error);
        return null;
    }
}