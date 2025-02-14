import { RedisKey } from 'ioredis';
import cloudinary from 'cloudinary';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import ejs from 'ejs';
import dotenv from 'dotenv';
import UserModel from '@/models/User.model';
import { catchAsync } from '@/utils/catchAsync';
import ErrorHandler from '@/utils/ErrorHandler';
import { NextFunction, Request, Response } from 'express';
import path from 'path';
import sendMail from '@/utils/sendMail';
import { UserT } from '@/interfaces/User';
import { accessTokenOptions, refreshTokenOptions, sendToken } from '@/utils/jwt';
import { redis } from '@/utils/redis';
import { getAllUsersService, getUserById, updateUserRoleService } from '@/services/user.service';

dotenv.config();

interface IRegistrationBody {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

interface IActivationToken {
    token: string;
    activationCode: string;
}

interface IActivationRequest {
    activation_token: string;
    activation_code: string;
}

interface ILoginRequest {
    email: string;
    password: string;
}

interface ISocialAuthBody {
    email: string;
    name: string;
    avatar: string;
}

interface IUpdateUserInfo {
    name?: string;
    avatar: string;
}

interface IUpdatePassword {
    oldPassword: string;
    newPassword: string;
}

interface IProfilePicture {
    avatar: string;
}

export const registrationUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    const isEmailExist = await UserModel.findOne({ email });
    if (isEmailExist) return next(new ErrorHandler('Email already exist', 400));

    const user: IRegistrationBody = {
        name,
        email,
        password
    };

    const activationToken = createActivationToken(user);

    const activationCode = activationToken.activationCode;

    const data = { user: { name: user.name }, activationCode };
    await ejs.renderFile(path.join(__dirname, '../mails/activation-mail.ejs'), data);

    try {
        await sendMail({
            email: user.email,
            subject: 'Activate your account',
            template: 'activation-mail.ejs',
            data
        });

        res.status(201).json({
            success: true,
            message: `Please check your email: ${user.email} to activate your account!`,
            activationToken: activationToken.token
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign({ user, activationCode }, process.env.ACTIVATION_SECRET as Secret, { expiresIn: '5m' });

    return { token, activationCode };
};

export const activateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { activation_token, activation_code } = req.body as IActivationRequest;

    const newUser: { user: UserT; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
    ) as { user: UserT; activationCode: string };

    if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler('Invalid activation code', 400));
    }

    const { name, email, password } = newUser.user;

    const isEmailExist = await UserModel.findOne({ email });
    if (isEmailExist) return next(new ErrorHandler('Email already exist', 400));

    await UserModel.create({
        name,
        email,
        password
    });

    res.status(201).json({
        success: true
    });
});

export const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as ILoginRequest;

    if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400));
    }

    const user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 400));
    }

    const isPasswordMath = await user.comparePassword(password);

    if (!isPasswordMath) {
        return next(new ErrorHandler('Invalid email or password', 400));
    }

    sendToken(user, 200, res);
});

export const logoutUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.cookie('access_token', '', { maxAge: 1 });
    res.cookie('refresh_token', '', { maxAge: 1 });

    const userId = req.user?._id || '';
    if (userId) {
        redis.del(userId as RedisKey);
    }

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});

export const updateAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refresh_token = req.cookies.refresh_token as string;
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN as string) as JwtPayload;

    const message = 'Could not refresh token';

    if (!decoded) {
        return next(new ErrorHandler(message, 400));
    }

    const session = await redis.get(decoded.id as string);

    if (!session) {
        return next(new ErrorHandler(message, 400));
    }

    const user = JSON.parse(session);

    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN as string, {
        expiresIn: '5m'
    });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN as string, {
        expiresIn: '3d'
    });

    req.user = user;

    res.cookie('access_token', accessToken, accessTokenOptions);
    res.cookie('refresh_token', refreshToken, refreshTokenOptions);

    res.status(200).json({
        success: true,
        accessToken
    });
});

export const getUserInfo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user._id) {
        return next(new ErrorHandler('User not authenticated', 500));
    }
    const userId = req.user._id;
    getUserById(userId, res);
});

export const socialAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, avatar } = req.body as ISocialAuthBody;
    const user = await UserModel.findOne({ email });
    if (!user) {
        const newUser = await UserModel.create({ email, name, avatar });
        sendToken(newUser, 200, res);
    } else {
        sendToken(user, 200, res);
    }
});

export const updateUserInfo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name, avatar } = req.body as IUpdateUserInfo;
    const userId = req.user?._id as RedisKey;
    const user = await UserModel.findById(userId);

    // if (user && email) {
    //     const isEmailExist = await UserModel.findOne({email});
    //     if (isEmailExist) {
    //         return next(new ErrorHandler("Email already exists", 400))
    //     }
    //     user.email = email
    // }

    if (user && name) {
        user.name = name;
    }

    if (user && avatar) {
        // If user already have avatar
        if (user?.avatar?.public_id) {
            await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
        }

        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: 'avatars',
            width: 150
        });
        user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        };
    }

    await user?.save();

    await redis.set(userId, JSON.stringify(user));

    res.status(200).json({
        success: true,
        user
    });
});

export const updatePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body as IUpdatePassword;

    if (!oldPassword || !newPassword) {
        return next(new ErrorHandler('Please enter old password and new password', 400));
    }

    const user = await UserModel.findById(req.user?._id).select('+password');

    if (user?.password === undefined) {
        return next(new ErrorHandler('Invalid user', 400));
    }

    const isPasswordMatch = await user?.comparePassword(oldPassword);

    if (!isPasswordMatch) {
        return next(new ErrorHandler('Invalid old password', 400));
    }

    user.password = newPassword;
    await user.save();

    redis.set(req.user?._id as RedisKey, JSON.stringify(user));

    res.status(200).json({
        success: true,
        user
    });
});

export const updateProfilePicture = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { avatar } = req.body as IProfilePicture;

    const userId = req.user?._id;

    const user = await UserModel.findById(userId);

    if (user && avatar) {
        // If user already have avatar
        if (user?.avatar?.public_id) {
            await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
        }

        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: 'avatars',
            width: 150
        });
        user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        };
    }

    await user?.save();

    await redis.set(userId as RedisKey, JSON.stringify(user));

    res.status(200).json({
        success: true,
        user
    });
});

// get all users -- for admin
export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    getAllUsersService(res);
});

// update user role -- for admin
export const updateUserRole = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id, role } = req.body;
    updateUserRoleService(res, id, role);
});

// delete user -- for admin
export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = await UserModel.findById(id);

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    await user.deleteOne({ id });

    await redis.del(id);

    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });
});
