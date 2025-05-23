// components/TablePurchase.tsx
import { deleteClients } from "@/api/clients/deleteClients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ViewPurchase from "../Modal/ViewPurchase";
import { deletePurchases } from "@/api/delivery_receipt/deletePurchaseOrder";

type Column<Purchase> = {
  header: string;
  accessor: keyof Purchase;
};

type Props<Purchase> = {
  data: Purchase[];
  columns: Column<Purchase>[];
  currentPage: number;
  rowsPerPage: number;
  onView: (id: number) => void;
  onDelete: (id: number) => void;
  redirectingId: number | null;
};

function TablePurchase<T extends { id: number }>({
  data,
  columns,
  currentPage,
  rowsPerPage,
  onView,
  onDelete,
  redirectingId,
}: Props<T>) {
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const queryClient = useQueryClient();
  const { mutate: deletePurchase } = useMutation({
    mutationFn: (id: number) => deletePurchases(id),
    onSuccess: () => {
      console.log("Deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["cash"] });
      setShowSuccess(true); // show alert
      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: (error) => {
      console.error("Error deleting cash:", error);
    },
  });
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="overflow-auto border border-gray-700 rounded-md shadow-sm">
      <table className="min-w-full text-sm bg-white">
        <thead className="bg-gray-700 text-white">
          <tr>
            <th className="px-4 py-2 text-center uppercase">PO No.</th>
            <th className="px-4 py-2 text-center uppercase">To</th>
            <th className="px-4 py-2 text-center uppercase">Grand Total</th>
            <th className="px-4 py-2 text-center uppercase">Created By</th>
            <th className="px-4 py-2 text-center uppercase">Date Created</th>
            <th className="px-4 py-2 text-center uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="text-center text-gray-500 py-4 dark:bg-gray-dark dark:text-white"
              >
                No records found
              </td>
            </tr>
          ) : (
            data?.map((user, index) => (
              <tr
                key={user.id}
                className={`transition-colors duration-300 ease-in-out
      ${
        index % 2 === 0
          ? "bg-gray-50 dark:bg-gray-800"
          : "bg-white dark:bg-gray-900"
      }
      text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}
              >
                <td className="px-4 py-2 text-center">{user.po_no}</td>
                <td className="px-4 py-2 text-center">{user.vendor}</td>
                <td className="px-4 py-2 text-center">
                  ₱ {user.grand_total.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-center">{user.created_by}</td>
                <td className="px-4 py-2 text-center">{user.date_created}</td>
                {/* <td className="px-4 py-2  justify-center flex gap-2"> */}
                <td className=" text-xs flex gap-2 justify-center py-1 px-4">
                  <ViewPurchase id={user.id} />
                  {/* <button className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs shadow transition duration-200">
                        <FaTrash /> Delete
                      </button> */}
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to delete this cash request?"
                        )
                      ) {
                        deletePurchase(user.id);
                      }
                    }}
                    className="flex items-center gap-1 border border-red-700 bg-white  text-red-700 px-3 py-1.5 rounded-md text-xs shadow transition duration-200 uppercase"

                    // className="uppercase flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs shadow transition duration-200"
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
  );
}

export default TablePurchase;
