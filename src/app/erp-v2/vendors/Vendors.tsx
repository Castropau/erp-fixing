"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchVendorsList, Vendor } from "@/api/vendor/fetchVendor";
import { deleteVendor } from "@/api/vendor/deleteVendor";
import AddVendor from "./_components/Modal/AddVendor";
import TableVendor from "./_components/Table/TableVendor";
import SearchInput from "./_components/Search/SearchInput";
import LoadingPage from "@/components/Loading/LoadingPage";
import ServerError from "@/components/Error/ServerError";

export default function Vendors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [redirectingId, setRedirectingId] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const rowsPerPage = 10;
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, error } = useQuery<Vendor[]>({
    queryKey: ["vendor"],
    queryFn: fetchVendorsList,
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

  const { mutate: deleteVendors } = useMutation({
    mutationFn: (id: number) => deleteVendor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const handleView = (id: number) => {
    setRedirectingId(id);
    setTimeout(() => {
      router.push(`/erp-v2/vendors/view/${id}`);
    }, 500);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      deleteVendors(id);
    }
  };

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) =>
      prev + 1 <= Math.ceil(filteredData.length / rowsPerPage) ? prev + 1 : prev
    );

  if (isLoading) return <LoadingPage />;
  // if (error instanceof Error) return <div>Error: {error.message}</div>;
  if (error instanceof Error) return <ServerError />;

  return (
    <div className="bg-white dark:bg-gray-dark  rounded-lg">
      {showSuccess && (
        <div className="alert alert-success mb-4 bg-green-100 text-green-800 px-4 py-2 rounded-md">
          Vendor successfully deleted.
        </div>
      )}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 ">
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setCurrentPage={setCurrentPage}
        />

        <div className="ml-auto">
          <AddVendor />
        </div>
      </div>

      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white uppercase ">
        Vendors
      </h1>

      <TableVendor
        vendors={paginatedData}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        onView={handleView}
        onDelete={handleDelete}
        redirectingId={redirectingId}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
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
  );
}
