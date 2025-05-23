import { deleteCheque } from "@/api/cheque-request/DeleteCheque";
import {
  fetchChequesLists,
  ChequeLists,
} from "@/api/cheque-request/fetchCheque";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import SearchInput from "./_components/Search/Search";
import AddChequeRequest from "./_components/Modal/AddChequeRequest";
import ChequeTable from "./_components/Table/TableCheque";
import LoadingPage from "@/components/Loading/LoadingPage";
import ServerError from "@/components/Error/ServerError";

type TableProps = {
  data: ChequeLists[];
};

const TableCheque: React.FC<TableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const rowsPerPage = 10;
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: datas,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cheque"],
    queryFn: fetchChequesLists,
  });

  const { mutate: deleteCash } = useMutation({
    mutationFn: (id: number) => deleteCheque(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cheque"] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: (error) => {
      console.error("Error deleting:", error);
    },
  });

  const handleViewClick = (id: string) => {
    setLoadingId(id);
    setTimeout(() => router.push(`/erp-v2/cheque-request/detail/${id}`), 300);
  };

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

  const handleDeleteClick = (id: number) => {
    if (confirm("Are you sure you want to delete this cheque?")) {
      deleteCash(id);
    }
  };
  if (isLoading) return <LoadingPage />;

  // if (error instanceof Error)
  //   return (
  //     <div className="text-center text-red-600 py-10">
  //       Error: {error.message}
  //     </div>
  //   );
  if (error instanceof Error) return <ServerError />;
  return (
    <>
      {showSuccess && (
        <div className="alert alert-success mb-4 bg-green-100 text-green-800 px-4 py-2 rounded-md">
          cheque request successfully deleted.
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-1">
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setCurrentPage={setCurrentPage}
        />
        <AddChequeRequest />
      </div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-1 uppercase tracking-wide dark:text-white">
        Cheque Requests
      </h1>
      <ChequeTable
        data={paginatedData}
        onViewClick={handleViewClick}
        onDeleteClick={handleDeleteClick}
        loadingId={loadingId}
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
    </>
  );
};

export default TableCheque;
