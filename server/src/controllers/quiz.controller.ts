import { catchAsync } from '@/utils/catchAsync';
import { NextFunction, Request, Response } from 'express';
import { redis } from '@/utils/redis';
import Quiz from '@/models/Quiz.model'; // Adjust the import path as needed
import ErrorHandler from '@/utils/ErrorHandler';

// GET /api/quizzes/:quizId - Fetch a quiz by ID
export const getQuizbyId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const quizId = req.params.id;
    console.log('quiz', quizId);

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

export const updateQuestionInQuiz = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id, questionId } = req.params;
    const updateData = req.body; // Dữ liệu cập nhật từ client

    // Kiểm tra xem quizId và questionId có được cung cấp không
    if (!id || !questionId) {
        return next(new ErrorHandler('Please provide quiz ID and question ID', 400));
    }

    // Tìm quiz trong database
    const quiz = await Quiz.findById(id);
    if (!quiz) {
        return next(new ErrorHandler('Quiz not found', 404));
    }

    // Tìm câu hỏi cần cập nhật trong quiz
    const questionToUpdate = quiz.questions.id(questionId);
    if (!questionToUpdate) {
        return next(new ErrorHandler('Question not found in the quiz', 404));
    }

    // Cập nhật thông tin của câu hỏi
    if (updateData.text) questionToUpdate.text = updateData.text;
    if (updateData.type) questionToUpdate.type = updateData.type;
    if (updateData.points) questionToUpdate.points = updateData.points;
    if (updateData.options) questionToUpdate.options = updateData.options;
    if (updateData.correctAnswer) questionToUpdate.correctAnswer = updateData.correctAnswer;

    // Validate lại câu hỏi sau khi cập nhật
    const validationError = questionToUpdate.validateSync();
    if (validationError) {
        return next(new ErrorHandler(validationError.message, 400));
    }

    // Lưu thay đổi vào database
    await quiz.save();

    // Cập nhật lại cache trong Redis (nếu cần)
    await redis.set(id, JSON.stringify(quiz), 'EX', 604800); // Cache for 7 days

    // Trả về kết quả
    res.status(200).json({
        success: true,
        message: 'Question updated successfully',
        quiz
    });
});

// GET /api/quizzes/:quizId/questions/:questionId - Get a specific question in a quiz
export const getQuestionById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id, questionId } = req.params;

    // Kiểm tra quizId và questionId
    if (!id || !questionId) {
        return next(new ErrorHandler('Please provide quiz ID and question ID', 400));
    }

    // Tìm quiz trong database
    const quiz = await Quiz.findById(id);
    if (!quiz) {
        return next(new ErrorHandler('Quiz not found', 404));
    }

    // Tìm câu hỏi trong quiz
    const question = quiz.questions.id(questionId);
    if (!question) {
        return next(new ErrorHandler('Question not found in the quiz', 404));
    }

    // Trả về câu hỏi
    res.status(200).json({
        success: true,
        question
    });
});

// GET /api/quizzes/:quizId/questions - Get all questions in a quiz
export const getAllQuestions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Kiểm tra quizId
    if (!id) {
        return next(new ErrorHandler('Please provide a quiz ID', 400));
    }

    // Tìm quiz trong database
    const quiz = await Quiz.findById(id);
    if (!quiz) {
        return next(new ErrorHandler('Quiz not found', 404));
    }

    // Trả về tất cả câu hỏi trong quiz
    res.status(200).json({
        success: true,
        questions: quiz.questions
    });
});

// DELETE /api/quizzes/:quizId/questions/:questionId - Delete a specific question in a quiz
export const deleteQuestion = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id, questionId } = req.params;

    // Kiểm tra id và questionId
    if (!id || !questionId) {
        return next(new ErrorHandler('Please provide quiz ID and question ID', 400));
    }

    // Tìm quiz trong database
    const quiz = await Quiz.findById(id);
    if (!quiz) {
        return next(new ErrorHandler('Quiz not found', 404));
    }

    // Tìm câu hỏi trong quiz
    const question = quiz.questions.id(questionId);
    if (!question) {
        return next(new ErrorHandler('Question not found in the quiz', 404));
    }

    // Xóa câu hỏi
    quiz.questions.pull(questionId); // Xóa câu hỏi khỏi mảng questions
    await quiz.save(); // Lưu thay đổi vào database

    // Trả về kết quả
    res.status(200).json({
        success: true,
        message: 'Question deleted successfully'
    });
});

// POST /api/quizzes/:quizId/questions - Create a new question in a quiz
export const createQuestion = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { text, type, points, options, correctAnswer } = req.body;

    // Kiểm tra id
    if (!id) {
        return next(new ErrorHandler('Please provide a quiz ID', 400));
    }

    // Kiểm tra dữ liệu đầu vào
    if (!text || !type || !points || !correctAnswer) {
        return next(new ErrorHandler('Please provide all required fields', 400));
    }

    // Kiểm tra options nếu type là multiple-choice
    if (type === 'multiple-choice' && (!options || options.length === 0)) {
        return next(new ErrorHandler('Options are required for multiple-choice questions', 400));
    }

    // Tìm quiz trong database
    const quiz = await Quiz.findById(id);
    if (!quiz) {
        return next(new ErrorHandler('Quiz not found', 404));
    }

    // Tạo câu hỏi mới
    const newQuestion = {
        text,
        type,
        points,
        options: type === 'multiple-choice' ? options : undefined,
        correctAnswer
    };

    // Thêm câu hỏi vào quiz
    quiz.questions.push(newQuestion);
    await quiz.save(); // Lưu thay đổi vào database

    // Trả về kết quả
    res.status(201).json({
        success: true,
        message: 'Question created successfully',
        question: newQuestion
    });
});
