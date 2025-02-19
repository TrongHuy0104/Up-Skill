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
    console.log(user);

    res.status(200).json({
        success: true,
        user
    });
};

// export const updateUserRoleService = async (res: Response, id: string, role: string) => {
//     try {
//         if (!id || !role) {
//             return res.status(400).json({ success: false, message: 'Missing user ID or role' });
//         }

//         const user = await UserModel.findByIdAndUpdate(id, { role }, { new: true });

//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         console.log('Updated user:', user);
//         console.log('ID:', id, 'Role:', role);

//         return res.status(200).json({
//             success: true,
//             user
//         });
//     } catch (error) {
//         console.error('Lỗi khi cập nhật role:', error);
//         return res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// };
