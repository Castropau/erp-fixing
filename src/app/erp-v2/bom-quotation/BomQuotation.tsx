"use client";

import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bom, fetchBomList } from "@/api/bom-quotation/fetchBom";
import { deleteBoms } from "@/api/bom-quotation/deleteBom";
import AddBom from "./Modal/AddBom";
import TableBom from "./_components/Table/TableBom";
import SearchInput from "./_components/Search/SearchInput";
import LoadingPage from "@/components/Loading/LoadingPage";
import ServerError from "@/components/Error/ServerError";

export default function BomQuotation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const rowsPerPage = 10;

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<Bom[]>({
    queryKey: ["bom"],
    queryFn: fetchBomList,
  });

  // const filteredData = useMemo(() => {
  //   return (
  //     data?.filter((item) =>
  //       [item.bom_no, item.project_name, item.client].some((val) =>
  //         val.toLowerCase().includes(searchTerm.toLowerCase())
  //       )
  //     ) || []
  //   );
  // }, [searchTerm, data]);
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

  const { mutate: deleteBom } = useMutation({
    mutationFn: (id: number) => deleteBoms(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bom"] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const handlePrev = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const handleNext = () =>
    setCurrentPage((prev) =>
      prev + 1 <= Math.ceil(filteredData.length / rowsPerPage) ? prev + 1 : prev
    );

  if (isLoading) return <LoadingPage />;
  // if (error instanceof Error) return <div>Error: {error.message}</div>;
  if (error instanceof Error) return <ServerError />;

  return (
    <div className="bg-white dark:bg-gray-dark  rounded-lg">
      {/* Success Alert */}
      {showSuccess && (
        <div className="alert alert-success mb-4 bg-green-100 text-green-800 px-4 py-2 rounded-md">
          BOM successfully deleted.
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full max-w-sm">
          <SearchInput
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setCurrentPage={setCurrentPage}
          />
        </div>
        <AddBom />
      </div>

      <h1 className="text-2xl font-bold text-gray-800 dark:text-white uppercase">
        BOM Quotation
      </h1>

      <TableBom
        data={paginatedData}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        handleDelete={deleteBom}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    </div>
  );
}
