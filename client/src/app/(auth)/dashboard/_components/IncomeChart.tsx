import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import axios from 'axios';

interface IncomeChartProps {
    userId: string;
}

const IncomeChart: React.FC<IncomeChartProps> = ({ userId }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        const fetchIncomeData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/income/${userId}`, {
                    withCredentials: true
                });
                const { data } = response;

                if (!data?.incomeData?.total || !Array.isArray(data.incomeData.total)) {
                    console.error('Invalid API response:', data);
                    return;
                }

                const monthlyIncome: number[] = data.incomeData.total;

                createChart(monthlyIncome);
            } catch (error) {
                console.error('Error fetching income data:', error);
            }
        };

        fetchIncomeData();

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [userId]);

    const createChart = (data: number[]) => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                const config: ChartConfiguration = {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        datasets: [
                            {
                                label: 'Monthly Income ($)',
                                data,
                                backgroundColor: 'rgba(49, 130, 206, 0.3)',
                                borderColor: '#3182ce',
                                borderWidth: 2,
                                fill: true,
                                tension: 0.4
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                };

                chartInstance.current = new Chart(ctx, config);
            }
        }
    };

    return (
        <div className="relative h-[400px] w-full">
            <canvas ref={chartRef} />
        </div>
    );
};

export default IncomeChart;
