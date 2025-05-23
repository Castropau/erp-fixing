"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  IoMdArrowBack,
  IoMdCreate,
  IoMdMore,
  IoMdPrint,
  IoMdCloseCircle,
} from "react-icons/io";
import Link from "next/link";

import {
  QueryClient,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import { ChequeId, fetchChequeById } from "@/api/cheque-request/fetchChequeId";

import { fetchUserLists } from "@/api/cheque-request/fetchUsersCheque";
import {
  fetchCashRequest,
  RequisitionCashOptions,
} from "@/api/cheque-request/fetchCashRequest";
import { ChequeUpdate, updateCheque } from "@/api/cheque-request/updateCheque";
import LoadingPage from "@/components/Loading/LoadingPage";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

interface PageProps {}

function Detail(props: PageProps) {
  const [cheque, setCheque] = useState<ChequeId | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [selectedCashRecord, setSelectedCashRecord] =
    useState<RequisitionCashOptions | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const pathname = usePathname();
  const id = pathname?.split("/").pop();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (id) {
      fetchChequeById(id as string)
        .then((data) => {
          setCheque(data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Error fetching cheque details.");
          setLoading(false);
        });
    }
  }, [id]);

  const {
    isLoading,
    error: userError,
    data,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUserLists,
  });

  const { isLoading: isCashLoading, data: cashRecords } = useQuery({
    queryKey: ["cashRecords"],
    queryFn: fetchCashRequest,
  });

  // const { mutate: updatedCheque } = useMutation({
  //   mutationFn: (data: UpdateCheque) => updateCheque(cheque!.id, data),
  //   onSuccess: () => {
  //     console.log("cheque updated successfully");
  //     queryClient.invalidateQueries({ queryKey: ["cheque", id] });
  //     queryClient.invalidateQueries({ queryKey: ["cheque"] });
  //     setShowEditModal(false);
  //   },
  //   onError: (error) => {
  //     console.error("Error updating cheque:", error);
  //   },
  // });

  const { mutate: updatedCheque } = useMutation({
    mutationFn: (data: ChequeUpdate) => updateCheque(cheque!.id, data),
    onSuccess: () => {
      console.log("cheque updated successfully");
      queryClient.invalidateQueries({ queryKey: ["cheque", id] });
      queryClient.invalidateQueries({ queryKey: ["cheque"] });
      setShowEditModal(false);
    },
    onError: (error) => {
      console.error("Error updating cheque:", error);
    },
  });

  // const handleAddRow = (cashId: number) => {
  //   const selectedCash = cashRecords?.find((cash) => cash.id === cashId);
  //   if (selectedCash) {
  //     setRows((prevRows) => [
  //       ...prevRows,
  //       {
  //         id: selectedCash.id,
  //         cash_record: selectedCash,
  //       },
  //     ]);
  //   }
  // };
  const handleAddRow = (cashRequisitionId: number) => {
    const selectedCashRecord = cashRecords?.find(
      (item: RequisitionCashOptions) => item.id === cashRequisitionId
    );

    if (selectedCashRecord) {
      setRows((prevRows) => [
        ...prevRows,
        {
          id: selectedCashRecord.id,
          cash_requisition: selectedCashRecord.id,
          serial_no: selectedCashRecord.serial_no,
          date_of_purchase: selectedCashRecord.date_requested,
          date_requested: selectedCashRecord.date_requested,
          description: selectedCashRecord.special_instructions,
          amount: selectedCashRecord.grand_total,
          requested_by: selectedCashRecord.requested_by,
          cheque_number: "",
          remarks: "",

          // cheque_number: selectedCashRecord.serial_no,
          // remarks: selectedCashRecord.special_instructions,
        },
      ]);
      setSelectedCashRecord(selectedCashRecord);
    }
  };

  // const handleRemoveRow = (rowId: number) => {
  //   setRows((prevRows) => prevRows.filter((row) => row.id !== rowId));
  // };
  // const handleRemoveRow = (rowId: number) => {
  //   // Remove from the rows state
  //   setRows((prevRows) => prevRows.filter((row) => row.id !== rowId));

  //   // Optionally, you can also remove it from cheque.cheque_requisition_items (if needed)
  //   setCheque((prevCheque) => ({
  //     ...prevCheque,
  //     cheque_requisition_items: prevCheque.cheque_requisition_items.filter(
  //       (item) => item.id !== rowId
  //     ),
  //   }));
  // };
  const handleRemoveRow = (rowId: number) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== rowId));
    setCheque((prevCheque) => {
      if (!prevCheque) return null;

      return {
        ...prevCheque,
        cheque_requisition_items: prevCheque.cheque_requisition_items.filter(
          (item) => item.id !== rowId
        ),
      };
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div>{error}</div>;

  if (!cheque) return <div>No cheque found.</div>;

  // Calculate total amount of cheque requisition items
  const totalAmount =
    cheque.cheque_requisition_items?.reduce(
      (total, item) => total + item.amount,
      0
    ) || 0;

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="p-4">
      <div className="ml-auto">
        <Link href="/erp-v2/cheque-request">
          <button className="btn bg-white text-black border border-black uppercase">
            {/* <IoMdArrowBack /> */}
            Back to Cheque List
          </button>
        </Link>
      </div>

      {/* Formik Form */}
      <div className="bg-white p-4 rounded-lg dark:bg-gray-dark dark:text-white">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-2xl font-semibold mb-1 dark:bg-gray-dark dark:text-white">
            {cheque.serial_no}
          </h3>
          <div className="flex gap-4">
            <IoMdPrint className="cursor-pointer text-lg" title="Print" />
            <button onClick={handleEditToggle}>
              {isEditing ? (
                <IoMdCloseCircle
                  className="cursor-pointer text-lg"
                  title="Cancel Edit"
                />
              ) : (
                <IoMdCreate className="cursor-pointer text-lg" title="Edit" />
              )}
            </button>
            <IoMdMore className="cursor-pointer text-lg" title="More options" />
          </div>
        </div>

        <Formik
          initialValues={{
            serial_no: cheque.serial_no || "",
            // date_of_purchase: cheque.date_of_purchase || "",
            purpose: cheque.purpose || "",
            address: cheque.address || "",
            payable_to: cheque.payable_to || "",
            name_of_organization: cheque.name_of_organization || "",
            requested_by: cheque.requested_by?.id || "",
            date_requested: cheque.date_requested || "",
            // status: cheque.status || "",
            remarks: cheque.remarks || "",
            cheque_requisition_items: cheque.cheque_requisition_items,
          }}
          enableReinitialize={true}
          onSubmit={(values) => {
            // const updatedChequeItems = rows.map((row) => ({
            //   ...row,
            //   cheque_number: row.cheque_number,
            //   remarks: row.remarks,
            //   date_of_purchase: row.date_requested,
            // }));
            // const updatedChequeItems = [
            //   ...cheque.cheque_requisition_items, // Include existing items
            //   ...rows, // Include new rows
            // ];
            const updatedChequeItems = [
              ...cheque.cheque_requisition_items,
              ...rows.map((row) => ({
                ...row,
                date_of_purchase: row.date_of_purchase || row.date_requested,
                cheque_number: row.cheque_number,
                remarks: row.remarks,
              })), // Include new rows
            ];

            // const updatedValues = {
            //   ...values,
            //   cheque_requisition_items: updatedChequeItems,
            // };
            // const updatedValues = {
            //   ...values,
            //   cheque_requisition_items: updatedChequeItems.map((row) => ({
            //     ...row,
            //     cheque_number: row.cheque_number, // Ensure cheque number is updated
            //     remarks: row.remarks, // Ensure remarks are updated
            //     date_of_purchase: row.date_requested, // Update date_of_purchase to date_requested
            //   })),
            // };
            const updatedValues = {
              ...values,
              cheque_requisition_items: updatedChequeItems,
            };

            updatedCheque(updatedValues);
            console.log(updatedValues);
          }}
        >
          <Form>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 uppercase">
              {/* Form Fields for Cheque Details */}
              {isEditing && (
                <div className="space-y-4">
                  <label className="block mb-1 text-sm font-bold text-gray-900 dark:bg-gray-dark dark:text-white">
                    Serial#
                  </label>
                  <Field
                    as="select"
                    name="serial_no"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-dark dark:text-white"
                    // disabled={!isEditing}
                  >
                    <option value="">Select Serial No</option>
                    {[...cheque.cheque_requisition_items, ...rows].map(
                      (item) => (
                        <option key={item.id} value={item.serial_no}>
                          {item.serial_no}
                        </option>
                      )
                    )}
                  </Field>
                </div>
              )}
              {/* Requested By Field */}
              <div className="space-y-1">
                <label className="block mb-1 text-sm font-bold text-gray-900 dark:bg-gray-dark dark:text-white">
                  Requested By
                </label>
                {isEditing ? (
                  <Field
                    as="select"
                    name="requested_by"
                    className="bg-gray-50 border dark:bg-gray-dark dark:text-white border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  >
                    {isLoading ? (
                      <option value="">Loading users...</option>
                    ) : (
                      data?.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.full_name}
                        </option>
                      ))
                    )}
                  </Field>
                ) : (
                  <Field
                    type="text"
                    id="requested_by"
                    name="requested_by"
                    className="bg-gray-50 border border-gray-300 dark:bg-gray-dark dark:text-white text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={cheque.requested_by?.full_name || ""}
                    readOnly
                  />
                )}
              </div>

              {/* Input fields for Purpose, Date Requested, Organization, Payable to, Address */}
              {[
                {
                  type: "text",
                  name: "purpose",
                  label: "Purpose",
                  placeholder: "Enter the purpose",
                },
                {
                  type: "date",
                  name: "date_requested",
                  label: "Date Requested",
                },
                {
                  type: "text",
                  name: "name_of_organization",
                  label: "Name of Organization",
                  placeholder: "Organization",
                },
                {
                  type: "text",
                  name: "payable_to",
                  label: "Payable To",
                  placeholder: "Payee",
                },
                {
                  type: "text",
                  name: "address",
                  label: "Address",
                  placeholder: "Organization Address",
                },
              ].map((field) => (
                <div key={field.name} className="space-y-4 uppercase ">
                  <label className="block mb-1 text-sm font-bold text-gray-900 dark:bg-gray-dark dark:text-white">
                    {field.label}
                  </label>
                  <Field
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    className="bg-gray-50 border dark:bg-gray-dark dark:text-white border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder={field.placeholder}
                    readOnly={!isEditing} // Toggle read-only based on isEditing
                  />
                </div>
              ))}

              {/* Discount Field */}
              <div className="space-y-4">
                {/* <label className="block mb-2 text-sm font-medium text-gray-900">
                  Discount
                </label>
                <Field
                  type="number"
                  name="discount"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  readOnly={!isEditing} // Disable when not in edit mode
                /> */}
              </div>

              {/* Show the Update button only if in editing mode */}
              {/* {isEditing && (
                <button
                  type="submit"
                  className="w-full text-white bg-info focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-sm px-5 py-2.5 text-center mt-4 hover:shadow-lg transition-all duration-200 ease-in-out"
                >
                  Update
                </button>
              )} */}
            </div>
            {isEditing && (
              <button
                type="submit"
                className="uppercase text-black bg-white border border-black focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-sm px-5 py-2.5 text-center mt-4 hover:shadow-lg transition-all duration-200 ease-in-out"
              >
                Update
              </button>
            )}
          </Form>
        </Formik>
      </div>

      {/* Table to display cheque items */}
      {/* Table to display cheque items */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-1 dark:bg-gray-dark dark:text-white">
        <table className="min-w-full table-zebra border-collapse">
          <thead>
            <tr className="text-blue-500 uppercase border border-black bg-gray-200">
              <th className="p-2 text-center">Serial No</th>
              <th className="p-2 text-center">Date of Purchase</th>
              <th className="p-2 text-center">Description</th>
              <th className="p-2 text-center">Amount</th>
              <th className="p-2 text-center">Cheque Number</th>
              <th className="p-2 text-center">Remark</th>
              {isEditing && <th className="p-2 text-center">Action</th>}
            </tr>
          </thead>
          <tbody>
            {cheque.cheque_requisition_items?.map((item) => (
              <tr key={item.id} className="text-center border border-black">
                <td className="p-2">{item.serial_no}</td>
                <td className="p-2">{item.date_of_purchase}</td>
                <td className="p-2">{item.description}</td>
                <td className="p-2">{item.amount}</td>
                <td className="p-2">{item.cheque_number}</td>
                <td className="p-2">{item.remarks}</td>
                {/* <td className="p-2">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveRow(item.id)}
                  >
                    Remove
                  </button>
                </td> */}
                {isEditing && ( // Conditionally render Remove button
                  <td className="p-2">
                    <button
                      className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs shadow transition duration-200 uppercase"
                      // className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveRow(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {/* Loop through added rows */}
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="p-2">{row.serial_no}</td>
                <td className="p-2">
                  <input
                    type="text"
                    value={row.date_requested}
                    onChange={(e) => {
                      const updatedRow = {
                        ...row,
                        date_requested: e.target.value,
                      };
                      setRows((prevRows) =>
                        prevRows.map((r) => (r.id === row.id ? updatedRow : r))
                      );
                    }}
                    className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 transition duration-200 ease-in-out"
                    readOnly={!isEditing}
                  />
                </td>
                <td className="p-2">{row.description}</td>
                <td className="p-2">{row.amount}</td>
                <td className="p-2">
                  <input
                    type="text"
                    value={row.cheque_number}
                    onChange={(e) => {
                      const updatedRow = {
                        ...row,
                        cheque_number: e.target.value,
                      };
                      setRows((prevRows) =>
                        prevRows.map((r) => (r.id === row.id ? updatedRow : r))
                      );
                    }}
                    className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 transition duration-200 ease-in-out"
                    readOnly={!isEditing}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={row.remarks}
                    onChange={(e) => {
                      const updatedRow = { ...row, remarks: e.target.value };
                      setRows((prevRows) =>
                        prevRows.map((r) => (r.id === row.id ? updatedRow : r))
                      );
                    }}
                    className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 transition duration-200 ease-in-out"
                    readOnly={!isEditing}
                  />
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleRemoveRow(row.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-between">
          {/* Only show the Select Cash Record dropdown if in editing mode */}
          {isEditing && (
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-dark dark:text-white"
              onChange={(e) => handleAddRow(Number(e.target.value))}
            >
              <option value="">Select Cash Record</option>
              {isCashLoading ? (
                <option value="">Loading cash records...</option>
              ) : (
                cashRecords?.map((cash: any) => (
                  <option key={cash.id} value={cash.id}>
                    {cash.serial_no}
                  </option>
                ))
              )}
            </select>
          )}
        </div>

        {/* Total Display */}
        <div className="mt-4 flex justify-end">
          <span className="font-semibold text-lg">
            Total: ₱{totalAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Detail;
