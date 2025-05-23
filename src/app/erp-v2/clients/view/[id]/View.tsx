"use client";
import { Formik, Form, Field } from "formik";
import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChequeItems } from "@/api/cheque-request/fetchItems";
import { ChequeUnits } from "@/api/cheque-request/fetchUnits";
import { UpdateItems, updateItems } from "@/api/cheque-request/UpdateItem";
import {
  updateLocation,
  UpdateLocation,
} from "@/api/cheque-request/UpdateLocation";
import { deleteItem } from "@/api/cheque-request/DeleteItem";
import { deleteLocation } from "@/api/cheque-request/DeleteLocation";
import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io";
// import ViewClients from "../../_components/Modal/ViewClients";
import { useParams } from "next/navigation";
import { fetchClientDataById } from "@/api/clients/fetchClientsView";
import ViewClients from "../../_components/Modal/ViewClients";
import { updateClient, UpdateClient } from "@/api/clients/updateClient";
import ViewQuo from "../../_components/ViewQuo";

function View() {
  const [isEditable, setIsEditable] = useState(false); // State to toggle between edit and view mode
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermLocation, setSearchTermLocation] = useState("");
  const [currentPageItems, setCurrentPageItems] = useState(1);
  const [currentPageUnits, setCurrentPageUnits] = useState(1);

  const params = useParams();
  const id = Number(params?.id);

  const handleEditToggle = () => {
    setIsEditable(!isEditable);
  };
  const handleCancel = () => {
    setIsEditable(false); // Switch back to readonly mode without saving
  };
  const queryClient = useQueryClient();

  const rowsPerPage = 10;

  const {
    isLoading: isItemsLoading,
    error: itemsError,
    data: itemsData,
  } = useQuery({
    queryKey: ["items"],
    queryFn: ChequeItems,
  });
  const {
    data: VendorData,
    isLoading: isCLoading,
    isError: cerror,
    error: cerrors,
  } = useQuery({
    queryKey: ["client", id],
    queryFn: () => fetchClientDataById(id),

    enabled: !!id,
  });

  const {
    isLoading: isUnitsLoading,
    error: UnitsError,
    data: unitsData,
  } = useQuery({
    queryKey: ["units"],
    queryFn: ChequeUnits,
  });
  const { mutate: updateClients } = useMutation({
    mutationFn: (data: UpdateClient) => updateClient(VendorData!.id, data),
    onSuccess: () => {
      console.log("vendor updated successfully");

      queryClient.invalidateQueries({ queryKey: ["client", id] });
      queryClient.invalidateQueries({ queryKey: ["client"] });
      setShowEditModal(false);
    },
    onError: (error) => {
      console.error("Error updating cheque:", error);
    },
  });

  // const filteredQuotations = VendorData?.quotations.filter(
  //   (q) =>
  //     q.project_name
  //       ?.toLowerCase()
  //       .includes(searchTermLocation.toLowerCase()) ||
  //     q.quotation_no?.toLowerCase().includes(searchTermLocation.toLowerCase())
  // );

  const newVendorData = VendorData?.quotations.filter((data) =>
    Object.values(data).some(
      (val) =>
        typeof val == "string" &&
        val
          .toLocaleLowerCase()
          .includes(searchTermLocation?.toLocaleLowerCase() || "")
    )
  );

  const indexOfLastRowUnits = currentPageUnits * rowsPerPage;
  const indexOfFirstRowUnits = indexOfLastRowUnits - rowsPerPage;
  // const currentUnitsRows = filteredQuotations?.slice(
  //   indexOfFirstRowUnits,
  //   indexOfLastRowUnits
  // );
  const paginatedVendorData = newVendorData?.slice(
    (currentPageUnits - 1) * rowsPerPage,
    currentPageUnits * rowsPerPage
  );

  const totalPagesUnits = Math.ceil((newVendorData?.length || 0) / rowsPerPage);
  // const totalPagesItems = Math.ceil((itemsData?.length || 0) / rowsPerPage);
  // const totalPagesUnits = Math.ceil((unitsData?.length || 0) / rowsPerPage);

  const filteredItemsData = itemsData?.filter((item) =>
    item.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUnitsData = unitsData?.filter((location) =>
    location.unit_of_measurement
      .toLowerCase()
      .includes(searchTermLocation.toLowerCase())
  );
  // const totalPagesUnits = Math.ceil(
  //   (filteredUnitsData?.length || 0) / rowsPerPage
  // );
  const indexOfLastRowItems = currentPageItems * rowsPerPage;
  const indexOfFirstRowItems = indexOfLastRowItems - rowsPerPage;

  // const indexOfLastRowUnits = currentPageUnits * rowsPerPage;
  // const indexOfFirstRowUnits = indexOfLastRowUnits - rowsPerPage;
  // const currentUnitsRows = filteredUnitsData?.slice(
  //   indexOfFirstRowUnits,
  //   indexOfLastRowUnits
  // );

  const handlePrevUnits = () => {
    if (currentPageUnits > 1) setCurrentPageUnits(currentPageUnits - 1);
  };

  const handleNextUnits = () => {
    if (currentPageUnits < totalPagesUnits)
      setCurrentPageUnits(currentPageUnits + 1);
  };

  if (isCLoading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          {/* Loading Spinner */}
          <div className="dark:border-gray-200 dark:border-t-white  w-16 h-16 border-4 border-t-4 border-gray-800 border-dashed rounded-full animate-spin"></div>

          <span className="text-lg text-gray-700 dark:text-white">
            Please wait...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="ml-auto">
        <Link href="/erp-v2/clients">
          <button className="btn bg-white border border-black text-black uppercase">
            {/* <IoMdArrowBack /> */}
            Back to Clients
          </button>
        </Link>
      </div>
      {/* <div className="grid grid-cols-2 gap-6"> */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold dark:text-white">
              Personal Information
            </h2>
            <div className="flex gap-2">
              {!isEditable ? (
                <button
                  onClick={handleEditToggle}
                  className="uppercase px-4 py-2 text-blue-800 bg-white rounded-lg  border border-blue-800"
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-800 bg-white rounded-lg border border-gray-800 uppercase"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <img
              src="https://via.placeholder.com/100"
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-gray-300"
            />
            <span className=" text-lg text-center font-bold uppercase">
              {VendorData?.client}
            </span>
          </div>

          {/* Formik Form */}
          <Formik
            initialValues={{
              client: VendorData?.client || "",
              address: VendorData?.address || "",
              contact_person: VendorData?.contact_person || "",
              position: VendorData?.position || "",
              contact_number: VendorData?.contact_number || "",
              email: VendorData?.email || "",
            }}
            enableReinitialize={true}
            onSubmit={(values) => {
              updateClients(values);
            }}
          >
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Input Fields */}
              {[
                {
                  type: "text",
                  name: "client",
                  placeholder: "Vendor",
                  label: "Client",
                },
                {
                  type: "text",
                  name: "address",
                  placeholder: "Enter address",
                  label: "Address",
                },
                {
                  type: "text",
                  name: "contact_person",
                  placeholder: "Enter contact person",
                  label: "Contact Person",
                },
                {
                  type: "text",
                  name: "position",
                  placeholder: "Enter position",
                  label: "Position",
                },
                {
                  type: "text",
                  name: "contact_number",
                  placeholder: "Enter contact number",
                  label: "Contact Number",
                },
                {
                  type: "email",
                  name: "email",
                  placeholder: "Enter email",
                  label: "Email",
                },
              ].map((item) => (
                <div key={item.name} className="flex flex-col space-y-1">
                  <label
                    htmlFor={item.name}
                    className="uppercase text-sm font-semibold text-gray-700 dark:text-white"
                  >
                    {item.label}
                  </label>
                  <Field
                    type={item.type}
                    id={item.name}
                    name={item.name}
                    placeholder={item.placeholder}
                    readOnly={!isEditable}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <table className="min-w-full table-zebra border-collapse border border-black">
                  <thead className="border border-black">
                    <tr className="text-blue-500 uppercase bg-gray-200 ">
                      <th className="p-2 text-center">created by</th>
                      <th className="p-2 text-center">date created </th>

                      {/* <th className="p-2 text-center">Actions</th> */}
                    </tr>
                  </thead>
                  {/* <tbody>
                  {VendorData?.quotations?.map((quotation) => (
                    <tr key={quotation.id} className="border-b">
                      <td className="p-2">{quotation.quotation_no}</td>
                      <td className="p-2">{quotation.project_name}</td>
                      <td className="p-2">
                        <button
                          //   onClick={() => handleViewQuotation(quotation.id)}
                          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                        >
                          View
                        </button>
                        <ViewQuo id={quotation.id} />
                      </td>
                    </tr>
                  ))}
                </tbody> */}
                  <tbody>
                    {VendorData?.quotations &&
                    VendorData.quotations.length > 0 ? (
                      VendorData.quotations.map((quotation) => (
                        <tr key={quotation.id} className="border-b">
                          <td className="p-2 text-center">
                            {quotation.created_by}
                          </td>
                          <td className="p-2 text-center">
                            {VendorData.date_created}
                          </td>
                          {/* <td className="p-2 flex justify-center items-center">
                          <ViewQuo id={quotation.id} />
                        </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="p-4 text-center text-gray-500"
                        >
                          No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Submit Button */}
              {isEditable && (
                <div className="modal-action">
                  <button
                    type="submit"
                    className="px-4 py-2 text-black bg-white uppercase border border-black rounded-lg hover:bg-green-600"
                  >
                    Update
                  </button>
                </div>
              )}
            </Form>
          </Formik>
        </div>

        {/* Second Column: Table */}
        <div className="bg-white p-4 rounded-lg shadow-md dark:bg-gray-700 dark:text-white">
          {/* <AddUnit /> */}
          {isUnitsLoading ? (
            <div>Loading locations...</div>
          ) : (
            <>
              <input
                type="search"
                className="w-120 mb-4 p-2 border rounded"
                placeholder="Search"
                value={searchTermLocation}
                onChange={(e) => {
                  setSearchTermLocation(e.target.value);
                  setCurrentPageUnits(1);
                }}
              />
              <table className="min-w-full table-zebra border-collapse border border-black">
                <thead className="border border-black">
                  <tr className="text-blue-500 uppercase bg-gray-200 ">
                    <th className="p-2 text-center">Quotation #</th>
                    <th className="p-2 text-center">Product Name</th>

                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                {/* <tbody>
                  {VendorData?.quotations?.map((quotation) => (
                    <tr key={quotation.id} className="border-b">
                      <td className="p-2">{quotation.quotation_no}</td>
                      <td className="p-2">{quotation.project_name}</td>
                      <td className="p-2">
                        <button
                          //   onClick={() => handleViewQuotation(quotation.id)}
                          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                        >
                          View
                        </button>
                        <ViewQuo id={quotation.id} />
                      </td>
                    </tr>
                  ))}
                </tbody> */}
                <tbody>
                  {paginatedVendorData && paginatedVendorData.length > 0 ? (
                    paginatedVendorData.map((unit) => (
                      <tr key={unit.id} className="border-b">
                        <td className="p-2 text-center">{unit.quotation_no}</td>
                        <td className="p-2 text-center">{unit.project_name}</td>
                        <td className="p-2 flex justify-center items-center">
                          <ViewQuo id={unit.id} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-gray-500">
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="flex justify-end items-center mt-4 gap-2">
                <button
                  onClick={handlePrevUnits}
                  className="btn bg-blue-500 text-xs text-white hover:bg-blue-600 disabled:bg-gray-300"
                  disabled={currentPageUnits === 1}
                >
                  Previous
                </button>
                <span className="text-xs mr-2">
                  Page {currentPageUnits} of {totalPagesUnits}
                </span>
                <button
                  onClick={handleNextUnits}
                  className="btn bg-blue-500 text-xs text-white hover:bg-blue-600 disabled:bg-gray-300"
                  disabled={currentPageUnits === totalPagesUnits}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default View;
