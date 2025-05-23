"use client";

import { Quatations } from "@/api/quotation/fetchQuo";
import View from "../Modal/View";

type Props = {
  data: Quatations[];
  totalPages: number;
  currentPage: number;
  handleDelete: (id: number) => void;
  handlePrev: () => void;
  handleNext: () => void;
};

const TableQuotation: React.FC<Props> = ({
  data,
  totalPages,
  currentPage,
  handleDelete,
  handlePrev,
  handleNext,
}) => {
  return (
    <>
      <div className="overflow-auto rounded-lg shadow-sm border border-gray-700">
        <table className="table table-xs w-full border-t rounded-lg shadow-lg bg-white text-sm">
          <thead className="bg-gray-700 text-white">
            <tr className="text-white-600 text-sm uppercase">
              <th className="py-2 px-4 text-center">Quotation</th>
              <th className="py-2 px-4 text-center">Project</th>
              <th className="py-2 px-4 text-center">To</th>
              <th className="py-2 px-4 text-center">Created by</th>
              <th className="py-2 px-4 text-center">Date created</th>
              <th className="py-2 px-4 text-center">Status</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No records found
                </td>
              </tr>
            ) : (
              data.map((user, index) => (
                <tr
                  key={user.id}
                  className={`transition-colors duration-300 ${
                    index % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-800"
                      : "bg-white dark:bg-gray-900"
                  } text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}
                >
                  <td className="text-xs text-center">{user.quotation_no}</td>
                  <td className="text-xs text-center">{user.project_name}</td>
                  <td className="text-xs text-center">{user.client}</td>
                  <td className="text-xs text-center">{user.created_by}</td>
                  <td className="text-xs text-center">{user.date_created}</td>
                  <td className="text-xs text-center">
                    <span
                      className={`${
                        user.status ? "bg-green-500" : "bg-red-500"
                      } text-white py-1 px-3 rounded-full`}
                    >
                      {user.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-xs flex gap-2 justify-center">
                    <View id={user.id} />
                    <button
                      className="flex items-center gap-1 border border-red-700 bg-white  text-red-700 px-3 py-1.5 rounded-md text-xs shadow transition duration-200 uppercase"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this?")) {
                          handleDelete(user.id);
                        }
                      }}
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

export default TableQuotation;
