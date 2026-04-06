import type { Experience, ExperienceRequest } from "#/types/experience";
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc } from "firebase/firestore"
import { firestore as db } from "#/lib/firebase"

export const fetchExperience = async (): Promise<Experience[]> => {
    if(!db) {
        throw new Error("Cannot fetch experience data: database is not initialized.");
    }

    try {
        const experienceRef = collection(db, "Experience");
        const experienceSnapshot = await getDocs(experienceRef);

        return experienceSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                startDate: data.startDate?.toDate() ?? new Date(),
                endDate: data.endDate?.toDate() ?? null,
            } as Experience;
        });
    } catch(e: any) {
        throw e;
    }
}

export const uploadExperience = async (experienceData: ExperienceRequest) => {
    if(!db) {
        throw new Error("Cannot upload experience data: database is not initialized.");
    }

    try {
        const experienceRef = collection(db, "Experience");
        const docRef = await addDoc(experienceRef, experienceData);

        return {
            ...experienceData,
            id: docRef.id
        };
    } catch(e: any) {
        throw e;
    }
}

export const modifyExperience = async (experienceData: ExperienceRequest, id: string) => {
    if(!db) {
        throw new Error("Cannot modify experience data: database is not initialized.");
    }

    try {
        const experienceRef = doc(db, "Experience", id);
        await setDoc(experienceRef, experienceData);

        return experienceData
    } catch(e: any) {
        throw e;
    }
}

export const deleteExperience = async (id: string) => {
    if(!db) {
        throw new Error("Cannot delete experience data: database is not initialized.");
    }

    try {
        const experienceRef = doc(db, "Experience", id);
        await deleteDoc(experienceRef);
    } catch(e: any) {
        throw e;
    }
}
