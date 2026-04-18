import type { GalleryImage } from './gallery'
import type { TechStackItem } from './experience'

export type ProjectMember = {
    name: string
    role: string
}

export type Project = {
    id: string
    title: string
    description: string
    techStack: TechStackItem[]
    members: ProjectMember[]
    images: GalleryImage[]
    link?: string
    githubUrl?: string
    logoUrl?: string
    startDate: Date
    endDate: Date | null
    isOngoing: boolean
}

export type ProjectRequest = Omit<Project, 'id'>
