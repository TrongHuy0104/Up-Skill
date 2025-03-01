import { User as AuthUser } from '@auth/core/types';

export interface User extends AuthUser {
    _id: string;
    email: string;
    name: string;
    role: string;
    avatar: {
        public_id: string;
        url: string;
    };
    phoneNumber: string;
    rating: number;
    address: string;
    age: number;
    profession: string;
    introduce: string;
    socialLinks: {
        twitter: string;
        facebook: string;
        instagram: string;
        linkedIn: string;
    };
    uploadedCourses: { id: string }[];
}
