import express from 'express';
import { getUserIncome } from '@/controllers/income.controller';
import { isAuthenticated } from '@/middlewares/auth/isAuthenticated';
import { authorizeRoles } from '@/middlewares/auth/authorizeRoles';

const router = express.Router();

router.get('/:userId', isAuthenticated, authorizeRoles('instructor'), getUserIncome);

export = router;
