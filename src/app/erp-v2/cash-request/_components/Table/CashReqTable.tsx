"use client";

import EditCashRequest from "../Modal/EditCashRequest";
import { RequisitionCash } from "@/api/cash-request/fetchCashRequest";

type Props = {
  data: RequisitionCash[];
  currentPage: number;
  rowsPerPage: number;
  handleDelete: (id: number) => void;
  handlePrev: () => void;
  handleNext: () => void;
};

const CashReqTable: React.FC<Props> = ({
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
      <div className="overflow-auto rounded-lg shadow-sm border border-gray-700 dark:bg-gray-dark">
        <table className="table table-xs w-full border-t rounded-lg shadow-lg">
          <thead className="bg-gray-700 text-white">
            <tr className="text-sm font-medium text-center uppercase">
              <th className="px-4 py-2">Serial #</th>
              <th className="px-4 py-2">Instruction</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Requested by</th>
              <th className="px-4 py-2">Date Requested</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-500 py-4">
                  No records found
                </td>
              </tr>
            ) : (
              paginatedData.map((user, index) => (
                <tr
                  key={user.id}
                  className={`transition-colors duration-300 ease-in-out ${
                    index % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-800"
                      : "bg-white dark:bg-gray-900"
                  } text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}
                >
                  <td className="text-xs text-center">{user.serial_no}</td>
                  <td className="text-xs text-center">
                    {user.special_instructions}
                  </td>
                  <td className="text-xs text-center">{user.grand_total}</td>
                  <td className="text-xs text-center">{user.requested_by}</td>
                  <td className="text-xs text-center">{user.date_requested}</td>
                  <td className="text-xs text-center">
                    <span
                      className={`${
                        user.status
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      } py-1 px-3 rounded-full`}
                    >
                      {user.status ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="text-xs flex gap-2 justify-center">
                    <EditCashRequest id={user.id} />
                    <button
                      className="flex items-center gap-1 border border-red-700 bg-white  text-red-700 px-3 py-1.5 rounded-md text-xs shadow transition duration-200 uppercase"
                      onClick={() => handleDelete(user.id)}
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

      <div className="flex justify-end items-center gap-1 mt-2 text-sm">
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

export default CashReqTable;
