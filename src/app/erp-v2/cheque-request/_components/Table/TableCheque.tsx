import React from "react";
import { ChequeLists } from "@/api/cheque-request/fetchCheque";

type ChequeTableProps = {
  data: ChequeLists[];
  onViewClick: (id: string) => void;
  onDeleteClick: (id: number) => void;
  loadingId: string | null;
};

const ChequeTable: React.FC<ChequeTableProps> = ({
  data,
  onViewClick,
  onDeleteClick,
  loadingId,
}) => {
  return (
    <div className="overflow-auto rounded-lg shadow-sm border border-gray-700 dark:bg-gray-dark">
      <table className="min-w-full bg-white text-sm">
        <thead className="bg-gray-700 text-white">
          <tr className="text-center uppercase">
            <th className="px-4 py-2 font-semibold">Serial No</th>
            <th className="px-4 py-2 font-semibold">Purpose</th>
            <th className="px-4 py-2 font-semibold">Total</th>
            <th className="px-4 py-2 font-semibold">Requested By</th>
            <th className="px-4 py-2 font-semibold">Date Requested</th>
            <th className="px-4 py-2 font-semibold">Status</th>
            <th className="px-4 py-2 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="text-center text-gray-500 py-4 dark:bg-gray-dark dark:text-white"
              >
                No records found.
              </td>
            </tr>
          ) : (
            data.map((cheque, index) => (
              <tr
                key={cheque.id}
                className={`transition-colors duration-300 ease-in-out ${
                  index % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-900"
                } text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}
              >
                <td className="px-4 py-2 text-center text-xs">
                  {cheque.serial_no}
                </td>
                <td className="px-4 py-2 text-center">{cheque.purpose}</td>
                <td className="px-4 py-2 text-center">₱{cheque.grand_total}</td>
                <td className="px-4 py-2 text-center">{cheque.requested_by}</td>
                <td className="px-4 py-2 text-center">
                  {cheque.date_requested}
                </td>
                <td className="px-4 py-2 text-center">
                  <span
                    className={`text-white text-xs font-semibold px-3 py-1 rounded-full ${
                      cheque.status ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {cheque.status ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="text-xs flex gap-2 text-center justify-center py-1 px-4">
                  <button
                    onClick={() => onViewClick(cheque.id)}
                    className="flex items-center gap-2 bg-white  text-blue-800 border border-blue-800 px-4 py-2 rounded-md shadow transition duration-200 uppercase"
                    disabled={loadingId === cheque.id}
                  >
                    {loadingId === cheque.id ? (
                      <span className="w-4 h-4 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      "View"
                    )}
                  </button>
                  <button
                    onClick={() => onDeleteClick(cheque.id)}
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
  );
};

export default ChequeTable;
