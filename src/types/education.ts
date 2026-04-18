export type EducationType = "DEGREE" | "BOOTCAMP" | "CERTIFICATE" | "COURSE"

export type Education = {
    id: string;
    title: string;
    description: string;
    organization: string;
    startYear: number;
    startMonth: number;
    endYear: number;
    endMonth: number;
    inProgress: boolean;
    type: EducationType;
    logoUrl?: string;
}

export type EducationRequest = Omit<Education, "id">
