import express from 'express';
import userRoutes from '@/routes/user.route';
import courseRoutes from '@/routes/course.route';
import orderRoutes from '@/routes/order.route';
import notificationRoutes from '@/routes/notification.route';
import layoutRoutes from '@/routes/layout.route';

const router = express.Router();

router.use('/user', userRoutes);

router.use('/courses', courseRoutes);

router.use('/orders', orderRoutes);

router.use('/notifications', notificationRoutes);

router.use('/layout', layoutRoutes);

export default router;
