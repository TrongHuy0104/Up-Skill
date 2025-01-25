import ejs from 'ejs';
import { IOrder } from '@/interfaces/Order';
import CourseModel from '@/models/Course.model';
import UserModel from '@/models/User.model';
import { getAllOrdersService, newOrder } from '@/services/order.service';
import { catchAsync } from '@/utils/catchAsync';
import ErrorHandler from '@/utils/ErrorHandler';
import { NextFunction, Request, Response } from 'express';
import path from 'path';
import sendMail from '@/utils/sendMail';
import NotificationModel from '@/models/Notification.model';

// create order
export const createOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { courseId } = req.body as IOrder;

    const user = await UserModel.findById(req.user?._id);

    const courseExistsInUser = user?.purchasedCourses.some((c: any) => c._id.toString() === courseId.toString());

    if (courseExistsInUser) {
        return next(new ErrorHandler('You have already purchased this course', 400));
    }

    const course = await CourseModel.findById(courseId);

    if (!course) {
        return next(new ErrorHandler('Course not found', 404));
    }

    const data: any = {
        courseId: course._id,
        userId: user?._id
    };

    const mailData = {
        order: {
            _id: course._id.toString().slice(0, 6),
            name: course.name,
            price: course.price,
            data: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        }
    };

    await ejs.renderFile(path.join(__dirname, '../mails/order-confirmation.ejs'), {
        order: mailData
    });

    try {
        if (user) {
            await sendMail({
                email: user.email,
                subject: 'Order Confirmation',
                template: 'order-confirmation.ejs',
                data: mailData
            });
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }

    user?.purchasedCourses.push(course?._id);

    await user?.save();

    await NotificationModel.create({
        user: user?._id,
        title: 'New Order',
        message: `You have a new order from ${course?.name}`,
        courseId: course._id,
        authorId: course.authorId
    });

    course.purchased ? (course.purchased += 1) : course.purchased;

    await course.save();

    newOrder(data, next, res);
});

// get all orders -- for admin
export const getAllOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    getAllOrdersService(res);
});
