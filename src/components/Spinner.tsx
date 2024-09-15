
import React from 'react';

const Spinner: React.FC = () => {
    return (
        <div className="flex justify-center items-center h-[100vh] w-[100vw] gap-7">
            <span>Loading Data.....</span>
            <div className="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );
};

export default Spinner;
