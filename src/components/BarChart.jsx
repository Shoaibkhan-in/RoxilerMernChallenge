import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ barData }) => {
    const data = {
        labels: barData.map(item => item.range),
        datasets: [
            {
                label: 'Number of Items',
                data: barData.map(item => item.count),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }
        ]
    };

    return (
        <div>
            <h1 className="mb-4 mt-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl "><mark className="px-2 text-white bg-blue-600 rounded dark:bg-blue-500">BarChart</mark> Price Details</h1>
            <Bar data={data} />
        </div>
    );
};

export default BarChart;
