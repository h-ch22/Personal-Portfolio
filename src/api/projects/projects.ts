import type { Project, ProjectRequest } from '#/types/project'
import type { GalleryImage } from '#/types/gallery'
import {
    collection,
    getDocs,
    addDoc,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
} from 'firebase/firestore'
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage'
import { firestore as db, storage } from '#/lib/firebase'

export const fetchProjects = async (): Promise<Project[]> => {
    if (!db) {
        throw new Error('Cannot fetch projects: database is not initialized.')
    }

    try {
        const projectsRef = collection(db, 'Projects')
        const snapshot = await getDocs(projectsRef)

        return snapshot.docs.map((doc) => {
            const data = doc.data()
            return {
                id: doc.id,
                ...data,
                startDate: data.startDate?.toDate() ?? new Date(),
                endDate: data.endDate?.toDate() ?? null,
            } as Project
        })
    } catch (e: any) {
        throw e
    }
}

export const uploadProjectImages = async (
    projectId: string,
    files: File[],
): Promise<GalleryImage[]> => {
    if (!storage) {
        throw new Error('Cannot upload images: storage is not initialized.')
    }

    const uploaded: GalleryImage[] = []

    for (const file of files) {
        const path = `projects/${projectId}/${Date.now()}-${file.name}`
        const storageRef = ref(storage, path)
        await uploadBytes(storageRef, file)
        const url = await getDownloadURL(storageRef)
        uploaded.push({ url, path })
    }

    return uploaded
}

const sanitize = (data: Record<string, any>) =>
    Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined))

export const createProject = async (
    data: Omit<ProjectRequest, 'images'>,
    imageFiles: File[],
): Promise<Project> => {
    if (!db) {
        throw new Error('Cannot create project: database is not initialized.')
    }

    try {
        const projectsRef = collection(db, 'Projects')
        const docRef = await addDoc(projectsRef, {
            ...sanitize(data as any),
            images: [],
        })

        const images = await uploadProjectImages(docRef.id, imageFiles)
        await updateDoc(docRef, { images })

        return { id: docRef.id, ...data, images }
    } catch (e: any) {
        throw e
    }
}

export const modifyProject = async (
    data: Omit<ProjectRequest, 'images'>,
    id: string,
    existingImages: GalleryImage[],
    newImageFiles: File[],
    deletedImagePaths: string[],
): Promise<Project> => {
    if (!db || !storage) {
        throw new Error('Cannot modify project: services not initialized.')
    }

    try {
        for (const path of deletedImagePaths) {
            try {
                await deleteObject(ref(storage, path))
            } catch {
                // bypass
            }
        }

        const newImages = await uploadProjectImages(id, newImageFiles)
        const keptImages = existingImages.filter(
            (img) => !deletedImagePaths.includes(img.path),
        )
        const images = [...keptImages, ...newImages]

        const projectDoc = doc(db, 'Projects', id)
        await setDoc(projectDoc, { ...sanitize(data as any), images })

        return { id, ...data, images }
    } catch (e: any) {
        throw e
    }
}

export const uploadProjectLogo = async (projectId: string, file: File): Promise<string> => {
    if (!storage) throw new Error('Storage not initialized.')
    const path = `projects/${projectId}/logo`
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    return await getDownloadURL(storageRef)
}

export const updateProjectLogoUrl = async (id: string, logoUrl: string): Promise<void> => {
    if (!db) throw new Error('Cannot update project: database is not initialized.')
    const projectDoc = doc(db, 'Projects', id)
    await updateDoc(projectDoc, { logoUrl })
}

export const deleteProject = async (
    id: string,
    images: GalleryImage[],
): Promise<void> => {
    if (!db) {
        throw new Error('Cannot delete project: database is not initialized.')
    }

    try {
        if (storage) {
            for (const image of images) {
                try {
                    await deleteObject(ref(storage, image.path))
                } catch {
                    // bypass
                }
            }
        }

        await deleteDoc(doc(db, 'Projects', id))
    } catch (e: any) {
        throw e
    }
}
