import type { TechStack, TechStackRequest } from '#/types/techstack'
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { firestore as db } from '#/lib/firebase'

export const fetchTechStacks = async (): Promise<TechStack[]> => {
    if (!db) {
        throw new Error('Cannot fetch tech stacks: database is not initialized.')
    }

    try {
        const colRef = collection(db, 'TechStack')
        const snapshot = await getDocs(colRef)

        return snapshot.docs.map((d) => {
            const data = d.data()

            if (!data.groups && data.group) {
                data.groups = [data.group]
            }
            return { id: d.id, ...data } as TechStack
        })
    } catch (e: any) {
        throw e
    }
}

export const createTechStack = async (data: TechStackRequest): Promise<TechStack> => {
    if (!db) {
        throw new Error('Cannot create tech stack: database is not initialized.')
    }

    try {
        const colRef = collection(db, 'TechStack')
        const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined))
        const docRef = await addDoc(colRef, clean)

        return { id: docRef.id, ...clean } as TechStack
    } catch (e: any) {
        throw e
    }
}

export const updateTechStack = async (id: string, data: Partial<TechStackRequest>): Promise<void> => {
    if (!db) {
        throw new Error('Cannot update tech stack: database is not initialized.')
    }

    try {
        const docRef = doc(db, 'TechStack', id)
        const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined))
        await updateDoc(docRef, clean)
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
