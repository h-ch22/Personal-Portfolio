import type { News, NewsRequest } from '#/types/news'
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

export const fetchNews = async (): Promise<News[]> => {
  if (!db) {
    throw new Error('Cannot fetch news data: database is not initialized.')
  }

  try {
    const newsRef = collection(db, 'News')
    const snapshot = await getDocs(newsRef)

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate() ?? new Date(),
      } as News
    })
  } catch (e: any) {
    throw e
  }
}

export const uploadNewsImages = async (
  newsId: string,
  files: File[],
): Promise<GalleryImage[]> => {
  if (!storage) {
    throw new Error('Cannot upload images: storage is not initialized.')
  }

  const uploadedImages: GalleryImage[] = []

  for (const file of files) {
    const path = `news/${newsId}/${Date.now()}-${file.name}`
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)
    uploadedImages.push({ url, path })
  }

  return uploadedImages
}

export const createNews = async (
  data: Omit<NewsRequest, 'images'>,
  imageFiles: File[],
): Promise<News> => {
  if (!db) {
    throw new Error('Cannot create news: database is not initialized.')
  }

  try {
    const newsRef = collection(db, 'News')
    const sanitized = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    )
    const docRef = await addDoc(newsRef, { ...sanitized, images: [] as string[] })

    const images = await uploadNewsImages(docRef.id, imageFiles)

    await updateDoc(docRef, { images })

    return { id: docRef.id, ...data, images }
  } catch (e: any) {
    throw e
  }
}

export const modifyNews = async (
  data: Omit<NewsRequest, 'images'>,
  id: string,
  existingImages: GalleryImage[],
  newImageFiles: File[],
  deletedImagePaths: string[],
): Promise<News> => {
  if (!db || !storage) {
    throw new Error('Cannot modify news: services not initialized.')
  }

  try {
    for (const path of deletedImagePaths) {
      try {
        const storageRef = ref(storage, path)
        await deleteObject(storageRef)
      } catch {
        // bypass
      }
    }

    const newImages = await uploadNewsImages(id, newImageFiles)

    const keptImages = existingImages.filter(
      (img) => !deletedImagePaths.includes(img.path),
    )
    const images = [...keptImages, ...newImages]

    const sanitized = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    )
    const newsDoc = doc(db, 'News', id)
    await setDoc(newsDoc, { ...sanitized, images })

    return { id, ...data, images }
  } catch (e: any) {
    throw e
  }
}

export const deleteNews = async (
  id: string,
  images: GalleryImage[],
): Promise<void> => {
  if (!db) {
    throw new Error('Cannot delete news: database is not initialized.')
  }

  try {
    if (storage) {
      for (const image of images) {
        try {
          const storageRef = ref(storage, image.path)
          await deleteObject(storageRef)
        } catch {
          // bypass
        }
      }
    }

    const newsDoc = doc(db, 'News', id)
    await deleteDoc(newsDoc)
  } catch (e: any) {
    throw e
  }
}
