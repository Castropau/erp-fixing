"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
/**state */
import React, { useState, useMemo } from "react";

/** api */
import { fetchUserList } from "@/api/User/fetchUserList";
import PersonalInformation from "../user/_components/Modal/PersonalInformation";
import ModuleAccess from "../user/_components/Modal/ModuleAccess";
import CreateUser from "../user/_components/Modal/CreateUser";
import AddLaborOfComputation from "../labor_of_computation/_compoments/Modal/AddLaborOfComputation";
import AddPurchaseOrder from "./_components/Modal/AddPurchaseOrder";
import ViewPurchase from "./_components/Modal/ViewPurchase";
import {
  fetchPurchaseList,
  PurchaseOrder,
} from "@/api/purchase-order/fetchPurchase";
import { FaTrash } from "react-icons/fa6";
import { deletePurchases } from "@/api/delivery_receipt/deletePurchaseOrder";
import SearchInput from "./_components/Search/SearchInput";
import LoadingPage from "@/components/Loading/LoadingPage";
import TablePurchase from "./_components/Table/TablePurchase";
import ServerError from "@/components/Error/ServerError";

/** components */

// import PersonalInformation from "../Modal/PersonalInformation";

interface User {
  id: number; // id as an integer
  full_name: string; // full_name as a string
  department: string; // department as a string
  role: string;
  is_active: boolean;
  is_superuser: boolean;
}

export default function PurchacaseOrder() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState(false);

  const { isLoading, error, data } = useQuery<PurchaseOrder[]>({
    queryKey: ["purchase"],
    queryFn: fetchPurchaseList,
    // refetchInterval: 1000,
  });
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
  const filteredData =
    data?.filter((item) =>
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
  // const totalPages = Math.ceil((filteredData?.length || 0) / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData?.slice(indexOfFirstRow, indexOfLastRow);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  function setShowRegisterModal(arg0: boolean): void {
    throw new Error("Function not implemented.");
  }
  if (isLoading) return <LoadingPage />;

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
          <span>purchase successfully deleted.</span>
        </div>
      )}
      <div className=" bg-white rounded-lg  dark:bg-gray-dark">
        {/* Search and Add */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-1">
          {/* Search */}
          <SearchInput
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setCurrentPage={setCurrentPage}
          />

          {/* Add PO */}
          <div className="ml-auto">
            <AddPurchaseOrder />
          </div>
        </div>

        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-1 uppercase tracking-wide dark:text-white">
          Purchase Orders
        </h1>

        {/* Table */}
        <TablePurchase
          data={paginatedData}
          columns={[]}
          currentPage={0}
          rowsPerPage={0}
          onView={function (id: number): void {
            throw new Error("Function not implemented.");
          }}
          onDelete={function (id: number): void {
            throw new Error("Function not implemented.");
          }}
          redirectingId={null}
        />

        {/* Pagination */}
        <div className="flex justify-end items-center gap-3 mt-6 text-sm">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:bg-gray-500 hover:bg-maroon-800 transition"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
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
