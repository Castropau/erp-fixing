"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
/**state */
import React, { useState, useMemo } from "react";

/** api */
import { fetchUserList } from "@/api/User/fetchUserList";
import PersonalInformation from "../user/_components/Modal/PersonalInformation";
import ModuleAccess from "../user/_components/Modal/ModuleAccess";
import CreateUser from "../user/_components/Modal/CreateUser";
import AddLaborOfComputation from "../labor_of_computation/_compoments/Modal/AddLaborOfComputation";
import AddProduct from "./_components/Modal/AddProduct";
import EditProduct from "./_components/Modal/EditProduct";
import { Bom, fetchBomList } from "@/api/bom-quotation/fetchBom";
import { fetchItemList, Item } from "@/api/product_master_list/fetchItem";
import { FaTrash } from "react-icons/fa6";
import { deleteMaster } from "@/api/product_master_list/deleteMasterList";
import SearchInput from "./_components/Search/SearchInput";
import TableProduct from "./_components/Table/TableProduct";
import ServerError from "@/components/Error/ServerError";

/** components */

// import PersonalInformation from "../Modal/PersonalInformation";

export default function ProductMasterList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState(false);

  const rowsPerPage = 10;

  const {
    isLoading,
    error,
    data: datas,
  } = useQuery<Item[]>({
    queryKey: ["item"],
    queryFn: fetchItemList,
    // refetchInterval: 1000,
  });
  const filteredData =
    datas?.filter((item) =>
      Object.values(item).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) ?? [];

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  //   const totalPages = Math.ceil(filteredData!.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData?.slice(indexOfFirstRow, indexOfLastRow);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          {/* Loading Spinner */}
          <div className="dark:border-gray-200 dark:border-t-white  w-16 h-16 border-4 border-t-4 border-gray-800 border-dashed rounded-full animate-spin"></div>

          <span className="text-lg text-gray-700 dark:text-white">
            Please wait...
          </span>
        </div>
      </div>
    );
  }

  // if (error instanceof Error)
  //   return <div>An error has occurred: {error.message}</div>;
  if (error instanceof Error) return <ServerError />;

  return (
    <>
      {showSuccess && (
        <div
          role="alert"
          className="alert alert-success mb-4 flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-md transition-opacity duration-300"
        >
          <span>masterlist successfully deleted.</span>
        </div>
      )}
      <div className=" dark:bg-gray-dark dark:text-white">
        <div className="flex items-center justify-between mb-1 gap-6">
          {/* Search Input */}
          <SearchInput
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setCurrentPage={setCurrentPage}
          />

          {/* Add Product Button */}
          <div className="ml-auto">
            <AddProduct />
          </div>
        </div>

        {/* Section Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-1 uppercase tracking-wide dark:text-white">
          Product List
        </h1>

        {/* Table */}
        <TableProduct data={paginatedData} />

        {/* Pagination */}
        <div className="flex justify-end items-center gap-3 mt-6 text-sm">
          <button
            onClick={() => currentPage > 1 && setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:bg-gray-500 hover:bg-maroon-800 transition"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              currentPage < totalPages && setCurrentPage((p) => p + 1)
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:bg-gray-500 hover:bg-maroon-800 transition"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
