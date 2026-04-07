export type GalleryImage = {
    url: string;
    path: string;
};

export type Gallery = {
    id: string;
    title: string;
    description?: string;
    date: Date;
    images: GalleryImage[];
};

export type GalleryRequest = Omit<Gallery, 'id'>;
