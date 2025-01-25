import express from 'express';
import { isAuthenticated } from '@/middlewares/auth/isAuthenticated';
import { authorizeRoles } from '@/middlewares/auth/authorizeRoles';
import { createOrder, getAllOrders } from '@/controllers/order.controller';

const router = express.Router();

router.post('/create-order', isAuthenticated, createOrder);

router.get('/get-orders', isAuthenticated, authorizeRoles('admin'), getAllOrders);

export = router;
