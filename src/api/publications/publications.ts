import type { Publication, PublicationRequest } from "#/types/publication";
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc } from "firebase/firestore"
import { firestore as db } from "#/lib/firebase"

export const fetchPublications = async (): Promise<Publication[]> => {
    if(!db) {
        throw new Error("Cannot fetch publication data: database is not initialized.");
    }

    try {
        const publicationsRef = collection(db, "Publications");
        const publicationSnapshot = await getDocs(publicationsRef);

        return publicationSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Publication[];
    } catch(e: any) {
        throw e;
    }
}

export const uploadPublication = async (publicationData: PublicationRequest) => {
    if(!db) {
        throw new Error("Cannot upload publication data: database is not initialized.");
    }

    try {
        const publicationsRef = collection(db, "Publications");
        await addDoc(publicationsRef, publicationData);

        return {
            ...publicationData,
            id: publicationsRef.id
        }
    } catch(e: any) {
        throw e;
    }
}

export const modifyPublication = async (publicationData: PublicationRequest, id: string) => {
    if(!db) {
        throw new Error("Cannot modify publication data: database is not initialized.");
    }
    
    try {
        const publicationRef = doc(db, "Publications", id);
        await setDoc(publicationRef, publicationData);

        return publicationData
    } catch(e: any) {
        throw e;
    }
}

export const deletePublication = async (id: string) => {
    if(!db) {
        throw new Error("Cannot delete publication data: database is not initialized.");
    }

    try {
        const publicationRef = doc(db, "Publications", id);
        await deleteDoc(publicationRef);
    } catch(e: any) {
        throw e;
    }
}