'use client';

import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { useLoadUserQuery } from '@/lib/redux/features/api/apiSlice';
import React, { useMemo } from 'react';
import IncomeChart from '../_components/IncomeChart';
import Image from 'next/image';
import { useGetInstructorIncomeQuery } from '@/lib/redux/features/income/incomeApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { formatCurrency } from '@/utils/helpers';
import { Badge } from '@/components/ui/Badge';
import CreateRequestForm from './_components/CreateRequestForm';
import { format } from 'date-fns';
// import PaginationComponent from '@/components/custom/PaginationComponent';

type IncomeStats = {
    totalIncome: number;
    withdraw: number;
    remain: number;
};

const STATS_CONFIG: Array<{
    title: string;
    key: keyof IncomeStats;
    icon: string;
}> = [
    { title: 'Total Income', key: 'totalIncome', icon: '/assets/icons/total-course.svg' },
    { title: 'Withdraw', key: 'withdraw', icon: '/assets/icons/published-course.svg' },
    { title: 'Remain', key: 'remain', icon: '/assets/icons/pending-course.svg' }
];

export default function Page() {
    const { data: userData, isLoading: isLoadingUser } = useLoadUserQuery(undefined);

    const userId = userData?.user?._id;
    const {
        data: incomeData,
        isLoading: isLoadingIncomeData,
        refetch
    } = useGetInstructorIncomeQuery(userId ?? skipToken);

    const incomeStats = useMemo(() => {
        if (isLoadingUser || isLoadingIncomeData || !incomeData) return null;

        const { incomeData: income } = incomeData;

        return {
            totalIncome: income.totalIncome,
            withdraw: income.totalWithdraw,
            remain: income.totalIncome - income.totalWithdraw
        };
    }, [isLoadingUser, isLoadingIncomeData, incomeData]);

    if (isLoadingUser || isLoadingIncomeData || !incomeStats) {
        return <DashboardSkeleton />;
    }

    const requests = incomeData.incomeData?.requests || [];

    return (
        <div className="container mx-auto pl-10">
            {/* Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {STATS_CONFIG.map((stat) => (
                    <StatCard key={stat.title} title={stat.title} value={incomeStats[stat.key] || 0} icon={stat.icon} />
                ))}
            </div>

            {/* Income Chart Section */}
            <div className="container bg-primary-50 rounded-lg p-[34px] border border-primary-100 mb-8">
                <h1 className="text-[22px] text-primary-800 font-medium">Total Income</h1>
                {userId && <IncomeChart userId={userId} />}
            </div>

            <div className="bg-primary-50 rounded-lg p-[34px] border border-primary-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[22px] text-primary-800 font-medium">Best Selling Courses</h2>
                    <CreateRequestForm userId={userId} remain={incomeStats.remain} refetch={refetch} />
                </div>

                <RequestIncomeTable requests={requests} />
            </div>
        </div>
    );
}

const RequestIncomeTable = ({ requests }: { requests: any[] }) => (
    <div className="overflow-x-auto">
        <table className="w-full">
            <thead>
                <tr className="text-left text-[15px] text-primary-800 bg-accent-100">
                    <th className="py-[26px] w-1/5 font-medium px-8">No.</th>
                    <th className="px-[30px] w-2/5 py-[26px] rounded-l-lg font-medium">Date</th>
                    <th className="py-[26px] w-1/5 font-medium pl-10 pr-6 text-center">Amount</th>
                    <th className="py-[26px] w-1/5 font-medium px-12 text-center">Status</th>
                </tr>
            </thead>

            <tbody>
                {requests.map((request, index) => (
                    <RequestRow key={request._id} request={request} index={index} />
                ))}
            </tbody>
        </table>
        {requests.length === 0 && <p className="text-center py-8 w-full relative font-medium">No request</p>}
    </div>
);

const RequestRow = ({ request, index }: { request: any; index: number }) => (
    <tr className="border-b border-primary-100">
        <td className="text-[15px] text-primary-800 font-medium py-[26px] px-8">{index + 1}</td>
        <td className="py-[26px] px-8">
            <div className="flex items-center">
                <div className="relative">
                    <span className="truncate w-[400px] text-[15px] text-primary-800 font-medium">
                        {format(new Date(request.createdAt), 'MM/dd/yyyy hh:mm:ss a')}
                    </span>
                </div>
            </div>
        </td>
        <td className="text-[15px] text-primary-800 font-medium py-[26px] px-8 text-center">
            {formatCurrency(request.amount)}
        </td>
        <td className="text-[15px] text-primary-800 font-medium py-[26px] px-8 text-center">
            <Badge
                className={`bg-slate-500 text-primary-50 ${request.status === 0 ? 'bg-accent-600' : request.status === -1 ? 'bg-red-500' : 'bg-green-500'}`}
            >
                {request.status === 1 && 'Finished'}
                {request.status === 0 && 'Pending'}
                {request.status === -1 && 'Reject'}
            </Badge>
        </td>
    </tr>
);

const StatCard = ({ title, value, icon }: { title: string; value: number; icon: string }) => (
    <div className="whitespace-nowrap w-[320px] h-[150px] bg-primary-50 rounded-lg p-9 flex items-center space-x-6 border border-primary-100">
        <div className="bg-accent-100 p-5 rounded-full">
            <Image src={icon} alt={title} width={30} height={30} unoptimized />
        </div>
        <div>
            <p className="text-primary-800 text-base">{title}</p>
            <p className="text-[26px] text-accent-900 font-semibold">{formatCurrency(value)}</p>
        </div>
    </div>
);
