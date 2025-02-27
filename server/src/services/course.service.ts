import CourseModel from '@/models/Course.model';
import UserModel from '@/models/User.model';
import ErrorHandler from '@/utils/ErrorHandler';
import { NextFunction, Request, Response } from 'express';

export const getTopRatedCourses = async (instructorId: string) => {
    // Lấy các khóa học mà instructor đã đăng
    const instructor = await UserModel.findById(instructorId).populate('uploadedCourses');

    if (!instructor || !instructor.uploadedCourses || instructor.uploadedCourses.length === 0) {
        throw new Error('No courses found for this instructor');
    }

    // Lấy thông tin chi tiết của các khóa học
    const topCourses = await CourseModel.find({
        _id: { $in: instructor.uploadedCourses } // Lọc khóa học theo ID trong uploadedCourses
    })
        .sort({ rating: -1 }) // Sắp xếp theo rating giảm dần
        .limit(3); // Giới hạn 3 khóa học đầu tiên

    return topCourses;
};

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
