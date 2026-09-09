import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Pet } from "../types";

function petsCollection(uid: string) {
    return collection(db, "users", uid, "pets");
}

export async function getPets(uid: string): Promise<Pet[]> {

    const petsQuery = query(
        petsCollection(uid),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(petsQuery);

    return snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...docSnapshot.data()
    })) as Pet[];
}

export async function addPet(
    uid: string,
    data: Omit<Pet, "id" | "createdAt">
): Promise<void> {

    await addDoc(petsCollection(uid), {
        ...data,
        createdAt: Date.now()
    });
}

export async function updatePet(
    uid: string,
    petId: string,
    data: Partial<Pet>
): Promise<void> {

    const { id, createdAt, ...updateData } = data;

    await updateDoc(
        doc(db, "users", uid, "pets", petId),
        updateData
    );
}

export async function deletePet(
    uid: string,
    petId: string
): Promise<void> {

    await deleteDoc(doc(db, "users", uid, "pets", petId));
}
