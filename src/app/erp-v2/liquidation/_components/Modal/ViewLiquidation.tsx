"use client";

import React, { useState, useEffect } from "react";
import { CiCirclePlus, CiEdit } from "react-icons/ci"; // Import the Edit icon
import { Field, Form, Formik, FieldArray } from "formik";

/** api */
import { CreateCategory } from "@/api/inventory/CreateCategory";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/** interfaces */
import { fetchDepartmentsList } from "@/api/User/fetchDepartmentList";
import { fetchUserList } from "@/api/User/fetchUserList";
import { FaBan, FaEye } from "react-icons/fa";
import { fetchLiquidationDataById } from "@/api/liquidations/fetchView";
import { UpdateView, updateView } from "@/api/liquidations/updateView";
import LoadingId from "@/components/Loading/LoadingId";

interface LiquidationId {
  id: number;
}

export default function ViewLiquidation(props: LiquidationId) {
  const { id } = props;
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: liquidationData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["liquidation", id],
    queryFn: () => fetchLiquidationDataById(id),
    enabled: !!id,
  });

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchDepartmentsList,
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUserList,
  });

  useEffect(() => {
    // console.log(liquidationData?.project_name); // Check the value here
  }, [liquidationData]);

  const { mutate: updatedView } = useMutation({
    mutationFn: (data: UpdateView) => updateView(id, data),
    onSuccess: () => {
      console.log("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["liquidation", id] });
      setShowRegisterModal(false); // Close the modal after successful update
    },
    onError: (error) => {
      console.error("Error updating liquidation:", error);
    },
  });

  const handleSubmit = (values: any) => {
    // Prepare the form data for submission
    const updatedLiquidationData = {
      ...values,
      liquidation_no: liquidationData?.liquidation_no, // Ensure you're passing all necessary fields
      task_notes: values.notesRows.map((note: any) => ({
        ...note,
        items: note.items.map((item: any) => ({
          ...item,
          order: parseInt(item.order, 10), // Ensure order is an integer
        })),
      })),
      liquidation_particulars: values.tableRows.map((row: any) => ({
        ...row,
        // expenses: parseFloat(row.expenses),
        // cash_from_accounting: parseFloat(row.cashFromAccounting),
        // balance: parseFloat(row.balance),
        expenses: parseFloat(row.expenses) || 0, // Ensure it's a number, default to 0
        cash_from_accounting: parseFloat(row.cashFromAccounting) || 0, // Ensure it's a number, default to 0
        balance: parseFloat(row.balance) || 0, // Ensure it's a number, default to 0
      })),
    };
    updatedView(updatedLiquidationData); // Call mutation
    console.log(updatedLiquidationData);
  };
  const handleRowFieldChange = (
    index: number,
    field: string,
    value: any,
    setFieldValue: any,
    values: any
  ) => {
    setFieldValue(`tableRows[${index}].${field}`, value);

    if (field === "expenses" || field === "cash_from_accounting") {
      const expenses = parseFloat(values.tableRows[index].expenses) || 0;
      const cashFromAccounting =
        parseFloat(values.tableRows[index].cash_from_accounting) || 0;

      const balance = expenses - cashFromAccounting;
      setFieldValue(`tableRows[${index}].balance`, balance.toString());
    }
  };

  if (isLoading) {
    return <LoadingId />;
  }

  if (isError) {
    return (
      <div>
        Error loading liquidation data: {error?.message || "Unknown error"}
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-start">
        <button
          className="uppercase flex items-center gap-2 bg-white  text-blue-800 border border-blue-800 px-4 py-2 rounded-md shadow transition duration-200"
          onClick={() => setShowRegisterModal(true)}
        >
          {/* <FaEye className="w-6 h-6 btn-info" /> */}
          View
        </button>
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <dialog open className="modal mt-15 backdrop-blur-sm">
          <div className="modal-box w-11/12 max-w-7xl max-h-[80vh] overflow-y-auto dark:bg-gray-dark">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Cash Request</h3>
              {/* Toggle between CiEdit and CiCircleBan based on editability */}
              {/* {isEditable ? (
                <FaBan
                  onClick={() => setIsEditable(false)} // Switch to readonly mode
                  className="w-6 h-6 cursor-pointer"
                />
              ) : (
                <CiEdit
                  onClick={() => setIsEditable(true)} // Switch to editable mode
                  className="w-6 h-6 cursor-pointer"
                />
              )} */}
              {isEditable ? (
                <span
                  onClick={() => setIsEditable(false)} // Switch to readonly mode
                  className="text-red-600 uppercase hover:underline cursor-pointer font-medium"
                >
                  Cancel
                </span>
              ) : (
                <span
                  onClick={() => setIsEditable(true)} // Switch to editable mode
                  className="text-blue-600 uppercase hover:underline cursor-pointer font-medium"
                >
                  Edit
                </span>
              )}
            </div>

            <Formik
              initialValues={{
                // projectName: liquidationData?.project_name || "",
                project_name: liquidationData?.project_name || "",
                projectDate: liquidationData?.date || "",
                remmitted_by: liquidationData?.remitted_by?.id || "",
                receivedBy: liquidationData?.received_by?.id || "",
                // tableRows: liquidationData?.liquidation_particulars.map(
                //   (particular) => ({
                //     date: particular.date || "",
                //     particulars: particular.particulars || "",
                //     expenses: particular.expenses || "",
                //     cashFromAccounting: particular.cash_from_accounting || "",
                //     balance: particular.balance || "",
                //     vatIncluded: particular.vat_inclusive || false,
                //   })
                // ),
                tableRows: liquidationData?.liquidation_particulars.map(
                  (particular) => ({
                    date: particular.date || "",
                    particulars: particular.particulars || "",
                    expenses: particular.expenses || 0, // Default to 0 if not available
                    cashFromAccounting: particular.cash_from_accounting || 0, // Default to 0 if not available
                    balance: particular.balance || 0, // Default to 0 if not available
                    vatIncluded: particular.vat_inclusive || false,
                  })
                ),
                notesRows: liquidationData?.task_notes,
              }}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => {
                // Calculate total expenses, cash from accounting, and balance
                const totalExpenses = values.tableRows.reduce(
                  (acc, row) => acc + (parseFloat(row.expenses) || 0),
                  0
                );
                // const totalCashFromAccounting = values.tableRows.reduce(
                //   (acc, row) => acc + (parseFloat(row.cashFromAccounting) || 0),
                //   0
                // );
                const totalCashFromAccounting = values.tableRows.reduce(
                  (acc, row) =>
                    acc + (parseFloat(row.cash_from_accounting) || 0), // Correct the key to match 'cash_from_accounting'
                  0
                );

                // const totalCashFromBalance = values.tableRows.reduce(
                //   (acc, row) => acc + (parseFloat(row.balance) || 0),
                //   0
                // );
                const totalCashFromBalance = values.tableRows.reduce(
                  (acc, row) => {
                    const balance =
                      (parseFloat(row.expenses) || 0) -
                      (parseFloat(row.cash_from_accounting) || 0);
                    return acc + balance;
                  },
                  0
                );

                return (
                  <Form className="py-4 uppercase">
                    <div className="flex items-center space-x-6">
                      <div className="w-1/3">
                        <img
                          src={
                            liquidationData?.photos?.photo ||
                            "default-image-url"
                          } // Ensure the photo URL is correct
                          alt="Project Image"
                          className="w-full h-auto rounded-md"
                        />
                      </div>
                      <div className="w-2/3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {[
                            {
                              label: "Project Name",
                              name: "project_name",
                              type: "text",
                              placeholder: "Enter project name",
                            },
                            {
                              label: "Date",
                              name: "projectDate",
                              type: "date",
                              placeholder: "",
                            },
                            {
                              label: "Remitted By",
                              name: "remmitted_by",
                              type: "select",
                              placeholder: "Select remitted by",
                            },
                            {
                              label: "Received By",
                              name: "receivedBy",
                              type: "select",
                              placeholder: "Enter who received",
                            },
                          ].map((item) => (
                            <div key={item.name}>
                              <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-white">
                                {item.label}
                              </label>
                              {item.type === "select" ? (
                                <Field
                                  as="select"
                                  name={item.name}
                                  className={`${
                                    isEditable
                                      ? ""
                                      : "bg-gray-200 cursor-not-allowed"
                                  } border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-dark dark:text-white`}
                                  disabled={!isEditable}
                                  required
                                >
                                  <option value="">Select {item.label}</option>
                                  {users?.map((user) => (
                                    <option key={user.id} value={user.id}>
                                      {user.full_name}
                                    </option>
                                  ))}
                                </Field>
                              ) : (
                                <Field
                                  type={item.type}
                                  name={item.name}
                                  placeholder={item.placeholder}
                                  className={`${
                                    isEditable
                                      ? ""
                                      : "bg-gray-200 cursor-not-allowed"
                                  } border border-gray-300 dark:bg-gray-dark dark:text-white text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                  disabled={!isEditable}
                                  required
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Table for Adding Expenses */}
                    <div className="space-y-4">
                      <h4 className="font-semibold">Liquidations</h4>
                      <FieldArray
                        name="tableRows"
                        render={(arrayHelpers) => (
                          <div>
                            <table className="table-auto w-full border-collapse">
                              <thead>
                                <tr>
                                  {[
                                    "Date",
                                    "Particulars",
                                    "Expenses",
                                    "Cash From Accounting",
                                    "Balance",
                                    "VAT Inc",
                                  ].map((header) => (
                                    <th key={header} className="p-2 text-left">
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {values.tableRows?.map((row, index) => (
                                  <tr key={index}>
                                    {[
                                      {
                                        name: `tableRows[${index}].date`,
                                        type: "date",
                                      },
                                      {
                                        name: `tableRows[${index}].particulars`,
                                        type: "text",
                                      },
                                      {
                                        name: `tableRows[${index}].expenses`,
                                        type: "number",
                                      },
                                      {
                                        name: `tableRows[${index}].cash_from_accounting`,
                                        type: "number",
                                      },
                                      {
                                        name: `tableRows[${index}].balance`,
                                        type: "number",
                                        value: (
                                          parseFloat(row.expenses || "0") -
                                          parseFloat(
                                            row.cash_from_accounting || "0"
                                          )
                                        ).toFixed(2),
                                      },
                                    ].map((field) => (
                                      <td key={field.name} className="p-2">
                                        <Field
                                          type={field.type}
                                          name={field.name}
                                          value={
                                            field.value ||
                                            row[field.name.split(".")[1]] ||
                                            ""
                                          }
                                          onChange={(e) =>
                                            handleRowFieldChange(
                                              index,
                                              field.name.split(".")[1],
                                              e.target.value,
                                              setFieldValue,
                                              values // Pass values for proper context
                                            )
                                          }
                                          className={`${
                                            isEditable
                                              ? ""
                                              : "bg-gray-200 cursor-not-allowed"
                                          } border border-gray-300 dark:bg-gray-dark dark:text-white text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                          disabled={!isEditable}
                                        />
                                      </td>
                                    ))}
                                    <td className="p-2">
                                      <Field
                                        type="checkbox"
                                        name={`tableRows[${index}].vatIncluded`}
                                        className="checkbox border-gray-300 dark:border-gray-600 dark:bg-gray-800  dark:checked:bg-white"
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                            {/* Conditionally render "Add Row" button */}
                            {isEditable && (
                              <button
                                type="button"
                                onClick={() =>
                                  arrayHelpers.push({
                                    date: "",
                                    particulars: "",
                                    expenses: 0,
                                    cash_from_accounting: 0,
                                    balance: "",
                                    vatIncluded: false,
                                  })
                                }
                                className="btn bg-white mt-1 mb-1 text-black border border-black uppercase"
                              >
                                Add Row
                              </button>
                            )}
                          </div>
                        )}
                      />
                    </div>

                    {/* Total Row */}
                    {/* <div className="flex justify-between py-2 border-t border-gray-300">
                      <div className="ml-auto flex space-x-4">
                        <div className="font-semibold">Total</div>
                        <div className="w-1/4">
                          <input
                            type="number"
                            value={totalExpenses}
                            readOnly
                            className="bg-gray-200 p-2 rounded-md w-full dark:bg-gray-dark dark:border border-white"
                          />
                        </div>
                        <div className="w-1/4">
                          <input
                            type="number"
                            value={totalCashFromAccounting}
                            readOnly
                            className="bg-gray-200 p-2 rounded-md w-full dark:bg-gray-dark dark:border border-white"
                          />
                        </div>
                        <div className="w-1/4">
                          <input
                            type="number"
                            value={totalCashFromBalance}
                            readOnly
                            className="bg-gray-200 p-2 rounded-md w-full dark:bg-gray-dark dark:border border-white"
                          />
                        </div>
                      </div>
                    </div> */}
                    <div className="flex justify-between py-2 border-t border-gray-300">
                      <div className="mb-4">
                        <h4 className="font-semibold">Take Notes</h4>
                        <FieldArray
                          name="notesRows"
                          render={(arrayHelpers) => (
                            <div>
                              {values.notesRows?.map((noteRow, index) => (
                                <div key={index} className="mb-2">
                                  <Field
                                    type="text"
                                    name={`notesRows[${index}].note`}
                                    className="input dark:bg-gray-dark dark:text-white dark:border border-black"
                                    placeholder="Enter note"
                                    disabled={!isEditable}
                                    readOnly={!isEditable}
                                  />

                                  {/* Conditionally render "Remove" button */}
                                  {isEditable && (
                                    <button
                                      type="button"
                                      onClick={() => arrayHelpers.remove(index)}
                                      // className="btn btn-danger ml-2"
                                      className="bg-white  text-red-800 border border-red-800 px-3 py-1.5 rounded-md text-xs shadow transition duration-200 uppercase"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                              ))}

                              {/* Conditionally render "Add Note" button */}
                              {isEditable && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    arrayHelpers.push({ note: "" })
                                  }
                                  className="btn bg-white border border-black mt-1 text-black uppercase"
                                >
                                  Add Note
                                </button>
                              )}
                            </div>
                          )}
                        />
                      </div>
                      <div className="ml-auto flex space-x-4">
                        <div className="flex flex-col items-start">
                          <div className="font-semibold">Total Expenses</div>
                          <input
                            type="number"
                            value={totalExpenses}
                            readOnly
                            className="bg-gray-200 p-2 rounded-md w-full dark:bg-gray-dark dark:border border-white"
                          />
                        </div>
                        <div className="flex flex-col items-start">
                          <div className="font-semibold">
                            Cash from Accounting
                          </div>
                          <input
                            type="number"
                            value={totalCashFromAccounting}
                            readOnly
                            className="bg-gray-200 p-2 rounded-md w-full dark:bg-gray-dark dark:border border-white"
                          />
                        </div>
                        <div className="flex flex-col items-start">
                          <div className="font-semibold">Cash from Balance</div>
                          <input
                            type="number"
                            value={totalCashFromBalance}
                            readOnly
                            className="bg-gray-200 p-2 rounded-md w-full dark:bg-gray-dark dark:border border-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Take Notes Section */}
                    {/* <div className="mb-4">
                      <h4 className="font-semibold">Take Notes</h4>
                      <FieldArray
                        name="notesRows"
                        render={(arrayHelpers) => (
                          <div>
                            {values.notesRows?.map((noteRow, index) => (
                              <div key={index} className="mb-2">
                                <Field
                                  type="text"
                                  name={`notesRows[${index}].note`}
                                  className="input dark:bg-gray-dark dark:text-white dark:border border-black"
                                  placeholder="Enter note"
                                  disabled={!isEditable}
                                  readOnly={!isEditable}
                                />

                                {isEditable && (
                                  <button
                                    type="button"
                                    onClick={() => arrayHelpers.remove(index)}
                                    className="btn btn-danger ml-2"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            ))}
                            {isEditable && (
                              <button
                                type="button"
                                onClick={() => arrayHelpers.push({ note: "" })}
                                className="btn btn-info mt-4 text-white uppercase"
                              >
                                Add Note
                              </button>
                            )}
                          </div>
                        )}
                      />
                    </div> */}

                    <div className="modal-action">
                      <button type="submit" className="btn">
                        Submit
                      </button>
                      <button
                        type="button"
                        className="btn"
                        onClick={() => setShowRegisterModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>

            {isError && (
              <div className="text-red-500 mt-4">
                <p>Error: {error?.message || "An error occurred"}</p>
              </div>
            )}
          </div>
        </dialog>
      )}
    </>
  );
}
