import type { TechStackGroup } from '#/types/techstack'

export type ExperienceType = 'Work' | 'Project' | 'Activity' | 'Open Source';

export type TechStackItem = {
    name: string;
    iconUrl?: string;
    group?: TechStackGroup;
};

export type Experience = {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date | null;
    isCurrentlyWorking: boolean;
    description: string;
    role: string;
    techStack: TechStackItem[];
    company: string;
    type: ExperienceType;
    logoUrl?: string;
}

export type ExperienceRequest = Omit<Experience, 'id'>;
