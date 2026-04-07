import type { Gallery, GalleryImage, GalleryRequest } from "#/types/gallery";
import {
    collection,
    getDocs,
    addDoc,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
} from "firebase/firestore";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";
import { firestore as db, storage } from "#/lib/firebase";

export const fetchGalleries = async (): Promise<Gallery[]> => {
    if (!db) {
        throw new Error("Cannot fetch gallery data: database is not initialized.");
    }

    try {
        const galleryRef = collection(db, "Gallery");
        const snapshot = await getDocs(galleryRef);

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                date: data.date?.toDate() ?? new Date(),
            } as Gallery;
        });
    } catch (e: any) {
        throw e;
    }
};

export const uploadGalleryImages = async (
    galleryId: string,
    files: File[],
): Promise<GalleryImage[]> => {
    if (!storage) {
        throw new Error("Cannot upload images: storage is not initialized.");
    }

    const uploadedImages: GalleryImage[] = [];

    for (const file of files) {
        const path = `gallery/${galleryId}/${Date.now()}-${file.name}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        uploadedImages.push({ url, path });
    }

    return uploadedImages;
};

export const createGallery = async (
    data: Omit<GalleryRequest, "images">,
    imageFiles: File[],
): Promise<Gallery> => {
    if (!db) {
        throw new Error("Cannot post gallery: database is not initialized.");
    }

    try {
        const galleryRef = collection(db, "Gallery");
        const docRef = await addDoc(galleryRef, { ...data, images: [] });

        const images = await uploadGalleryImages(docRef.id, imageFiles);

        await updateDoc(docRef, { images });

        return { id: docRef.id, ...data, images };
    } catch (e: any) {
        throw e;
    }
};

export const modifyGallery = async (
    data: Omit<GalleryRequest, "images">,
    id: string,
    existingImages: GalleryImage[],
    newImageFiles: File[],
    deletedImagePaths: string[],
): Promise<Gallery> => {
    if (!db || !storage) {
        throw new Error("Cannot modify gallery: services not initialized.");
    }

    try {
        for (const path of deletedImagePaths) {
            try {
                const storageRef = ref(storage, path);
                await deleteObject(storageRef);
            } catch {
                // bypass
            }
        }

        const newImages = await uploadGalleryImages(id, newImageFiles);

        const keptImages = existingImages.filter(
            (img) => !deletedImagePaths.includes(img.path),
        );
        const images = [...keptImages, ...newImages];

        const galleryDoc = doc(db, "Gallery", id);
        await setDoc(galleryDoc, { ...data, images });

        return { id, ...data, images };
    } catch (e: any) {
        throw e;
    }
};

export const deleteGallery = async (
    id: string,
    images: GalleryImage[],
): Promise<void> => {
    if (!db) {
        throw new Error("Cannot delete gallery: database is not initialized.");
    }

    try {
        if (storage) {
            for (const image of images) {
                try {
                    const storageRef = ref(storage, image.path);
                    await deleteObject(storageRef);
                } catch {
                    // bypass
                }
            }
        }

        const galleryDoc = doc(db, "Gallery", id);
        await deleteDoc(galleryDoc);
    } catch (e: any) {
        throw e;
    }
};
