import cron from 'node-cron';
import OrderModel from '@/models/Order.model';
import IncomeModel from '@/models/Income.model';
import CourseModel from '@/models/Course.model';
import { redis } from '@/utils/redis';

const calculateDailyIncome = async () => {
    try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();

        console.log("Starting daily income calculation...");

        const orders = await OrderModel.find({
            'courseIds': { $exists: true, $ne: [] },
            createdAt: {
                $gte: new Date(currentYear, currentMonth - 1, currentDay, 0, 0, 0),
                $lt: new Date(currentYear, currentMonth - 1, currentDay + 1, 0, 0, 0)
            }
        }).populate('courseIds');

        const incomeData: { [key: string]: { income: number, purchased: number } } = {};

        for (const order of orders) {
            if (!order.courseIds || !Array.isArray(order.courseIds)) continue;

            for (const courseId of order.courseIds) {
                const course = await CourseModel.findById(courseId);
                if (!course || course.authorId.toString() !== order.userId.toString()) continue;

                const commissionRate = parseFloat(process.env.COMMISSION_RATE || '0.1');
                if (isNaN(commissionRate)) {
                    throw new Error('Invalid COMMISSION_RATE in environment variables');
                }

                const courseIncome = course.price * (1 - commissionRate);
                const authorId = course.authorId.toString();

                if (!incomeData[authorId]) {
                    incomeData[authorId] = { income: 0, purchased: 0 };
                }

                incomeData[authorId].income += courseIncome;
                incomeData[authorId].purchased += 1;
            }
        }

        for (const userId in incomeData) {
            const { income, purchased } = incomeData[userId];

            let incomeRecord = await IncomeModel.findOne({ userId });

            if (!incomeRecord) {
                incomeRecord = new IncomeModel({
                    userId,
                    totalIncome: income,
                    totalPurchased: purchased,
                    total: [{ day: currentDay, month: currentMonth, year: currentYear, income, purchased }]
                });
            } else {
                incomeRecord.totalIncome = incomeRecord.total.reduce((sum: any, entry: { income: any; }) => sum + entry.income, 0) + income;
                incomeRecord.totalPurchased = incomeRecord.total.reduce((sum: any, entry: { purchased: any; }) => sum + entry.purchased, 0) + purchased;

                const existingEntry = incomeRecord.total.find(
                    (entry: { day: number; month: number; year: number; }) => entry.day === currentDay && entry.month === currentMonth && entry.year === currentYear
                );
                if (existingEntry) {
                    existingEntry.income += income;
                    existingEntry.purchased += purchased;
                } else {
                    incomeRecord.total.push({ day: currentDay, month: currentMonth, year: currentYear, income, purchased });
                }
            }
            await incomeRecord.save();
            await redis.set(`income ${userId}`, JSON.stringify(incomeRecord));
        }
    } catch (error) {
        console.error('Error calculating daily income:', error);
    }
};

cron.schedule('0 0 * * *', calculateDailyIncome, {
    timezone: 'Asia/Ho_Chi_Minh'
});

export default calculateDailyIncome;
