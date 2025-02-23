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
}
