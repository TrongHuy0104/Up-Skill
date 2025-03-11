import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import axios from 'axios';

// interface IncomeData {
//   userId: string;
//   totalIncome: number;
//   totalPurchased: number;
//   total: number[];
// }

interface IncomeChartProps {
  userId: string;
}

const IncomeChart: React.FC<IncomeChartProps> = ({ userId }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/orders/income/${userId}`);
        const { data } = response;
        createChart(data.total);
      } catch (error) {
        console.error('Error fetching income data:', error);
      }
    };

    fetchIncomeData();
  }, [userId]);

  const createChart = (data: number[]) => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        const config: ChartConfiguration = {
          type: 'line',
          data: {
            labels: [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec'
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

        new Chart(ctx, config);
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
