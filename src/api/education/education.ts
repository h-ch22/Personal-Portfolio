import type { Education, EducationRequest } from "#/types/education"
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc } from "firebase/firestore"
import { firestore as db } from "#/lib/firebase"

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
        const docRef = await addDoc(educationRef, educationData);

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
        await setDoc(educationRef, educationData);

        return educationData
    } catch(e: any) {
        throw e;
    }
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
