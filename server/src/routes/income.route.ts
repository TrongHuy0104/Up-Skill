import express from 'express';
import {
    createWithdrawRequest,
    getAllWithdrawRequestsByAdmin,
    getUserIncome,
    rejectWithdrawRequest,
    newPayment,
    createTransaction
} from '../controllers/income.controller';
import { isAuthenticated } from '../middlewares/auth/isAuthenticated';
import { authorizeRoles } from '../middlewares/auth/authorizeRoles';
import { updateAccessToken } from '../controllers/user.controller';

const router = express.Router();

router.post(
    '/create-withdraw-request',
    updateAccessToken,
    isAuthenticated,
    authorizeRoles('instructor'),
    createWithdrawRequest
);

router.get('/:userId', updateAccessToken, isAuthenticated, authorizeRoles('instructor'), getUserIncome);

router.get('/withdraw/all', updateAccessToken, isAuthenticated, authorizeRoles('admin'), getAllWithdrawRequestsByAdmin);

router.put('/withdraw/reject', updateAccessToken, isAuthenticated, authorizeRoles('admin'), rejectWithdrawRequest);

router.put('/withdraw/transfer', updateAccessToken, isAuthenticated, authorizeRoles('admin'), newPayment);

router.put('/withdraw/approve', updateAccessToken, isAuthenticated, authorizeRoles('admin'), createTransaction);

export = router;
