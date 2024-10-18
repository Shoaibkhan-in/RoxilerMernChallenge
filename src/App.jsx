import React, { useEffect, useState } from 'react';
import TransactionsTable from './components/TransactionsTable.jsx';
import StatisticsBox from './components/StatisticsBox.jsx';
import BarChart from './components/BarChart.jsx';
import PieChart from './components/PieChart.jsx';
import { fetchTransactions, fetchStatistics, fetchBarChartData, fetchPieChartData } from './services/api.js';
import "./index.css"

function App() {
  const [month, setMonth] = useState('March'); // Default to March
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [page, setPage] = useState(1);

  // Fetch transactions when month, search or page changes
  useEffect(() => {
    const loadTransactions = async () => {
      const data = await fetchTransactions(month, page, search);
      setTransactions(data.transactions);
    };
    loadTransactions();
  }, [month, search, page]);

  // Fetch statistics when month changes
  useEffect(() => {
    const loadStatistics = async () => {
      const data = await fetchStatistics(month);
      setStatistics(data);
    };
    loadStatistics();
  }, [month]);

  // Fetch bar chart data when month changes
  useEffect(() => {
    const loadBarChartData = async () => {
      const data = await fetchBarChartData(month);
      setBarChartData(data);
    };
    loadBarChartData();
  }, [month]);

  // Fetch pie chart data when month changes
  useEffect(() => {
    const loadPieChartData = async () => {
      const data = await fetchPieChartData(month);
      setPieChartData(data);
    };
    loadPieChartData();
  }, [month]);

  return (
    <div className="">
      <h2 className="flex flex-row flex-nowrap items-center mt-4">
        <span className="flex-grow block border-t border-black"></span>
        <span className="flex-none block mx-4 px-4 py-2.5 text-xl rounded leading-none font-medium bg-black text-white">
          Transaction Dashboard
        </span>
        <span className="flex-grow block border-t border-black"></span>
      </h2>
      {/* Month Dropdown */}


      <form className="max-w-sm ml-4">
        <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
        <select id="countries" value={month} onChange={e => setMonth(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option value="January">January</option>
        <option value="February">February</option>
        <option value="March" selected>March</option>
        <option value="April">April</option>
        <option value="May">May</option>
        <option value="June">June</option>
        <option value="July">July</option>
        <option value="August">August</option>
        <option value="September">September</option>
        <option value="October">October</option>
        <option value="November">November</option>
        <option value="December">December</option>
        </select>
      </form>

      {/* Search Input */}


      <form>
        <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <div className='flex justify-start items-center'>
          <input type="search" id="search" onChange={e => setSearch(e.target.value)} value={search} className="block w-[30vw] p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 p-4 m-2" placeholder="Search" required />
          <button type="submit" className="text-white bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
          </div>
        </div>
      </form>


      {/* Transactions Table */}
      <TransactionsTable
        transactions={transactions}
        page={page}
        setPage={setPage}
      />

      {/* Statistics Box */}
      {statistics && <StatisticsBox statistics={statistics} />}

      {/* Bar Chart */}
      {barChartData && <BarChart barData={barChartData} />}

      {/* Pie Chart */}
      {pieChartData && <PieChart pieData={pieChartData} />}
    </div>
  );
}

export default App;
