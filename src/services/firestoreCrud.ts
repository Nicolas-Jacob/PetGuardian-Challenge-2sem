import {
    Firestore,
    DocumentData,
    QuerySnapshot,
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy
} from "firebase/firestore";

export function createFirestoreCrud<T extends { id: string }>(
    db: Firestore,
    buildCollectionPath: (uid: string) => [string, ...string[]]
) {

    function collectionRef(uid: string) {
        return collection(db, ...buildCollectionPath(uid));
    }

    function docRef(uid: string, id: string) {
        return doc(db, ...buildCollectionPath(uid), id);
    }

    function mapSnapshot(snapshot: QuerySnapshot<DocumentData>): T[] {
        return snapshot.docs.map((docSnapshot) => ({
            id: docSnapshot.id,
            ...docSnapshot.data()
        })) as T[];
    }

    return {
        collectionRef,
        mapSnapshot,

        async getAll(
            uid: string,
            orderByField: string = "createdAt"
        ): Promise<T[]> {

            const snapshot = await getDocs(
                query(collectionRef(uid), orderBy(orderByField, "desc"))
            );

            return mapSnapshot(snapshot);
        },

        async add(
            uid: string,
            data: Omit<T, "id" | "createdAt">
        ): Promise<void> {

            await addDoc(collectionRef(uid), {
                ...data,
                createdAt: Date.now()
            });
        },

        async update(
            uid: string,
            id: string,
            data: Partial<T>
        ): Promise<void> {

            const { id: _id, createdAt, ...updateData } =
                data as Partial<T> & { createdAt?: unknown };

            await updateDoc(docRef(uid, id), updateData);
        },

        async remove(
            uid: string,
            id: string
        ): Promise<void> {

            await deleteDoc(docRef(uid, id));
        }
    };
}
