import React, { useState } from "react";
import { ChequeLists } from "@/api/cheque-request/fetchCheque";
import EditBom from "../Modal/EditBom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBom } from "@/api/bill_of_materials/deleteBom";
import { Boms } from "@/api/bill_of_materials/fetchBill";

type TableBomProps = {
  data: Boms[];
};

const TableBom: React.FC<TableBomProps> = ({ data }) => {
  const queryClient = useQueryClient();

  const { mutate: deleteBoms } = useMutation({
    mutationFn: (id: number) => deleteBom(id),
    onSuccess: () => {
      console.log("Deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["bom"] });
      setShowSuccess(true); // show alert
      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: (error) => {
      console.error("Error deleting cash:", error);
    },
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const statusColorMap: Record<string, string> = {
    Pending: "bg-yellow-500 text-white",
    Approved: "bg-green-500 text-white",
    "Approved To Be Revised": "bg-blue-500 text-white",
    Revised: "bg-purple-500 text-white",
    Cancelled: "bg-red-500 text-white",
    Noted: "bg-gray-500 text-white",
  };

  return (
    <div className="overflow-auto border border-gray-700 rounded-lg shadow-sm">
      <table className="min-w-full text-sm bg-white">
        <thead className="bg-gray-700 text-white uppercase">
          <tr>
            <th className="px-4 py-3 text-center font-bold">BOM No</th>
            <th className="px-4 py-3 text-center font-bold">Project Name</th>
            <th className="px-4 py-3 text-center font-bold">Client</th>
            <th className="px-4 py-3 text-center font-bold">Date</th>
            <th className="px-4 py-3 text-center font-bold">Prepared By</th>
            <th className="px-4 py-3 text-center font-bold">Status</th>
            <th className="px-4 py-3 text-center font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="text-center text-gray-500 py-6 dark:bg-gray-dark dark:text-white"
              >
                No records found
              </td>
            </tr>
          ) : (
            data?.map((bom, index) => (
              <tr
                key={bom.id}
                className={`transition-colors duration-300 ease-in-out
       ${
         index % 2 === 0
           ? "bg-gray-50 dark:bg-gray-800"
           : "bg-white dark:bg-gray-900"
       }
       text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}
              >
                <td className="px-4 py-2 text-center">{bom.bom_no}</td>
                <td className="px-4 py-2 text-center">{bom.project_name}</td>
                <td className="px-4 py-2 text-center">{bom.client}</td>
                <td className="px-4 py-2 text-center">{bom.date_created}</td>
                <td className="px-4 py-2 text-center">{bom.created_by}</td>
                <td className="px-4 py-2 text-center">
                  <span
                    className={`inline-block text-xs font-medium py-1 px-3 rounded-full ${
                      statusColorMap[bom.status] || "bg-gray-300 text-black"
                    }`}
                  >
                    {bom.status}
                  </span>
                </td>
                {/* <td className="px-4 py-2 text-center"> */}
                <td className=" text-xs flex gap-2 text-center justify-center py-1 px-4">
                  {/* <div className="inline-flex items-center justify-center gap-2"> */}
                  <EditBom id={bom.id} />
                  <button
                    className="flex items-center gap-1 border border-red-700 bg-white  text-red-700 px-3 py-1.5 rounded-md text-xs shadow transition duration-200 uppercase"
                    // className="uppercase flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs shadow transition duration-200"
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to delete this cash request?"
                        )
                      ) {
                        deleteBoms(bom.id);
                      }
                    }}
                  >
                    {/* <FaTrash /> */}
                    Delete
                  </button>
                  {/* </div> */}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableBom;
