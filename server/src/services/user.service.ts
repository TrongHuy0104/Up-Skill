import UserModel from '@/models/User.model';
import { redis } from '@/utils/redis';
import { Response } from 'express';

export const getUserById = async (id: string, res: Response) => {
    // const user = await UserModel.findById(id);
    const userJSON = await redis.get(id);

    if (userJSON) {
        const user = JSON.parse(userJSON);
        res.status(200).json({
            success: true,
            user
        });
    }
};

export const getAllUsersService = async (res: Response) => {
    const users = await UserModel.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        users
    });
};

export const updateUserRoleService = async (res: Response, id: string, role: string) => {
    const user = await UserModel.findByIdAndUpdate(id, { role }, { new: true });

    res.status(200).json({
        success: true,
        user
    });
};

export const getUserUploadedCoursesCount = async (userId: string) => {
    console.log('Fetching user with ID:', userId); // Log ID người dùng đang được tìm kiếm

    const user = await UserModel.findById(userId);

    if (!user) {
        console.log('User not found'); // Log khi không tìm thấy người dùng
        throw new Error('User not found');
    }

    // Đảm bảo uploadedCourses là một mảng và không phải là undefined
    const uploadedCourses = Array.isArray(user.uploadedCourses) ? user.uploadedCourses : [];
    console.log('Uploaded courses:', uploadedCourses); // Log mảng khóa học đã tải lên

    return uploadedCourses.length;
};
