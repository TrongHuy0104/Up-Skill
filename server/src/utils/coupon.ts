import mongoose from 'mongoose';
import { CouponModel } from '../models/Coupon.model';

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
