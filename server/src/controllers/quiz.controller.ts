import { catchAsync } from '@/utils/catchAsync';
import { NextFunction, Request, Response } from 'express';
import { redis } from '@/utils/redis';
import Quiz from '@/models/Quiz.model'; // Adjust the import path as needed
import Course from '@/models/Course.model'; // Import Course model
import ErrorHandler from '@/utils/ErrorHandler';
import mongoose from 'mongoose';

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

// POST /api/quizzes - Create a new quiz
export const createQuiz = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {
        title,
        description,
        difficulty,
        duration,
        passingScore,
        maxAttempts,
        isPublished,
        instructorId,
        questions,
        order,
        videoSection,
        courseId
    } = req.body;

    // Validate required fields
    if (
        !title ||
        !difficulty ||
        !duration ||
        !passingScore ||
        !maxAttempts ||
        !instructorId ||
        !questions ||
        !order ||
        !videoSection ||
        !courseId
    ) {
        return next(new ErrorHandler('Missing required fields', 400));
    }

    // Validate courseId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return next(new ErrorHandler('Invalid course ID format', 400));
    }

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
        return next(new ErrorHandler('Course not found', 404));
    }

    // Create a new quiz
    const newQuiz = new Quiz({
        title,
        description,
        difficulty,
        duration,
        passingScore,
        maxAttempts,
        isPublished,
        instructorId,
        questions,
        order,
        videoSection,
        courseId
    });

    // Save the quiz to the database
    const savedQuiz = await newQuiz.save();

    // Add the quiz to the selected course's section
    const courseData = course.courseData.find((data: any) => data.videoSection === videoSection);
    if (courseData) {
        courseData.quizzes.push(savedQuiz._id); // Add quiz to the section
    } else {
        // If the section doesn't exist, create a new section and add the quiz
        course.courseData.push({
            videoSection,
            quizzes: [savedQuiz._id]
        });
    }

    // Save the updated course
    await course.save();

    // Return the created quiz
    res.status(201).json({
        success: true,
        message: 'Quiz created successfully',
        quiz: savedQuiz
    });
});

// GET /api/quizzes - Fetch all quizzes (without pagination)
export const getAllQuizzes = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { difficulty, courseId } = req.query;

    // Build the query
    const query: any = {};
    if (difficulty) query.difficulty = difficulty;
    if (courseId) query.courseId = courseId;

    // Fetch all quizzes
    const quizzes = await Quiz.find(query).populate('instructorId', 'name email').populate('courseId', 'title');

    // Cache the result in Redis
    const cacheKey = `quizzes:${JSON.stringify(req.query)}`;
    await redis.set(cacheKey, JSON.stringify(quizzes), 'EX', 3600); // Cache for 1 hour

    // Return the quizzes
    res.status(200).json({
        success: true,
        quizzes
    });
});

// PUT /api/quizzes/:quizId - Update a quiz
export const updateQuiz = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const quizId = req.params.id;
    const updateData = req.body;

    // Validate quizId format
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
        return next(new ErrorHandler('Invalid quiz ID format', 400));
    }

    // Find and update the quiz
    const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, updateData, {
        new: true, // Return the updated document
        runValidators: true // Run Mongoose validators
    });

    // If quiz not found, return an error
    if (!updatedQuiz) {
        return next(new ErrorHandler('Quiz not found', 404));
    }

    // Invalidate Redis cache for this quiz
    await redis.del(quizId);

    // Return the updated quiz
    res.status(200).json({
        success: true,
        message: 'Quiz updated successfully',
        quiz: updatedQuiz
    });
});

// DELETE /api/quizzes/:quizId - Delete a quiz
export const deleteQuiz = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const quizId = req.params.id;

    // Validate quizId format
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
        return next(new ErrorHandler('Invalid quiz ID format', 400));
    }

    // Find the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        return next(new ErrorHandler('Quiz not found', 404));
    }

    // Remove the quiz from the course's section
    const course = await Course.findById(quiz.courseId);
    if (course) {
        const courseData = course.courseData.find((data: any) => data.videoSection === quiz.videoSection);
        if (courseData) {
            courseData.quizzes = courseData.quizzes.filter((q: any) => q.toString() !== quizId);
            await course.save();
        }
    }

    // Delete the quiz
    await Quiz.findByIdAndDelete(quizId);

    // Invalidate Redis cache for this quiz
    await redis.del(quizId);

    // Return success message
    res.status(200).json({
        success: true,
        message: 'Quiz deleted successfully'
    });
});

// GET /api/quizzes/course/:courseId - Fetch quizzes by course
export const getQuizzesByCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.courseId;

    // Validate courseId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return next(new ErrorHandler('Invalid course ID format', 400));
    }

    // Fetch quizzes by courseId
    const quizzes = await Quiz.find({ courseId }).populate('instructorId', 'name email').populate('courseId', 'title');

    // Return the quizzes
    res.status(200).json({
        success: true,
        quizzes
    });
});

export const getQuizzesBySection = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const videoSection = req.params.videoSection;

    // Validate videoSection
    if (!videoSection) {
        return next(new ErrorHandler('Please provide a video section', 400));
    }

    // Fetch quizzes by videoSection
    const quizzes = await Quiz.find({ videoSection })
        .populate('instructorId', 'name email')
        .populate('courseId', 'title');

    // Return the quizzes
    res.status(200).json({
        success: true,
        quizzes
    });
});

// POST /api/quizzes/:quizId/submit - Submit quiz answers
export const submitQuiz = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const quizId = req.params.id;
    const { userId, answers } = req.body;

    // Validate quizId format
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
        return next(new ErrorHandler('Invalid quiz ID format', 400));
    }

    // Find the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        return next(new ErrorHandler('Quiz not found', 404));
    }

    // Calculate the score
    let score = 0;
    quiz.questions.forEach((question: any, index: any) => {
        if (question.correctAnswer === answers[index]) {
            score += question.points;
        }
    });

    // Save the user's score
    quiz.userScores.push({
        user: userId,
        score,
        attemptedAt: new Date()
    });

    // Save the updated quiz
    await quiz.save();

    // Return the result
    res.status(200).json({
        success: true,
        message: 'Quiz submitted successfully',
        score,
        passingScore: quiz.passingScore,
        isPassed: score >= quiz.passingScore
    });
});
