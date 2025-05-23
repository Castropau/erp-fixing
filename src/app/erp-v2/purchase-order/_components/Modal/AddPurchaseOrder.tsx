"use client";

import React, { useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { Field, Form, Formik, FieldArray } from "formik";
import { CiCirclePlus } from "react-icons/ci";

/** api */
import { CreateCategory } from "@/api/inventory/CreateCategory";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/** interfaces */
import { fetchDepartmentsList } from "@/api/User/fetchDepartmentList";
import { fetchUserList } from "@/api/User/fetchUserList";
import { CreatePurchase } from "@/api/purchase-order/createPurchase";
import { fetchVendorsList } from "@/api/vendor/fetchVendor";

export default function AddPurchaseOrder() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");

  const queryClient = useQueryClient();

  const {
    mutate: registerCategory,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: CreateCategory) => CreateCategory(data),
    onSuccess: () => {
      console.log("purchase registered successfully");
      queryClient.invalidateQueries({ queryKey: ["category"] });
      setShowRegisterModal(false);
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
    },
  });
  const {
    mutate: registerQuotation,
    isError: errors,
    error: errorr,
  } = useMutation({
    mutationFn: (data: CreatePurchase) => CreatePurchase(data),
    onSuccess: () => {
      console.log("purchase registered successfully");
      queryClient.invalidateQueries({ queryKey: ["purchase"] });
      setShowRegisterModal(false);
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
    },
  });

  // Fetch project data based on dropdown selection
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchVendorsList, // Assume fetchDepartmentsList is an API call to fetch departments (projects)
  });

  // Fetch user list for 'remittedBy' dropdown
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUserList, // Assume fetchUserList is an API call to fetch users
  });

  // Handle form submission
  const handleSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <>
      <div className="flex justify-start">
        <button
          className="btn bg-white border border-black  uppercase text-black mr-4"
          onClick={() => setShowRegisterModal(true)}
        >
          {/* <FaCirclePlus className="w-6 h-6 btn-info" /> */}
          Add Purchase Order
        </button>
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <dialog open className="modal mt-15 backdrop-blur-sm">
          <div className="modal-box w-11/12 max-w-7xl max-h-[80vh] overflow-y-auto dark:bg-gray-dark dark:text-white">
            <h3 className="font-bold text-lg uppercase">
              Create New Purchase Order
            </h3>
            <Formik
              initialValues={{
                project: "",
                projectName: "",
                projectDate: "",
                remittedBy: "",
                receivedBy: "",
                tableRows: [
                  {
                    id: 0,
                    item: "",
                    description: "",
                    srp: "",
                    quantity: "",
                    total: 0,
                    // description: "",
                  },
                ],
                discount: 0,
                vat: 0,
                terms: "",
              }}
              onSubmit={(values) => {
                const payload: CreatePurchase = {
                  items: values.tableRows.map((row) => ({
                    // id: row.id || 0,
                    item: row.item,
                    description: row.description || "",
                    unit_price: row.srp || 0,
                    quantity: row.quantity || 0,
                  })),
                  terms: values.terms,
                  discount: values.discount || 0,
                  vat_percentage: values.vat || 0,
                  vendor: parseFloat(values.project),
                };

                registerQuotation(payload);
                console.log("Submitting purchase payload:", payload);
              }}
            >
              {({ values, setFieldValue }) => {
                // Calculate total expenses and cash from accounting
                const totalExpenses = values.tableRows.reduce(
                  (acc, row) =>
                    acc + (parseFloat(row.srp) * parseFloat(row.quantity) || 0),
                  0
                );
                const totalCashFromAccounting = values.tableRows.reduce(
                  (acc, row) => acc + (parseFloat(row.balance) || 0),
                  0
                );
                const totalCashFromBalance = values.tableRows.reduce(
                  (acc, row) => acc + (parseFloat(row.balance) || 0),
                  0
                );

                return (
                  <Form className="py-1">
                    {/* Dropdown for Project Selection */}
                    <div className="mb-1">
                      <label className="block text-sm font-bold uppercase ">
                        Company
                      </label>
                      <Field
                        as="select"
                        name="project"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-dark"
                        // onChange={(e) => {
                        //   setSelectedProject(e.target.value);
                        //   setFieldValue("project", e.target.value);
                        // }}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          setSelectedProject(selectedId);
                          setFieldValue("project", selectedId);

                          const selectedVendor = projects?.find(
                            (proj) => proj.id.toString() === selectedId
                          );

                          if (selectedVendor) {
                            setFieldValue(
                              "address",
                              selectedVendor.address || ""
                            );
                            setFieldValue("tin", selectedVendor.tin || "");
                            setFieldValue(
                              "contact_number",
                              selectedVendor.contact_number || ""
                            );
                          }
                        }}
                      >
                        <option value="">Select a Project</option>
                        {projects?.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.vendor}
                          </option>
                        ))}
                      </Field>
                    </div>

                    {/* Project Details */}
                    {selectedProject && (
                      <div className="space-y-1">
                        <h4 className="font-semibold">Project Details</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {[
                            {
                              label: "Address",
                              name: "address",
                              type: "text",
                              placeholder: "Address",
                            },
                            {
                              label: "TIN",
                              name: "tin",
                              type: "text",
                              placeholder: "TIN",
                            },
                            {
                              label: "Contact Number",
                              name: "contact_number",
                              type: "text",
                              placeholder: "Contact Number",
                            },
                          ].map((item) => (
                            <div key={item.name}>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                {item.label}
                              </label>
                              {item.type === "select" ? (
                                <Field
                                  as="select"
                                  name={item.name}
                                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-dark dark:text-white"
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
                                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-dark dark:text-white"
                                  required
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Terms & Conditions */}
                    <div className="mt-1 mb-2">
                      <h4 className="font-semibold">Terms & Conditions</h4>
                      <Field
                        as="textarea"
                        name="terms"
                        className="bg-gray-50 border border-gray-300 dark:bg-gray-dark rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:text-white mt-2"
                        placeholder="Enter terms and conditions for this quotation"
                      />
                    </div>

                    {/* Table for Adding Expenses */}
                    <div className="space-y-1">
                      {/* <h4 className="font-semibold">Expenses</h4> */}
                      <FieldArray
                        name="tableRows"
                        render={(arrayHelpers) => (
                          <div>
                            <table className="table-zebra w-full border-collapse">
                              <thead>
                                <tr>
                                  {[
                                    "# ITEM",
                                    "Description",
                                    "Unit price",
                                    "Quantity",
                                    "Total",
                                  ].map((header) => (
                                    <th
                                      key={header}
                                      className="p-2 text-center border border-black bg-gray-200"
                                    >
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {values.tableRows.map((row, index) => (
                                  <tr key={index}>
                                    <td className="p-2 border border-black">
                                      <Field
                                        type="text"
                                        name={`tableRows[${index}].item`}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-dark dark:text-white"
                                      />
                                    </td>
                                    <td className="p-2 border border-black">
                                      <Field
                                        type="text"
                                        name={`tableRows[${index}].description`}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-dark dark:text-white"
                                      />
                                    </td>
                                    <td className="p-2 border border-black">
                                      <Field
                                        type="number"
                                        name={`tableRows[${index}].srp`}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-dark dark:text-white"
                                        onChange={(e) => {
                                          const srp =
                                            parseFloat(e.target.value) || 0;
                                          const quantity =
                                            parseFloat(
                                              values.tableRows[index].quantity
                                            ) || 0;
                                          const total = srp * quantity;

                                          // Update the srp and total in the form state
                                          setFieldValue(
                                            `tableRows[${index}].srp`,
                                            srp
                                          );
                                          setFieldValue(
                                            `tableRows[${index}].total`,
                                            total
                                          );
                                        }}
                                      />
                                    </td>
                                    <td className="p-2 border border-black">
                                      <Field
                                        type="number"
                                        name={`tableRows[${index}].quantity`}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-dark dark:text-white"
                                        onChange={(e) => {
                                          const quantity =
                                            parseFloat(e.target.value) || 0;
                                          const srp =
                                            parseFloat(
                                              values.tableRows[index].srp
                                            ) || 0;
                                          const total = srp * quantity;

                                          // Update the quantity and total in the form state
                                          setFieldValue(
                                            `tableRows[${index}].quantity`,
                                            quantity
                                          );
                                          setFieldValue(
                                            `tableRows[${index}].total`,
                                            total
                                          );
                                        }}
                                      />
                                    </td>
                                    <td className="p-2 border border-black">
                                      <Field
                                        type="number"
                                        name={`tableRows[${index}].total`}
                                        readOnly
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-dark dark:text-white"
                                      />
                                    </td>
                                    <td className="p-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          arrayHelpers.remove(index)
                                        }
                                        // className="btn btn-danger"
                                        className="flex items-center gap-1 bg-white  text-red-800 border border-red-800 px-3 py-1.5 rounded-md text-xs shadow transition duration-200 uppercase"
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
                                  item: "",
                                  description: "",
                                  srp: "",
                                  quantity: "",
                                  total: 0,
                                })
                              }
                              className="btn bg-white text-black border border-black mt-2 uppercase mb-2"
                            >
                              Add Row
                            </button>
                          </div>
                        )}
                      />
                    </div>

                    {/* Total Row */}
                    <div className="flex justify-between py-2 border-t border-gray-300">
                      <div className="ml-auto flex space-x-4 w-full">
                        {/* Discount Input */}
                        <div className="flex flex-col w-1/4">
                          <label className="font-semibold">Discount</label>
                          <Field
                            type="number"
                            name="discount"
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-dark dark:text-white"
                            onChange={(e) => {
                              const discount = parseFloat(e.target.value) || 0;
                              setFieldValue("discount", discount);
                            }}
                          />
                        </div>

                        {/* VAT Input */}
                        <div className="flex flex-col w-1/4">
                          <label className="font-semibold">VAT (%)</label>
                          <Field
                            type="number"
                            name="vat"
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-dark dark:text-white"
                            onChange={(e) => {
                              const vat = parseFloat(e.target.value);
                              setFieldValue("vat", vat);
                            }}
                          />
                        </div>

                        {/* Sub Total */}
                        <div className="flex flex-col w-1/4">
                          <label className="font-semibold">Sub Total</label>
                          <input
                            type="number"
                            value={totalExpenses}
                            readOnly
                            className="bg-gray-200 p-2 rounded-md w-full dark:bg-gray-dark dark:border border-white"
                          />
                        </div>

                        {/* VAT Value */}
                        <div className="flex flex-col w-1/4">
                          <label className="font-semibold">VAT Value</label>
                          <input
                            type="number"
                            value={(() => {
                              const vat = (parseFloat(values.vat) || 0) / 100;
                              return totalExpenses * vat;
                            })()}
                            readOnly
                            className="bg-gray-200 p-2 rounded-md w-full dark:bg-gray-dark dark:border border-white"
                          />
                        </div>
                        <div className="flex flex-col w-1/4">
                          <label className="font-semibold">Grand Total</label>
                          <input
                            type="number"
                            value={(() => {
                              const discountAmount =
                                totalExpenses * (values.discount / 100) || 0;
                              const vatAmount =
                                totalExpenses * (values.vat / 100) || 0;
                              return totalExpenses - discountAmount + vatAmount;
                            })()}
                            readOnly
                            className="bg-gray-200 p-2 rounded-md w-full dark:bg-gray-dark dark:border border-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Grand Total */}
                    <div className="flex justify-between py-2 border-t border-gray-300">
                      <div className="ml-auto flex space-x-4 w-full">
                        {/* Grand Total */}
                        {/* <div className="flex flex-col w-1/4">
                          <label className="font-semibold">Grand Total</label>
                          <input
                            type="number"
                            value={(() => {
                              const discountAmount =
                                totalExpenses * (values.discount / 100) || 0;
                              const vatAmount =
                                totalExpenses * (values.vat / 100) || 0;
                              return totalExpenses - discountAmount + vatAmount;
                            })()}
                            readOnly
                            className="bg-gray-200 p-2 rounded-md w-full dark:bg-gray-dark dark:border border-white"
                          />
                        </div> */}
                      </div>
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
