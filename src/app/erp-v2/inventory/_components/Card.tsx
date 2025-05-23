import { FetchInventories, Inventories } from "@/api/inventory/Inventory";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { FaListAlt } from "react-icons/fa";
import { IoGrid, IoGridOutline } from "react-icons/io5";
import AddInventory from "./Modal/AddInventory";
import Export from "./Modal/Export";
import Link from "next/link";
import ServerError from "@/components/Error/ServerError";

const InventoryCard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  const { isLoading, error, data } = useQuery<Inventories[]>({
    queryKey: ["inventory"],
    queryFn: FetchInventories,
  });

  const [isDropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const toggleDropdown = (id: number) => {
    setDropdownOpen((prevId) => (prevId === id ? null : id));
  };

  const filteredData = useMemo(() => {
    return data?.filter(
      (user) =>
        (user.item || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.category || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (user.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  const totalPages = Math.ceil((filteredData?.length || 0) / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData?.slice(indexOfFirstRow, indexOfLastRow);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (isLoading)
    return (
      <div className="p-4 sm:ml-64">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-100 p-4 rounded-lg shadow-md relative"
            >
              {/* Image skeleton */}
              <div className="w-full h-48 bg-gray-300 rounded-md mb-4"></div>

              {/* Title */}
              <div className="h-5 bg-gray-300 rounded w-2/3 mb-2"></div>

              {/* Description */}
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>

              {/* Category */}
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>

              {/* Quantity */}
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>

              {/* Unit */}
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>

              {/* Dropdown Icon */}
              <div className="absolute top-2 right-2 w-6 h-6 bg-gray-300 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );

  // if (error instanceof Error)
  //   return <div>An error has occurred: {error.message}</div>;
  if (error instanceof Error) return <ServerError />;

  const toggleView = () => {
    setViewMode((prevMode) => (prevMode === "grid" ? "list" : "grid"));
  };

  const renderGridView = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data?.map((inventory) => (
          <div
            key={inventory.id}
            className="bg-red-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 relative"
          >
            <img
              src={inventory.photos}
              alt={inventory.item}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h4 className="text-lg font-medium">{inventory.item}</h4>
            <p className="text-sm text-gray-700">{inventory.specification}</p>
            <div className="mt-2">
              <span className="text-sm font-semibold">Category:</span>{" "}
              {inventory.category}
            </div>
            <div className="mt-1">
              <span className="text-sm font-semibold">Quantity:</span>{" "}
              {inventory.quantity}
            </div>
            <div className="mt-1">
              <span className="text-sm font-semibold">Unit:</span>{" "}
              {inventory.unit_of_measurement}
            </div>

            {/* Dropdown button */}
            <div className="absolute top-2 right-2">
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown(inventory.id);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12h12M6 6h12M6 18h12"
                  />
                </svg>
              </button>
              {/* Dropdown menu */}
              {isDropdownOpen === inventory.id && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10">
                  <div className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                    {/* <Link href="{`/erp-v2/inventory/view/${user}`}"> */}
                    <Link href={`/erp-v2/inventory/view/${inventory.id}`}>
                      View
                    </Link>
                  </div>
                  <div className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                    Delete
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderListView = () => (
    <>
      <div className="p-6 rounded-md shadow-md">
        <label className="relative w-full max-w-sm">
          {/* Search Input */}
          <input
            type="search"
            className="dark:text-white w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />

          {/* Search Icon (left) */}
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </g>
          </svg>

          {/* {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              ×
            </button>
          )} */}
        </label>
      </div>

      <div className="overflow-auto rounded-lg shadow-lg border border-gray-600">
        <table className="table-zebra w-full border-t rounded-lg shadow-lg bg-white">
          <thead className="bg-gray-700 text-white uppercase">
            <tr className="text-white-600 ">
              <th className="px-4 py-3 text-center text-lg font-bold">Item</th>
              <th className="px-4 py-3 text-center text-lg font-bold">
                Category
              </th>
              <th className="px-4 py-3 text-center text-lg font-bold">
                Quantity
              </th>
              <th className="px-4 py-3 text-center text-lg font-bold">Unit</th>
              <th className="px-4 py-3 text-center text-lg font-bold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData?.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center text-gray-500 py-4 font-semi-bold dark:text-white dark:bg-gray-dark"
                >
                  No records found
                </td>
              </tr>
            ) : (
              currentRows?.map((inventory, index) => (
                <tr
                  key={inventory.id}
                  className={`transition-colors duration-300 ease-in-out
                ${
                  index % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-900"
                }
                text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}
                >
                  <td className=" text-lg text-center">{inventory.item}</td>
                  <td className=" text-lg text-center ">
                    {inventory.category}
                  </td>
                  <td className=" text-lg text-center ">
                    {inventory.quantity}
                  </td>
                  <td className=" text-lg text-center">
                    {inventory.unit_of_measurement}
                  </td>
                  <td className=" text-xs text-center">
                    <div className="inline-flex gap-2 justify-center">
                      <Link href={`/erp-v2/inventory/view/${inventory.id}`}>
                        <button
                          // className="text-blue-600 hover:underline"
                          className="mt-2 uppercase px-3 py-2 text-xs font-medium text-blue-500 bg-white border border-blue-500 rounded-md  transition flex items-center gap-2"
                        >
                          View
                        </button>
                      </Link>
                      <button
                        // className="text-red-600 hover:underline"
                        className="mt-2 uppercase flex items-center gap-1 bg-white  text-red-800 border border-red-800 px-3 py-1.5 rounded-md text-xs shadow transition duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex justify-end items-center gap-3 p-4 bg-gray-50 border-t dark:bg-gray-dark dark:text-white">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-1.5 bg-gray-700 text-white rounded hover:bg-gray-800 disabled:bg-gray-400 transition"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-1.5 bg-gray-700 text-white rounded hover:bg-gray-800 disabled:bg-gray-400 transition"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div>
        <div className="flex justify-start mb-1 gap-2">
          <AddInventory />
          <Export />
          <button
            className="btn bg-white text-black border border-black"
            onClick={toggleView}
          >
            {viewMode === "grid" ? (
              <>
                {/* <IoGrid className="mr-2" /> */}
                Switch to List View
              </>
            ) : (
              <>
                {/* <FaListAlt className="mr-2" /> */}
                Switch to Grid View
              </>
            )}
          </button>
        </div>

        {viewMode === "grid" && renderGridView()}
        {viewMode === "list" && renderListView()}
      </div>
      {/* <AddInventory /> */}
    </>
  );
};

export default InventoryCard;
