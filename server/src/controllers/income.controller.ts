import mongoose from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

import { Request, Response, NextFunction } from 'express';
import IncomeModel, { IIncome } from '../models/Income.model';
import OrderModel from '../models/Order.model';
import ErrorHandler from '../utils/ErrorHandler';
import { catchAsync } from '../utils/catchAsync';
import UserModel from '../models/User.model';

export const getUserIncome = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new ErrorHandler('Invalid user ID', 400));
    }

    const orders = await OrderModel.find({}).populate({
        path: 'courseIds',
        select: 'authorId price purchased createdAt'
    });

    const monthlyIncome = Array(12).fill(0);
    const monthlyPurchased = Array(12).fill(0);
    let totalIncome = 0;
    let totalPurchased = 0;

    orders.forEach((order) => {
        order.courseIds.forEach((course: any) => {
            if (course.authorId.toString() === userId) {
                const month = new Date(order.createdAt).getMonth();
                const income = course.price * course.purchased;
                const incomeAfterCommission = income * 0.9;

                monthlyIncome[month] += incomeAfterCommission;
                monthlyPurchased[month] += course.purchased;

                totalIncome += incomeAfterCommission;
                totalPurchased += course.purchased;
            }
        });
    });

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

export const createWithdrawRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId, amount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new ErrorHandler('Invalid user ID', 400));
    }

    const income: any = await IncomeModel.findOne({ userId });

    if (!income) {
        return next(new ErrorHandler('Income is not exist', 400));
    }

    if (income.requests.find((request: any) => request.status === 0)) {
        return next(new ErrorHandler('You already have a pending withdraw request ', 400));
    }

    const newRequest = {
        amount
    };

    const requests = [newRequest, ...income.requests];
    income.requests = requests;

    await income.save();

    res.status(200).json({
        success: true,
        income
    });
});

export const getAllWithdrawRequestsByAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const pendingRequests = await mongoose.model<IIncome>('Income').aggregate([
        // Match incomes that are not admin and have at least one request with status 0
        {
            $match: {
                isAdmin: false,
                'requests.status': 0
            }
        },
        // Unwind the requests array to process each request individually
        {
            $unwind: '$requests'
        },
        // Match only requests with status 0
        {
            $match: {
                'requests.status': 0
            }
        },
        // Lookup to get user information
        {
            $lookup: {
                from: 'users', // assuming your user collection is named 'users'
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        // Unwind the user array (since lookup returns an array)
        {
            $unwind: '$user'
        },
        // Project only the fields you want to return
        {
            $project: {
                'user.password': 0, // exclude sensitive fields
                'user.__v': 0,
                'user.createdAt': 0,
                'user.updatedAt': 0,
                // add other fields you want to exclude
                __v: 0,
                totalIncome: 0,
                totalPurchased: 0,
                total: 0,
                totalWithdraw: 0,
                isAdmin: 0,
                createdAt: 0,
                updatedAt: 0
            }
        },
        // Optionally sort by request creation date
        {
            $sort: {
                'requests.createdAt': 1
            }
        }
    ]);

    res.status(200).json({
        success: true,
        data: pendingRequests
    });
});

export const rejectWithdrawRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { incomeId, requestId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(incomeId) || !mongoose.Types.ObjectId.isValid(requestId)) {
        return next(new ErrorHandler('Invalid ID', 400));
    }

    const income: any = await IncomeModel.findOne({ incomeId });

    if (!income) {
        return next(new ErrorHandler('Income is not exist', 400));
    }

    const request = income.requests.find((request: any) => new mongoose.Types.ObjectId(requestId).equals(request._id));

    if (!request) {
        return next(new ErrorHandler('Request is not exist', 400));
    }

    request.status = -1;

    const requests = [request, ...income.requests];
    income.requests = requests;

    await income.save();

    res.status(200).json({
        success: true,
        data: requests
    });
});
export const createTransaction = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { incomeId, requestId, amount, payment_info } = req.body;

    if (!mongoose.Types.ObjectId.isValid(incomeId) || !mongoose.Types.ObjectId.isValid(requestId)) {
        return next(new ErrorHandler('Invalid ID', 400));
    }

    const income: any = await IncomeModel.findOne({ incomeId });

    if (!income) {
        return next(new ErrorHandler('Income is not exist', 400));
    }

    const request = income.requests.find((request: any) => new mongoose.Types.ObjectId(requestId).equals(request._id));

    if (!request) {
        return next(new ErrorHandler('Request is not exist', 400));
    }

    // Validate payment
    if (payment_info && 'id' in payment_info) {
        const paymentIntentId = payment_info.id;
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
            return next(new ErrorHandler('Payment not authorized', 400));
        }
    }

    request.status = 1;

    income.totalWithdraw += amount;

    const remainRequest = income.requests.filter((item: any) => item._id !== request._id);

    const requests = [request, ...remainRequest];
    income.requests = requests;

    await income.save();

    res.status(200).json({
        success: true,
        data: requests
    });
});

export const newPayment = catchAsync(async (req, res, next) => {
    const { userId, amount } = req.body;

    const user = await UserModel.findById(userId).select('+stripeAccountId');

    if (!user?.stripeAccountId) {
        return next(new ErrorHandler('Payment account not setup', 400));
    }

    // Check account status right before transferring
    // const account = await stripe.accounts.retrieve(user.stripeAccountId);

    // if (!account.SendMoneyForm || !account.payouts_enabled) {
    //     return next(new ErrorHandler('Instructor payment account not ready', 400));
    // }

    // Proceed with transfer
    const myPayment = await stripe.transfers.create({
        amount: amount * 100, // in cents
        currency: 'usd',
        destination: user.stripeAccountId
    });

    res.status(201).json({ success: true, client_secret: myPayment.client_secret });
});
