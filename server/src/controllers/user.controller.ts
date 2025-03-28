import { RedisKey } from 'ioredis';
import cloudinary from 'cloudinary';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import ejs from 'ejs';
import dotenv from 'dotenv';

import UserModel from '../models/User.model';
import { catchAsync } from '../utils/catchAsync';
import ErrorHandler from '../utils/ErrorHandler';
import { NextFunction, Request, Response } from 'express';
import IncomeModel from '../models/Income.model';
import path from 'path';
import sendMail from '../utils/sendMail';
import { UserT } from '../interfaces/User';
import { accessTokenOptions, refreshTokenOptions, sendToken } from '../utils/jwt';
import { redis } from '../utils/redis';
import {
    getUserById,
    getAllUsersService,
    updateUserRoleService,
    getAllInstructorsService
} from '../services/user.service';
import CourseModel from '../models/Course.model';

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

interface IResetCode {
    reset_token: string;
    reset_code: string;
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
    email: string;
    age: number;
    profession: string;
    introduce: string;
    address: string;
    phoneNumber: string;
    rating: number;
    student: number;
}

interface IUpdatePassword {
    oldPassword: string;
    newPassword: string;
}

interface IProfilePicture {
    avatar: string;
}

export const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    if (!userId) {
        return next(new ErrorHandler('Please provide a user ID', 400));
    }

    const user = await UserModel.findById(userId).populate('uploadedCourses'); // Populate uploadedCourses

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }
    const uploadedCoursesCount = Array.isArray(user.uploadedCourses) ? user.uploadedCourses.length : 0;
    res.status(200).json({
        success: true,
        data: {
            user,
            uploadedCoursesCount
        }
    });
});

export const updateUserSocialLinks = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { data } = req.body; // Đảm bảo rằng bạn nhận được đúng đối tượng `socialLinks`
    const userId = req.user?._id as RedisKey;
    const user = await UserModel.findById(userId);

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    // Cập nhật các liên kết mạng xã hội
    if (data.facebook) user.socialLinks.facebook = data.facebook;
    if (data.twitter) user.socialLinks.twitter = data.twitter;
    if (data.linkedin) user.socialLinks.linkedin = data.linkedin;
    if (data.instagram) user.socialLinks.instagram = data.instagram;

    // Lưu thông tin vào database
    await user.save();

    // Lưu lại dữ liệu vào Redis
    await redis.del(userId);

    await redis.set(userId, JSON.stringify(user));

    // Trả về kết quả thành công
    res.status(200).json({
        success: true,
        user
    });
});

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
    res.cookie('access_token', '', {
        domain: '.vercel.app',
        secure: true,
        sameSite: 'none',
        httpOnly: true,
        maxAge: 1
    });
    res.cookie('refresh_token', '', {
        domain: '.vercel.app',
        secure: true,
        sameSite: 'none',
        httpOnly: true,
        maxAge: 1
    });

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
        expiresIn: '1m'
    });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN as string, {
        expiresIn: '3d'
    });

    req.user = user;
    req.access_token = accessToken;

    res.cookie('access_token', accessToken, accessTokenOptions);
    res.cookie('refresh_token', refreshToken, refreshTokenOptions);

    next();
});

export const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
        expiresIn: '1m'
    });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN as string, {
        expiresIn: '3d'
    });

    req.user = user;
    req.access_token = accessToken;

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
    const { name, avatar, email, introduce, profession, age, phoneNumber, address } = req.body as IUpdateUserInfo;
    const userId = req.user?._id as RedisKey;
    const user = await UserModel.findById(userId);

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    // Kiểm tra và cập nhật email (nếu email mới không trùng)
    if (email && email !== user.email) {
        const isEmailExist = await UserModel.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler('Email already exists', 400));
        }
        user.email = email;
    }

    // Cập nhật các trường khác
    if (name) user.name = name;
    if (introduce) user.introduce = introduce;
    if (profession) user.profession = profession;
    if (age) user.age = age;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;

    // Cập nhật avatar nếu có
    if (avatar) {
        if (user.avatar?.public_id) {
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);
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

    await user.save();
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
    const { user, role } = req.body;

    updateUserRoleService(res, user._id, role);
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

export const forgotPasswordUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return next(new ErrorHandler('User not found', 404));

    const resetToken = createActivationToken(user);

    const resetCode = resetToken.activationCode;

    const data = { user: { name: user.name }, resetCode };
    await ejs.renderFile(path.join(__dirname, '../mails/reset-password-mail.ejs'), data);

    try {
        await sendMail({
            email: user.email,
            subject: 'Reset your password',
            template: 'reset-password-mail.ejs',
            data
        });

        res.status(200).json({
            success: true,
            message: `Please check your email: ${user.email} to reset your password!`,
            resetToken: resetToken.token
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const resetCodeVerify = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { reset_token, reset_code } = req.body as IResetCode;

    const decoded: { user: UserT; activationCode: string } = jwt.verify(
        reset_token,
        process.env.ACTIVATION_SECRET as string
    ) as { user: UserT; activationCode: string };

    if (decoded.activationCode !== reset_code) {
        return next(new ErrorHandler('Invalid reset code', 400));
    }

    res.status(201).json({
        success: true
    });
});

export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { reset_token, newPassword } = req.body;

    if (!reset_token || !newPassword) {
        return next(new ErrorHandler('Missing reset token or new password', 400));
    }

    let decoded;
    try {
        decoded = jwt.verify(reset_token, process.env.ACTIVATION_SECRET as string) as { user: { email: string } };
    } catch (error) {
        return next(new ErrorHandler('Invalid or expired reset token', 400));
    }

    const user = await UserModel.findOne({ email: decoded?.user?.email });
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password has been reset successfully'
    });
});

