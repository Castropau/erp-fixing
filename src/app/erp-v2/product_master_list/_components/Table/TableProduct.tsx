import React, { useState } from "react";
import { ChequeLists } from "@/api/cheque-request/fetchCheque";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMaterial } from "@/api/withdraw-materials/deleteMaterials";
import { Withdraw } from "@/api/withdraw-materials/fetchWithdraw";
import { Item } from "@/api/product_master_list/fetchItem";
import EditProduct from "../Modal/EditProduct";
import { deleteMaster } from "@/api/product_master_list/deleteMasterList";

type TableProductProps = {
  data: Item[];
};

const TableProduct: React.FC<TableProductProps> = ({ data }) => {
  const [isLoadings, setIsLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState(false);

  const [redirecting, setRedirecting] = useState<number | null>(null); // null when not redirecting
  const handleRedirect = () => {
    setIsLoading(true);
    router.push("/erp-v2/withdraw_materials/add-material-request");
  };
  const { mutate: deleteMasterList } = useMutation({
    mutationFn: (id: number) => deleteMaster(id),
    onSuccess: () => {
      console.log("Deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["master_list"] });
      setShowSuccess(true); // show alert
      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: (error) => {
      console.error("Error deleting:", error);
    },
  });

  return (
    <div className="overflow-auto border border-gray-700 rounded-md shadow-sm">
      <table className="min-w-full table-zebra text-sm bg-white">
        <thead className="bg-gray-700 text-white uppercase">
          <tr>
            <th className="px-4 py-2 text-center">Item #</th>
            <th className="px-4 py-2 text-center">Item Name</th>
            <th className="px-4 py-2 text-center">Description</th>
            <th className="px-4 py-2 text-center">Supplier</th>
            <th className="px-4 py-2 text-center">Brand</th>
            <th className="px-4 py-2 text-center">Model</th>
            <th className="px-4 py-2 text-center">SRP</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.length === 0 ? (
            <tr>
              <td
                colSpan={8}
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
     ${index % 2 === 0 ? " dark:bg-gray-800" : "bg-white dark:bg-gray-900"}
     text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}
              >
                <td className="text-xs text-center">{user.item_no}</td>
                <td className="text-xs text-center">{user.item}</td>
                <td className="text-xs text-center">{user.description}</td>
                <td className="text-xs text-center">{user.vendor}</td>
                <td className="text-xs text-center">{user.brand}</td>
                <td className="text-xs text-center">{user.model}</td>
                <td className="text-xs text-center">{user.srp}</td>
                {/* <td className="px-4 py-2 text-center"> */}
                <td className=" text-xs flex gap-1 text-center justify-center py-1 px-4">
                  {/* <div className="inline-flex items-center justify-center gap-2"> */}
                  <EditProduct id={user.id} />
                  {/* <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition">
                         <FaTrash className="w-4 h-4" />
                         Delete
                       </button> */}
                  <button
                    className="flex items-center gap-1 border border-red-700 bg-white  text-red-700 px-3 py-1.5 rounded-md text-xs shadow transition duration-200 uppercase"
                    // className="uppercase flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs shadow transition duration-200"
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to delete this cash request?"
                        )
                      ) {
                        deleteMasterList(user.id);
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

export default TableProduct;
