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

import Link from "next/link";
import AddVendor from "../vendors/_components/Modal/AddVendor";

import Config from "../quotation/_components/Modal/Config";
import AddQuotations from "../quotation/_components/Modal/AddQuotations";
import AddClients from "./_components/Modal/AddClients";
import { Client, fetchClientsList } from "@/api/clients/fetchClients";
import { useRouter } from "next/navigation";
import { deleteClients } from "@/api/clients/deleteClients";
import { FaTrash } from "react-icons/fa6";
import SearchInput from "./_components/Search/SearchInput";
import LoadingPage from "@/components/Loading/LoadingPage";
import TableClients from "./_components/Table/TableClients";
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

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState(false);

  const [redirecting, setRedirecting] = useState<number | null>(null); // null when not redirecting

  const { isLoading, error, data } = useQuery<Client[]>({
    queryKey: ["client"],
    queryFn: fetchClientsList,
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
  const { mutate: deleteClient } = useMutation({
    mutationFn: (id: number) => deleteClients(id),
    onSuccess: () => {
      console.log("Deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["client"] });
      setShowSuccess(true); // show alert
      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: (error) => {
      console.error("Error deleting:", error);
    },
  });

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
          <span>client successfully deleted.</span>
        </div>
      )}
      <div className=" bg-white rounded-lg dark:bg-gray-dark">
        {/* Top Controls: Search + Add Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-1">
          <SearchInput
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setCurrentPage={setCurrentPage}
          />

          {/* Add Client Button */}
          <div className="ml-auto">
            <AddClients />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-1 uppercase tracking-wide dark:text-white">
          Clients
        </h1>

        <TableClients
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
