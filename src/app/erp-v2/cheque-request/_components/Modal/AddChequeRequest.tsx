"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaCirclePlus } from "react-icons/fa6";
import { Formik, Field, Form, FieldArray } from "formik";
import { AddCheque, registerCheque } from "@/api/cheque-request/CreateCheque";
import { fetchUserLists } from "@/api/cash-request/fetchUsers";
import {
  fetchCashRequest,
  RequisitionCashOptions,
} from "@/api/cheque-request/fetchCashRequest";

export default function AddChequeRequest() {
  const [rows, setRows] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const queryClient = useQueryClient();

  const { mutate: registerChequeRequest } = useMutation({
    mutationFn: registerCheque,
    // mutationFn: (data: AddCheque) => registerCheque(data),
    onSuccess: () => {
      console.log("Cheque successfully registered");
      queryClient.invalidateQueries({ queryKey: ["cheque"] });
      setShowRegisterModal(false);
    },
    onError: (error) => {
      console.error("Error during cheque registration:", error);
    },
  });
  useEffect(() => {
    const newTotalAmount = rows.reduce(
      (acc, row) => acc + parseFloat(row.amount || 0),
      0
    );
    setTotalAmount(newTotalAmount);
  }, [rows]);
  // Fetching users list
  const {
    isLoading: DisLoading,
    error: Derror,
    data: usersList,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUserLists,
  });

  const handleSubmit = (values: any) => {
    console.log("Form data to submit:", values);
    registerCheque(values);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  const { isLoading: isCashLoading, data: cashRecords } = useQuery({
    queryKey: ["cashRecords"],
    queryFn: fetchCashRequest,
  });

  //   const totalAmount = rows.reduce(
  //     (sum, row) => sum + (parseFloat(row.amount) || 0),
  //     0
  //   );

  // Handle adding a row based on cash record selection
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
          date_requested: selectedCashRecord.date_requested,
          description: selectedCashRecord.special_instructions,
          amount: selectedCashRecord.grand_total,
          requested_by: selectedCashRecord.requested_by,
          cheque_no: "",
          remarks: "",
        },
        console.log(selectedCashRecord.id),
      ]);
    }
  };

  // Handle row removal
  const handleRemoveRow = (rowId: number) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== rowId));
  };

  // Handle form submission
  const handleSubmits = (values: any) => {
    const updatedChequeItems = rows.map((row) => ({
      ...row,
      cash_requisition: row.id,
      cheque_no: row.cheque_no,
      remarks: row.remarks,
    }));

    const updatedValues = {
      ...values,
      cheque_requisition_items: updatedChequeItems,
    };

    registerChequeRequest(updatedValues);
  };

  return (
    <>
      <div className="flex justify-end">
        <button
          className="btn bg-white uppercase text-black border border-black"
          onClick={() => setShowRegisterModal(true)}
        >
          {/* <FaCirclePlus className="h-5 btn-info" /> */}
          Add Cheque Request
        </button>
      </div>

      {showRegisterModal && (
        <dialog open className="modal mt-15 backdrop-blur-sm">
          <div className="modal-box w-11/12 max-w-7xl max-h-[80vh] overflow-y-auto dark:bg-gray-dark">
            <h3 className="font-bold text-lg dark:text-white text-center uppercase">
              Create New Cash Request
            </h3>

            <Formik
              initialValues={{
                cheque_requisition_items: [],
                name_of_organization: "",
                payable_to: "",
                address: "",
                purpose: "",
                requested_by: "",
                cheque_no: "",
                date_requested: "",
                serial_no: "",
              }}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form className="">
                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 uppercase"> */}
                  <div className="flex flex-col gap-1 uppercase">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                      {/* Form Fields */}
                      {[
                        {
                          name: "serial_no",
                          type: "select",
                          label: "Set Serial #",
                        }, // Change type to select here
                        { name: "date_requested", type: "date", label: "Date" },
                        {
                          name: "name_of_organization",
                          type: "text",
                          label: "Name of Organization",
                        },
                        { name: "cheque_no", type: "text", label: "cheque no" },
                        {
                          name: "payable_to",
                          type: "text",
                          label: "Payable To",
                        },
                        { name: "address", type: "text", label: "Address" },
                        { name: "purpose", type: "text", label: "Purpose" },
                        {
                          name: "requested_by",
                          type: "select",
                          label: "Requested By",
                          options:
                            usersList?.map((user) => ({
                              value: user.id,
                              label: user.full_name,
                            })) || [],
                        },
                      ].map((item) => (
                        <div key={item.name} className=" dark:text-white">
                          <label
                            htmlFor={item.name}
                            className="block text-sm font-bold text-gray-700 dark:text-white dark:bg-gray-dark"
                          >
                            {item.label}
                          </label>

                          {item.type === "select" ? (
                            <Field
                              as="select"
                              id={item.name}
                              name={item.name}
                              className=" block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:text-white dark:bg-gray-800 dark:border-gray-700 dark:placeholder:text-gray-300"
                            >
                              <option value="">Select {item.label}</option>
                              {item.name === "serial_no"
                                ? values.cheque_requisition_items?.map(
                                    (record: {
                                      id: number;
                                      serial_no: number;
                                    }) => (
                                      <option key={record.id} value={record.id}>
                                        {record.serial_no}
                                      </option>
                                    )
                                  )
                                : item.options?.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                            </Field>
                          ) : item.type === "text" || item.type === "date" ? (
                            <Field
                              type={item.type}
                              id={item.name}
                              name={item.name}
                              className=" block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                          ) : null}
                        </div>
                      ))}
                    </div>

                    <div className="col-span-2">
                      {/* <h2 className="font-bold text-lg dark:bg-gray-dark dark:text-white">
                        Items
                      </h2> */}
                      <FieldArray name="cheque_requisition_items">
                        {({ push, remove }) => (
                          <div>
                            <div className="bg-white p-4 rounded-lg shadow-md mt-1 dark:bg-gray-dark">
                              <table className="min-w-full table-zebra border-collapse border">
                                <thead className="border bg-gray-200">
                                  <tr className="text-blue-500">
                                    <th className="p-2 text-center">
                                      Serial No
                                    </th>
                                    <th className="p-2 text-center">
                                      Date of Purchase
                                    </th>
                                    <th className="p-2 text-center">
                                      Description
                                    </th>
                                    <th className="p-2 text-center">Amount</th>
                                    <th className="p-2 text-center">
                                      Cheque Number
                                    </th>
                                    <th className="p-2 text-center">Remark</th>
                                    <th className="p-2 text-center">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Array.isArray(
                                    values.cheque_requisition_items
                                  ) &&
                                  values.cheque_requisition_items.length > 0 ? (
                                    values.cheque_requisition_items.map(
                                      (item, index) => (
                                        <tr key={index}>
                                          <td className="p-2">
                                            <Field
                                              name={`cheque_requisition_items[${index}].serial_no`}
                                              className="bg-gray-50 border border-gray-300 rounded-lg block w-full p-2.5 dark:bg-gray-dark dark:text-white"
                                              placeholder="Serial No"
                                            />
                                          </td>
                                          <td className="p-2">
                                            <Field
                                              name={`cheque_requisition_items[${index}].date_of_purchase`}
                                              className="bg-gray-50 border border-gray-300 rounded-lg block w-full p-2.5 dark:bg-gray-dark dark:text-white"
                                              placeholder="Date"
                                            />
                                          </td>
                                          <td className="p-2">
                                            <Field
                                              name={`cheque_requisition_items[${index}].description`}
                                              className="bg-gray-50 border border-gray-300 rounded-lg block w-full p-2.5 dark:bg-gray-dark dark:text-white"
                                              placeholder="Description"
                                            />
                                          </td>
                                          <td className="p-2">
                                            <Field
                                              name={`cheque_requisition_items[${index}].amount`}
                                              className="bg-gray-50 border border-gray-300 rounded-lg block w-full p-2.5 dark:bg-gray-dark dark:text-white"
                                              placeholder="Amount"
                                            />
                                          </td>
                                          <td className="p-2">
                                            <Field
                                              name={`cheque_requisition_items[${index}].cheque_no`}
                                              className="bg-gray-50 border border-gray-300 rounded-lg block w-full p-2.5 dark:bg-gray-dark dark:text-white"
                                              placeholder="Cheque No"
                                            />
                                          </td>
                                          <td className="p-2">
                                            <Field
                                              name={`cheque_requisition_items[${index}].remarks`}
                                              className="bg-gray-50 border border-gray-300 rounded-lg block w-full p-2.5 dark:bg-gray-dark dark:text-white"
                                              placeholder="Remarks"
                                            />
                                          </td>
                                          <td className="p-2">
                                            <button
                                              type="button"
                                              onClick={() => remove(index)} // Remove the row from Formik state
                                              // className="text-red-500 hover:text-red-700"
                                              className="flex items-center gap-1 bg-white  text-red-800 border border-red-800 px-3 py-1.5 rounded-md text-xs shadow transition duration-200 uppercase"
                                            >
                                              Remove
                                            </button>
                                          </td>
                                        </tr>
                                      )
                                    )
                                  ) : (
                                    <tr>
                                      <td
                                        colSpan={7}
                                        className="p-2 text-center text-gray-500"
                                      >
                                        No items added yet
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>

                              {/* Cash Record Selection Dropdown */}
                              <select
                                className="bg-gray-50 border border-gray-300 rounded-lg block w-full p-2.5 dark:bg-gray-dark dark:text-white mt-4"
                                onChange={(e) => {
                                  const parsedValue: {
                                    id: number;
                                    serial_no: string;
                                    special_instructions: string;
                                    grand_total: number;
                                    requested_by: string;
                                    date_requested: string;
                                    status: string;
                                  } = JSON.parse(e.target.value);

                                  push({
                                    id: parsedValue.id,
                                    serial_no: parsedValue.serial_no,
                                    cash_requisition: parsedValue.id,
                                    date_of_purchase:
                                      parsedValue.date_requested,
                                    description:
                                      parsedValue.special_instructions,
                                    amount: parsedValue.grand_total,
                                    cheque_no: "",
                                    remark: "",
                                  });

                                  setTotalAmount(
                                    (prevTotal) =>
                                      prevTotal + parsedValue.grand_total
                                  );
                                }}
                              >
                                <option value="">Select Cash Record</option>
                                {isCashLoading ? (
                                  <option value="">
                                    Loading cash records...
                                  </option>
                                ) : (
                                  cashRecords?.map((cash) => (
                                    <option
                                      key={cash.id}
                                      value={JSON.stringify(cash)}
                                    >
                                      {cash.serial_no}
                                    </option>
                                  ))
                                )}
                              </select>
                            </div>
                          </div>
                        )}
                      </FieldArray>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between ">
                    {/* Only show the Select Cash Record dropdown if in editing mode */}
                    {isEditing && (
                      <select
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
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
                  <div className="mt-4 flex justify-end dark:bg-gray-dark dark:text-white">
                    <span className="font-semibold text-lg">
                      Total: ₱{totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="modal-action">
                    <button type="submit" className="btn">
                      Submit
                    </button>
                    <button
                      className="btn"
                      type="button"
                      onClick={() => setShowRegisterModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </dialog>
      )}
    </>
  );
}
