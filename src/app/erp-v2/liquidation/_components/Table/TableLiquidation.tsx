"use client";

import { Liquidations } from "@/api/liquidations/fetchLiq";
import ViewLiquidation from "../Modal/ViewLiquidation";

type Props = {
  data: Liquidations[];
  currentPage: number;
  rowsPerPage: number;
  handleDelete: (id: number) => void;
  handlePrev: () => void;
  handleNext: () => void;
};

const TableLiquidation: React.FC<Props> = ({
  data,
  currentPage,
  rowsPerPage,
  handleDelete,
  handlePrev,
  handleNext,
}) => {
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
      <div className="overflow-auto rounded-lg shadow-sm border border-gray-700">
        <table className="min-w-full bg-white table-zebra text-sm text-left">
          <thead className="bg-gray-700 text-white uppercase font-bold">
            <tr>
              <th className="py-2 px-4 text-end text-sm">LIQ</th>
              <th className="py-2 px-4 text-center text-sm">Project Name</th>
              <th className="py-2 px-4 text-center text-sm">Date</th>
              <th className="py-2 px-4 text-center text-sm">Remitted By</th>
              <th className="py-2 px-4 text-center text-sm">Total</th>
              <th className="py-2 px-4 text-center text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-4 text-gray-500 dark:bg-gray-dark dark:text-white"
                >
                  No records found
                </td>
              </tr>
            ) : (
              paginatedData.map((user, index) => (
                <tr
                  key={user.id}
                  className={`transition-colors duration-300 ease-in-out
                    ${
                      index % 2 === 0
                        ? "dark:bg-gray-800"
                        : "bg-white dark:bg-gray-900"
                    }
                    text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}
                >
                  <td className="text-xs text-end">{user.liquidation_no}</td>
                  <td className="text-xs text-center">{user.project_name}</td>
                  <td className="text-xs text-center">{user.date}</td>
                  <td className="text-xs text-center">{user.remitted_by}</td>
                  <td className="text-xs text-center">{user.total}</td>
                  <td className="text-xs flex gap-2 justify-center py-1 px-4">
                    <ViewLiquidation id={user.id} />
                    <button
                      onClick={() =>
                        confirm(
                          "Are you sure you want to delete this cash request?"
                        ) && handleDelete(user.id)
                      }
                      className="flex items-center gap-1 border border-red-700 bg-white  text-red-700 px-3 py-1.5 rounded-md text-xs shadow transition duration-200 uppercase"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center gap-3 mt-6 text-sm">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:bg-gray-500 hover:bg-maroon-800 transition"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:bg-gray-500 hover:bg-maroon-800 transition"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default TableLiquidation;
