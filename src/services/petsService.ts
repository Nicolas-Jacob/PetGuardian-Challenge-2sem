import { db } from "./firebaseConfig";
import { createFirestoreCrud } from "./firestoreCrud";
import { Pet } from "../types";

const petsCrud = createFirestoreCrud<Pet>(db, (uid) => ["users", uid, "pets"]);

export async function getPets(uid: string): Promise<Pet[]> {
    return petsCrud.getAll(uid);
}

export async function addPet(
    uid: string,
    data: Omit<Pet, "id" | "createdAt">
): Promise<void> {
    await petsCrud.add(uid, data);
}

export async function updatePet(
    uid: string,
    petId: string,
    data: Partial<Pet>
): Promise<void> {
    return petsCrud.update(uid, petId, data);
}

export async function deletePet(
    uid: string,
    petId: string
): Promise<void> {
    return petsCrud.remove(uid, petId);
}
