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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/orders/income/${userId}`, {
          withCredentials: true
        });
        const { data } = response;
        const monthlyIncome = new Array(12).fill(0);
        data.income.total.forEach((entry: any) => {
          const monthIndex = entry.month - 1;
          monthlyIncome[monthIndex] += entry.income;
        });

        createChart(monthlyIncome);
      } catch (error) {
        console.error('Error:', error);
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
            labels: [
              'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ],
            datasets: [
              {
                label: 'Income',
                data,
                backgroundColor: '#3182ce',
                borderColor: '#3182ce',
                fill: false
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
    <div className="relative h-[400px]">
      <canvas ref={chartRef} />
    </div>
  );
};

export default IncomeChart;
