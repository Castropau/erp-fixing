import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="p-4 flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        {/* Loading Spinner */}
        <div className="dark:border-gray-200 dark:border-t-white w-16 h-16 border-4 border-t-4 border-gray-800 border-dashed rounded-full animate-spin"></div>

        <span className="text-lg text-gray-700 dark:text-white">
          Please wait...
        </span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
