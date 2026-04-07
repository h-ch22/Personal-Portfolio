import type { GalleryImage } from './gallery'

export type NewsCategory =
  | 'Award'
  | 'Research'
  | 'Publication'
  | 'Activity'
  | 'Press'
  | 'Other'

export type News = {
  id: string
  title: string
  date: Date
  category: NewsCategory
  description: string
  images: GalleryImage[]
  link?: string
}

export type NewsRequest = Omit<News, 'id'>
