import express from 'express';
import userRoutes from '@/routes/user.route';
import courseRoutes from '@/routes/course.route';
import orderRoutes from '@/routes/order.route';
import notificationRoutes from '@/routes/notification.route';
import layoutRoutes from '@/routes/layout.route';
import categoryRoutes from '@/routes/category.route';
import levelRoutes from '@/routes/level.route';
import incomeRoutes from '@/routes/income.route';

const router = express.Router();

router.use('/user', userRoutes);

router.use('/courses', courseRoutes);

router.use('/orders', orderRoutes);

router.use('/notifications', notificationRoutes);

router.use('/layout', layoutRoutes);

router.use('/level', levelRoutes);

router.use('/category', categoryRoutes);

router.use('/income', incomeRoutes);

export default router;
