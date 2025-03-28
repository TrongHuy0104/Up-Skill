import express from 'express';
import userRoutes from '../routes/user.route';
import courseRoutes from '../routes/course.route';
import orderRoutes from '../routes/order.route';
import notificationRoutes from '../routes/notification.route';
import layoutRoutes from '../routes/layout.route';
import categoryRoutes from '../routes/category.route';
import levelRoutes from '../routes/level.route';
import quizRoutes from '../routes/quiz.route';
import progressRoutes from '../routes/progress.route';
import incomeRoutes from '../routes/income.route';
import cartRoutes from '../routes/cart.route';
import couponRoutes from '../routes/coupon.route';
import requestRoutes from '../routes/request.router';

const router = express.Router();

router.use('/user', userRoutes);

router.use('/courses', courseRoutes);

router.use('/orders', orderRoutes);

router.use('/notifications', notificationRoutes);

router.use('/layout', layoutRoutes);

router.use('/level', levelRoutes);

router.use('/category', categoryRoutes);

router.use('/quizzes', quizRoutes);

router.use('/progress', progressRoutes);

router.use('/income', incomeRoutes);

router.use('/request', requestRoutes);

router.use('/cart', cartRoutes);

router.use('/coupon', couponRoutes);

export default router;
