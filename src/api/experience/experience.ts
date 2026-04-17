import type { Experience, ExperienceRequest } from "#/types/experience";
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { firestore as db, storage } from "#/lib/firebase"

export const uploadExperienceLogo = async (experienceId: string, file: File): Promise<string> => {
    if (!storage) throw new Error("Storage not initialized.")
    const path = `experience/${experienceId}/logo`
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    return await getDownloadURL(storageRef)
}

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

const stripUndefined = <T extends object>(obj: T): T =>
    Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T

export const uploadExperience = async (experienceData: ExperienceRequest) => {
    if(!db) {
        throw new Error("Cannot upload experience data: database is not initialized.");
    }

    try {
        const experienceRef = collection(db, "Experience");
        const docRef = await addDoc(experienceRef, stripUndefined(experienceData));

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
        await setDoc(experienceRef, stripUndefined(experienceData));

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
