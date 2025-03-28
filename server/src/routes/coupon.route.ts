import express from 'express';
import {
    createCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon,
    validateCoupon
} from '../controllers/coupon.controller';
import { isAuthenticated } from '../middlewares/auth/isAuthenticated';
import { authorizeRoles } from '../middlewares/auth/authorizeRoles';
import { updateAccessToken } from '../controllers/user.controller';

const router = express.Router();

// Admin routes
router.post('/create', updateAccessToken, isAuthenticated, authorizeRoles('admin'), createCoupon);
router.get('/all', updateAccessToken, isAuthenticated, authorizeRoles('admin'), getAllCoupons);
router.put('/:id', updateAccessToken, isAuthenticated, authorizeRoles('admin'), updateCoupon);
router.delete('/:id', updateAccessToken, isAuthenticated, authorizeRoles('admin'), deleteCoupon);

// User route
router.post('/validate', updateAccessToken, isAuthenticated, validateCoupon);

export default router;
