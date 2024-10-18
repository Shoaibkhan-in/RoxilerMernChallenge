import React from 'react';

const StatisticsBox = ({ statistics }) => {
    return (
        <div className="statistics-box">
            <h2 className="flex flex-row flex-nowrap items-center mt-24">
                <span className="flex-grow block border-t border-black"></span>
                <span className="flex-none block mx-4 px-4 py-2.5 text-xl rounded leading-none font-medium bg-black text-white">
                    Transaction Details
                </span>
                <span className="flex-grow block border-t border-black"></span>
            </h2>

            <h1 className="mb-4 mt-2 text-xl font-extrabold text-gray-900 md:text-2xl lg:text-3xl"> Total Sales Amount : <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">{statistics.totalSaleAmount}</span></h1>
            <h1 className="mb-4 text-xl font-extrabold text-gray-900 md:text-2xl lg:text-3xl"> Total Sold Items : <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">{statistics.totalSoldItems}</span></h1>
            <h1 className="mb-4 text-xl font-extrabold text-gray-900 md:text-2xl lg:text-3xl"> Total UnSold Items : <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">{statistics.totalUnsoldItems}</span></h1>
            
        </div>
    );
};

export default StatisticsBox;
