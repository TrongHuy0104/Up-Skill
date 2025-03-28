import { ICoupon } from '@/interfaces/Coupon';
import mongoose, { Schema } from 'mongoose';

const CouponSchema: Schema = new Schema(
    {
        code: { type: String, required: true, unique: true, trim: true },
        discountPercentage: { type: Number, required: true, min: 1, max: 100 },
        isActive: { type: Boolean, default: true },
        expiryDate: { type: Date, default: null },
        usageLimit: { type: Number, default: null, min: 1 },
        usersUsed: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    },
    { timestamps: true }
);

export const CouponModel = mongoose.model<ICoupon>('Coupon', CouponSchema);
