import express from 'express';
import { isAuthenticated } from '@/middlewares/auth/isAuthenticated';
import { authorizeRoles } from '@/middlewares/auth/authorizeRoles';
import { createRequest } from '@/controllers/request.controller';

const router = express.Router();

router.post('/create-request', isAuthenticated, authorizeRoles('instructor'), createRequest);

export = router;
