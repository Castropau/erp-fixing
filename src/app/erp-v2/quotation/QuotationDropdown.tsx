"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchQuoList, Quatations } from "@/api/quotation/fetchQuo";
import { deleteQuo } from "@/api/quotation/deleteQuo";

import AddQuotations from "./_components/Modal/AddQuotations";
import Config from "./_components/Modal/Config";

import LoadingPage from "@/components/Loading/LoadingPage";
import SearchInput from "./_components/Search/SearchInput";
import TableQuotation from "./_components/Table/TableQuotation";
import ServerError from "@/components/Error/ServerError";

export default function QuotationDropdown() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState(false);

  const { data, isLoading, error } = useQuery<Quatations[]>({
    queryKey: ["quotations"],
    queryFn: fetchQuoList,
  });

  // const filteredData = useMemo(() => {
  //   return (
  //     data?.filter((item) => {
  //       const quote = item.quotation_no?.toLowerCase() || "";
  //       const project = item.project_name?.toLowerCase() || "";
  //       return (
  //         quote.includes(searchTerm.toLowerCase()) ||
  //         project.includes(searchTerm.toLowerCase())
  //       );
  //     }) || []
  //   );
  // }, [searchTerm, data]);
  const filteredData = useMemo(() => {
    return (
      data?.filter((item) =>
        Object.values(item).some(
          (val) =>
            typeof val === "string" &&
            val.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) ?? []
    );
  }, [searchTerm, data]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const { mutate: deleteQuotation } = useMutation({
    mutationFn: (id: number) => deleteQuo(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["quotations"] });
      const previousData = queryClient.getQueryData<Quatations[]>([
        "quotations",
      ]);
      queryClient.setQueryData<Quatations[]>(["quotations"], (old) =>
        old?.filter((q) => q.id !== id)
      );
      return { previousData };
    },
    onSuccess: () => {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["quotations"], context.previousData);
      }
    },
  });

  if (isLoading) return <LoadingPage />;
  // if (error instanceof Error) return <div>Error: {error.message}</div>;
  if (error instanceof Error) return <ServerError />;

  return (
    <>
      {showSuccess && (
        <div className="alert alert-success mb-4 bg-green-100 text-green-800 px-4 py-2 rounded-md">
          Quotation successfully deleted.
        </div>
      )}

      <div className="bg-white rounded-md dark:bg-gray-dark dark:text-white">
        <div className="flex items-center justify-between mb-1 gap-4">
          <SearchInput
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setCurrentPage={setCurrentPage}
          />
          <div className="flex items-center gap-4">
            <AddQuotations />
            <Config />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-1 uppercase tracking-wide dark:text-white">
          Quotation
        </h1>

        <TableQuotation
          data={paginatedData}
          totalPages={totalPages}
          currentPage={currentPage}
          handleDelete={deleteQuotation}
          handlePrev={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          handleNext={() =>
            currentPage < totalPages && setCurrentPage(currentPage + 1)
          }
        />

        {/* <div className="flex justify-end items-center gap-3 mt-6 text-sm">
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
        </div> */}
      </div>
    </>
  );
}
