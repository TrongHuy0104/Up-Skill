import UserModel from '@/models/User.model';
import { redis } from '@/utils/redis';
import { Response } from 'express';

export const getUserById = async (id: string, res: Response) => {
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

export const getAllInstructorsService = async (res: Response) => {
    const instructors = await UserModel.find({ role: 'instructor' }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        instructors
    });
};

import { Request } from 'express';
import moment from 'moment';

export const getInstructorsWithSortService = async (req: Request, res: Response) => {
    try {
        const filterType = req.query.filterType as string;

        if (!filterType) {
            return res.status(400).json({ message: 'Filter type is required' });
        }

        const query: any = {};
        let sort: any = {};

        switch (filterType) {
            case '3days':
                query.createdAt = { $gte: moment().subtract(3, 'days').toDate() };
                break;
            case 'bestselling':
                sort = { students: -1 }; // Sắp xếp giảm dần theo số lượng học viên
                break;
            case 'oldest':
                sort = { createdAt: 1 }; // Sắp xếp tăng dần theo ngày tạo
                break;
            default:
                return res.status(400).json({ message: 'Invalid filter type' });
        }

        const instructors = await UserModel.find({ role: 'instructor', ...query }).sort(sort);

        res.status(200).json({
            success: true,
            instructors
        });
    } catch (error) {
        console.error('Error in getInstructorsWithSortService:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