export const getTopInstructors = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const topInstructors = await UserModel.aggregate([
        { $match: { role: 'instructor' } },
        {
            $lookup: {
                from: 'courses',
                localField: 'uploadedCourses',
                foreignField: '_id',
                as: 'uploadedCoursesData'
            }
        },
        {
            $addFields: {
                totalStudents: {
                    $sum: {
                        $map: {
                            input: '$uploadedCoursesData',
                            as: 'course',
                            in: { $ifNull: ['$$course.purchased', 0] }
                        }
                    }
                },
                averageRating: {
                    $avg: {
                        $map: {
                            input: '$uploadedCoursesData',
                            as: 'course',
                            in: { $ifNull: ['$$course.rating', 0] }
                        }
                    }
                },
                uploadedCoursesCount: { $size: '$uploadedCoursesData' }
            }
        },
        { $sort: { totalStudents: -1, averageRating: -1 } },
        { $limit: 10 },
        {
            $project: {
                _id: 1,
                name: 1,
                email: 1,
                role: 1,
                avatar: 1,
                uploadedCourses: 1,
                totalStudents: 1,
                averageRating: 1,
                uploadedCoursesCount: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ]);

    if (!topInstructors || topInstructors.length === 0) {
        return next(new ErrorHandler('No instructors found', 404));
    }

    res.status(200).json({
        success: true,
        topInstructors
    });
});
export const getAllInstructors = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    getAllInstructorsService(res);
});

export const getInstructorsWithSort = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.query;

    if (!type || (type !== 'recent' && type !== 'oldest')) {
        return next(new ErrorHandler('Invalid type parameter. Use "recent" or "oldest".', 400));
    }

    let users;

    if (type === 'recent') {
        const threeDaysAgo = new Date();
        threeDaysAgo.setUTCDate(threeDaysAgo.getUTCDate() - 3);

        users = await UserModel.find({ createdAt: { $gte: threeDaysAgo }, role: 'instructor' })
            .sort({ createdAt: -1 })
            .limit(3);
    } else {
        users = await UserModel.find({ role: 'instructor' }).sort({ createdAt: 1 }).limit(10);
    }

    res.status(200).json({
        success: true,
        instructors: users
    });
});

//get data for analysis
export const getUserStatisticsByMonth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Lấy tháng hiện tại (1-12)

    // Đếm tổng số Student, Instructor, User, Course
    const totalStudent = await UserModel.countDocuments({ role: 'user' });
    const totalInstructor = await UserModel.countDocuments({ role: 'instructor' });
    const totalUser = totalStudent + totalInstructor;
    const totalCourse = await CourseModel.countDocuments({ isPublished: true });

    // Hàm lấy số lượng theo tháng
    const getCountByMonth = async (filter: object) => {
        const result = await UserModel.aggregate([
            {
                $match: {
                    ...filter,
                    createdAt: { $gte: new Date(`${currentYear}-01-01`), $lt: new Date(`${currentYear + 1}-01-01`) }
                }
            },
            { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } }
        ]);
        return result.reduce(
            (acc, item) => {
                acc[item._id] = item.count;
                return acc;
            },
            {} as Record<number, number>
        );
    };

    // Lấy dữ liệu từng nhóm người dùng
    const studentsByMonth = await getCountByMonth({ role: 'user' });
    const instructorsByMonth = await getCountByMonth({ role: 'instructor' });

    // Tổng user theo tháng = Student + Instructor
    const usersByMonth: Record<number, number> = {};
    for (let i = 1; i <= 12; i++) {
        usersByMonth[i] = (studentsByMonth[i] || 0) + (instructorsByMonth[i] || 0);
    }

    // Lấy số lượng courses theo tháng
    const coursesByMonth = await CourseModel.aggregate([
        {
            $match: {
                isPublished: true,
                createdAt: { $gte: new Date(`${currentYear}-01-01`), $lt: new Date(`${currentYear + 1}-01-01`) }
            }
        },
        { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } }
    ]).then((data) =>
        data.reduce(
            (acc, item) => {
                acc[item._id] = item.count;
                return acc;
            },
            {} as Record<number, number>
        )
    );

    // Danh sách tháng chuẩn
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Lấy số lượng mới nhất trong tháng hiện tại
    const usersThisMonth = usersByMonth[currentMonth] || 0;
    const studentsThisMonth = studentsByMonth[currentMonth] || 0;
    const instructorsThisMonth = instructorsByMonth[currentMonth] || 0;
    const coursesThisMonth = coursesByMonth[currentMonth] || 0;

    // Tính phần trăm tăng trưởng
    const calcGrowthRate = (newValue: number, total: number) =>
        total > 0 && newValue > 0 ? `${((newValue / total) * 100).toFixed(2)}%` : '0%';

    const growthRates = {
        userGrowthRate: calcGrowthRate(usersThisMonth, totalUser),
        studentGrowthRate: calcGrowthRate(studentsThisMonth, totalStudent),
        instructorGrowthRate: calcGrowthRate(instructorsThisMonth, totalInstructor),
        courseGrowthRate: calcGrowthRate(coursesThisMonth, totalCourse)
    };

    // Chuẩn bị dữ liệu phản hồi
    const data = months.map((month, index) => ({
        date: month,
        students: studentsByMonth[index + 1] || 0,
        instructors: instructorsByMonth[index + 1] || 0
    }));

    res.status(200).json({
        success: true,
        totalStudent,
        totalUser,
        totalInstructor,
        totalCourse,
        growthRates,
        data
    });
});

