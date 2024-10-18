import express from 'express'
import mongoose from 'mongoose'
import cors from "cors"
import axios from 'axios';
import Product from './models/Product.js';

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://localhost:27017/productsDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("Connected to Mongo DB") })
    .catch(err => console.log(err))

app.get("/api/initialize", async (req, res) => {
    try {
        const response = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json")
        const products = await response.data;
        await Product.deleteMany({});
        await Product.insertMany(products);
        // console.log(products)
        res.status(200).json({ message: "Products initialized successfully" })
    }
    catch (error) {
        console.error('Error fetching data from the third-party API:', error);
        res.status(500).send({ error: 'Failed to initialize database' });
    }
})

app.get('/api/transactions', async (req, res) => {
    const { title, description, price, page = 1, perPage = 10, month } = req.query;
    const filters = {};

    // Search filters based on title, description, price
    if (title) filters.title = { $regex: title, $options: 'i' }; // Case-insensitive regex search
    if (description) filters.description = { $regex: description, $options: 'i' };
    if (price) filters.price = Number(price);

    // Month filter (converts string month to date comparison)
    if (month) {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const monthIndex = monthNames.indexOf(month) + 1; // Get month index (1-based for MongoDB)
        if (monthIndex === 0) {
            return res.status(400).send('Invalid month');
        }

        // MongoDB date filtering using $expr to extract the month
        filters.$expr = {
            $eq: [{ $month: '$dateOfSale' }, monthIndex],
        };
    }

    // Pagination
    const skip = (page - 1) * perPage;

    try {
        // Query the database with filters and pagination
        const transactions = await Product.find(filters)
            .skip(skip)
            .limit(Number(perPage));

        // Get total count of filtered transactions
        const count = await Product.countDocuments(filters);

        res.json({ total: count, transactions });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching transactions');
    }
});

app.get('/api/statistics', async (req, res) => {
    const { month } = req.query;

    // Ensure a valid month is provided
    if (!month) {
        return res.status(400).send('Month is required');
    }

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthIndex = monthNames.indexOf(month) + 1; // Get month index (1-based for MongoDB)
    if (monthIndex === 0) {
        return res.status(400).send('Invalid month');
    }

    try {
        // Perform MongoDB aggregation to calculate statistics
        const stats = await Product.aggregate([
            {
                // Add a field 'isSold' to mark if the item was sold or not
                $addFields: {
                    isSold: { $cond: [{ $ifNull: ['$dateOfSale', false] }, true, false] }
                }
            },
            {
                // Filter only transactions for the selected month
                $match: {
                    $expr: {
                        $eq: [{ $month: '$dateOfSale' }, monthIndex]
                    }
                }
            },
            {
                // Group the results to calculate total sales, sold items, and unsold items
                $group: {
                    _id: null,
                    totalSaleAmount: { $sum: { $cond: [{ $ifNull: ['$dateOfSale', false] }, '$price', 0] } },
                    totalSoldItems: { $sum: { $cond: [{ $ifNull: ['$dateOfSale', false] }, 1, 0] } },
                    totalUnsoldItems: { $sum: { $cond: [{ $ifNull: ['$dateOfSale', false] }, 0, 1] } }
                }
            }
        ]);

        if (stats.length > 0) {
            const result = stats[0];
            res.json({
                totalSaleAmount: result.totalSaleAmount,
                totalSoldItems: result.totalSoldItems,
                totalUnsoldItems: result.totalUnsoldItems
            });
        } else {
            res.json({
                totalSaleAmount: 0,
                totalSoldItems: 0,
                totalUnsoldItems: 0
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching statistics');
    }
});


const priceRanges = [
    { label: '0-100', min: 0, max: 100 },
    { label: '101-200', min: 101, max: 200 },
    { label: '201-300', min: 201, max: 300 },
    { label: '301-400', min: 301, max: 400 },
    { label: '401-500', min: 401, max: 500 },
    { label: '501-600', min: 501, max: 600 },
    { label: '601-700', min: 601, max: 700 },
    { label: '701-800', min: 701, max: 800 },
    { label: '801-900', min: 801, max: 900 },
    { label: '901-above', min: 901, max: Infinity }
];


app.get('/api/bar-chart', async (req, res) => {
    try {
        const { month } = req.query;

        // Check if month is provided
        if (!month) {
            return res.status(400).json({ error: 'Month is required' });
        }

        // Convert month string (e.g., 'January') to a number (e.g., 1)
        const monthNumber = new Date(`${month} 01, 2000`).getMonth() + 1;

        // Use aggregation pipeline to filter by month and group by price range
        const items = await Product.aggregate([
            {
                $match: {
                    $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] } // Filter by the month
                }
            }
        ]);

        // Group items by price range
        const result = priceRanges.map(range => ({
            range: range.label,
            count: items.filter(item => item.price >= range.min && item.price <= range.max).length
        }));

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/pie-chart', async (req, res) => {
    try {
        const { month } = req.query;

        // Check if month is provided
        if (!month) {
            return res.status(400).json({ error: 'Month is required' });
        }

        // Convert month string (e.g., 'January') to a number (e.g., 1)
        const monthNumber = new Date(`${month} 01, 2000`).getMonth() + 1;

        // Use aggregation pipeline to filter by month and group by category
        const items = await Product.aggregate([
            {
                $match: {
                    $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] }  // Filter by the month
                }
            },
            {
                $group: {
                    _id: "$category",  // Group by category
                    count: { $sum: 1 }  // Count the number of items in each category
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",  // Rename _id field to category
                    count: 1
                }
            }
        ]);

        res.json(items);  // Return the result as a JSON response
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/combined-data', async (req, res) => {
    try {
        const { month } = req.query;

        // Check if the month is provided
        if (!month) {
            return res.status(400).json({ error: 'Month is required' });
        }

        // URLs for the three APIs
        const statisticsUrl = `http://localhost:3001/api/statistics?month=${month}`;
        const barChartUrl = `http://localhost:3001/api/bar-chart?month=${month}`;
        const pieChartUrl = `http://localhost:3001/api/pie-chart?month=${month}`;

        // Use Promise.all to fetch data concurrently from the three APIs
        const [statisticsResponse, barChartResponse, pieChartResponse] = await Promise.all([
            axios.get(statisticsUrl),
            axios.get(barChartUrl),
            axios.get(pieChartUrl)
        ]);

        // Combine the responses
        const combinedData = {
            statistics: statisticsResponse.data,
            barChart: barChartResponse.data,
            pieChart: pieChartResponse.data
        };

        // Send the combined JSON data as the final response
        res.json(combinedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3001, () => {
    console.log(`Sever is Running on port ${3001}`);
})

