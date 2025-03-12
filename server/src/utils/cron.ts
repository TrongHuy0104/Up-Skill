import cron from 'node-cron';
import IncomeModel from '@/models/Income.model';
import OrderModel from '@/models/Order.model';

const updateDailyIncome = async () => {
    const orders = await OrderModel.find({}).populate({
        path: 'courseIds',
        select: 'authorId price purchased createdAt'
    });

    const incomeMap = new Map();

    orders.forEach((order) => {
        order.courseIds.forEach((course: any) => {
            const month = new Date(order.createdAt).getMonth();
            const userId = course.authorId.toString();
            const income = course.price * course.purchased * 0.9;

            if (!incomeMap.has(userId)) {
                incomeMap.set(userId, { totalIncome: 0, totalPurchased: 0, monthlyIncome: Array(12).fill(0) });
            }

            const userIncome = incomeMap.get(userId);
            userIncome.totalIncome += income;
            userIncome.totalPurchased += course.purchased;
            userIncome.monthlyIncome[month] += income;
        });
    });

    for (const [userId, data] of incomeMap) {
        await IncomeModel.findOneAndUpdate(
            { userId },
            {
                totalIncome: data.totalIncome,
                totalPurchased: data.totalPurchased,
                total: data.monthlyIncome
            },
            { new: true, upsert: true }
        );
    }
};

// Run cron job everyday at 12:00 AM
cron.schedule('0 0 * * *', updateDailyIncome);

export default updateDailyIncome;
