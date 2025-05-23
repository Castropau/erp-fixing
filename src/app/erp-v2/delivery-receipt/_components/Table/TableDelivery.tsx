// components/TableDelivery.tsx
import { deleteClients } from "@/api/clients/deleteClients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ViewDeliveryReceipt from "../ViewDeliveryReceipt";
import { deleteReceipt } from "@/api/delivery_receipt/deleteReceipt";

type Column<Delivery> = {
  header: string;
  accessor: keyof Delivery;
};

type Props<Delivery> = {
  data: Delivery[];
  columns: Column<Delivery>[];
  currentPage: number;
  rowsPerPage: number;
  onView: (id: number) => void;
  onDelete: (id: number) => void;
  redirectingId: number | null;
};

function TableDelivery<T extends { id: number }>({
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
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [redirecting, setRedirecting] = useState<number | null>(null); // null when not redirecting
  const router = useRouter();

  const { mutate: deleteReceipts } = useMutation({
    mutationFn: (id: number) => deleteReceipt(id),
    onMutate: (id) => {
      setDeletingId(id); // Set loading for specific row
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery_delete"] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setDeletingId(null); // Reset loading
    },
    onError: (error) => {
      console.error("Error deleting:", error);
      setDeletingId(null); // Reset loading on error too
    },
  });
  return (
    <div className="overflow-auto border border-gray-700 rounded-md shadow-sm">
      <table className="min-w-full text-sm bg-white">
        <thead className="bg-gray-700 text-white uppercase">
          <tr>
            <th className="px-4 py-2 text-center">Date</th>
            <th className="px-4 py-2 text-center">Delivered To</th>
            <th className="px-4 py-2 text-center">Address</th>
            <th className="px-4 py-2 text-center">PO No.</th>
            <th className="px-4 py-2 text-center">OR No.</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-gray-500 py-4">
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
                <td className="px-4 py-2 text-center">{user.date}</td>
                <td className="px-4 py-2 text-center">{user.delivered_to}</td>
                <td className="px-4 py-2 text-center">{user.address}</td>
                <td className="px-4 py-2 text-center">{user.po_no}</td>
                <td className="px-4 py-2 text-center">{user.or_no}</td>
                {/* <td className="px-4 py-2 text-center flex justify-center gap-2"> */}
                <td className=" text-xs flex gap-2 text-center justify-center py-1 px-4">
                  <ViewDeliveryReceipt id={user.id} />
                  {/* <button className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition">
                         Delete
                       </button> */}
                  <button
                    className="flex items-center gap-1 border border-red-700 bg-white  text-red-700 px-3 py-1.5 rounded-md text-xs shadow transition duration-200 uppercase"
                    // className="uppercase flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs shadow transition duration-200"
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this client?")
                      ) {
                        deleteReceipts(user.id);
                      }
                    }}
                    disabled={deletingId === user.id}
                  >
                    {deletingId === user.id ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <>
                        {/* <FaTrash /> */}
                        Delete
                      </>
                    )}
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

export default TableDelivery;
