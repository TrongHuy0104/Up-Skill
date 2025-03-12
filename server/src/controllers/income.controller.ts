import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import IncomeModel from '@/models/Income.model';
import OrderModel from '@/models/Order.model';
import ErrorHandler from '@/utils/ErrorHandler';
import { catchAsync } from '@/utils/catchAsync';

export const getUserIncome = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new ErrorHandler('Invalid user ID', 400));
    }

    // Lấy danh sách đơn hàng có chứa khóa học của người dùng này
    const orders = await OrderModel.find({}).populate({
        path: 'courseIds',
        select: 'authorId price purchased createdAt'
    });

    // Mảng chứa tổng thu nhập của từng tháng
    const monthlyIncome = Array(12).fill(0);
    const monthlyPurchased = Array(12).fill(0);
    let totalIncome = 0;
    let totalPurchased = 0;

    // Lặp qua từng đơn hàng để kiểm tra khóa học nào thuộc về userId
    orders.forEach((order) => {
        order.courseIds.forEach((course: any) => {
            if (course.authorId.toString() === userId) {
                const month = new Date(order.createdAt).getMonth(); // Lấy tháng của đơn hàng
                const income = course.price * course.purchased; // Tính doanh thu của course
                const incomeAfterCommission = income * 0.9; // Trừ 10% phí hoa hồng

                monthlyIncome[month] += incomeAfterCommission;
                monthlyPurchased[month] += course.purchased;

                totalIncome += incomeAfterCommission;
                totalPurchased += course.purchased;
            }
        });
    });

    // Cập nhật vào bảng thu nhập
    const incomeData = await IncomeModel.findOneAndUpdate(
        { userId },
        {
            totalIncome,
            totalPurchased,
            total: monthlyIncome
        },
        { new: true, upsert: true }
    );

    res.status(200).json({
        success: true,
        incomeData
    });
});
