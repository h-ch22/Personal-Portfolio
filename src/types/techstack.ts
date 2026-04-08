export type TechStackCategory = 'Language' | 'Framework' | 'Tool' | 'Platform' | 'Database' | 'Other'

export type TechStackIconType = 'emoji' | 'image'

export type TechStack = {
    id: string
    name: string
    iconType: TechStackIconType
    icon: string
    iconPath?: string
    category: TechStackCategory
}

export const TECH_CATEGORIES: TechStackCategory[] = [
  'Language',
  'Framework',
  'Tool',
  'Platform',
  'Database',
  'Other',
]

export type TechStackRequest = Omit<TechStack, 'id'>
