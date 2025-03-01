import express from 'express';
import {
    createQuestion,
    deleteQuestion,
    getAllQuestions,
    getQuestionById,
    getQuizbyId,
    updateQuestionInQuiz
} from '@/controllers/quiz.controller';

const router = express.Router();

router.get('/:id', getQuizbyId);

router.get('/:id/questions/:questionId', getQuestionById);

router.get('/:id/questions', getAllQuestions);

router.post('/:id/questions', createQuestion);

router.put('/:id/questions/:questionId', updateQuestionInQuiz);

router.delete('/:id/questions/:questionId', deleteQuestion);

export default router;