//get data for revenueChart analysis
export const getRevenueStatistics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Lấy tất cả các bản ghi thu nhập từ IncomeModel
    const incomes = await IncomeModel.find().select('amount createdAt');

    // Hàm nhóm dữ liệu theo tháng
    const groupByMonth = (data: any[]) => {
        return data.reduce(
            (acc, income) => {
                const month = new Date(income.createdAt).toLocaleString('en-US', { month: 'short' });

                // Tính toán thu nhập
                const adminShare = (income.amount * 10) / 100; // Admin nhận 10%
                const platformIncome = (income.amount * 90) / 100; // Nền tảng nhận 90%

                // Cộng dồn vào tháng tương ứng
                if (!acc[month]) {
                    acc[month] = { adminShare: 0, platformIncome: 0 };
                }
                acc[month].adminShare += adminShare;
                acc[month].platformIncome += platformIncome;

                return acc;
            },
            {} as Record<string, { adminShare: number; platformIncome: number }>
        );
    };

    const revenueByMonth = groupByMonth(incomes);

    // Danh sách các tháng theo thứ tự
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Chuẩn bị dữ liệu đầu ra
    const data = months.map((month) => ({
        month,
        adminShare: revenueByMonth[month]?.adminShare || 0,
        platformIncome: revenueByMonth[month]?.platformIncome || 0
    }));

    res.status(200).json({
        success: true,
        data
    });
});

// export const updateInstructorInfo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const { introduce, phoneNumber, address, age, profession } = req.body as {
//         introduce: string;
//         phoneNumber: string;
//         address: string;
//         age: number;
//         profession: string;
//     };

//     if (!introduce || !phoneNumber || !address || !age || !profession) {
//         return next(new ErrorHandler('All fields are required', 400));
//     }

//     const user = await UserModel.findById(req.user?._id);

//     if (!user) {
//         return next(new ErrorHandler('User not found', 404));
//     }

//     user.introduce = introduce;
//     user.phoneNumber = phoneNumber;
//     user.address = address;
//     user.age = age;
//     user.profession = profession;
//     user.role = 'instructor';

//     await user.save();

//     redis.set(req.user?._id as RedisKey, JSON.stringify(user));

//     res.status(200).json({
//         success: true,
//         message: 'User information updated successfully',
//         user
//     });
// });

export const updateInstructorInfo = catchAsync(async (req, res, next) => {
    const { introduce, phoneNumber, address, age, profession } = req.body;

    // Basic validation
    if (!introduce || !phoneNumber || !address || !age || !profession) {
        return next(new ErrorHandler('All fields are required', 400));
    }

    const user = await UserModel.findById(req.user?._id);
    if (!user) return next(new ErrorHandler('User not found', 404));

    // Create Stripe account only if becoming instructor
    if (user.role !== 'instructor') {
        try {
            const account = await stripe.accounts.create({
                type: 'express',
                email: user.email,
                capabilities: {
                    transfers: { requested: true }
                }
            });
            user.stripeAccountId = account.id;
        } catch (error) {
            console.log('Stripe account creation failed (will try later)');
            console.log(error);
            // Continue without failing - you can create the account later
        }
    }

    // Update user fields
    Object.assign(user, {
        role: 'instructor',
        introduce,
        phoneNumber,
        address,
        age,
        profession
    });

    await user.save();
    redis.set(user._id.toString(), JSON.stringify(user));

    res.status(200).json({
        success: true,
        message: 'Instructor profile updated'
    });
});
