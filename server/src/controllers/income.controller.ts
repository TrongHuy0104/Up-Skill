import { catchAsync } from '@/utils/catchAsync';
import { NextFunction, Request, Response } from 'express';
import IncomeModel from '@/models/Income.model';
import ErrorHandler from '@/utils/ErrorHandler';
import mongoose from 'mongoose';

export const getUserIncome = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new ErrorHandler('Invalid user ID!', 400));
    }

    let income = await IncomeModel.findOne({ userId });

    if (!income) {
        income = new IncomeModel({
            userId,
            totalIncome: 0,
            totalPurchased: 0,
            total: []
        });
    } else {
        const newTotalIncome = income.total.reduce((sum: any, entry: { income: any; }) => sum + entry.income, 0);
        const newTotalPurchased = income.total.reduce((sum: any, entry: { purchased: any; }) => sum + entry.purchased, 0);

        if (income.totalIncome !== newTotalIncome || income.totalPurchased !== newTotalPurchased) {
            income.totalIncome = newTotalIncome;
            income.totalPurchased = newTotalPurchased;
            await income.save();
        }
    }

    res.status(200).json({
        success: true,
        income
    });
});


