export interface Course {
    name: string;
    subTitle: string;
    description?: string;
    price?: number;
    estimatedPrice?: number;
    thumbnail?: string;
    authorId: string;
    tags?: string;
    demoUrl?: string;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    rating?: number;
    purchased?: number;
    isPublished: boolean;
    level?: string;
    category: string;
    subCategory: string;
}
