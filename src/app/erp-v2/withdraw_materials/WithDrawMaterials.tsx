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
import CreateMaterialRequest from "./add-material-request/CreateMaterialRequest";
import Link from "next/link";
import {
  fetchWithdrawList,
  Withdraw,
} from "@/api/withdraw-materials/fetchWithdraw";
import { FaCirclePlus, FaEye, FaTrash } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { deleteMaterial } from "@/api/withdraw-materials/deleteMaterials";
import LoadingPage from "@/components/Loading/LoadingPage";
import SearchInput from "./_components/Search/SearchInput";
import TableWithdraw from "./_components/Table/TableWithdraw";
import ServerError from "@/components/Error/ServerError";

/** components */

// import PersonalInformation from "../Modal/PersonalInformation";

export default function WithDrawMaterials() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [isLoadings, setIsLoading] = useState(false);

  const [redirecting, setRedirecting] = useState<number | null>(null); // null when not redirecting

  const rowsPerPage = 10;
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState(false);

  const { isLoading, error, data } = useQuery<Withdraw[]>({
    queryKey: ["withdraw"],
    queryFn: fetchWithdrawList,
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

  function setShowRegisterModal(arg0: boolean): void {
    throw new Error("Function not implemented.");
  }
  const handleRedirect = () => {
    setIsLoading(true);
    router.push("/erp-v2/withdraw_materials/add-material-request");
  };
  const { mutate: deleteMaterials } = useMutation({
    mutationFn: (id: number) => deleteMaterial(id),
    onSuccess: () => {
      console.log("Deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
      setShowSuccess(true); // show alert
      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: (error) => {
      console.error("Error deleting cash:", error);
    },
  });
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
          <span>material successfully deleted.</span>
        </div>
      )}
      <div className=" bg-white rounded-md dark:bg-gray-dark">
        <div className="flex items-center justify-between mb-1 gap-4">
          <SearchInput
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setCurrentPage={setCurrentPage}
          />

          <div className="ml-auto">
            {/* <CreateMaterialRequest /> */}
            {/* <Link href="/erp-v2/withdraw_materials/add-material-request">
            <button className="btn btn-info">
              <FaPlusCircle className="w-6 h-6 btn-info" />
              Add Material Request
            </button>
          </Link> */}
            <button
              className="btn bg-white border mr-4 border-black  flex items-center gap-2  text-black uppercase"
              onClick={handleRedirect}
              disabled={isLoadings}
            >
              {isLoadings ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  {/* <FaPlusCircle className="w-5 h-5" /> */}
                  Add Material Request
                </>
              )}
            </button>
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-1 uppercase tracking-wide dark:text-white">
          Withdraw Materials
        </h1>
        <TableWithdraw
          data={paginatedData}
          onViewClick={function (id: string): void {
            throw new Error("Function not implemented.");
          }}
          onDeleteClick={function (id: number): void {
            throw new Error("Function not implemented.");
          }}
          loadingId={null}
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
    </>
  );
}
