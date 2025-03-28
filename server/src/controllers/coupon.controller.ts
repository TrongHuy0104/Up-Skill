import { Request, Response, NextFunction } from 'express';
import { CouponModel } from '../models/Coupon.model';
import ErrorHandler from '../utils/ErrorHandler';
import mongoose from 'mongoose';

export const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { code, discountPercentage, expiryDate, usageLimit } = req.body;
        const coupon = await CouponModel.create({
            code,
            discountPercentage,
            expiryDate,
            usageLimit
        });
        res.status(201).json({ success: true, coupon, message: 'Coupon created successfully' });
    } catch (error) {
        next(error);
    }
};

export const getAllCoupons = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const coupons = await CouponModel.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, coupons });
    } catch (error) {
        next(error);
    }
};

export const updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const couponId = req.params.id;
        const updates = req.body;
        const updatedCoupon = await CouponModel.findByIdAndUpdate(couponId, updates, {
            new: true,
            runValidators: true
        });
        if (!updatedCoupon) {
            return next(new ErrorHandler('Coupon not found', 404));
        }
        res.status(200).json({ success: true, coupon: updatedCoupon, message: 'Coupon updated successfully' });
    } catch (error) {
        next(error);
    }
};

export const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const couponId = req.params.id;
        const deletedCoupon = await CouponModel.findByIdAndDelete(couponId);
        if (!deletedCoupon) {
            return next(new ErrorHandler('Coupon not found', 404));
        }
        res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const validateCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { code } = req.body;
        const userId = req.user?._id;

        const coupon = await CouponModel.findOne({ code, isActive: true });

        if (!coupon) {
            return next(new ErrorHandler('Invalid coupon code', 200));
        }

        if (coupon.expiryDate && coupon.expiryDate < new Date()) {
            return next(new ErrorHandler('Coupon code expired', 200));
        }

        if (coupon.usageLimit && coupon.usersUsed && coupon.usersUsed.length >= coupon.usageLimit) {
            return next(new ErrorHandler('Coupon usage limit reached', 200));
        }

        if (userId) {
            const userIdString = String(userId);
            const userIdObjectId = new mongoose.Types.ObjectId(userIdString);
            if (coupon.usersUsed?.includes(userIdObjectId)) {
                return next(new ErrorHandler('Coupon already used by you', 200));
            }
        }

        res.status(200).json({
            success: true,
            coupon,
            discountPercentage: coupon.discountPercentage,
            message: 'Coupon valid'
        });
    } catch (error) {
        next(error);
    }
};
