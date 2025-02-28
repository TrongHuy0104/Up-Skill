import { catchAsync } from '@/utils/catchAsync';
import { NextFunction, Request, Response } from 'express';
import { redis } from '@/utils/redis';
import Quiz from '@/models/Quiz.model'; // Adjust the import path as needed
import ErrorHandler from '@/utils/ErrorHandler';

// GET /api/quizzes/:quizId - Fetch a quiz by ID
export const getQuizbyId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const quizId = req.params.id;

    if (!quizId) {
        return next(new ErrorHandler('Please provide a quiz id', 400));
    }

    // Check Redis cache first
    const isCacheExist = await redis.get(quizId);
    let quiz;

    if (isCacheExist) {
        // If cached, parse the data
        quiz = JSON.parse(isCacheExist);
    } else {
        // If not cached, fetch from the database
        quiz = await Quiz.findById(quizId)
            .populate('instructorId', 'name email') // Populate instructor details
            .populate('courseId', 'title')
            .exec();

        // If quiz not found, return an error
        if (!quiz) {
            return next(new ErrorHandler('Quiz not found', 404));
        }

        // Cache the quiz in Redis
        await redis.set(quizId, JSON.stringify(quiz), 'EX', 604800); // Cache for 7 days (604800 seconds)
    }

    // Return the quiz
    res.status(200).json({
        success: true,
        quiz
    });
});
