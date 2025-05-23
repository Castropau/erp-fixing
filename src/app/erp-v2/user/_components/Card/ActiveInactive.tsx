import React from "react";

const ActiveInactive = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-1">
      <div className="dark:bg-gray-900 bg-blue-50 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
        <h4 className="text-lg font-medium text-blue-600">Active Users</h4>
        <p className="text-4xl font-bold text-blue-700">123</p>
      </div>

      <div className="dark:bg-gray-900 bg-red-50 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
        <h4 className="text-lg font-medium text-red-600">Inactive Users</h4>
        <p className="text-4xl font-bold text-red-700">123</p>
      </div>
    </div>
  );
};

export default ActiveInactive;
