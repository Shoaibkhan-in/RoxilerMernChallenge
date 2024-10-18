import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'; // Backend URL

// Fetch transactions with pagination and search
export const fetchTransactions = async (month, page = 1, search = '') => {
    const response = await axios.get(`${API_BASE_URL}/transactions`, {
        params: { month, page, search }
    });
    return response.data;
};

// Fetch statistics (total sales, sold, and unsold items)
export const fetchStatistics = async (month) => {
    const response = await axios.get(`${API_BASE_URL}/statistics`, {
        params: { month }
    });
    return response.data;
};

// Fetch bar chart data (price ranges)
export const fetchBarChartData = async (month) => {
    const response = await axios.get(`${API_BASE_URL}/bar-chart`, {
        params: { month }
    });
    return response.data;
};

// Fetch pie chart data (categories and counts)
export const fetchPieChartData = async (month) => {
    const response = await axios.get(`${API_BASE_URL}/pie-chart`, {
        params: { month }
    });
    return response.data;
};
