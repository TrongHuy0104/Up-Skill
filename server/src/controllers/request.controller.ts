import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@/utils/catchAsync';
import ErrorHandler from '@/utils/ErrorHandler';
import RequestModel from '@/models/Request.model';

export const createRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { courseId, instructorId } = req.body;
    if (!instructorId) {
        return next(new ErrorHandler('Unauthorized access', 401));
    }

    if (!courseId) {
        return next(new ErrorHandler('Course ID is required', 400));
    }

    const existingRequest = await RequestModel.findOne({ courseId, instructorId, status: 'pending' });

    if (existingRequest) {
        return next(new ErrorHandler('A request for this course is already pending', 400));
    }

    const newRequest = await RequestModel.create({
        courseId,
        instructorId,
        status: 'pending'
    });

    res.status(201).json({
        success: true,
        data: newRequest
    });
});
