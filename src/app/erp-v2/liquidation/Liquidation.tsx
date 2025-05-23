import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import AddLiquidation from "./_components/Modal/AddLiquidation";
import { fetchLiqList, Liquidations } from "@/api/liquidations/fetchLiq";
import { deleteLiquidation } from "@/api/liquidations/deleteLiq";
import SearchInput from "./_components/Search/SearchInput";
import TableLiquidation from "./_components/Table/TableLiquidation";
import LoadingPage from "@/components/Loading/LoadingPage";
import ServerError from "@/components/Error/ServerError";

export default function Liquidation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [showSuccess, setShowSuccess] = useState(false);
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery<Liquidations[]>({
    queryKey: ["liquidation"],
    queryFn: fetchLiqList,
  });

  const { mutate: deleteLiq } = useMutation({
    mutationFn: (id: number) => deleteLiquidation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["liquidation"] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: (err) => {
      console.error("Delete failed:", err);
    },
  });

  // const filteredData = useMemo(() => {
  //   return (
  //     data?.filter(
  //       (user) =>
  //         user.liquidation_no
  //           .toLowerCase()
  //           .includes(searchTerm.toLowerCase()) ||
  //         user.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         user.date.toLowerCase().includes(searchTerm.toLowerCase())
  //     ) || []
  //   );
  // }, [data, searchTerm]);
  const filteredData =
    data?.filter((item) =>
      Object.values(item).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) ?? [];

  if (isLoading) return <LoadingPage />;
  // if (error instanceof Error) return <div>Error: {error.message}</div>;
  if (error instanceof Error) return <ServerError />;

  return (
    <div className="dark:bg-gray-dark dark:text-white">
      {showSuccess && (
        <div className="alert alert-success mb-4 bg-green-100 text-green-800 px-4 py-2 rounded-md">
          Cheque request successfully deleted.
        </div>
      )}

      <div className="flex items-center justify-between mb-1 gap-6">
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setCurrentPage={setCurrentPage}
        />
        <AddLiquidation />
      </div>

      <h1 className="text-2xl font-semibold text-gray-800 mb-1 uppercase tracking-wide dark:text-white">
        Liquidations
      </h1>

      <TableLiquidation
        data={filteredData}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        handleDelete={deleteLiq}
        handlePrev={() => currentPage > 1 && setCurrentPage((p) => p - 1)}
        handleNext={() =>
          currentPage < Math.ceil(filteredData.length / rowsPerPage) &&
          setCurrentPage((p) => p + 1)
        }
      />
    </div>
  );
}
