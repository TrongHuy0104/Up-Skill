import mongoose, { Schema } from 'mongoose';
import { RequestT } from '../interfaces/Request';

export const RequestSchema: Schema<RequestT> = new Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        },
        instructorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                delete ret.__v;
                return ret;
            }
        },
        toObject: {
            transform: (doc, ret) => {
                delete ret.__v;
                return ret;
            }
        }
    }
);

export default mongoose.models.Request || mongoose.model<RequestT>('Request', RequestSchema);
