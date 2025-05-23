// components/TableClients.tsx
import { deleteClients } from "@/api/clients/deleteClients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Column<T> = {
  header: string;
  accessor: keyof T;
};

type Props<Client> = {
  data: Client[];
  columns: Column<Client>[];
  currentPage: number;
  rowsPerPage: number;
  onView: (id: number) => void;
  onDelete: (id: number) => void;
  redirectingId: number | null;
};

function TableClients<T extends { id: number }>({
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [redirecting, setRedirecting] = useState<number | null>(null); // null when not redirecting
  const router = useRouter();

  const { mutate: deleteClient } = useMutation({
    mutationFn: (id: number) => deleteClients(id),
    onSuccess: () => {
      console.log("Deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["client"] });
      setShowSuccess(true); // show alert
      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: (error) => {
      console.error("Error deleting:", error);
    },
  });
  return (
    <div className="overflow-auto rounded-md border border-gray-700 shadow-sm">
      <table className="min-w-full text-sm bg-white">
        <thead className="bg-gray-700 text-white uppercase">
          <tr>
            <th className="px-4 py-2 text-center">Client Name</th>
            <th className="px-4 py-2 text-center">Contact Person</th>
            <th className="px-4 py-2 text-center">Contact Number</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center text-gray-500 py-4">
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
                <td className="px-4 py-2 text-center">{user.client}</td>
                <td className="px-4 py-2 text-center">{user.contact_person}</td>
                <td className="px-4 py-2 text-center">{user.contact_number}</td>
                {/* <td className="px-4 py-2 text-center justify-center flex gap-2"> */}
                <td className=" text-xs flex gap-2 text-center justify-center py-1 px-4">
                  {/* <Link href={`/erp-v2/clients/view/${user.id}`}>
                      <button className="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition">
                        View
                      </button>
                    </Link> */}
                  <button
                    onClick={() => {
                      setRedirecting(user.id);
                      setTimeout(() => {
                        router.push(`/erp-v2/clients/view/${user.id}`);
                      }, 500); // Optional delay to show the spinner
                    }}
                    className="uppercase px-3 py-1 text-xs font-medium text-blue-800 border border-blue-800 bg-white rounded-md  transition flex items-center gap-2"
                  >
                    {redirecting === user.id ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      "View"
                    )}
                  </button>

                  {/* <Link href="/erp-v2/vendors/view">
                      <button className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition">
                        Delete
                      </button>
                    </Link> */}
                  <button
                    className="flex items-center gap-1 border border-red-700 bg-white  text-red-700 px-3 py-1.5 rounded-md text-xs shadow transition duration-200 uppercase"
                    // className="uppercase flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs shadow transition duration-200"
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this clients?")
                      ) {
                        deleteClient(user.id);
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
  );
}

export default TableClients;
