"use client";

import React, { useState, useEffect } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { Field, Form, Formik, FieldArray } from "formik";
import { CiCirclePlus } from "react-icons/ci";

/** api */
import { CreateCategory } from "@/api/inventory/CreateCategory";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/** interfaces */
import { fetchDepartmentsList } from "@/api/User/fetchDepartmentList";
import { fetchUserList } from "@/api/User/fetchUserList";
import { fetchClientsList } from "@/api/quotation/fetchClients";
import { AddQuo, CreateQuo } from "@/api/quotation/addQuotation";

export default function AddQuotations() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>(""); // Client ID
  const [projectName, setProjectName] = useState<string>("");
  const [contactPerson, setContactPerson] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [id, setClient] = useState<number>(0);
  //   const [projectName, setProjectName] = useState<string>("");

  const queryClient = useQueryClient();

  const {
    mutate: registerQuotation,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: AddQuo) => CreateQuo(data),
    onSuccess: () => {
      console.log("quotation registered successfully");
      queryClient.invalidateQueries({ queryKey: ["quotation"] });
      setShowRegisterModal(false);
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
    },
  });

  // Fetch project data based on dropdown selection
  const { data: projects } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClientsList, // Assume fetchDepartmentsList is an API call to fetch departments (projects)
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
  // useEffect(() => {
  //   if (selectedProject) {
  //     const selectedClientDetails = projects?.find(
  //       (project) => project.id === parseInt(selectedProject)
  //     );
  //     if (selectedClientDetails) {
  //       setProjectName(selectedClientDetails.client); // Set project name
  //       setContactPerson(selectedClientDetails.contact_person); // Set contact person
  //       setAddress(selectedClientDetails.address); // Set address

  //       setFieldValue("delivery_address", selectedClientDetails.address || "");
  //     }
  //   }
  // }, [selectedProject, projects, setFieldValue]);

  return (
    <>
      <div className="flex justify-start">
        <button
          className="btn bg-white border border-black uppercase text-black"
          onClick={() => setShowRegisterModal(true)}
        >
          {/* <FaCirclePlus className="w-6 h-6 btn-info" /> */}
          Add Quotations
        </button>
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <dialog open className="modal backdrop-blur-sm mt-15">
          <div className="modal-box w-11/12 max-w-7xl max-h-[80vh] overflow-y-auto dark:bg-gray-dark">
            <h3 className="font-bold text-lg text-center uppercase">
              Create New Quotations
            </h3>
            <Formik
              initialValues={{
                project: "",
                // projectName: "",
                project_name: projectName || "",
                contactPerson: contactPerson || "",
                delivery_address: address || "", // Ensure address is passed
                client: id || 0,
                projectDate: "",
                remittedBy: "",
                receivedBy: "",
                tableRows: [
                  {
                    date: "",
                    description: "",
                    srp: "",
                    quantity: "",
                    total: 0,
                    balance: "",
                  },
                ],
                quotation_items: [
                  {
                    item: "",
                    description: "",
                    srp: "",
                    quantity: "",
                    total: 0,
                    balance: "",
                  },
                ],
                // notesRows: [{ note: "" }],
                notes_assumptions: "",
                terms_conditions: "",
              }}
              // onSubmit={handleSubmit}
              onSubmit={(values, { resetForm }) => {
                registerQuotation(values);
                resetForm({
                  values: {
                    project: "",
                    project_name: "",
                    contactPerson: "",
                    delivery_address: "",
                    client: 0,
                    projectDate: "",
                    remittedBy: "",
                    receivedBy: "",
                    tableRows: [
                      {
                        date: "",
                        description: "",
                        srp: "",
                        quantity: "",
                        total: 0,
                        balance: "",
                      },
                    ],
                    quotation_items: [
                      {
                        item: "",
                        description: "",
                        srp: "",
                        quantity: "",
                        total: 0,
                        balance: "",
                      },
                    ],
                    notes_assumptions: "",
                    terms_conditions: "",
                  },
                });
                setProjectName("");
                setContactPerson("");
                setAddress("");
                setSelectedProject("");
                setClient(0);
                console.log(values);
              }}
            >
              {({ values, setFieldValue }) => {
                useEffect(() => {
                  if (selectedProject) {
                    const selectedClientDetails = projects?.find(
                      (project) => project.id === parseInt(selectedProject)
                    );
                    if (selectedClientDetails) {
                      setProjectName(selectedClientDetails.client); // Set project name
                      setContactPerson(selectedClientDetails.contact_person); // Set contact person
                      setAddress(selectedClientDetails.address); // Set address
                      setClient(selectedClientDetails.id); // Set address
                      // Update Formik form field for delivery_address
                      setFieldValue(
                        "delivery_address",
                        selectedClientDetails.address || ""
                      );
                      setFieldValue(
                        "contactPerson",
                        selectedClientDetails.contact_person || ""
                      );
                      setFieldValue(
                        "client",
                        selectedClientDetails.client || ""
                      );
                    }
                  }
                }, [selectedProject, projects, setFieldValue]);
                // Calculate total expenses and cash from accounting
                const totalExpenses = values.quotation_items.reduce(
                  (acc, row) =>
                    acc + (parseFloat(row.srp) * parseFloat(row.quantity) || 0),
                  0
                );
                const totalCashFromAccounting = values.quotation_items.reduce(
                  (acc, row) => acc + (parseFloat(row.balance) || 0),
                  0
                );
                const totalCashFromBalance = values.quotation_items.reduce(
                  (acc, row) => acc + (parseFloat(row.balance) || 0),
                  0
                );

                return (
                  <Form className="py-4">
                    {/* Project and Address Inputs */}
                    {[
                      {
                        label: "Project",
                        name: "project_name",
                        type: "text",
                        placeholder: "Enter project name",
                        value: projectName || "",
                      },
                    ].map((item) => (
                      <div key={item.name}>
                        <label className="uppercase block mb-2 text-sm font-bold text-gray-700 dark:text-white">
                          {item.label}
                        </label>
                        <Field
                          type={item.type}
                          name={item.name}
                          placeholder={item.placeholder}
                          className="bg-gray-50 border dark:placeholder:text-white dark:bg-gray-dark dark:text-white border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                          required
                        />
                      </div>
                    ))}

                    {/* Dropdown for Project Selection */}
                    <div className="mb-1">
                      <label className="block text-sm font-bold uppercase text-gray-700 dark:text-white">
                        Company
                      </label>
                      <Field
                        as="select"
                        name="project"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-dark"
                        onChange={(e) => {
                          const projectId = e.target.value;
                          setSelectedProject(projectId); // Set selected project
                          setFieldValue("project", projectId);
                        }}
                      >
                        <option value="">Select a Company</option>
                        {projects?.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.client}
                          </option>
                        ))}
                      </Field>
                    </div>

                    {/* Project Details */}
                    {selectedProject && (
                      <div className="space-y-4 ">
                        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-2">
                          {/* <h4 className="font-semibold">Project Details</h4> */}
                          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"> */}
                          {/* <div className="flex flex-wrap gap-4"> */}
                          {[
                            {
                              label: "Contact Person",
                              name: "contactPerson",
                              type: "text",
                              placeholder: "Contact Person",
                            },
                            {
                              label: "client",
                              name: "client",
                              type: "text",
                              placeholder: "client",
                            },
                            {
                              label: "Address",
                              name: "delivery_address",
                              type: "text",
                              placeholder: "Address",
                              // value: address || "",
                              // value: values.delivery_address || address || "",
                            },
                          ].map((item) => (
                            <div key={item.name}>
                              <label className="uppercase block mb-2 text-sm font-bold text-gray-700">
                                {item.label}
                              </label>
                              {item.type === "select" ? (
                                <Field
                                  as="select"
                                  name={item.name}
                                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
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
                                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                  required
                                  // value={
                                  //   item.name === "contactPerson"
                                  //     ? contactPerson
                                  //     : address || values[item.name]
                                  // }
                                  value={values[item.name] || ""}
                                  readOnly
                                  // value={
                                  //   item.name === "contactPerson"
                                  //     ? contactPerson || values.contactPerson // For contactPerson, use the contactPerson value or Formik's value
                                  //     : item.name === "delivery_address"
                                  //     ? values.delivery_address || address || "" // For delivery_address, use Formik's value or fallback to address
                                  //     : values[item.name] // For other fields, use Formik's state value
                                  // }
                                  // value={values[item.name] || address || ""}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Table for Adding Expenses */}
                    <div className="space-y-4">
                      {/* <h4 className="font-semibold">Expenses</h4> */}
                      <FieldArray
                        name="quotation_items"
                        render={(arrayHelpers) => (
                          <div>
                            <table className="table-auto w-full border-collapse">
                              <thead>
                                <tr className="uppercase">
                                  {[
                                    "# ITEM",
                                    "Description",
                                    "SRP",
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
                                {values.quotation_items.map((row, index) => (
                                  <tr key={index}>
                                    <td className="p-2 border border-black">
                                      <Field
                                        as="select"
                                        name={`quotation_items[${index}].item`} // Name it as client
                                        className="bg-gray-50 border dark:bg-gray-dark dark:text-white border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        onChange={(e) => {
                                          const selectedItemId = e.target.value;
                                          setFieldValue(
                                            `quotation_items[${index}].item`,
                                            selectedItemId
                                          );

                                          // Fetch the selected item details and update form fields
                                          const selectedItem = projects?.find(
                                            (project) =>
                                              project.id ===
                                              parseInt(selectedItemId)
                                          );

                                          if (selectedItem) {
                                            // Set the description and SRP from selected item
                                            setFieldValue(
                                              `quotation_items[${index}].description`,
                                              selectedItem.client || "" // Set description from client name
                                            );
                                            setFieldValue(
                                              `quotation_items[${index}].srp`,
                                              selectedItem.contact_number || 0 // Set SRP (assuming contact_number is SRP)
                                            );
                                            setFieldValue(
                                              `quotation_items[${index}].quantity`,
                                              1
                                            ); // Set initial quantity to 1
                                            setFieldValue(
                                              `quotation_items[${index}].total`,
                                              (selectedItem.contact_number ||
                                                0) * 1 // Calculate total based on SRP and quantity
                                            );
                                          }
                                        }}
                                      >
                                        <option value="">Select Item</option>
                                        {projects?.map((client) => (
                                          <option
                                            key={client.id}
                                            value={client.id}
                                          >
                                            {client.client}{" "}
                                            {/* Display client name */}
                                          </option>
                                        ))}
                                      </Field>
                                    </td>

                                    <td className="p-2 border border-black">
                                      <Field
                                        type="text"
                                        name={`quotation_items[${index}].description`}
                                        className="bg-gray-50 dark:bg-gray-dark dark:text-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        readOnly
                                      />
                                    </td>

                                    <td className="p-2 border border-black">
                                      <Field
                                        type="number"
                                        name={`quotation_items[${index}].srp`}
                                        className="bg-gray-50 dark:bg-gray-dark dark:text-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        // Allow user to edit SRP
                                        onChange={(e) => {
                                          const srp = parseFloat(
                                            e.target.value
                                          );
                                          const quantity =
                                            parseFloat(
                                              values.quotation_items[index]
                                                .quantity
                                            ) || 1;
                                          const total = srp * quantity;

                                          setFieldValue(
                                            `quotation_items[${index}].srp`,
                                            srp
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
                                        name={`quotation_items[${index}].quantity`}
                                        className="bg-gray-50 dark:bg-gray-dark dark:text-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
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
                                        className="bg-gray-50 dark:bg-gray-dark dark:text-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                      />
                                    </td>

                                    <td className="p-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          arrayHelpers.remove(index)
                                        }
                                        // className="btn btn-danger uppercase"
                                        className="flex items-center gap-1 bg-white border border-red-800 text-red-800 px-3 py-1.5 rounded-md text-xs shadow transition duration-200 uppercase"
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
                                  date: "",
                                  description: "",
                                  srp: "",
                                  quantity: 1,
                                  total: 0,
                                  balance: "",
                                })
                              }
                              className="btn bg-white mt-2 mb-2 text-black border border-black uppercase"
                            >
                              Add Row
                            </button>
                          </div>
                        )}
                      />
                    </div>

                    {/* Total Row */}
                    <div className="flex justify-between py-2 border-t border-gray-300">
                      <div className="ml-auto flex space-x-4 w-full uppercase">
                        {/* Discount Input */}
                        <div className="flex flex-col w-1/4">
                          <label className="font-semibold">Discount</label>
                          <Field
                            type="number"
                            name="discount"
                            className="bg-gray-50 dark:bg-gray-dark dark:text-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
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
                            className="bg-gray-50 dark:bg-gray-dark dark:text-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={(e) => {
                              const vat = parseFloat(e.target.value);
                              setFieldValue("vat", vat);
                            }}
                          />
                        </div>

                        {/* Sub Total */}
                        <div className="flex flex-col w-1/4 ">
                          <label className="font-semibold">Sub Total</label>
                          <input
                            type="number"
                            value={totalExpenses}
                            readOnly
                            className="bg-gray-200 border border-white dark:bg-gray-dark dark:text-white p-2 rounded-md w-full"
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
                            className="bg-gray-200 border border-white dark:bg-gray-dark dark:text-white p-2 rounded-md w-full"
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
                            className="bg-gray-200 border border-white dark:bg-gray-dark dark:text-white p-2 rounded-md w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Grand Total */}
                    <div className="flex justify-between py-2 border-t border-gray-300 uppercase">
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
                            className="bg-gray-200 border border-white dark:bg-gray-dark dark:text-white p-2 rounded-md w-full"
                          />
                        </div> */}
                      </div>
                    </div>
                    {/* Notes & Assumptions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                      <div className="mt-1">
                        <h4 className="font-semibold uppercase">
                          Notes & Assumptions
                        </h4>
                        <Field
                          as="textarea"
                          name="notes_assumptions"
                          className="bg-gray-50 dark:bg-gray-dark dark:text-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 mt-2"
                          placeholder="Enter any notes or assumptions regarding this quotation"
                        />
                      </div>

                      {/* Terms & Conditions */}
                      <div className="mt-1 uppercase">
                        <h4 className="font-semibold">Terms & Conditions</h4>
                        <Field
                          as="textarea"
                          name="terms_conditions"
                          className="bg-gray-50 dark:bg-gray-dark dark:text-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 mt-2"
                          placeholder="Enter terms and conditions for this quotation"
                        />
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
