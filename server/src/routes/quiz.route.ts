import express from 'express';
import { getQuizbyId } from '@/controllers/quiz.controller';

const router = express.Router();

router.get('/:id', getQuizbyId);

export default router;
