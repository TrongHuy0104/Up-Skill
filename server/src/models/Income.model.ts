// models/Income.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IMonthlyIncome {
    day: number; // 1-31
    month: number; // 1-12
    year: number;
    income: number;
    purchased: number;
}

export interface IIncome extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    totalIncome: number;
    totalPurchased: number;
    total: IMonthlyIncome[];
}

const MonthlyIncomeSchema = new Schema<IMonthlyIncome>({
    day: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    income: { type: Number, default: 0 },
    purchased: { type: Number, default: 0 }
});

const IncomeSchema = new Schema<IIncome>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalIncome: { type: Number, default: 0 },
    totalPurchased: { type: Number, default: 0 },
    total: [MonthlyIncomeSchema]
}, { timestamps: true });

export default mongoose.models.Income || mongoose.model<IIncome>('Income', IncomeSchema);
