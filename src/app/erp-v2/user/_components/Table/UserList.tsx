"use client";

import { useQuery } from "@tanstack/react-query";
/**state */
import React, { useState, useMemo } from "react";

/** api */

/** components */
const PersonalInformation = React.lazy(
  () => import("../Modal/PersonalInformation")
);
// import PersonalInformation from "../Modal/PersonalInformation";
import ModuleAccess from "../Modal/ModuleAccess";
import { FaCirclePlus } from "react-icons/fa6";
import CreateUser from "../Modal/CreateUser";
import SearchInput from "../Search/SearchInput";
import TableUsers from "./TableUsers";
import { fetchUserList, Users } from "@/api/User/fetchUserList";
import ActiveInactive from "../Card/ActiveInactive";
import ServerError from "@/components/Error/ServerError";

export default function UserList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const { isLoading, error, data } = useQuery<Users[]>({
    queryKey: ["users"],
    queryFn: fetchUserList,
  });

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          {/* Loading Spinner */}
          <div className="w-16 h-16 border-4 border-t-4 border-gray-800 border-dashed rounded-full animate-spin"></div>

          <span className="text-lg text-gray-700">Please wait...</span>
        </div>
      </div>
    );
  }

  // if (error instanceof Error)
  //   return <div>An error has occurred: {error.message}</div>;
  if (error instanceof Error) return <ServerError />;

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

  return (
    <>
      <div className="p-1 bg-white rounded-lg  dark:bg-gray-700">
        {/* Information Text */}
        <div className="bg-gray-200 p-4 rounded-md mb-1 dark:bg-gray-400">
          <span className="text-sm text-gray-600 font-semibold">
            This page contains user information. You can{" "}
            <strong>EDIT your DETAILS</strong> by clicking on "Personal
            Information." The "Module Access" section controls permissions for
            CRUD operations (Create, Read, Update, Delete).
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-1">
          <SearchInput
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setCurrentPage={setCurrentPage}
          />
          <div className="ml-auto">
            <CreateUser />
          </div>
        </div>

        <TableUsers data={paginatedData} />

        <div className="flex justify-end items-center mt-6 gap-3 text-sm">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:bg-gray-500 hover:bg-gray-800 transition"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:bg-gray-500 hover:bg-gray-800 transition"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-1">
        <span className="text-sm text-black font-semibold p-2 rounded-md">
          This page displays user information. Currently, there are,
          <strong>123</strong> users in total, with <strong>123</strong> active
          users and <strong>123</strong> inactive users.
        </span>

        <ActiveInactive />
      </div>
    </>
  );
}
