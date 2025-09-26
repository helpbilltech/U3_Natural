import React from 'react';
// You need to install chart.js and react-chartjs-2
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function AnalyticsChart({ data }: any) {
  const chartData = {
    labels: data.map((p: any) => p.name),
    datasets: [
      {
        label: 'Units Sold',
        data: data.map((p: any) => p.sold),
        backgroundColor: 'rgba(34,197,94,0.7)',
      }
    ]
  };
  return <div className="mt-8 bg-white p-6 rounded shadow">
    <Bar data={chartData} />
  </div>;
}