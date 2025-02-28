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
import LevelModel from '@/models/Level.model';
import CategoryModel from '@/models/Category.model';
import SubCategoryModel from '@/models/SubCategory.model';
import UserModel from '@/models/User.model';

export const getTopRatedCoursesController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id: instructorId } = req.params; // Lấy giá trị `id` từ req.params

    if (!instructorId) {
        return next(new ErrorHandler('Instructor not found', 404));
    }

    // Find top-rated courses by the specific instructor
    const topCourses = await CourseModel.find({ authorId: instructorId }) // Lọc đúng instructor
        .sort({ rating: -1 })
        .limit(10)
        .populate('authorId', 'name email')
        .populate('category', 'name')
        .lean();

    if (!topCourses || topCourses.length === 0) {
        return next(new ErrorHandler('No courses found', 404));
    }

    // Add lesson count and duration
    const coursesWithDetails = topCourses.map((course) => {
        const lessonsCount = course.courseData?.length || 0;
        const duration =
            course.courseData?.reduce(
                (acc: number, curr: { videoLength?: number }) => acc + (curr.videoLength ?? 0),
                0
            ) || 0;
        const durationInHours = (duration / 60).toFixed(1);

        return {
            ...course,
            lessonsCount,
            duration: `${durationInHours} hours`
        };
    });

    res.status(200).json({
        success: true,
        data: {
            topCourses: coursesWithDetails
        }
    });
});

export const getTopCourses = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const topCourses = await CourseModel.find({ isPublished: true })
        .sort({ rating: -1, purchased: -1 })
        .limit(10)
        .populate('authorId', 'name email')
        .populate('category', 'name')
        .lean();

    if (!topCourses || topCourses.length === 0) {
        return next(new ErrorHandler('No courses found', 404));
    }

    const coursesWithDetails = topCourses.map((course) => {
        const lessonsCount = course.courseData?.length || 0;

        const duration =
            course.courseData?.reduce((acc: number, curr: { videoLength?: number }) => {
                return acc + (curr.videoLength || 0);
            }, 0) || 0;

        const durationInHours = (duration / 60).toFixed(1);

        return {
            ...course,
            lessonsCount,
            duration: `${durationInHours} hours`
        };
    });

    res.status(200).json({
        success: true,
        data: {
            topCourses: coursesWithDetails
        }
    });
});

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
    await redis.del(`allCourses ${req.user?._id}`);
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
        const courses = await CourseModel.find().select(
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

    const courseExists = userCourseList?.find((c: any) => c === courseId.toString());

    if (!courseExists) {
        return next(new ErrorHandler('You are not eligible to access this course', 404));
    }

    const course = await CourseModel.findById(courseId);

    res.status(200).json({
        success: true,
        course
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

interface CourseFilter {
    level?: mongoose.Types.ObjectId;
    category?: mongoose.Types.ObjectId;
    subCategory?: mongoose.Types.ObjectId;
    authorId?: mongoose.Types.ObjectId;
    rating?: number;
    language?: string;
    price?: any;
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

//get courses -- pagination

export const getCoursesLimitWithPagination = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    const filter: CourseFilter = {};

    if (req.query.level) {
        const levelDoc = await LevelModel.findOne({ name: req.query.level as string });
        if (levelDoc) filter.level = levelDoc._id;
    }

    if (req.query.category) {
        const categoryDoc = await CategoryModel.findOne({ title: req.query.category as string });
        if (categoryDoc) filter.category = categoryDoc._id;
    }

    if (req.query.subCategory) {
        const subCategoryDoc = await SubCategoryModel.findOne({ title: req.query.subCategory as string });
        if (subCategoryDoc) filter.subCategory = subCategoryDoc._id;
    }

    if (req.query.authorId) {
        const authorDoc = await UserModel.findOne({ name: req.query.authorId as string });
        if (authorDoc) filter.authorId = authorDoc._id;
    }

    // Filter rating
    if (req.query.rating) {
        const rating = parseInt(req.query.rating as string, 10);
        if (!isNaN(rating) && rating >= 1 && rating <= 5) {
            filter.rating = rating;
        }
    }

    // Filter language
    if (req.query.language) {
        filter.language = req.query.language as string;
    }

    // Filter price (Free or Paid)
    if (req.query.price) {
        if (req.query.price === 'Free') {
            filter.price = 0;
        } else if (req.query.price === 'Paid') {
            filter.price = { $gt: 0 };
        }
    }

    const courses = await CourseModel.find(filter)
        .select('-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links')
        .populate('authorId', 'name')
        .skip(skip)
        .limit(limit);

    const totalCourses = await CourseModel.countDocuments(filter);

    res.status(200).json({
        success: true,
        page,
        limit,
        totalCourses,
        totalPages: Math.ceil(totalCourses / limit),
        courses
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
// get courses statistics
export const getCourseStatistics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const courses = await CourseModel.find()
        .populate('category', 'title')
        .populate('subCategory', 'title')
        .populate('authorId', 'name')
        .populate('level', 'name');

    const formatCategoryData = () => ({
        title: 'Categories',
        data: courses.reduce((acc, course) => {
            const categoryLabel = course.category?.title || 'Unknown';
            const subCategoryLabel = course.subCategory?.title || 'Unknown';

            let categoryItem = acc.find((item: any) => item.label === categoryLabel);
            if (!categoryItem) {
                categoryItem = { label: categoryLabel, count: 0, subCategories: [] };
                acc.push(categoryItem);
            }

            categoryItem.count += 1;

            const subCategoryItem = categoryItem.subCategories.find((sub: any) => sub.label === subCategoryLabel);
            if (subCategoryItem) {
                subCategoryItem.count += 1;
            } else {
                categoryItem.subCategories.push({ label: subCategoryLabel, count: 1 });
            }

            return acc;
        }, [])
    });

    const formatData = (field: string, title: string) => ({
        title,
        data: courses.reduce((acc, course) => {
            const fieldValue = course[field]?.title || course[field]?.name || course[field] || 'Unknown';
            const existing = acc.find((item: any) => item.label === fieldValue);
            if (existing) {
                existing.count += 1;
            } else {
                acc.push({ label: fieldValue, count: 1 });
            }
            return acc;
        }, [])
    });

    const formatRatingData = () => ({
        title: 'Rating',
        data: [
            { label: '1', min: 0, max: 1 },
            { label: '2', min: 1, max: 2 },
            { label: '3', min: 2, max: 3 },
            { label: '4', min: 3, max: 4 },
            { label: '5', min: 4, max: 5 }
        ].map(({ label, min, max }) => ({
            label,
            count: courses.filter((course) => course.rating > min && course.rating <= max).length
        }))
    });

    const formatPriceData = () => ({
        title: 'Price',
        data: [
            { label: 'Free', count: courses.filter((course) => course.price === 0).length },
            { label: 'Paid', count: courses.filter((course) => course.price > 0).length }
        ]
    });

    const data = {
        categories: formatCategoryData(),
        authors: formatData('authorId', 'Author'),
        levels: formatData('level', 'Level'),
        ratings: formatRatingData(),
        price: formatPriceData(),
        languages: formatData('language', 'Language')
    };

    res.status(200).json({
        success: true,
        data
    });
});
