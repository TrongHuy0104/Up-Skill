// controllers/income.controller.ts
import { catchAsync } from '@/utils/catchAsync';
import { NextFunction, Request, Response } from 'express';
import IncomeModel from '@/models/Income.model';
import ErrorHandler from '@/utils/ErrorHandler';
import mongoose from 'mongoose';

export const getUserIncome = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new ErrorHandler('Invalid user ID', 400));
    }

    const income = await IncomeModel.findOne({ userId });

    if (!income) {
        return next(new ErrorHandler('Income data not found for this user', 404));
    }

    res.status(200).json({
        success: true,
        income
    });
});
