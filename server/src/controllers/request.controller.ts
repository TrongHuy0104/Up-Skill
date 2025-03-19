import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@/utils/catchAsync';
import ErrorHandler from '@/utils/ErrorHandler';
import RequestModel from '@/models/Request.model';
import CourseModel from '@/models/Course.model';
import UserModel from '@/models/User.model';
import sendMail from '@/utils/sendMail';

//create request to admin
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

//get request by courseId
export const getRequestsByCourseId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { courseId } = req.params;

    if (!courseId) {
        return next(new ErrorHandler('Course ID is required', 400));
    }

    const request = await RequestModel.findOne({ courseId });

    if (!request) {
        return next(new ErrorHandler('No request found for this course', 404));
    }

    res.status(200).json({
        success: true,
        data: request
    });
});

//get pending request
export const getPendingRequests = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const pendingRequests = await RequestModel.find({ status: 'pending' });

    if (!pendingRequests || pendingRequests.length === 0) {
        return next(new ErrorHandler('No pending requests found', 404));
    }

    res.status(200).json({
        success: true,
        data: pendingRequests
    });
});

// Handle request

export const handleRequestApproval = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { requestId } = req.params;
    const { action } = req.body;

    if (!requestId) {
        return next(new ErrorHandler('Request ID is required', 400));
    }

    if (!['approve', 'reject'].includes(action)) {
        return next(new ErrorHandler('Invalid action', 400));
    }

    const request = await RequestModel.findById(requestId);
    if (!request) {
        return next(new ErrorHandler('Request not found', 404));
    }

    const course = await CourseModel.findById(request.courseId);
    if (!course) {
        return next(new ErrorHandler('Course not found', 404));
    }

    const instructor = await UserModel.findById(request.instructorId);
    if (!instructor) {
        return next(new ErrorHandler('Instructor not found', 404));
    }

    request.status = action === 'approve' ? 'approved' : 'rejected';
    await request.save();

    let emailTemplate = '';
    let subject = '';

    if (action === 'approve') {
        await CourseModel.findByIdAndUpdate(request.courseId, { isPublished: true });

        emailTemplate = 'approved-request-mail.ejs';
        subject = 'Your Course Has Been Approved!';
    } else {
        emailTemplate = 'reject-request-mail.ejs';
        subject = 'Your Course Has Been Rejected';
    }

    const data = {
        user: { name: instructor.name },
        courseName: course.name,
        rejectionReason: action === 'reject' ? 'Your course did not meet the platform requirements.' : '',
        courseUrl: `https://your-platform.com/courses/${course._id}`
    };

    try {
        await sendMail({
            email: instructor.email,
            subject,
            template: emailTemplate,
            data
        });

        res.status(200).json({
            success: true,
            message: `Request has been ${request.status} and email notification sent.`
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});
