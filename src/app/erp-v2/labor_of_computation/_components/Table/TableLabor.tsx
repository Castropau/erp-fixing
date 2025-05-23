import React, { useState } from "react";
import { ChequeLists } from "@/api/cheque-request/fetchCheque";
import { LaborComputation } from "@/api/labor_of_computation/LaborOfComputations";
import EditLabor from "../Modal/EditLabor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteLabor } from "@/api/labor_of_computation/deleteLabor";

type TableLaborProps = {
  data: LaborComputation[];
};

const TableLabor: React.FC<TableLaborProps> = ({ data }) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState(false);

  const { mutate: deletedLabor } = useMutation({
    mutationFn: (id: number) => DeleteLabor(id),
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
    <>
      {showSuccess && (
        <div
          role="alert"
          className="alert alert-success mb-4 flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-md transition-opacity duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>labor successfully deleted.</span>
        </div>
      )}
      <div className="overflow-auto border border-gray-700 rounded-lg shadow-sm">
        <table className="min-w-full text-sm bg-white">
          <thead className="bg-gray-700 text-white uppercase">
            <tr>
              <th className="px-4 py-3 text-center">Labor No</th>
              <th className="px-4 py-3 text-center">BOM</th>
              <th className="px-4 py-3 text-center">Project Name</th>
              <th className="px-4 py-3 text-center">System</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-500 py-6 dark:bg-gray-dark dark:text-white"
                >
                  No records found
                </td>
              </tr>
            ) : (
              data?.map((labor, index) => (
                <tr
                  key={labor.id}
                  className={`transition-colors duration-300 ease-in-out
     ${
       index % 2 === 0
         ? "bg-gray-50 dark:bg-gray-800"
         : "bg-white dark:bg-gray-900"
     }
     text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}
                >
                  <td className="px-4 py-2 text-center">{labor.lc_no}</td>
                  <td className="px-4 py-2 text-center">{labor.bom}</td>
                  <td className="px-4 py-2 text-center">
                    {labor.project_name}
                  </td>
                  <td className="px-4 py-2 text-center">{labor.system}</td>
                  {/* <td className="px-4 py-2 text-center"> */}
                  <td className=" text-xs flex gap-2 text-center justify-center py-1 px-4">
                    {/* <div className="inline-flex gap-2 items-center justify-center"> */}
                    <EditLabor id={labor.id} />
                    {/* <ModuleAccess /> */}
                    {/* <button
                           onClick={() => {
                             if (
                               confirm(
                                 "Are you sure you want to delete this labor?"
                               )
                             ) {
                               deletedLabor(labor.id);
                             }
                           }}
                           className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs shadow transition duration-200"
                         >
                           <FaTrash /> Delete
                         </button> */}
                    <button
                      className="flex items-center gap-1 border border-red-700 bg-white  text-red-700 px-3 py-1.5 rounded-md text-xs shadow transition duration-200 uppercase"
                      // className="uppercase flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs shadow transition duration-200"
                      onClick={() => {
                        if (
                          confirm("Are you sure you want to delete this labor?")
                        ) {
                          deletedLabor(labor.id);
                        }
                      }}
                      disabled={deletingId === labor.id}
                    >
                      {deletingId === labor.id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <>
                          {/* <FaTrash /> */}
                          Delete
                        </>
                      )}
                    </button>
                    {/* </div> */}
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

export default TableLabor;
