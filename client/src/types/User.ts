import { User as AuthUser } from '@auth/core/types';

export interface User extends AuthUser {
    email: string;
    name: string;
    role: string;
    avatar: {
        public_id: string;
        url: string;
    };
}
