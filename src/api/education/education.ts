import type { Education, EducationRequest } from "#/types/education"
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { firestore as db, storage } from "#/lib/firebase"

const stripUndefined = <T extends object>(obj: T): T =>
    Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T

export const fetchEducation = async (): Promise<Education[]> => {
    if(!db) {
        throw new Error("Cannot fetch education data: database is not initialized.");
    }

    try {
        const educationRef = collection(db, "Education");
        const educationSnapshot = await getDocs(educationRef);

        return educationSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Education[];
    } catch(e: any) {
        throw e;
    }
}

export const uploadEducation = async (educationData: EducationRequest) => {
    if(!db) {
        throw new Error("Cannot upload education data: database is not initialized.");
    }

    try {
        const educationRef = collection(db, "Education");
        const docRef = await addDoc(educationRef, stripUndefined(educationData));

        return {
            ...educationData,
            id: docRef.id
        };
    } catch(e: any) {
        throw e;
    }
}

export const modifyEducation = async (educationData: EducationRequest, id: string) => {
    if(!db) {
        throw new Error("Cannot modify education data: database is not initialized.");
    }

    try {
        const educationRef = doc(db, "Education", id);
        await setDoc(educationRef, stripUndefined(educationData));

        return educationData
    } catch(e: any) {
        throw e;
    }
}

export const uploadEducationLogo = async (educationId: string, file: File): Promise<string> => {
    if (!storage) throw new Error('Storage not initialized.')
    const path = `education/${educationId}/logo`
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    return await getDownloadURL(storageRef)
}

export const deleteEducation = async (id: string) => {
    if(!db) {
        throw new Error("Cannot delete education data: database is not initialized.");
    }

    try {
        const educationRef = doc(db, "Education", id);
        await deleteDoc(educationRef);
    } catch(e: any) {
        throw e;
    }
}
