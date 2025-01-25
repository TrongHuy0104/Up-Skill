import mongoose, { Document } from 'mongoose';
import { UserT } from './User';

export interface IComment extends Document {
    user: UserT;
    question: string;
    questionReplies: IComment[];
}

export interface IReview extends Document {
    user: UserT;
    rating: number;
    comment: string;
    commentReplies: IComment[];
}

export interface ILink extends Document {
    title: string;
    url: string;
}

export interface ICourseData extends Document {
    title: string;
    description: string;
    videoUrl: string;
    videoLength: number;
    videoPlayer: string;
    links: ILink[];
    suggestion: string;
    questions: IComment[];
}

export interface ICourse extends Document {
    name: string;
    description?: string;
    price: number;
    estimatedPrice?: number;
    thumbnail: object;
    authorId: mongoose.Schema.Types.ObjectId;
    tags: string;
    level: string;
    demoUrl: string;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    reviews: IReview[];
    courseData: ICourseData[];
    rating?: number;
    purchased?: number;
}
