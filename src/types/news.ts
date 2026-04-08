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

export const CATEGORY_VARIANT: Record<
  NewsCategory,
  'default' | 'secondary' | 'outline'
> = {
  Award: 'default',
  Research: 'secondary',
  Publication: 'secondary',
  Activity: 'outline',
  Press: 'outline',
  Other: 'outline',
}

export type NewsRequest = Omit<News, 'id'>
