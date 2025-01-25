import { IOrder } from '@/interfaces/Order';
import mongoose, { Schema } from 'mongoose';

const OrderSchema = new Schema<IOrder>(
    {
        courseId: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        payment_info: {
            type: String
        }
    },
    { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
