import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center ">
      <table className="table table-xs table-zebra w-full">
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <td className="text-xs">
                <div className="skeleton w-16 h-4 bg-gray-300 rounded"></div>
              </td>
              <td className="text-xs">
                <div className="skeleton w-24 h-4 bg-gray-300 rounded"></div>
              </td>
              <td className="text-xs">
                <div className="skeleton w-20 h-4 bg-gray-300 rounded"></div>
              </td>
              <td className="text-xs">
                <div className="skeleton w-24 h-4 bg-gray-300 rounded"></div>
              </td>
              <td className="text-xs">
                <div className="skeleton w-20 h-4 bg-gray-300 rounded"></div>
              </td>
              <td className="text-xs">
                <div className="skeleton w-16 h-4 bg-gray-300 rounded"></div>
              </td>
              <td className="text-xs">
                <div className="skeleton w-24 h-4 bg-gray-300 rounded"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Loading;
