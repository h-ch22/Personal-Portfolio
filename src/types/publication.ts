export type PublicationType = "International Journal" | "International Conference" | "Domestic Journal" | "Domestic Conference" | "Patient" | "Book"

export type Publication = {
    id: string;
    title: string;
    journal: string;
    authors: string[];
    publicationYear: number;
    publicationMonth: number;
    type: PublicationType;
    link: string;
}

export type PublicationRequest = Omit<Publication, "id">
