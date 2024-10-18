import React from 'react';
import "../index.css"
const TransactionsTable = ({ transactions, page, setPage }) => {
    return (
        <div className='text-white min-h-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]'>
            <div className="flex h-12 w-full items-center justify-center bg-black">
                <span className="absolute py-4 flex border w-fit bg-gradient-to-r blur-xl from-blue-500 via-teal-500 to-pink-500 bg-clip-text text-3xl box-content font-extrabold text-transparent text-center select-none">
                    Transaction Table
                </span>
                <h1
                    className="relative top-0 w-fit h-10 py-4 justify-center flex bg-gradient-to-r items-center from-blue-500 via-teal-500 to-pink-500 bg-clip-text text-xl font-extrabold text-transparent text-center select-auto">
                    Transaction table
                </h1>
            </div>
            <table className='border-2'>
                <thead>
                    <tr className=''>
                        <th className='border-2'>Title</th>
                        <th className='border-2'>Description</th>
                        <th className='border-2'>Price</th>
                        <th className='border-2'>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction._id} className='border-2'>
                            <td className='border-2'>{transaction.title}</td>
                            <td className='border-2'>{transaction.description}</td>
                            <td className='border-2'>{transaction.price}</td>
                            <td className='border-2'>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => setPage(page - 1)} disabled={page === 1} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded border-2 border-black'>
                Previous
            </button>
            <button onClick={() => setPage(page + 1)} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                Next
            </button>
        </div>
    );
};

export default TransactionsTable;
