import mongoose, { Schema, Document } from 'mongoose';

export interface IIncome extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    totalIncome: number;
    totalPurchased: number;
    total: number[];
    totalWithdraw: number;
    isAdmin: boolean;
    requests: IRequest[];
    balance: number;
    commissionRate?: number;
}

interface IRequest extends Document {
    amount: number;
    status: 1 | 0 | -1;
}

const RequestSchema = new Schema<IRequest>(
    {
        amount: {
            type: Number,
            default: 0
        },
        status: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

const IncomeSchema = new Schema<IIncome>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalIncome: {
        type: Number,
        default: 0
    },
    totalPurchased: {
        type: Number,
        default: 0
    },
    total: {
        type: [Number],
        default: Array(12).fill(0) // 12 tháng, mỗi tháng khởi tạo 0
    },
    totalWithdraw: {
        type: Number,
        default: 0
    },
    balance: {
        type: Number,
        default: 0
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    requests: [RequestSchema],
    commissionRate: Number
});

export default mongoose.models.Order || mongoose.model<IIncome>('Income', IncomeSchema);