export type PublicationType = "International Journal" | "International Conference" | "Domestic Journal" | "Domestic Conference" | "Patent" | "Book"

export type Publication = {
    id: string;
    title: string;
    journal: string;
    authors: string[];
    publicationYear: number;
    publicationMonth: number;
    type: PublicationType;
    link: string;
    projectId?: string;
}

export type PublicationRequest = Omit<Publication, "id">
