import express from 'express';
import { updateLessonCompletionStatus, getProgressData } from '@/controllers/progress.controller';
import { isAuthenticated } from '@/middlewares/auth/isAuthenticated';
import { updateAccessToken } from '@/controllers/user.controller';
const router = express.Router();

// Update lesson completion status via Progress model
router.put('/update-lesson-completion/:id', updateAccessToken, isAuthenticated, updateLessonCompletionStatus);

// Get progress data
router.get('/:id', updateAccessToken, isAuthenticated, getProgressData);

export default router;
