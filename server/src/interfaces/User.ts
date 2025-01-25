import mongoose, { Document } from 'mongoose';

export interface UserT extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    avatar: {
        public_id: string;
        url: string;
    };
    purchasedCourses: mongoose.Schema.Types.ObjectId[];
    uploadedCourses: mongoose.Schema.Types.ObjectId[];
    isVerified: boolean;
    confirmPassword: (password: string) => Promise<boolean>;
    signAccessToken: () => string;
    signRefreshToken: () => string;
}
