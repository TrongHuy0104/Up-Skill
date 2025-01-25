import { User as AuthUser } from '@auth/core/types';

export interface User extends AuthUser {
    phone?: string;
}
