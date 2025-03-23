import { UserT } from '../interfaces/User';
import { Response } from 'express';
import { redis } from '../utils/redis';

interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: 'lax' | 'strict' | 'none' | boolean;
    secure?: boolean;
    path?: string;
    domain?: string;
}

// Parse environment variables with fallback values
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '300', 10);
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1200', 10);

// Options for cookies
export const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined,
    path: '/'
    // domain: '.vercel.app'
    // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    // secure: process.env.NODE_ENV === 'production',
};

export const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined,
    path: '/'
    // domain: '.upskill-git-dev-huys-projects-090228c7.vercel.app'
};

export const sendToken = (user: UserT, statusCode: number, res: Response) => {
    const accessToken = user.signAccessToken();
    const refreshToken = user.signRefreshToken();

    // Upload session to Redis
    if (!user._id) {
        throw new Error('User ID is missing');
    }

    redis.set(user._id.toString(), JSON.stringify(user));

    // Set cookies
    res.cookie('access_token', accessToken, accessTokenOptions);
    res.cookie('refresh_token', refreshToken, refreshTokenOptions);

    res.status(statusCode).json({
        success: true,
        user,
        accessToken
    });
};
