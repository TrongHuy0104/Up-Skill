import express from 'express';
import {
    createRequest,
    getPendingRequests,
    getRequestsByCourseId,
    handleRequestApproval
} from '@/controllers/request.controller';
import { isAuthenticated } from '@/middlewares/auth/isAuthenticated';
import { authorizeRoles } from '@/middlewares/auth/authorizeRoles';
import { updateAccessToken } from '@/controllers/user.controller';

const router = express.Router();

router.post('/create-request', updateAccessToken, isAuthenticated, authorizeRoles('instructor'), createRequest);

router.get('/get-request/:courseId', isAuthenticated, authorizeRoles('instructor'), getRequestsByCourseId);

router.get('/get-request-pending/', updateAccessToken, isAuthenticated, authorizeRoles('admin'), getPendingRequests);

router.put(
    '/handle-request/:requestId',
    updateAccessToken,
    isAuthenticated,
    authorizeRoles('admin'),
    handleRequestApproval
);

export = router;
