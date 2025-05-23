import React from "react";

const LoadingId = () => {
  return (
    <div className="flex justify-center items-center space-x-2">
      {/* Spinner */}
      <div className="w-6 h-6 border-4 border-dashed border-gray-400 border-t-transparent rounded-full animate-spin dark:border-gray-200 dark:border-t-transparent"></div>

      <span className="text-sm text-gray-700 dark:text-gray-300">
        Loading...
      </span>
    </div>
  );
};

export default LoadingId;
