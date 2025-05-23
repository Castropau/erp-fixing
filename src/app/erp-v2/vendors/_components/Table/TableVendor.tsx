import React from "react";
import { Vendor } from "@/api/vendor/fetchVendor";

type Props = {
  vendors: Vendor[]; // <-- Already paginated!
  currentPage: number;
  rowsPerPage: number;
  onView: (id: number) => void;
  onDelete: (id: number) => void;
  redirectingId: number | null;
  handlePrev: () => void;
  handleNext: () => void;
};

const TableVendor: React.FC<Props> = ({
  vendors,
  currentPage,
  rowsPerPage,
  onView,
  onDelete,
  redirectingId,
  handlePrev,
  handleNext,
}) => {
  return (
    <>
      <div className="overflow-auto rounded-md border border-gray-700 shadow-sm">
        <table className="min-w-full text-sm bg-white">
          <thead className="bg-gray-700 text-white uppercase">
            <tr>
              <th className="px-4 py-2 text-center">Vendor</th>
              <th className="px-4 py-2 text-center">Contact Number</th>
              <th className="px-4 py-2 text-center">Email</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No records found
                </td>
              </tr>
            ) : (
              vendors.map((vendor, index) => (
                <tr
                  key={vendor.id}
                  className={`${
                    index % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-800"
                      : "bg-white dark:bg-gray-900"
                  } text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}
                >
                  <td className="px-4 py-2 text-center">{vendor.vendor}</td>
                  <td className="px-4 py-2 text-center">
                    {vendor.contact_number}
                  </td>
                  <td className="px-4 py-2 text-center">{vendor.email}</td>
                  <td className="text-xs flex gap-2 justify-center py-1 px-4">
                    <button
                      onClick={() => onView(vendor.id)}
                      className="uppercase px-3 py-1 text-xs font-medium text-blue-800 border border-blue-800 bg-white rounded-md flex items-center gap-2"
                    >
                      {redirectingId === vendor.id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        "View"
                      )}
                    </button>
                    <button
                      onClick={() => onDelete(vendor.id)}
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
    </>
  );
};

export default TableVendor;
