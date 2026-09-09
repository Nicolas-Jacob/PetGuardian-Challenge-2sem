import { getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { createFirestoreCrud } from "./firestoreCrud";
import { HistoryRecord } from "../types";

const historyCrud = createFirestoreCrud<HistoryRecord>(
    db,
    (uid) => ["users", uid, "history"]
);

export async function getHistoryByPet(
    uid: string,
    petId: string
): Promise<HistoryRecord[]> {

    const historyQuery = query(
        historyCrud.collectionRef(uid),
        where("petId", "==", petId),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(historyQuery);

    return historyCrud.mapSnapshot(snapshot);
}

export async function addHistoryRecord(
    uid: string,
    data: Omit<HistoryRecord, "id" | "createdAt">
): Promise<void> {
    return historyCrud.add(uid, data);
}

export async function updateHistoryRecord(
    uid: string,
    recordId: string,
    data: Partial<HistoryRecord>
): Promise<void> {
    return historyCrud.update(uid, recordId, data);
}

export async function deleteHistoryRecord(
    uid: string,
    recordId: string
): Promise<void> {
    return historyCrud.remove(uid, recordId);
}
