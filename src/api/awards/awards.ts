import type { Award, AwardRequest } from "#/types/award";
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc } from "firebase/firestore"
import { firestore as db } from "#/lib/firebase"

export const fetchAwards = async (): Promise<Award[]> => {
    if (!db) {
        throw new Error("Cannot fetch awards data: database is not initialized.");
    }

    try {
        const awardsRef = collection(db, "Awards");
        const awardsSnapshot = await getDocs(awardsRef);

        return awardsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                date: data.date?.toDate() ?? new Date(),
            } as Award;
        });
    } catch (e: any) {
        throw e;
    }
}

export const uploadAward = async (awardData: AwardRequest) => {
    if (!db) {
        throw new Error("Cannot upload award data: database is not initialized.");
    }

    try {
        const awardsRef = collection(db, "Awards");
        const docRef = await addDoc(awardsRef, awardData);

        return { ...awardData, id: docRef.id };
    } catch (e: any) {
        throw e;
    }
}

export const modifyAward = async (awardData: AwardRequest, id: string) => {
    if (!db) {
        throw new Error("Cannot modify award data: database is not initialized.");
    }

    try {
        const awardRef = doc(db, "Awards", id);
        await setDoc(awardRef, awardData);

        return awardData;
    } catch (e: any) {
        throw e;
    }
}

export const deleteAward = async (id: string) => {
    if (!db) {
        throw new Error("Cannot delete award data: database is not initialized.");
    }

    try {
        const awardRef = doc(db, "Awards", id);
        await deleteDoc(awardRef);
    } catch (e: any) {
        throw e;
    }
}
