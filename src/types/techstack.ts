export type TechStackCategory = 'Language' | 'Framework' | 'Tool' | 'Platform' | 'Database' | 'Other'

export type TechStack = {
    id: string
    name: string
    icon: string
    category: TechStackCategory
}

export type TechStackRequest = Omit<TechStack, 'id'>
