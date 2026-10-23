import { Pet } from "../types";

export interface PetFormValues {
    name: string;
    species: string;
    age: string;
}

export type PetFormData = Pick<Pet, "name" | "species" | "age">;

export type PetValidationResult =
    | { ok: true; data: PetFormData }
    | { ok: false; message: string };

export const EMPTY_PET_FORM: PetFormValues = { name: "", species: "", age: "" };

export function petToFormValues(pet: Pet): PetFormValues {
    return { name: pet.name, species: pet.species, age: String(pet.age) };
}

// Mesmas regras e mesma ordem das telas de cadastro e edição de pet
export function validatePetForm({ name, species, age }: PetFormValues): PetValidationResult {

    if (!name.trim() || !species.trim() || !age.trim()) {
        return { ok: false, message: "Preencha todos os campos" };
    }

    if (isNaN(Number(age))) {
        return { ok: false, message: "Digite uma idade válida" };
    }

    return {
        ok: true,
        data: { name: name.trim(), species: species.trim(), age: Number(age) }
    };
}
