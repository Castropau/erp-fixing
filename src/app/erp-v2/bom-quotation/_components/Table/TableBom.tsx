import React from "react";
import { Bom } from "@/api/bom-quotation/fetchBom";
import View from "../../Modal/View";

type Props = {
  data: Bom[];
  currentPage: number;
  rowsPerPage: number;
  handleDelete: (id: number) => void;
  handlePrev: () => void;
  handleNext: () => void;
};

const TableBom: React.FC<Props> = ({
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
      <div className="overflow-auto rounded-lg border border-gray-400 shadow-sm">
        <table className="min-w-full table-zebra bg-white text-sm text-center">
          <thead className="bg-gray-700 text-white uppercase">
            <tr>
              <th className="px-4 py-2"> BOM Quotation </th>
              <th className="px-4 py-2">Projects</th>
              <th className="px-4 py-2">To</th>
              <th className="px-4 py-2">Created by</th>
              <th className="px-4 py-2">Checked By</th>
              <th className="px-4 py-2">Approved By</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Date Created</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-4 text-gray-500">
                  No records found
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr
                  key={item.id}
                  className={`${
                    index % 2 === 0
                      ? " dark:bg-gray-800"
                      : "bg-white dark:bg-gray-900"
                  } text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}
                >
                  <td className="text-xs text-center">{item.bom_no}</td>
                  <td className="text-xs text-center">{item.project_name}</td>
                  <td className="text-xs text-center">{item.client}</td>

                  <td className="text-xs text-center">{item.created_by}</td>
                  <td className="text-xs text-center">{item.checked_by}</td>
                  <td className="text-xs text-center">{item.approved_by}</td>
                  <td className="text-xs text-center">{item.date}</td>
                  <td className="text-xs text-center">{item.date_created}</td>
                  <td className="text-xs text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {item.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  {/* <td className="px-4 py-2 text-center flex gap-2"> */}
                  <td className=" text-xs flex gap-2 text-center justify-center py-1 px-4">
                    <View id={item.id} />
                    {/* <ModuleAccess /> */}
                    {/* <button className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs shadow transition duration-200">
                      <FaTrash /> delete
                    </button> */}
                    <button
                      className="flex items-center gap-1 border border-red-700 bg-white  text-red-700 px-3 py-1.5 rounded-md text-xs shadow transition duration-200 uppercase"
                      //   className="uppercase flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs shadow transition duration-200"
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this cash request?"
                          )
                        ) {
                          handleDelete(item.id);
                        }
                      }}
                    >
                      {/* <FaTrash /> */}
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-4 gap-2 text-sm">
        <button
          onClick={handlePrev}
          className="px-4 py-1.5 bg-gray-700 text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          className="px-4 py-1.5 bg-gray-700 text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default TableBom;
