"use client";

import React, { useState } from "react";
import { FaCirclePlus, FaEye } from "react-icons/fa6";
import { Field, Form, Formik, FieldArray } from "formik";
import { CiCirclePlus, CiEdit } from "react-icons/ci";
import { FaBan, FaEdit } from "react-icons/fa"; // Import Edit Icon

/** api */
import { CreateCategory } from "@/api/inventory/CreateCategory";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/** interfaces */
import { fetchDepartmentsList } from "@/api/User/fetchDepartmentList";
import { fetchUserList } from "@/api/User/fetchUserList";
import { fetchQuotationDataById } from "@/api/quotation/viewQuotation";
import { fetchClientsList } from "@/api/quotation/fetchClients";
import { UpdateView, updateView } from "@/api/quotation/updateView";

interface QuotationId {
  id: number;
}

export default function View(props: QuotationId) {
  const { id } = props;
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const queryClient = useQueryClient();

  // const {
  //   mutate: registerCategory,
  //   isError,
  //   error,
  // } = useMutation({
  //   mutationFn: (data: CreateCategory) => CreateCategory(data),
  //   onSuccess: () => {
  //     console.log("category registered successfully");
  //     queryClient.invalidateQueries({ queryKey: ["category"] });
  //     setShowRegisterModal(false);
  //   },
  //   onError: (error: any) => {
  //     console.error("Registration error:", error);
  //   },
  // });

  const { data: projects } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClientsList,
  });

  const {
    data: QuotationData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["quotation", id],
    queryFn: () => fetchQuotationDataById(id),
    enabled: !!id,
  });
  const { mutate: updatedView } = useMutation({
    mutationFn: (data: UpdateView) => updateView(id, data),
    onSuccess: () => {
      console.log("quotations updated successfully");
      queryClient.invalidateQueries({ queryKey: ["quotations", id] });
      setShowRegisterModal(false);
    },
    onError: (error) => {
      console.error("Error updating quotation:", error);
    },
  });

  const handleCompanyChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setFieldValue: any
  ) => {
    const value = e.target.value;
    setSelectedProject(value);

    const client = projects?.find((project) => project.id === parseInt(value));
    if (client) {
      setSelectedClient(client);
      setFieldValue("project", client);
      setFieldValue("contact_person", client.contact_person);
      setFieldValue("delivery_address", client.address);
      setFieldValue("client", client.client);
    }
  };

  const handleSubmit = (values: any) => {
    console.log(values);
  };
  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center space-x-2">
  //       {/* Spinner */}
  //       <div className="w-6 h-6 border-4 border-dashed border-gray-400 border-t-transparent rounded-full animate-spin dark:border-gray-200 dark:border-t-transparent"></div>

  //       <span className="text-sm text-gray-700 dark:text-gray-300">
  //         Loading...
  //       </span>
  //     </div>
  //   );
  // }
  if (isLoading || !QuotationData || !QuotationData.client) {
    return (
      <div className="flex justify-center items-center space-x-2">
        <div className="w-6 h-6 border-4 border-dashed border-gray-400 border-t-transparent rounded-full animate-spin dark:border-gray-200 dark:border-t-transparent"></div>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Loading...
        </span>
      </div>
    );
  }
  return (
    <>
      <div className="flex justify-start">
        <button
          className="uppercase flex items-center gap-2 bg-white text-blue-800 border border-blue-800 px-4 py-2 rounded-md shadow transition duration-200"
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
            <div className="flex justify-between">
              <h3 className="font-bold text-lg">
                {QuotationData?.quotation_no}
              </h3>
              {/* Toggle between CiEdit and CiCircleBan based on editability */}
              {isEditable ? (
                <FaBan
                  onClick={() => setIsEditable(false)} // Switch to readonly mode
                  className="w-6 h-6 cursor-pointer"
                />
              ) : (
                <CiEdit
                  onClick={() => setIsEditable(true)} // Switch to editable mode
                  className="w-6 h-6 cursor-pointer"
                />
              )}
            </div>

            <Formik
              initialValues={{
                project: QuotationData?.client.id,
                // project: {
                //   id: QuotationData?.id,
                //   client: QuotationData?.client,
                // },
                project_name: QuotationData?.project_name,
                remittedBy: QuotationData?.created_by.full_name,
                receivedBy: "",
                contact_person: QuotationData?.client.contact_person || "", // Initially populate if available
                delivery_address: QuotationData?.delivery_address || "",
                client: QuotationData?.client || "",
                quotation_items: QuotationData?.quotation_items.map((item) => ({
                  item: item.item || "",
                  description: item.description || "",
                  srp: item.srp || 0,
                  quantity: item.quantity || 0, // Ensure quantity is initialized as 0
                  total: item.srp * (item.quantity || 0),
                  // balance: "",

                  // date: particular.date || "",
                  // particulars: particular.particulars || "",
                  // expenses: particular.expenses || 0, // Default to 0 if not available
                  // cashFromAccounting: particular.cash_from_accounting || 0, // Default to 0 if not available
                  // balance: particular.balance || 0, // Default to 0 if not available
                  // vatIncluded: particular.vat_inclusive || false,
                })),
                // notesRows: [{ note: QuotationData?.notes_assumptions }],
                notes_assumptions: QuotationData?.notes_assumptions || "", // Set initial value for notes
                terms_conditions: QuotationData?.terms_conditions || "",
                discount: QuotationData?.discount || 0,
                vat_value: QuotationData?.vat_value || 0,
                // vat_value: QuotationData?.vat_total || 0,
              }}
              onSubmit={(values) => {
                // Trigger update mutation when form is submitted
                const updatedData = {
                  ...values,
                  tableRows: values.quotation_items?.map((row) => ({
                    ...row,
                    total: row.srp * row.quantity, // Recalculate total if needed
                  })),
                };

                // Call the mutation function to update the quotation
                updatedView(updatedData);
                console.log(updatedData);
              }}
            >
              {({ values, setFieldValue }) => {
                // Calculate total expenses and cash from accounting
                const totalExpenses = values.quotation_items?.reduce(
                  (acc, row) =>
                    acc + (parseFloat(row.srp) * parseFloat(row.quantity) || 0),
                  0
                );
                const totalCashFromAccounting = values.quotation_items?.reduce(
                  (acc, row) => acc + (parseFloat(row.balance) || 0),
                  0
                );
                const totalCashFromBalance = values.quotation_items?.reduce(
                  (acc, row) => acc + (parseFloat(row.balance) || 0),
                  0
                );

                return (
                  <Form className="py-1 uppercase">
                    {/* Project and Address Inputs */}
                    {[
                      {
                        label: "Project",
                        name: "project_name",
                        type: "text",
                        placeholder: "Enter project name",
                      },
                    ].map((item) => (
                      <div key={item.name}>
                        <label className="block mb-2 text-sm text-gray-700 dark:text-white">
                          {item.label}
                        </label>
                        <Field
                          type={item.type}
                          name={item.name}
                          placeholder={item.placeholder}
                          className="bg-gray-50 dark:bg-gray-dark dark:text-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                          required
                          disabled={!isEditable} // Conditionally disable field based on edit mode
                        />
                      </div>
                    ))}

                    {/* Dropdown for Project Selection */}
                    <div className="mb-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-white">
                        Company
                      </label>
                      <Field
                        as="select"
                        name="project"
                        className="mt-1 block w-full dark:bg-gray-dark border border-gray-300 rounded-md shadow-sm p-2"
                        onChange={(e) => handleCompanyChange(e, setFieldValue)}
                        // value={values.project?.id || ""}
                        disabled={!isEditable}
                      >
                        <option value="">Select a Project</option>
                        {projects?.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.client}
                          </option>
                        ))}
                      </Field>
                    </div>
                    {/* Project Details */}
                    {/* {selectedProject && ( */}
                    {
                      <div className="space-y-1">
                        {/* <h4 className="font-semibold">Project Details</h4> */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                              Contact person
                            </label>
                            <Field
                              type="text"
                              name="contact_person"
                              placeholder="Owner"
                              className="bg-gray-50 dark:bg-gray-dark dark:text-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              value={values.contact_person || ""} // Use Formik value
                              required
                              disabled={!isEditable} // Conditionally disable field based on edit mode
                            />
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                              Delivery address
                            </label>
                            <Field
                              type="text"
                              name="delivery_address"
                              placeholder="Enter delivery address"
                              className="bg-gray-50 dark:bg-gray-dark dark:text-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              value={values.delivery_address || ""} // Use Formik value
                              required
                              disabled={!isEditable} // Conditionally disable field based on edit mode
                            />
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                              address
                            </label>
                            <Field
                              type="text"
                              name="client"
                              placeholder="Enter delivery address"
                              className="bg-gray-50 dark:bg-gray-dark dark:text-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              value={values.client.address || ""} // Use Formik value
                              required
                              disabled={!isEditable} // Conditionally disable field based on edit mode
                            />
                          </div>
                        </div>
                      </div>
                    }

                    {/* Table for Adding Expenses */}
                    <div className="space-y-5 mt-4">
                      {/* <h4 className="font-semibold">Expenses</h4> */}
                      <FieldArray
                        name="quotation_items"
                        render={(arrayHelpers) => (
                          <div>
                            <table className="table-zebra w-full border-collapse">
                              <thead>
                                <tr className="dark:text-white">
                                  {[
                                    "# ITEM",
                                    "Description",
                                    "SRP",
                                    "Quantity",
                                    "Total",
                                  ].map((header) => (
                                    <th
                                      key={header}
                                      className="p-2 text-center bg-gray-200 border border-black"
                                    >
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {values.quotation_items?.map((row, index) => (
                                  <tr key={index}>
                                    <td className="p-2 border border-black">
                                      <Field
                                        type="text"
                                        name={`quotation_items[${index}].item`}
                                        disabled={!isEditable}
                                        className="dark:bg-gray-dark text-center dark:text-white bg-gray-50 border  border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                      />
                                    </td>
                                    <td className="p-2 border border-black">
                                      <Field
                                        type="text"
                                        name={`quotation_items[${index}].description`}
                                        disabled={!isEditable}
                                        className="bg-gray-50 border text-center border-gray-300 dark:bg-gray-dark dark:text-white text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                      />
                                    </td>
                                    <td className="p-2 border border-black">
                                      <Field
                                        type="number"
                                        name={`quotation_items[${index}].srp`}
                                        disabled={!isEditable}
                                        className="bg-gray-50 border text-center border-gray-300 dark:bg-gray-dark dark:text-white text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                      />
                                    </td>
                                    <td className="p-2 border border-black">
                                      <Field
                                        type="number"
                                        name={`quotation_items[${index}].quantity`}
                                        disabled={!isEditable}
                                        className="bg-gray-50 border text-center border-gray-300 dark:bg-gray-dark dark:text-white text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        onChange={(e) => {
                                          const quantity = parseFloat(
                                            e.target.value
                                          );
                                          const srp =
                                            parseFloat(
                                              values.quotation_items[index].srp
                                            ) || 0;
                                          const total = srp * quantity;
                                          setFieldValue(
                                            `quotation_items[${index}].quantity`,
                                            quantity
                                          );
                                          setFieldValue(
                                            `quotation_items[${index}].total`,
                                            total
                                          );
                                        }}
                                      />
                                    </td>
                                    <td className="p-2 border border-black">
                                      <Field
                                        type="number"
                                        name={`quotation_items[${index}].total`}
                                        readOnly
                                        className="bg-gray-50 border text-center border-gray-300 dark:bg-gray-dark dark:text-white text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                      />
                                    </td>
                                    <td className="p-2 ">
                                      {isEditable && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            arrayHelpers.remove(index)
                                          }
                                          // className="btn btn-danger uppercase"
                                          className="flex items-center gap-1 bg-white border border-red-800  text-red-800 px-3 py-1.5 rounded-md text-xs shadow transition duration-200 uppercase"
                                        >
                                          Remove
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {isEditable && (
                              <button
                                type="button"
                                onClick={() =>
                                  arrayHelpers.push({
                                    date: "",
                                    particulars: "",
                                    srp: "",
                                    quantity: "",
                                    total: 0,
                                    balance: "",
                                  })
                                }
                                className="btn bg-white border border-black mt-1 mb-1 text-black uppercase"
                              >
                                Add Row
                              </button>
                            )}
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
                            disabled={!isEditable}
                            className="bg-gray-50 border border-gray-300 dark:bg-gray-dark dark:text-white text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
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
                            name="vat_value"
                            disabled={!isEditable}
                            className="bg-gray-50 border border-gray-300 dark:bg-gray-dark dark:text-white text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
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
                            className="bg-gray-200 p-2 rounded-md w-full dark:bg-gray-dark dark:text-white dark:border border-white "
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
                            className="bg-gray-200 p-2 rounded-md w-full dark:bg-gray-dark dark:text-white dark:border border-white "
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
                            className="bg-gray-200 p-2 rounded-md w-full dark:bg-gray-dark dark:text-white dark:border border-white"
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
                            className="bg-gray-200 p-2 rounded-md w-full dark:bg-gray-dark dark:text-white dark:border border-white"
                          />
                        </div> */}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                      {/* Notes & Assumptions */}
                      <div className="mt-1">
                        <h4 className="font-semibold">Notes & Assumptions</h4>
                        <Field
                          as="textarea"
                          name="notes_assumptions"
                          disabled={!isEditable}
                          className="bg-gray-50 border border-gray-300 dark:bg-gray-dark dark:text-white text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 mt-2"
                          placeholder="Enter any notes or assumptions regarding this quotation"
                        />
                      </div>

                      {/* Terms & Conditions */}
                      <div className="mt-1">
                        <h4 className="font-semibold">Terms & Conditions</h4>
                        <Field
                          as="textarea"
                          name="terms_conditions"
                          disabled={!isEditable}
                          className="bg-gray-50 border border-gray-300 dark:bg-gray-dark dark:text-white text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 mt-2"
                          placeholder="Enter terms and conditions for this quotation"
                        />
                      </div>
                    </div>
                    {/* Submit and Cancel Buttons */}
                    <div className="modal-action">
                      <button type="submit" className="btn">
                        {isEditable ? "Update" : "Submit"}{" "}
                        {/* Conditionally change the button text */}
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
