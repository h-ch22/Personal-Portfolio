import type { TechStack, TechStackRequest } from '#/types/techstack'
import { collection, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore'
import { firestore as db } from '#/lib/firebase'

export const fetchTechStacks = async (): Promise<TechStack[]> => {
    if (!db) {
        throw new Error('Cannot fetch tech stacks: database is not initialized.')
    }

    try {
        const ref = collection(db, 'TechStack')
        const snapshot = await getDocs(ref)

        return snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
        })) as TechStack[]
    } catch (e: any) {
        throw e
    }
}

export const createTechStack = async (data: TechStackRequest): Promise<TechStack> => {
    if (!db) {
        throw new Error('Cannot create tech stack: database is not initialized.')
    }

    try {
        const ref = collection(db, 'TechStack')
        const docRef = await addDoc(ref, data)

        return { id: docRef.id, ...data }
    } catch (e: any) {
        throw e
    }
}

export const deleteTechStack = async (id: string): Promise<void> => {
    if (!db) {
        throw new Error('Cannot delete tech stack: database is not initialized.')
    }

    try {
        const docRef = doc(db, 'TechStack', id)
        await deleteDoc(docRef)
    } catch (e: any) {
        throw e
    }
}
