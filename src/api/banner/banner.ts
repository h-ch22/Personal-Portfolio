import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage, firestore as db } from "#/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { CONFIG } from "#/config";

export const fetchBannerImage = async () => {
    if(!storage) {
        return null;
    }

    const bannerRef = ref(storage, "banner/img_banner.png");

    try {
        const res = await getDownloadURL(bannerRef);
        return res;
    } catch(e: any) {
        throw e;
    }
}

export const uploadBannerImage = async (file: File): Promise<string> => {
    if (!storage) {
        throw new Error('Cannot upload banner image: storage is not initialized.')
    }

    const bannerRef = ref(storage, "banner/img_banner.png")
    await uploadBytes(bannerRef, file)
    return await getDownloadURL(bannerRef)
}

export const fetchBannerText = async (): Promise<string> => {
    if (!db) {
        return CONFIG.banner.bannerTextPlaceholder;
    }

    try {
        const docRef = doc(db, 'Settings', 'banner')
        const snapshot = await getDoc(docRef)

        if (snapshot.exists()) {
            return (snapshot.data().text as string) ?? CONFIG.banner.bannerTextPlaceholder;
        }

        return CONFIG.banner.bannerTextPlaceholder;
    } catch {
        return CONFIG.banner.bannerTextPlaceholder;
    }
}

export const updateBannerText = async (text: string): Promise<void> => {
    if (!db) {
        throw new Error('Cannot update banner text: database is not initialized.')
    }

    const docRef = doc(db, 'Settings', 'banner')
    await setDoc(docRef, { text }, { merge: true })
}

const HOME_DESCRIPTION_DEFAULT = CONFIG.banner.defaultDescriptionText;

export const fetchProfileImage = async (): Promise<string | null> => {
    if (!storage) return null

    try {
        const profileRef = ref(storage, 'settings/img_profile.png')
        return await getDownloadURL(profileRef)
    } catch {
        return null
    }
}

export const uploadProfileImage = async (file: File): Promise<string> => {
    if (!storage) {
        throw new Error('Cannot upload profile image: storage is not initialized.')
    }

    const profileRef = ref(storage, 'settings/img_profile.png')
    await uploadBytes(profileRef, file)
    return await getDownloadURL(profileRef)
}

export const fetchHomeDescription = async (): Promise<string> => {
    if (!db) {
        return HOME_DESCRIPTION_DEFAULT
    }

    try {
        const docRef = doc(db, 'Settings', 'home')
        const snapshot = await getDoc(docRef)

        if (snapshot.exists()) {
            return (snapshot.data().description as string) ?? HOME_DESCRIPTION_DEFAULT
        }

        return HOME_DESCRIPTION_DEFAULT
    } catch {
        return HOME_DESCRIPTION_DEFAULT
    }
}

export const updateHomeDescription = async (description: string): Promise<void> => {
    if (!db) {
        throw new Error('Cannot update home description: database is not initialized.')
    }

    const docRef = doc(db, 'Settings', 'home')
    await setDoc(docRef, { description }, { merge: true })
}

export const fetchFeaturedProjectIds = async (): Promise<string[]> => {
    if (!db) return []

    try {
        const docRef = doc(db, 'Settings', 'home')
        const snapshot = await getDoc(docRef)

        if (snapshot.exists()) {
            return (snapshot.data().featuredProjectIds as string[]) ?? []
        }

        return []
    } catch {
        return []
    }
}

export const updateFeaturedProjectIds = async (ids: string[]): Promise<void> => {
    if (!db) {
        throw new Error('Cannot update featured projects: database is not initialized.')
    }

    const docRef = doc(db, 'Settings', 'home')
    await setDoc(docRef, { featuredProjectIds: ids }, { merge: true })
}
