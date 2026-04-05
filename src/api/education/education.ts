import type { Education, EducationRequest } from "#/types/education"
import { collection, getDocs, addDoc } from "firebase/firestore"
import { firestore as db } from "#/lib/firebase"

export const fetchEducation = async (): Promise<Education[]> => {
    if(!db) {
        throw new Error("Cannot fetch education data: database is not initialized.");
    } else {
        const educationRef = collection(db!, "Education");
        const educationSnapshot = await getDocs(educationRef);

        return educationSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Education[];
    }
}

export const uploadEducation = async (educationData: EducationRequest) => {
    if(!db) {
        throw new Error("Cannot upload education data: database is not initialized.");
    } else {
        const educationRef = collection(db!, "Education");
        const docRef = await addDoc(educationRef, educationData);

        return {
            ...educationData,
            id: docRef.id
        };
    }
}
