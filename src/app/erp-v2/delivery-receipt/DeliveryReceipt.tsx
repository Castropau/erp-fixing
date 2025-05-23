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
import AddDeliveryReceipt from "./_components/Modal/AddDeliveryReceipt";
import ViewDeliveryReceipt from "./_components/ViewDeliveryReceipt";
import {
  Delivery,
  fetchDeliveryList,
} from "@/api/delivery_receipt/fetchDelivery";
import { fetchReceiptById } from "@/api/delivery_receipt/fetchReceipt";
import { FaTrash } from "react-icons/fa6";
import { deleteReceipt } from "@/api/delivery_receipt/deleteReceipt";
import SearchInput from "./_components/Search/SearchInput";
import TableDelivery from "./_components/Table/TableDelivery";
import LoadingPage from "@/components/Loading/LoadingPage";
import ServerError from "@/components/Error/ServerError";

/** components */

// import PersonalInformation from "../Modal/PersonalInformation";

export default function DeliveryReceipt() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [showSuccess, setShowSuccess] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  // const { isLoading, error, data } = useQuery<Delivery[]>({
  //   queryKey: ["delivery"],
  //   queryFn: fetchDeliveryList,
  // });
  const { isLoading, error, data } = useQuery<Delivery[]>({
    queryKey: ["delivery"],
    queryFn: fetchDeliveryList,
    // refetchInterval: 5000,
  });

  // const {
  //   data: ReceiptData,
  //   isLoading: Rloading,
  //   isError,
  //   error: rerror,
  // } = useQuery({
  //   queryKey: ["quotation", id],
  //   queryFn: () => fetchReceiptById(id),
  //   enabled: !!id,
  // });

  //   if (isLoading) return <div>Loading...</div>;

  //   if (error instanceof Error)
  //     return <div>An error has occurred: {error.message}</div>;
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
  if (isLoading) {
    return <LoadingPage />;
  }

  if (error instanceof Error) return <ServerError />;

  return (
    <>
      {showSuccess && (
        <div
          role="alert"
          className="alert alert-success mb-4 flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-md transition-opacity duration-300"
        >
          <span>delivery successfully deleted.</span>
        </div>
      )}
      <div className=" bg-white rounded-lg  dark:bg-gray-dark">
        {/* Top Section: Search + Add Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-1">
          {/* Search Input */}
          <SearchInput
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setCurrentPage={setCurrentPage}
          />

          {/* Add Button */}
          <div className="ml-auto">
            <AddDeliveryReceipt />
          </div>
        </div>

        {/* Section Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-1 uppercase tracking-wide dark:text-white">
          Delivery Receipts
        </h1>

        {/* Table */}
        <TableDelivery
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
          redirectingId={null} // onViewClick={handleViewClick}
          // onDeleteClick={handleDeleteClick}
          // loadingId={loadingId}
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
