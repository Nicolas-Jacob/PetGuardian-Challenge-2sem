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

        if (!data) {
            return [];
        }

        const parsedData =
            JSON.parse(data);

        if (
            Array.isArray(
                parsedData
            )
        ) {
            return parsedData;
        }

        return [
            parsedData
        ];

    } catch (error) {

        console.log(
            "Erro ao buscar pets:",
            error
        );

        return [];
    }
}

export async function removePet(
    index: number
): Promise<boolean> {

    try {

        const pets =
            await getPets();

        pets.splice(
            index,
            1
        );

        await AsyncStorage.setItem(
            PET_KEY,
            JSON.stringify(pets)
        );

        return true;

    } catch (error) {

        console.log(
            "Erro ao remover:",
            error
        );

        return false;
    }
}

export async function petExists(): Promise<boolean> {

    try {

        const pets =
            await getPets();

        return pets.length > 0;

    } catch {

        return false;
    }
}