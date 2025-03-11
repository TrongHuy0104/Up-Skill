// utils/cronJobs.ts
import cron from 'node-cron';
import OrderModel from '@/models/Order.model';
import IncomeModel from '@/models/Income.model';
import CourseModel from '@/models/Course.model';
import { redis } from '@/utils/redis';

const calculateDailyIncome = async () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    const orders = await OrderModel.find({
        'courseIds': { $exists: true, $ne: [] },
        createdAt: {
            $gte: new Date(currentYear, currentMonth - 1, currentDay, 0, 0, 0),
            $lt: new Date(currentYear, currentMonth - 1, currentDay + 1, 0, 0, 0)
        }
    }).populate('courseIds');

    const incomeData: { [key: string]: { income: number, purchased: number } } = {};

    for (const order of orders) {
        for (const courseId of order.courseIds) {
            const course = await CourseModel.findById(courseId);
            if (course && course.authorId.toString() === order.userId.toString()) {
                const commissionRate = parseFloat(process.env.COMMISSION_RATE || '0.1');
                const courseIncome = course.price * (1 - commissionRate);
                if (!incomeData[course.authorId.toString()]) {
                    incomeData[course.authorId.toString()] = { income: 0, purchased: 0 };
                }
                incomeData[course.authorId.toString()].income += courseIncome;
                incomeData[course.authorId.toString()].purchased += 1;
            }
        }
    }

    for (const userId in incomeData) {
        const { income, purchased } = incomeData[userId];

        // Kiểm tra xem đã có dữ liệu thu nhập cho ngày này chưa
        let incomeRecord = await IncomeModel.findOne({ userId, 'total.day': currentDay, 'total.month': currentMonth, 'total.year': currentYear });

        if (incomeRecord) {
            // Cập nhật dữ liệu thu nhập
            incomeRecord.totalIncome += income;
            incomeRecord.totalPurchased += purchased;
            incomeRecord.total = incomeRecord.total.map((item: { day: number; month: number; year: number; income: number; purchased: number; }) => {
                if (item.day === currentDay && item.month === currentMonth && item.year === currentYear) {
                    return { ...item, income: item.income + income, purchased: item.purchased + purchased };
                }
                return item;
            });
        } else {
            // Tạo mới dữ liệu thu nhập
            incomeRecord = new IncomeModel({
                userId,
                totalIncome: income,
                totalPurchased: purchased,
                total: [{ day: currentDay, month: currentMonth, year: currentYear, income, purchased }]
            });
        }

        await incomeRecord.save();
        await redis.set(`income ${userId}`, JSON.stringify(incomeRecord));
    }
};

// Cập nhật thu nhập hàng ngày vào 00:00 mỗi ngày
cron.schedule('0 0 * * *', calculateDailyIncome, {
    timezone: 'Asia/Ho_Chi_Minh'
});

export default calculateDailyIncome;
