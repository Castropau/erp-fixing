"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { Field, Form, Formik, FieldArray } from "formik";
import { CiCirclePlus } from "react-icons/ci";

/** api */
import { CreateCategory } from "@/api/inventory/CreateCategory";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/** interfaces */
import { fetchDepartmentsList } from "@/api/User/fetchDepartmentList";
import { fetchUserList } from "@/api/User/fetchUserList";
import { fetchCashList } from "@/api/liquidations/fetchCash";
import { fetchCashDetailsById } from "@/api/liquidations/fetchProject";
import { AddLiq, CreateLiq } from "@/api/liquidations/addLiq";

export default function AddLiquidation() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [projectName, setProjectName] = useState<string>("");
  const [dateRequested, setDateRequested] = useState<string | Date>(""); // Initialize with an empty string or a Date type

  const queryClient = useQueryClient();

  const {
    mutate: registerCategory,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: AddLiq) => CreateLiq(data),
    onSuccess: () => {
      console.log("liquidations registered successfully");
      queryClient.invalidateQueries({ queryKey: ["liquidations"] });
      setShowRegisterModal(false);
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
    },
  });

  const { data: projects } = useQuery({
    queryKey: ["cash"],
    queryFn: fetchCashList,
  });

  const { data: projectDetails, isLoading: isLoadingProjectDetails } = useQuery(
    {
      queryKey: ["projectDetails", selectedProject],
      queryFn: () => fetchCashDetailsById(Number(selectedProject)),
      enabled: !!selectedProject, // Enable query only when selectedProject is truthy
    }
  );

  // useEffect(() => {
  //   if (selectedProject && projectDetails) {
  //     setProjectName(projectDetails.special_instructions); // Set project name
  //     setDateRequested(projectDetails.date_requested); // Set date_requested
  //   }
  // }, [selectedProject, projectDetails]);

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUserList,
  });

  // Handle form submission
  //   const handleSubmit = (values: any) => {
  //     console.log(values);
  //   };
  // const handleSubmit = (values: any) => {
  //   const liquidationData: AddLiq = {
  //     id: Number(selectedProject),
  //     liquidation_no: "LQ-" + Date.now(), // You can replace this with dynamic logic for liquidation number
  //     photos: "", // Add logic to handle photos if applicable
  //     project_name: projectName || "",
  //     date: values.date, // Ensure this is the correct field in your form
  //     remitted_by: values.remittedBy, // Ensure this matches the form field name
  //     total: String(
  //       values.tableRows.reduce(
  //         (acc, row) => acc + parseFloat(row.balance || "0"),
  //         0
  //       )
  //     ),
  //     task_notes: values.task_notes,

  //   };

  //   registerCategory(liquidationData);
  //   console.log(liquidationData);
  // };
  // const handleSubmit = (values: any) => {
  //   const liquidationData: AddLiq = {
  //     id: Number(selectedProject),
  //     liquidation_no: "LQ-" + Date.now(),
  //     photos: [], // ← backend expects a list, not a string
  //     project_name: projectName || "",
  //     date: values.date,
  //     remitted_by: values.remittedBy,
  //     total: String(
  //       values.tableRows.reduce(
  //         (acc, row) => acc + parseFloat(row.balance || "0"),
  //         0
  //       )
  //     ),
  //     task_notes: values.task_notes,
  //     liquidation_particulars: values.tableRows, // ✅ fix here
  //   };

  //   registerCategory(liquidationData);
  //   console.log(liquidationData);
  // };
  // const handleSubmit = (values: any) => {
  //   const mappedParticulars = values.tableRows.map((row: any) => ({
  //     // date: row.date_requested || dateRequested,
  //     date: row.date || dateRequested || new Date().toISOString().split("T")[0],

  //     particulars: row.item || row.particulars,
  //     expenses: row.expenses,
  //     cash_from_accounting: row.cashFromAccounting,
  //     // balance: row.balance,
  //     balance:
  //       parseFloat(row.expenses || "0") -
  //       parseFloat(row.cashFromAccounting || "0"),
  //     vat_included: row.vatIncluded,
  //   }));

  //   const liquidationData: AddLiq = {
  //     id: Number(selectedProject),
  //     liquidation_no: "LQ-" + Date.now(),
  //     photos: [],
  //     // project_name: projectName || "",
  //     project_name: values.project_name,
  //     date: values.date,
  //     remitted_by: values.remittedBy,
  //     total: String(
  //       values.tableRows.reduce(
  //         (acc, row) => acc + parseFloat(row.balance || "0"),
  //         0
  //       )
  //     ),
  //     task_notes: values.task_notes,
  //     liquidation_particulars: mappedParticulars,
  //   };

  //   registerCategory(liquidationData);
  //   console.log(liquidationData);
  //   setShowRegisterModal(false);
  // };
  const handleSubmit = (values: any, { resetForm }: { resetForm: any }) => {
    const mappedParticulars = values.tableRows.map((row: any) => ({
      date:
        row.date ||
        values.date_requested ||
        new Date().toISOString().split("T")[0],
      particulars: row.item || row.particulars,
      expenses: row.expenses,
      cash_from_accounting: row.cashFromAccounting,
      balance:
        parseFloat(row.expenses || "0") -
        parseFloat(row.cashFromAccounting || "0"),
      vat_included: row.vatIncluded,
    }));

    const liquidationData: AddLiq = {
      id: Number(values.project),
      liquidation_no: "LQ-" + Date.now(),
      photos: [],
      project_name: values.project_name,
      date: values.date,
      remitted_by: values.remittedBy,
      total: String(
        values.tableRows.reduce(
          (acc, row) => acc + parseFloat(row.balance || "0"),
          0
        )
      ),
      task_notes: values.task_notes,
      liquidation_particulars: mappedParticulars,
    };

    registerCategory(liquidationData);
    console.log(liquidationData);
    resetForm({
      values: {
        project: "",
        photos: [],
        id: "",
        project_name: "",
        date: "",
        date_requested: "",
        liquidation_particulars: [],
        cash_requisition: "",
        remitted_by: "",
        received_by: "",
        tableRows: [
          {
            date: "",
            item: "",
            particulars: "",
            expenses: "",
            cashFromAccounting: "",
            balance: "",
            vatIncluded: false,
          },
        ],
        task_notes: [{ task_notes: "", items: "", description: "" }],
      },
    });

    setShowRegisterModal(false);
  };

  return (
    <>
      <div className="flex justify-start">
        <button
          className="btn bg-white  text-black  border border-black uppercase"
          onClick={() => setShowRegisterModal(true)}
        >
          {/* <FaCirclePlus className="w-6 h-6 btn-info" /> */}
          Add Liquidation
        </button>
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <dialog open className="modal mt-15 backdrop-blur-sm">
          <div className="modal-box w-11/12 max-w-7xl max-h-[80vh] overflow-y-auto dark:bg-gray-dark dark:text-white">
            <h3 className="font-bold text-lg dark:bg-gray-dark dark:text-white text-center uppercase">
              Create New Liquidation
            </h3>
            <Formik
              initialValues={{
                project: "",
                photos: [],
                id: projectDetails?.id || "",
                project_name: "",
                date: "",
                date_requested: projectDetails?.date_requested || "",
                liquidation_particulars:
                  projectDetails?.cash_requisition_items || [], // Populate with fetched items
                cash_requisition: "",
                remitted_by: "",
                received_by: "",
                tableRows: projectDetails?.cash_requisition_items || [
                  {
                    date: "",
                    particulars: "",
                    expenses: "",
                    cashFromAccounting: "",
                    balance: "",
                    vatIncluded: false,
                  },
                ],
                // task_notes: [{ task_notes: "" }],
                task_notes: [
                  { task_notes: "", items: "", description: "" }, // Set initial task notes with item and description
                ],
                // task_notes: [],
              }}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => {
                useEffect(() => {
                  if (projectDetails) {
                    setFieldValue(
                      "project_name",
                      projectDetails.special_instructions || ""
                    );
                    setFieldValue(
                      "date_requested",
                      projectDetails.date_requested || ""
                    );

                    setFieldValue(
                      "tableRows",
                      projectDetails.cash_requisition_items?.map((item) => ({
                        date: projectDetails.date_requested || "",
                        item: item.item || item.special_instructions || "",
                        expenses: item.expenses || item.total_price || "",
                        cashFromAccounting: "",
                        balance: "",
                        vatIncluded: false,
                      })) || []
                    );
                  }
                }, [projectDetails, setFieldValue]);

                const totalExpenses = values.tableRows.reduce(
                  (acc, row) => acc + (parseFloat(row.expenses) || 0),
                  0
                );
                const totalCashFromAccounting = values.tableRows.reduce(
                  (acc, row) => acc + (parseFloat(row.cashFromAccounting) || 0),
                  0
                );

                const totalCashFromBalance = values.tableRows.reduce(
                  (acc, row) => acc + (parseFloat(row.balance) || 0),
                  0
                );

                return (
                  <Form className="py-1 uppercase">
                    {/* Dropdown for Project Selection */}
                    <div className="mb-1">
                      <label className="block text-sm  font-bold text-gray-700 dark:bg-gray-dark dark:text-white">
                        Select Project
                      </label>
                      <Field
                        as="select"
                        name="project"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-dark dark:text-white"
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                          const projectId = e.target.value;
                          setSelectedProject(projectId); // Set selected project
                          setFieldValue("project", projectId); // Update Formik state
                          setFieldValue("liquidation_particulars", []); // Clear liquidation particulars when changing project
                          setFieldValue("project_name", ""); // Clear project name
                        }}
                      >
                        <option value="">Select a Project</option>
                        {projects?.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.serial_no}
                          </option>
                        ))}
                      </Field>
                    </div>

                    {/* Project Details */}
                    {selectedProject && (
                      <div className="space-y-1">
                        {/* <h4 className="font-semibold">Project Details</h4> */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {[
                            {
                              label: "Project Name",
                              name: "projectName",
                              type: "text",
                              placeholder: "Enter project name",
                              value: values.project_name || "", // Fetch from Formik values
                            },
                            {
                              label: "Date",
                              name: "date",
                              type: "date",
                              placeholder: "",
                            },
                            {
                              label: "Remitted By",
                              name: "remittedBy",
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
                              <label className="block mb-1 text-sm font-bold text-gray-700 dark:bg-gray-dark dark:text-white">
                                {item.label}
                              </label>
                              {item.type === "select" ? (
                                <Field
                                  as="select"
                                  name={item.name}
                                  className="dark:bg-gray-dark dark:text-white bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
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
                                  className="dark:bg-gray-dark dark:text-white bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                  required
                                  value={item.value || values[item.name]}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Table for Adding Expenses */}
                    <div className="space-y-4 mt-3">
                      {/* <h4 className="font-semibold">Expenses</h4> */}
                      <FieldArray
                        name="tableRows"
                        render={(arrayHelpers) => (
                          <div>
                            <table className="table-zebra w-full border border-collapse">
                              <thead>
                                <tr>
                                  {[
                                    "Date",
                                    "Particulars",
                                    "Expenses",
                                    "Minus to balance",
                                    "Balance",
                                    "VAT Inc",
                                    "Action",
                                  ].map((header) => (
                                    <th
                                      key={header}
                                      className="p-2 text-center bg-gray-200 border "
                                    >
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {values.tableRows.map((item, index) => (
                                  <tr key={index}>
                                    <td className="p-2">
                                      <Field
                                        name={`tableRows[${index}].date`}
                                        type="date"
                                        className="bg-gray-50 dark:bg-gray-dark dark:text-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        // value={
                                        //   item.date_requested ||
                                        //   projectDetails?.date_requested ||
                                        //   ""
                                        // }
                                      />
                                    </td>

                                    <td className="p-2">
                                      <Field
                                        name={`tableRows[${index}].item`}
                                        className="bg-gray-50 dark:bg-gray-dark dark:text-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        value={item.item || ""}
                                      />
                                    </td>
                                    <td className="p-2">
                                      <Field
                                        name={`tableRows[${index}].expenses`}
                                        className="bg-gray-50 dark:bg-gray-dark dark:text-white  border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        value={item.expenses || ""}
                                      />
                                    </td>
                                    <td className="p-2">
                                      <Field
                                        name={`tableRows[${index}].cashFromAccounting`}
                                        className="bg-gray-50 dark:bg-gray-dark dark:text-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                      />
                                    </td>
                                    <td className="p-2">
                                      <Field
                                        readOnly
                                        // name={`tableRows[${index}].total_price`}
                                        className="bg-gray-50 dark:bg-gray-dark dark:text-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        value={
                                          item.expenses -
                                            item.cashFromAccounting ||
                                          item.expenses
                                        }
                                      />
                                    </td>
                                    <td className="p-2">
                                      <Field
                                        type="checkbox"
                                        name={`tableRows[${index}].vatIncluded`}
                                        className="checkbox dark:bg-gray-dark border border-black dark:text-white  dark:checked:border-white"
                                      />
                                    </td>
                                    <td className="p-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          arrayHelpers.remove(index)
                                        }
                                        // className="btn btn-danger"
                                        className="flex items-center gap-1 bg-white text-red-800 border border-red-800 px-3 py-1.5 rounded-md text-xs shadow transition duration-200 uppercase"
                                      >
                                        Remove
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <button
                              type="button"
                              onClick={() =>
                                arrayHelpers.push({
                                  date_requested: "",
                                  // date_requested: dateRequested || "",

                                  particulars: "",
                                  expenses: "",
                                  cashFromAccounting: "",
                                  balance: "",
                                  vatIncluded: false,
                                })
                              }
                              className="btn bg-white mt-4 mb-4 text-black border border-black uppercase"
                            >
                              Add Row
                            </button>
                          </div>
                        )}
                      />
                    </div>

                    {/* Total Row */}
                    {/* <div className="flex justify-between py-2 border-t border-gray-300">
                      <div className="ml-auto flex space-x-4 ">
                        <div className="font-semibold">Total</div>
                        <div className="w-1/4">
                          <input
                            type="number"
                            value={projectDetails?.sub_total}
                            readOnly
                            className="bg-gray-200 p-2 rounded-md w-full border border-gray-300 dark:bg-gray-800 dark:text-white"
                          />
                        </div>
                        <div className="w-1/4">
                          <input
                            type="number"
                            value={totalCashFromAccounting}
                            readOnly
                            className="bg-gray-200 p-2 rounded-md w-full border border-gray-300 dark:bg-gray-dark dark:text-white "
                          />
                        </div>
                        <div className="w-1/4">
                          <input
                            type="number"
                            value={projectDetails?.total}
                            readOnly
                            className="bg-gray-200 p-2 rounded-md w-full dark:bg-gray-dark dark:text-white border border-white"
                          />
                        </div>
                      </div>
                    </div> */}
                    <div className="flex justify-between py-2 border-t border-gray-300">
                      <div className="ml-auto flex space-x-4">
                        <div className="flex flex-col items-start">
                          <div className="font-semibold">Total Expenses</div>
                          <input
                            type="number"
                            value={projectDetails?.sub_total}
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
                            value={projectDetails?.total}
                            readOnly
                            className="bg-gray-200 p-2 rounded-md w-full dark:bg-gray-dark dark:border border-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Take Notes Section */}
                    <div className="mb-4">
                      <h4 className="font-semibold">Take Notes</h4>
                      <FieldArray
                        name="task_notes"
                        render={(arrayHelpers) => (
                          <div>
                            {values.task_notes.map((noteRow, index) => (
                              <div key={index} className="mb-2">
                                <Field
                                  type="text"
                                  name={`task_notes[${index}].task_notes`}
                                  className="input dark:bg-gray-dark dark:text-white dark:border-white"
                                  placeholder="Enter note"
                                />
                                <Field
                                  type="text"
                                  name={`task_notes[${index}].description`}
                                  className="input dark:bg-gray-dark dark:text-white dark:border-white"
                                  placeholder="Enter description"
                                />
                                <Field
                                  type="text"
                                  name={`task_notes[${index}].items`}
                                  className="input dark:bg-gray-dark dark:text-white dark:border-white"
                                  placeholder="Enter item"
                                />
                                <button
                                  type="button"
                                  onClick={() => arrayHelpers.remove(index)}
                                  // className="btn btn-danger ml-2"
                                  className="flex items-center gap-1 bg-white border border-red-800 hover:bg-red-700 text-red-800 px-3 py-1.5 rounded-md text-xs shadow transition duration-200 uppercase"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() =>
                                // arrayHelpers.push({ task_notes: "" })
                                arrayHelpers.push({
                                  task_notes: "",
                                  items: "",
                                  description: "",
                                })
                              }
                              className="btn bg-white mt-1 text-black border border-black uppercase"
                            >
                              Add Note
                            </button>
                          </div>
                        )}
                      />
                    </div>

                    {/* Submit and Cancel Buttons */}
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
