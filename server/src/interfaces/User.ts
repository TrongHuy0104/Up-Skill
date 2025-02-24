import mongoose, { Document } from 'mongoose';

export interface UserT extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    introduce?: string;
    position: string;
    age: number;
    avatar: {
        public_id: string;
        url: string;
    };
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
    };
    address: string;
    phoneNumber: string;

    purchasedCourses: mongoose.Schema.Types.ObjectId[];
    uploadedCourses: mongoose.Schema.Types.ObjectId[];
    isVerified: boolean;
    confirmPassword: (password: string) => Promise<boolean>;
    signAccessToken: () => string;
    signRefreshToken: () => string;
}
