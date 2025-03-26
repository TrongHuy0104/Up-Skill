import { CouponModel, CouponDocument } from '@/models/Coupon.model';
import ErrorHandler from '@/utils/ErrorHandler';
import mongoose from 'mongoose';

export const validateCouponCode = async (
    couponCode: string,
    userId?: string
): Promise<CouponDocument> => {
    const coupon = await CouponModel.findOne({ code: couponCode, isActive: true });

    if (!coupon) {
        throw new ErrorHandler('Invalid coupon code', 400);
    }

    if (coupon.expiryDate && coupon.expiryDate < new Date()) {
        throw new ErrorHandler('Coupon code expired', 400);
    }

    if (coupon.usageLimit && coupon.usersUsed && coupon.usersUsed.length >= coupon.usageLimit) {
        throw new ErrorHandler('Coupon usage limit reached', 400);
    }

    if (userId) {
        const userIdObjectId = new mongoose.Types.ObjectId(userId);
        if (coupon.usersUsed && coupon.usersUsed.includes(userIdObjectId)) {
            throw new ErrorHandler('Coupon already used by you', 400);
        }
    }

    return coupon;
};

export const recordCouponUsage = async (couponCode: string, userId?: string) => {
    if (!userId) return;

    const coupon = await CouponModel.findOne({ code: couponCode });
    if (coupon) {
        const userIdObjectId = new mongoose.Types.ObjectId(userId);
        coupon.usersUsed = coupon.usersUsed || [];
        coupon.usersUsed.push(userIdObjectId);
        await coupon.save();
    }
};
