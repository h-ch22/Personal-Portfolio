export type AwardType = 'Competition' | 'Academic' | 'Scholarship' | 'Recognition' | 'Other';

export type Award = {
    id: string;
    title: string;
    issuer: string;
    date: Date;
    type: AwardType;
    description?: string;
};

export type AwardRequest = Omit<Award, 'id'>;
