import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import ejs from 'ejs';
import { catchAsync } from '@/utils/catchAsync';
import { NextFunction, Request, Response } from 'express';
import { createCourse, getAllCoursesService } from '@/services/course.service';
import CourseModel from '@/models/Course.model';
import ErrorHandler from '@/utils/ErrorHandler';
import { redis } from '@/utils/redis';
import path from 'path';
import sendMail from '@/utils/sendMail';
import NotificationModel from '@/models/Notification.model';
import axios from 'axios';

export const uploadCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    const thumbnail = data.thumbnail;
    if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
            folder: 'courses'
        });
        data.thumbnail = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        };
    }
    await redis.del('allCourses ${req.user?._id}');
    await redis.del('allCourses undefined');
    createCourse(data, req, res, next);
});
// export const uploadCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const data = req.body;

//     createCourse(data, req, res, next);
// });

export const updateCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id;

    if (!courseId) {
        return next(new ErrorHandler('Please provide a course id', 400));
    }

    const isCacheExist = await redis.get(courseId);
    let course;

    if (isCacheExist) {
        course = await JSON.parse(isCacheExist);
    } else {
        course = await CourseModel.findById(req.params.id).select(
            '-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links'
        );
        redis.set(courseId, JSON.stringify(course));
    }

    const data = req.body;

    const thumbnail = data.thumbnail;
    if (thumbnail) {
        if (course?.thumbnail?.public_id) {
            await cloudinary.v2.uploader.destroy(course.thumbnail.public_id);
        }

        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
            folder: 'courses'
        });

        data.thumbnail = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        };
    }

    const courseAfterUpdated = await CourseModel.findByIdAndUpdate(courseId, { $set: data }, { new: true });

    redis.set(courseId, JSON.stringify(courseAfterUpdated));

    res.status(200).json({
        success: true,
        course: courseAfterUpdated
    });
});

// get single course without purchase
export const getSingleCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id;

    if (!courseId) {
        return next(new ErrorHandler('Please provide course id', 400));
    }

    const isCacheExist = await redis.get(courseId);
    let course;

    if (isCacheExist) {
        course = await JSON.parse(isCacheExist);
    } else {
        course = await CourseModel.findById(req.params.id)
            .populate('authorId')
            .select('-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links');
        redis.set(courseId, JSON.stringify(course));
    }

    if (!course) {
        return next(new ErrorHandler('Course not found', 404));
    }

    res.status(200).json({
        success: true,
        course
    });
});

// get all courses without purchase
export const getAllCoursesWithoutPurchase = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const isCacheExist = await redis.get(`allCourses ${req.user?._id}`);
    let courses;

    if (isCacheExist) {
        courses = JSON.parse(isCacheExist);
    } else {
        courses = await CourseModel.find().select(
            '-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links'
        );
        redis.set(`allCourses ${req.user?._id}`, JSON.stringify(courses));
    }

    res.status(200).json({
        success: true,
        courses
    });
});

// get course content -- only for valid user
export const getPurchasedCourseByUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userCourseList = req.user?.purchasedCourses;
    const courseId = req.params.id;

    const courseExists = userCourseList?.find((c: any) => c._id.toString() === courseId.toString());

    if (!courseExists) {
        return next(new ErrorHandler('You are not eligible to access this course', 404));
    }

    const course = await CourseModel.findById(courseId);

    const content = course?.courseData;

    res.status(200).json({
        success: true,
        content
    });
});
// add question in course
interface IAddQuestionData {
    question: string;
    courseId: string;
    contentId: string;
}

export const addQuestion = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { question, courseId, contentId } = req.body as IAddQuestionData;
    const course = await CourseModel.findById(courseId);

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler('Invalid content Id', 400));
    }

    const courseContent = course?.courseData?.find((c: any) => c._id.equals(contentId));

    if (!courseContent) {
        return next(new ErrorHandler('Course content is not exist', 400));
    }

    const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: []
    };

    courseContent.questions.push(newQuestion);

    await NotificationModel.create({
        user: req.user?._id,
        title: 'New Question Received',
        message: `You have a new question in ${courseContent.title}`,
        courseId: course._id,
        authorId: course.authorId
    });

    await course?.save();

    res.status(200).json({
        success: true,
        course
    });
});

// add answer in course question
interface IAddAnswerData {
    answer: string;
    courseId: string;
    contentId: string;
    questionId: string;
}

