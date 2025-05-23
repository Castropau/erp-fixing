"use client";

import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaPen, FaBan } from "react-icons/fa"; // Import edit and ban icons
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchWithdrawDataById } from "@/api/withdraw-materials/fetchWithdrawId";
import { Field, Form, Formik } from "formik";
import {
  FetchInventoriesData,
  Inventories,
} from "@/api/withdraw-materials/fetchInventory";
import {
  updateWithdraw,
  UpdateWithdraw,
} from "@/api/withdraw-materials/updateWithdraw";
import { User } from "@/interfaces/User";
import { fetchUserList } from "@/api/User/fetchUserList";

// Simulated data for the table (replace with actual data as needed)

function View() {
  const [requestor, setRequestor] = useState("");
  const [dateRequested, setDateRequested] = useState("");
  const [dateNeeded, setDateNeeded] = useState("");
  const [purpose, setPurpose] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false); // New state to track edit mode
  const params = useParams();
  //   const id = Number(params?.id);
  const id = typeof params?.id === "string" ? Number(params.id) : undefined;
  const queryClient = useQueryClient();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "requestor") setRequestor(value);
    if (name === "dateRequested") setDateRequested(value);
    if (name === "dateNeeded") setDateNeeded(value);
    if (name === "purpose") setPurpose(value);
  };

  // Handle modal opening/closing
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Handle selecting a row from the modal
  const handleSelectRow = (row) => {
    const exists = selectedRows.some((item) => item.id === row.id);
    if (!exists) {
      setSelectedRows((prev) => [
        ...prev,
        {
          id: row.id, // This is the correct ID for the material withdrawal row
          quantity: row.quantity,
          inventory_item: {
            id: row.id, // Ensure we are using the correct inventory item ID
            item: row.item,
            unit_of_measurement: row.unit_of_measurement,
            specification: row.specification,
            description: row.description,
          },
        },
      ]);
      toggleModal();
    }
  };

  // Handle the table search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter table data based on search term
  //   const filteredTableData = tableData.filter((row) => {
  //     const normalizedRowName = row.name.replace(/\s+/g, "").toLowerCase();
  //     const normalizedSearchTerm = searchTerm.replace(/\s+/g, "").toLowerCase();
  //     return normalizedRowName.includes(normalizedSearchTerm);
  //   });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with values:", {
      requestor,
      dateRequested,
      dateNeeded,
      purpose,
      selectedRows,
    });
  };

  // Handle cancel action (reset form)
  const handleCancel = () => {
    setRequestor("");
    setDateRequested("");
    setDateNeeded("");
    setPurpose("");
    setSelectedRows([]);
  };
  const {
    data: WithdrawData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["withdraw", id],
    queryFn: () => fetchWithdrawDataById(id!),
    enabled: !!id,
  });
  //   const {
  //     isLoading: InventoriesL,
  //     error: Lerror,
  //     data,
  //   } = useQuery<Inventories[]>({
  //     queryKey: ["inventory"],
  //     queryFn: FetchInventoriesData,
  //   });
  const {
    isLoading: inventoriesLoading,
    error: inventoriesError,
    data: inventoriesData,
  } = useQuery<Inventories[]>({
    queryKey: ["inventory"],
    queryFn: FetchInventoriesData,
  });
  useEffect(() => {
    if (WithdrawData?.material_items) {
      setSelectedRows(WithdrawData.material_items);
    }
  }, [WithdrawData]);

  const { mutate: updatedView } = useMutation({
    mutationFn: (viewData: UpdateWithdraw) => updateWithdraw(id, viewData),
    onSuccess: () => {
      console.log("withdraw updated successfully");
      queryClient.invalidateQueries({ queryKey: ["inventory", id] });
      //   setShowRegisterModal(false); // Close the modal after successful update
    },
    onError: (error) => {
      console.error("Error updating quotation:", error);
    },
  });
  const {
    isLoading: loading,
    error: errors,
    data: UserList,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUserList,
  });

  if (!id) return <div>Loading route params...</div>;
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
  if (isError) return <div>Error fetching data: {error.message}</div>;

  return (
    <>
      <h3 className="font-bold">Withdraw Materials</h3>
      <Link href="/erp-v2/withdraw_materials">
        <button className="btn btn-info text-white uppercase">
          {/* <FaArrowLeft /> */}
          back
        </button>
      </Link>
      <div className="p-6 bg-gray-50 dark:bg-gray-dark dark:text-white">
        <h2 className="text-xl font-bold mb-1">{WithdrawData?.serial_no}</h2>

        {/* Edit/Cancel Icon */}
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)} // Toggle editing mode
          className="absolute top-4 right-4 text-xl"
        >
          {isEditing ? <FaBan /> : <FaPen />}{" "}
          {/* Toggle between edit and ban icon */}
        </button>

        {/* Form Inputs */}
        <Formik
          initialValues={{
            requestor: WithdrawData?.name_of_requestor.id || "",
            dateRequested: WithdrawData?.date_of_request || "",
            dateNeeded: WithdrawData?.date_needed || "",
            purpose: WithdrawData?.purpose || "",
          }}
          onSubmit={(values, { setSubmitting }) => {
            const payload = {
              name_of_requestor: values.requestor,
              created_by: 1,
              date_of_request: values.dateRequested,
              date_needed: values.dateNeeded,
              purpose: values.purpose,
              material_items: selectedRows.map((item) => ({
                inventory_item: item.inventory_item.id, // Use only the ID
                quantity: item.quantity,
              })),
            };

            updatedView(payload);
            console.log(payload);
            setSubmitting(false);
            setIsEditing(false);
          }}
        >
          <Form>
            <div className="mb-1 flex gap-4">
              {/* Name of Requestor */}
              <div className="w-1/3">
                <label className="block text-sm font-medium">
                  Name of Requestor
                </label>
                <Field
                  as="select"
                  name="requestor"
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  disabled={!isEditing}
                >
                  <option value="" disabled>
                    Select Requestor
                  </option>
                  {UserList?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.full_name}
                    </option>
                  ))}
                </Field>
              </div>

              {/* Date of Request */}
              <div className="w-1/3">
                <label className="block text-sm font-medium">
                  Date of Request
                </label>
                <Field
                  name="dateRequested"
                  type="date"
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  readOnly={!isEditing}
                />
              </div>

              {/* Date Needed */}
              <div className="w-1/3">
                <label className="block text-sm font-medium">Date Needed</label>
                <Field
                  name="dateNeeded"
                  type="date"
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  readOnly={!isEditing}
                />
              </div>
            </div>

            {/* Purpose */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Purpose</label>
              <Field
                name="purpose"
                type="text"
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                readOnly={!isEditing}
              />
            </div>

            {/* Button to open Modal */}
            {isEditing && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="w-full bg-blue-500 text-white py-2 rounded-md"
                >
                  Select Items
                </button>
              </div>
            )}

            {/* Display Selected Rows */}
            <div className="mb-4">
              <h3 className="font-bold uppercase mb-2">Selected Items:</h3>
              <div className="overflow-y-auto max-h-64 border rounded-md">
                <table className="min-w-full border-collapse table-auto">
                  <thead className="sticky top-0 bg-gray-400">
                    <tr>
                      <th className="border px-4 py-2 uppercase">ID</th>
                      <th className="border px-4 py-2 uppercase">Name</th>
                      <th className="border px-4 py-2 uppercase">Quantity</th>
                      <th className="border px-4 py-2 uppercase">Unit</th>
                      <th className="border px-4 py-2 uppercase">
                        Specification
                      </th>
                      <th className="border px-4 py-2 uppercase">
                        Description
                      </th>
                      {isEditing && (
                        <th className="border px-4 py-2 uppercase">Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRows.map((item, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2 text-center">
                          {item.inventory_item.id}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {item.inventory_item.item}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {item.quantity}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {item.inventory_item.unit_of_measurement}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {item.inventory_item.specification}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {item.inventory_item.description}
                        </td>
                        {isEditing && (
                          <td className="border px-4 py-2 text-center">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedRows((prev) =>
                                  prev.filter((_, i) => i !== index)
                                )
                              }
                              className="bg-red-500 text-white py-1 px-2 rounded-md"
                            >
                              Remove
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Submit & Cancel */}
            {isEditing && (
              <div className="flex gap-4">
                <Link
                  className="w-full bg-blue-500 text-white text-center py-2 rounded-md"
                  href="/erp-v2/withdraw_materials"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-md"
                >
                  Update
                </button>
              </div>
            )}
          </Form>
        </Formik>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-2/4">
              <h3 className="text-lg font-semibold mb-4">Select Items</h3>

              {/* Search input */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>

              {/* Table */}
              <div className="overflow-y-auto max-h-64 border rounded-md">
                <table className="min-w-full border-collapse table-auto">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">ID</th>
                      <th className="border px-4 py-2">Name</th>
                      <th className="border px-4 py-2">Quantity</th>
                      <th className="border px-4 py-2">Unit</th>
                      <th className="border px-4 py-2">Specification</th>
                      <th className="border px-4 py-2">Description</th>
                      <th className="border px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoriesData?.map((row) => (
                      <tr key={row.id}>
                        <td className="border px-4 py-2">{row.id}</td>
                        <td className="border px-4 py-2">{row.item}</td>
                        <td className="border px-4 py-2">{row.quantity}</td>
                        <td className="border px-4 py-2">
                          {row.unit_of_measurement}
                        </td>
                        <td className="border px-4 py-2">
                          {row.specification}
                        </td>
                        <td className="border px-4 py-2">{row.description}</td>
                        <td className="border px-4 py-2">
                          <button
                            type="button"
                            onClick={() => handleSelectRow(row)}
                            disabled={selectedRows.some(
                              (selected) => selected.id === row.id
                            )}
                            className={`${
                              selectedRows.some(
                                (selected) => selected.id === row.id
                              )
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-500"
                            } text-white py-1 px-2 rounded-md`}
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Close Modal */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={toggleModal}
                  className="bg-red-500 text-white py-2 px-4 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default View;
