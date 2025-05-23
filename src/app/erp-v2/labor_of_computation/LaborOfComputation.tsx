"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
/**state */
import React, { useState, useMemo } from "react";

/** api */

import PersonalInformation from "../user/_components/Modal/PersonalInformation";
import ModuleAccess from "../user/_components/Modal/ModuleAccess";
import AddLaborOfComputation from "./_components/Modal/AddLaborOfComputation";
import {
  FetchLaborComputation,
  LaborComputation,
} from "@/api/labor_of_computation/LaborOfComputations";
import EditLabor from "./_components/Modal/EditLabor";
import { FaTrash } from "react-icons/fa6";
import { DeleteLabor } from "@/api/labor_of_computation/deleteLabor";
import SearchInput from "./_components/Search/SearchInput";
import TableLabor from "./_components/Table/TableLabor";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import ServerError from "@/components/Error/ServerError";

/** components */

// import PersonalInformation from "../Modal/PersonalInformation";

export default function LaborOfComputation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [showSuccess, setShowSuccess] = useState(false);
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // const { mutate: deletedLabor } = useMutation({
  //   mutationFn: (id: number) => DeleteLabor(id),
  //   onSuccess: () => {
  //     console.log("Deleted successfully");
  //     queryClient.invalidateQueries({ queryKey: ["labor_delete"] });
  //     setShowSuccess(true); // show alert
  //     setTimeout(() => setShowSuccess(false), 3000);
  //   },
  //   onError: (error) => {
  //     console.error("Error deleting cash:", error);
  //   },
  // });

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

  const { isLoading, error, data } = useQuery<LaborComputation[]>({
    queryKey: ["labor"],
    queryFn: FetchLaborComputation,
    // refetchInterval: 1000,
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

  // if (isLoading) return <div>Loading...</div>;
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // if (error instanceof Error)
  //   return <div>An error has occurred: {error.message}</div>;
  if (error instanceof Error) return <ServerError />;

  return (
    <>
      {/* {showSuccess && (
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
      )} */}
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
            <AddLaborOfComputation />
          </div>
        </div>

        {/* Table */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-1 uppercase tracking-wide dark:text-white">
          Labor of Computation
        </h1>
        <TableLabor data={paginatedData} />

        {/* Pagination */}
        <div className="flex justify-end items-center mt-6 gap-3 text-sm">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:bg-gray-400 hover:bg-gray-800 transition"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:bg-gray-400 hover:bg-gray-800 transition"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
