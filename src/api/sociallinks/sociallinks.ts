import type { SocialLink, SocialLinkRequest } from '#/types/sociallink'
import { collection, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore'
import { firestore as db } from '#/lib/firebase'

export const fetchSocialLinks = async (): Promise<SocialLink[]> => {
    if (!db) {
        throw new Error('Cannot fetch social links: database is not initialized.')
    }

    try {
        const colRef = collection(db, 'SocialLinks')
        const snapshot = await getDocs(colRef)

        return snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
        })) as SocialLink[]
    } catch (e: any) {
        throw e
    }
}

export const createSocialLink = async (data: SocialLinkRequest): Promise<SocialLink> => {
    if (!db) {
        throw new Error('Cannot create social link: database is not initialized.')
    }

    try {
        const colRef = collection(db, 'SocialLinks')
        const docRef = await addDoc(colRef, data)

        return { id: docRef.id, ...data }
    } catch (e: any) {
        throw e
    }
}

export const deleteSocialLink = async (id: string): Promise<void> => {
    if (!db) {
        throw new Error('Cannot delete social link: database is not initialized.')
    }

    try {
        const docRef = doc(db, 'SocialLinks', id)
        await deleteDoc(docRef)
    } catch (e: any) {
        throw e
    }
}
