"use client";

import React, { useState } from "react";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

/** components */
import { FaCirclePlus } from "react-icons/fa6";

/** api */
import { registerUser } from "@/api/User/registerUser";

/** interfaces */
import { RegisterEmployee } from "@/interfaces/RegisterEmployee";
import { Field, Form, Formik } from "formik";
import { fetchDepartmentsList } from "@/api/User/fetchDepartmentList";
import { fetchRoleList } from "@/api/User/fetchRoleList";
import { CreateItem, Item } from "@/api/product_master_list/addItem";
import { fetchVendorList } from "@/api/product_master_list/fetchVendor";
import { fetchCategoryList } from "@/api/product_master_list/fetchCategory";

export default function AddProduct() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  // const [errorMessage, setErrorMessage] = useState("");
  // const [formData, setFormData] = useState<RegisterEmployee>({
  //   first_name: "",
  //   middle_name: "",
  //   last_name: "",
  //   suffix: "",
  //   birth_date: "",
  //   sex: false,
  //   address: "",
  //   email: "",
  //   contact_number: "",
  //   department: "",
  //   role: "",
  //   username: "",
  //   password: "",
  //   password2: "",
  // });

  const queryClient = useQueryClient();

  // const handleInputChanged = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: type === "radio" ? checked : value,
  //   }));
  // };

  const {
    mutate: registerItem,
    isError,
    error,
  } = useMutation({
    mutationFn: (NewItem: Item) => CreateItem(NewItem),
    onSuccess: () => {
      console.log("new registered successfully");
      queryClient.invalidateQueries({ queryKey: ["item"] });
      setShowRegisterModal(false);
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
    },
  });

  // departments

  const {
    isLoading: DisLoading,
    error: Derror,
    data: departmentList,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartmentsList,
  });
  const {
    isLoading: VendorisLoading,
    error: Vendorerror,
    data: vendorList,
  } = useQuery({
    queryKey: ["vendor"],
    queryFn: fetchVendorList,
  });

  const {
    isLoading: Categoryloading,
    error: Categoryerror,
    data: categoryList,
  } = useQuery({
    queryKey: ["category"],
    queryFn: fetchCategoryList,
  });
  // roles
  const { data: RoleList } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoleList,
  });

  if (DisLoading) return <div>Loading...</div>;
  if (Derror instanceof Error)
    return <div>An error has occurred: {Derror.message}</div>;

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          className="btn bg-white text-black border border-black uppercase"
          onClick={() => setShowRegisterModal(true)}
        >
          {/* <FaCirclePlus className="w-6 h-6 btn-info" /> */}
          Add item list
        </button>
      </div>
      <div>
        {/* Registration Modal */}
        {showRegisterModal && (
          <dialog open className="modal mt-15 backdrop-blur-sm">
            <div className="modal-box w-11/12 max-w-7xl max-h-[80vh] overflow-y-auto dark:bg-gray-dark dark:text-white">
              {/* <h3 className="font-bold text-lg uppercase text-center">
                Add item
              </h3> */}
              <Formik
                initialValues={{
                  vendor: "",
                  category: "",
                  item: "",
                  brand: "",
                  model: "",
                  unit_of_measurement: "",
                  unit_price: "",
                  srp: "",
                  vat_percentage: "",
                  vat_exempted: false,
                  description: "",
                }}
                onSubmit={(values, { resetForm }) => {
                  registerItem({
                    ...values,
                    unit_price: values.unit_price,
                    srp: values.srp,
                    vat_percentage: values.vat_percentage,
                    vat_exempt: values.vat_exempted,
                  });
                  resetForm();
                  console.log(values);
                }}
              >
                {({ values, setFieldValue }) => (
                  <Form className="py-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left column */}
                      <div>
                        {[
                          {
                            type: "text",
                            name: "item",
                            placeholder: "Enter item name",
                            label: "Item Name",
                          },
                          {
                            type: "text",
                            name: "brand",
                            placeholder: "Enter brand",
                            label: "Brand",
                          },
                          {
                            type: "text",
                            name: "model",
                            placeholder: "Enter model",
                            label: "Model",
                          },
                          {
                            type: "text",
                            name: "unit_of_measurement",
                            placeholder: "Enter unit of measurement",
                            label: "Unit of Measurement",
                          },
                          {
                            type: "textarea",
                            name: "description",
                            placeholder: "Enter your description",
                            label: "Description",
                          },
                          // ].map((item) => (
                          //   <div key={item.name} className="mb-1 uppercase ">
                          //     <label
                          //       htmlFor={item.name}
                          //       className="block text-sm font-bold "
                          //     >
                          //       {item.label}
                          //     </label>
                          //     <Field
                          //       type={item.type}
                          //       id={item.name}
                          //       name={item.name}
                          //       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          //       placeholder={item.placeholder}
                          //     />
                          //   </div>
                          // ))
                        ].map((item) => (
                          <div key={item.name} className="mb-1 uppercase">
                            <label
                              htmlFor={item.name}
                              className="block text-sm font-bold"
                            >
                              {item.label}
                            </label>
                            <Field
                              as={
                                item.type === "textarea" ? "textarea" : "input"
                              }
                              type={
                                item.type !== "textarea" ? item.type : undefined
                              }
                              id={item.name}
                              name={item.name}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                              placeholder={item.placeholder}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Right column */}
                      <div>
                        {[
                          {
                            type: "select",
                            name: "vendor",
                            label: "Vendor",
                            options:
                              vendorList?.map((d) => ({
                                value: d.vendor,
                                label: d.vendor,
                              })) || [],
                          },
                          {
                            type: "select",
                            name: "category",
                            label: "Category",
                            options:
                              categoryList?.map((r) => ({
                                value: r.category,
                                label: r.category,
                              })) || [],
                          },
                        ].map((item) => (
                          <div key={item.name} className="mb-1 uppercase">
                            <label
                              htmlFor={item.name}
                              className="block text-sm font-bold "
                            >
                              {item.label}
                            </label>
                            <Field
                              as="select"
                              id={item.name}
                              name={item.name}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-dark"
                            >
                              <option value="">Select {item.label}</option>
                              {item.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Field>
                          </div>
                        ))}

                        {/* Price-related fields */}
                        {[
                          {
                            type: "number",
                            name: "srp",
                            placeholder: "Enter SRP",
                            label: "SRP",
                          },
                          {
                            type: "number",
                            name: "unit_price",
                            placeholder: "Enter Unit Price",
                            label: "Unit Price",
                          },
                          {
                            type: "number",
                            name: "vat_percentage",
                            placeholder: "Enter VAT Percentage",
                            label: "VAT %",
                          },
                        ].map((item) => (
                          <div key={item.name} className="mb-1">
                            <label
                              htmlFor={item.name}
                              className="block text-sm font-bold "
                            >
                              {item.label}
                            </label>
                            <Field
                              type={item.type}
                              id={item.name}
                              name={item.name}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                              placeholder={item.placeholder}
                            />
                          </div>
                        ))}

                        {/* VAT Checkbox */}
                        <div className="mb-1 flex items-center gap-2 ">
                          <input
                            type="checkbox"
                            id="vat_exempted"
                            name="vat_exempted"
                            checked={values.vat_exempted}
                            onChange={(e) =>
                              setFieldValue("vat_exempted", e.target.checked)
                            }
                            className="checkbox border-gray-300 dark:border-gray-600 dark:bg-gray-800  dark:checked:bg-white"
                          />
                          <label
                            htmlFor="vat_exempted"
                            className="text-sm font-medium text-gray-800 dark:text-white"
                          >
                            Apply VAT
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {/* <div className="mb-1">
                      <label
                        htmlFor="description"
                        className="block text-sm font-bold uppercase "
                      >
                        Description
                      </label>
                      <Field
                        as="textarea"
                        id="description"
                        name="description"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="Enter your description"
                      />
                    </div> */}

                    {/* Actions */}
                    <div className="modal-action">
                      <button type="submit" className="btn">
                        Submit
                      </button>
                      <button
                        type="button"
                        className="btn"
                        onClick={() => setShowRegisterModal(false)}
                      >
                        Close
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>

              {isError && (
                <div className="text-red-500 mt-4">
                  <p>Error: {error?.message || "An error occurred"}</p>
                </div>
              )}
            </div>
          </dialog>
        )}
      </div>
    </>
  );
}
