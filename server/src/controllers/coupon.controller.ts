import { Request, Response, NextFunction } from 'express';
import { CouponModel } from '@/models/Coupon.model';
import ErrorHandler from '@/utils/ErrorHandler';
// import mongoose from 'mongoose';

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
        const updatedCoupon = await CouponModel.findByIdAndUpdate(couponId, updates, { new: true, runValidators: true });
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
