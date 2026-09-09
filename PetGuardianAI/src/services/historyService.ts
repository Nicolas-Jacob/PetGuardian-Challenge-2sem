import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { HistoryRecord } from "../types";

function historyCollection(uid: string) {
    return collection(db, "users", uid, "history");
}

export async function getHistoryByPet(
    uid: string,
    petId: string
): Promise<HistoryRecord[]> {

    const historyQuery = query(
        historyCollection(uid),
        where("petId", "==", petId),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(historyQuery);

    return snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...docSnapshot.data()
    })) as HistoryRecord[];
}

export async function addHistoryRecord(
    uid: string,
    data: Omit<HistoryRecord, "id" | "createdAt">
): Promise<void> {

    await addDoc(historyCollection(uid), {
        ...data,
        createdAt: Date.now()
    });
}

export async function updateHistoryRecord(
    uid: string,
    recordId: string,
    data: Partial<HistoryRecord>
): Promise<void> {

    const { id, createdAt, ...updateData } = data;

    await updateDoc(
        doc(db, "users", uid, "history", recordId),
        updateData
    );
}

export async function deleteHistoryRecord(
    uid: string,
    recordId: string
): Promise<void> {

    await deleteDoc(doc(db, "users", uid, "history", recordId));
}
