import mongoose, { Document } from 'mongoose';

export interface RequestT extends Document {
    _id: string;
    courseId: mongoose.Schema.Types.ObjectId;
    instructorId: mongoose.Schema.Types.ObjectId;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}
