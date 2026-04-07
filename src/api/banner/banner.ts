import { ref, getDownloadURL } from "firebase/storage";
import { storage, firestore as db } from "#/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

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

export const fetchBannerText = async (): Promise<string> => {
    if (!db) {
        return 'Yujee Chang'
    }

    try {
        const docRef = doc(db, 'Settings', 'banner')
        const snapshot = await getDoc(docRef)

        if (snapshot.exists()) {
            return (snapshot.data().text as string) ?? 'Yujee Chang'
        }

        return 'Yujee Chang'
    } catch {
        return 'Yujee Chang'
    }
}

export const updateBannerText = async (text: string): Promise<void> => {
    if (!db) {
        throw new Error('Cannot update banner text: database is not initialized.')
    }

    const docRef = doc(db, 'Settings', 'banner')
    await setDoc(docRef, { text }, { merge: true })
}