export const addAnswer = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { answer, courseId, contentId, questionId } = req.body as IAddAnswerData;
    const course = await CourseModel.findById(courseId);

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler('Invalid content Id', 400));
    }

    const courseContent = course?.courseData?.find((c: any) => c._id.equals(contentId));

    if (!courseContent) {
        return next(new ErrorHandler('Course content is not exist', 400));
    }

    const question = courseContent?.questions?.find((q: any) => q._id.equals(questionId));

    if (!question) {
        return next(new ErrorHandler('Invalid question Id', 400));
    }

    // create new answer object
    const newAnswer: any = {
        user: req.user,
        answer
    };

    //  add answer to course content
    question.questionReplies.push(newAnswer);

    await course?.save();

    if (req.user?._id === question.user._id) {
        // create a notification
        await NotificationModel.create({
            user: req.user?._id,
            title: 'New Question Reply Received',
            message: `You have a new question reply in ${courseContent.title}`,
            courseId: course._id,
            authorId: course.authorId
        });
    } else {
        const data = {
            name: question.user.name,
            title: courseContent.title
        };

        await ejs.renderFile(path.join(__dirname, '../mails/question-reply.ejs'), data);

        try {
            await sendMail({
                email: question.user.email,
                subject: 'Question Reply',
                template: 'question-reply.ejs',
                data
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
    res.status(200).json({
        success: true,
        course
    });
});

// add review for course
interface IAddReviewData {
    review: string;
    rating: number;
    userId: string;
}

export const addReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userCourseList = req.user?.purchasedCourses;

    const courseId = req.params.id;

    const courseExists = userCourseList?.some((c: any) => c._id.toString() === courseId.toString());

    if (!courseExists) {
        return next(new ErrorHandler('You are not eligible to access this course', 404));
    }

    const course = await CourseModel.findById(courseId);

    if (!course) {
        return next(new ErrorHandler('Course not found', 404));
    }

    const { rating, review } = req.body as IAddReviewData;

    const reviewData: any = {
        user: req.user,
        rating,
        comment: review
    };

    course?.reviews.push(reviewData);

    // Calculate rating
    let totalRating = 0;

    course?.reviews.forEach((review: any) => {
        totalRating += review.rating;
    });

    course.rating = totalRating / course?.reviews.length;

    await course.save();

    // create notification

    const notification = {
        user: req.user?._id,
        title: 'New Review Received',
        message: `${req.user?.name} has given review in ${course?.name}`,
        courseId: course._id,
        authorId: course.authorId
    };

    await NotificationModel.create(notification);

    res.status(200).json({
        success: true,
        course
    });
});

// add reply in review
interface IAddReviewData {
    comment: string;
    courseId: string;
    reviewId: string;
}

export const addReplyToReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { comment, courseId, reviewId } = req.body as IAddReviewData;

    const course = await CourseModel.findById(courseId);

    if (!course) {
        return next(new ErrorHandler('Course not found', 404));
    }

    const review = course?.reviews?.find((r: any) => r._id.toString() === reviewId.toString());

    if (!review) {
        return next(new ErrorHandler('Review not found', 404));
    }

    const replyData: any = {
        user: req.user,
        comment
    };

    if (!review.commentReplies) {
        review.commentReplies = [];
    }

    review.commentReplies.push(replyData);

    await course.save();

    res.status(200).json({
        success: true,
        course
    });
});

// get all courses -- for admin
export const getAllCourses = catchAsync(async (req: Request, res: Response, next: NextFunction) => [
    getAllCoursesService(res)
]);

// delete course -- for admin
export const deleteCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const course = await CourseModel.findById(id);

    if (!course) {
        return next(new ErrorHandler('Course not found', 404));
    }

    await course.deleteOne({ id });

    await redis.del(id);

    res.status(200).json({
        success: true,
        message: 'Course deleted successfully'
    });
});

// generate video url
export const generateVideoUrl = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { videoId } = req.body;
    const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
        { ttl: 300 },
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Apisecret ${process.env.VIDEOCIPHER_API_SECRET}`
            },
            withCredentials: true
        }
    );
    res.json(response.data);
});

export const getTopCourses = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const topCourses = await CourseModel.find({ isPublished: true })
        .sort({ rating: -1, purchased: -1 })
        .limit(10)
        .populate('authorId', 'name email')
        .populate('category', 'name')
        .select('-courseData -reviews -benefits -prerequisites -tags');

    if (!topCourses || topCourses.length === 0) {
        return next(new ErrorHandler('No courses found', 404));
    }

    res.status(200).json({
        success: true,
        topCourses
    });
});
