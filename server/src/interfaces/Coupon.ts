import mongoose, { Document } from 'mongoose';

export interface ICoupon extends Document {
    code: string;
    discountPercentage: number;
    isActive: boolean;
    expiryDate?: Date;
    usageLimit?: number;
    usersUsed?: mongoose.Types.ObjectId[];
}
