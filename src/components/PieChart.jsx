import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

// Register the components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ pieData }) => {
    const data = {
        labels: pieData.map(item => item.category),
        datasets: [
            {
                data: pieData.map(item => item.count),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            }
        ]
    };

    return (
        <div>
            <h1 className="mb-4 mt-8 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl "><mark className="px-2 text-white bg-blue-600 rounded dark:bg-blue-500">PieChar</mark> Category Chart</h1>
            <Pie data={data} />
        </div>
    );
};

export default PieChart;
