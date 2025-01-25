import CourseModel from '@/models/Course.model';
import ErrorHandler from '@/utils/ErrorHandler';
import { NextFunction, Request, Response } from 'express';

export const createCourse = async (data: any, req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
        return next(new ErrorHandler('User is not logged in!', 400));
    }
    data.authorId = userId;
    const course = await CourseModel.create(data);
    req.user?.uploadedCourses.push(course._id);
    res.status(201).json({
        success: true,
        course
    });
};

export const getAllCoursesService = async (res: Response) => {
    const courses = await CourseModel.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        courses
    });
};
