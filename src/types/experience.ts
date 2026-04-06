export type ExperienceType = 'Work' | 'Project' | 'Activity' | 'Open Source';

export type TechStackItem = {
    name: string;
    iconUrl?: string;
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
}

export type ExperienceRequest = Omit<Experience, 'id'>;
