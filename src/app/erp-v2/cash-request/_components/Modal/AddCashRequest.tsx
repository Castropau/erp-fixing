"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaCirclePlus } from "react-icons/fa6";
import { Formik, Field, Form, FieldArray } from "formik";
import { registerUser } from "@/api/User/registerUser";
import { RegisterEmployee } from "@/interfaces/RegisterEmployee";
import { fetchUserLists } from "@/api/cash-request/fetchUsers";
import { CashUnits } from "@/api/cash-request/fetchUnit";
import { ChequeItems, Items } from "@/api/cheque-request/fetchItems";
import { Supplier } from "@/api/cash-request/fetchSupplier";
import { fetchCashRequestId } from "@/api/cash-request/fetchCashRequestId";
import {
  AddRequisitionCash,
  registerCashRequest,
} from "@/api/cash-request/addCashRequest";

export default function AddCashRequest() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: registerRequest } = useMutation({
    mutationFn: (data: AddRequisitionCash) => registerCashRequest(data),
    onSuccess: () => {
      console.log("registered");
      queryClient.invalidateQueries({ queryKey: ["request"] });
      setShowRegisterModal(false);
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });

  // users fetch
  const {
    isLoading: DisLoading,
    error: Derror,
    data: usersList,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUserLists,
  });

  //   const unitsList = ["kg", "unit", "box", "liter", "meter"];
  const {
    isLoading: CULoading,
    error: CUerror,
    data: unitsList,
  } = useQuery<CashUnits[]>({
    queryKey: ["units"],
    queryFn: CashUnits,
  });

  // fetch items
  const {
    isLoading: ItemLoading,
    error: Itemerror,
    data: ItemList,
  } = useQuery<Items[]>({
    queryKey: ["items"],
    queryFn: ChequeItems,
  });

  const {
    isLoading: SupplierLoading,
    error: Supplierrrror,
    data: SupplierList,
  } = useQuery<Supplier[]>({
    queryKey: ["supplier"],
    queryFn: Supplier,
  });

  const handleSubmit = (values: any) => {
    console.log("Form data to submit:", values);
    registerRequest(values);
  };

  return (
    <>
      <div className="flex justify-end">
        <button
          className="btn bg-white uppercase text-black border border-black"
          onClick={() => setShowRegisterModal(true)}
        >
          {/* <FaCirclePlus className="w-6 h-5 btn-info" /> */}
          Add Cash Request
        </button>
      </div>

      {showRegisterModal && (
        <dialog open className="modal mt-15 backdrop-blur-sm">
          <div className="modal-box w-11/12 max-w-7xl max-h-[80vh] overflow-y-auto dark:bg-gray-dark dark:text-white">
            <h3 className="font-bold text-lg text-center">
              Create New Cash Request
            </h3>

            <Formik
              initialValues={{
                requested_by: "",
                date_requested: "",
                created_by: "",
                date_created: "",
                date_cancelled: "",
                cancelled_by: {
                  username: "",
                  full_name: "",
                  role: "",
                  department: "",
                  contact_number: "",
                },
                cash_requisition_items: [
                  {
                    total_price: "",
                    item: "",
                    supplier: "",
                    unit_of_measurement: "",
                    quantity: 0,
                    unit_price: 0,
                    description: "",
                    discount: "",
                    vat_percentage: "",
                    less_ewt: "",
                    total: "",
                    vat_value: "",
                    ewt_value: "",
                    grand_total: "",
                  },
                ],
                cheque_request_ref: "",
                serial_no: "",
                sub_total: "",
                total: "",
                vat_value: "",
                ewt_value: "",
                grand_total: "",
                special_instructions: "",
                project_name: "",
                delivery_address: "",
                // status: "",
                discount: 0,
                vat_percentage: 0,
                less_ewt: 0,
              }}
              onSubmit={handleSubmit}
          
            >
              {({ values, setFieldValue }) => (
                <Form className="">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 uppercase">
                    {[
                      {
                        type: "textarea",
                        name: "special_instructions",
                        placeholder: "Enter special instructions",
                        label: "Special Instructions",
                      },
                      {
                        type: "text",
                        name: "project_name",
                        placeholder: "Enter project name",
                        label: "Project Name",
                      },
                      {
                        type: "text",
                        name: "delivery_address",
                        placeholder: "Enter delivery address",
                        label: "Delivery Address",
                      },
                      {
                        type: "select",
                        name: "requested_by",
                        label: "Requested By",
                        options:
                          usersList?.map((user) => ({
                            value: user.id.toString(),
                            label: user.full_name,
                          })) || [],
                      },
                      {
                        type: "date",
                        name: "date_requested",
                        placeholder: "Select date",
                        label: "Date",
                      },
                    ].map((item) => (
                      <div
                        key={item.name}
                        className={
                          item.type === "textarea" ? "md:col-span-2" : ""
                        }
                      >
                        <label
                          htmlFor={item.name}
                          className="block text-sm font-bold"
                        >
                          {item.label}
                        </label>
                        {item.type === "text" ||
                        item.type === "date" ||
                        item.type === "textarea" ? (
                          <Field
                            as={item.type === "textarea" ? "textarea" : "input"}
                            type={item.type === "textarea" ? null : item.type}
                            id={item.name}
                            name={item.name}
                            className=" block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder={item.placeholder}
                            required
                          />
                        ) : item.type === "select" ? (
                          <Field
                            as="select"
                            id={item.name}
                            name={item.name}
                            className=" block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                          >
                            <option value="">Select a user</option>
                            {item.options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Field>
                        ) : null}
                      </div>
                    ))}
                  </div>

                  <FieldArray name="cash_requisition_items">
                    {({ insert, remove, push }) => (
                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            push({
                              item: "", // Dropdown for users
                              quantity: "",
                              unit: "",
                              description: "",
                              supplier: "",
                              unit_price: "",
                              total: 0,
                              discount: 0,
                              vat_percentage: 0,
                              less_ewt: 0,
                              vat_value: 0,
                              ewt_value: 0,
                              grand_total: 0,
                            })
                          }
                          className="btn bg-white border border-black mb-2 text-black uppercase"
                        >
                          Add Row
                        </button>
                        <table
                          className="w-full table-zebra border-collapse text-sm border"
                          style={{ width: "100%" }}
                        >
                          <thead className="bg-gray-200 dark:bg-gray-900">
                            <tr>
                              <th className="border p-2">Item</th>
                              <th className="border p-2">Quantity</th>
                              <th className="border p-2">Unit</th>
                              <th className="border p-2">Description</th>
                              <th className="border p-2">Supplier</th>
                              <th className="border p-2">Unit Price</th>
                              <th className="border p-2">Total</th>
                              <th className="border p-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {values.cash_requisition_items.map(
                              (item, index) => (
                                <tr key={index}>
                                  <td className=" p-2">
                                    {DisLoading ? (
                                      <div>Loading users...</div>
                                    ) : Derror ? (
                                      <div>Error loading users</div>
                                    ) : (
                                      <div>
                                        <input
                                          type="text"
                                          name={`cash_requisition_items[${index}].item`}
                                          list={`ItemList-${index}`}
                                          className="w-full p-2 border dark:border-white border-gray-300 rounded-md shadow-sm text-center"
                                          placeholder="Search or type item"
                                          value={item.item}
                                          onChange={(e) =>
                                            setFieldValue(
                                              `cash_requisition_items[${index}].item`,
                                              e.target.value
                                            )
                                          }
                                          required
                                        />
                                        <datalist id={`ItemList-${index}`}>
                                          {ItemList?.map((user) => (
                                            <option
                                              key={user.id}
                                              value={user.item}
                                            />
                                          ))}
                                        </datalist>
                                      </div>
                                    )}
                                  </td>
                                  <td className=" p-2">
                                    <Field
                                      type="number"
                                      name={`cash_requisition_items[${index}].quantity`}
                                      className="w-full p-2 border text-center border-gray-300 rounded-md shadow-sm"
                                      placeholder="Quantity"
                                      onChange={(e) =>
                                        setFieldValue(
                                          `cash_requisition_items[${index}].quantity`,
                                          e.target.value
                                        )
                                      }
                                      required
                                    />
                                  </td>
                                  <td className=" p-2">
                                    <Field
                                      as="select"
                                      name={`cash_requisition_items[${index}].unit_of_measurement`}
                                      className="w-full p-2 border dark:bg-gray-dark text-center border-gray-300 rounded-md shadow-sm"
                                      required
                                    >
                                      <option value="">Select unit</option>
                                      {CULoading ? (
                                        <option value="">Loading...</option>
                                      ) : CUerror ? (
                                        <option value="">
                                          Error loading units
                                        </option>
                                      ) : (
                                        unitsList?.map((unit) => (
                                          <option
                                            key={unit.id}
                                            value={unit.unit_of_measurement}
                                            selected={
                                              unit.unit_of_measurement ===
                                              item.unit_of_measurement
                                            }
                                          >
                                            {unit.unit_of_measurement}
                                          </option>
                                        ))
                                      )}
                                    </Field>
                                  </td>

                                  <td className=" p-2">
                                    <Field
                                      type="text"
                                      name={`cash_requisition_items[${index}].description`}
                                      className="w-full p-2 border text-center border-gray-300 rounded-md shadow-sm"
                                      placeholder="Description"
                                      required
                                    />
                                  </td>
                                  <td className=" p-2">
                                    {DisLoading ? (
                                      <div>Loading users...</div>
                                    ) : Derror ? (
                                      <div>Error loading users</div>
                                    ) : (
                                      <div>
                                        <input
                                          type="text"
                                          name={`cash_requisition_items[${index}].supplier`}
                                          list={`supplierList-${index}`}
                                          className="w-full p-2 border text-center border-gray-300 rounded-md shadow-sm"
                                          placeholder="Search or type supplier"
                                          value={item.supplier}
                                          onChange={(e) =>
                                            setFieldValue(
                                              `cash_requisition_items[${index}].supplier`,
                                              e.target.value
                                            )
                                          }
                                          required
                                        />
                                        <datalist id={`supplierList-${index}`}>
                                          {SupplierList?.map((supplier) => (
                                            <option
                                              key={supplier.id}
                                              value={supplier.vendor}
                                            />
                                          ))}
                                        </datalist>
                                      </div>
                                    )}
                                  </td>
                                  <td className=" p-2">
                                    <Field
                                      type="number"
                                      name={`cash_requisition_items[${index}].unit_price`}
                                      className="w-full p-2 border text-center border-gray-300 rounded-md shadow-sm"
                                      placeholder="Unit Price"
                                      onChange={(e) =>
                                        setFieldValue(
                                          `cash_requisition_items[${index}].unit_price`,
                                          e.target.value
                                        )
                                      }
                                      required
                                    />
                                  </td>
                                  <td className=" p-2">
                                    <Field
                                      type="number"
                                      name={`cash_requisition_items[${index}].total`}
                                      className="w-full p-2 border text-center border-gray-300 rounded-md shadow-sm"
                                      placeholder="Total"
                                      disabled
                                      value={
                                        item.quantity * item.unit_price || 0
                                      } // Calculate total
                                    />
                                  </td>
                                  <td className=" p-2">
                                    <button
                                      type="button"
                                      onClick={() => remove(index)}
                                      // className="btn btn-error"
                                      className="flex items-center gap-1 bg-white text-red-800 border border-red-800 px-3 py-1.5 rounded-md text-xs shadow transition duration-200 uppercase"
                                    >
                                      Remove
                                    </button>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                        {/* <div className="mt-4 grid grid-cols-3 gap-4"> */}
                        {/* Input fields */}
                        {/* Container spans 2 columns like Project Name/Address */}
                        {/* <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div>
                            <strong>Discount:</strong>
                            <Field
                              type="number"
                              name="discount"
                              className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                              placeholder="Discount"
                              onChange={(e) =>
                                setFieldValue("discount", e.target.value)
                              }
                            />
                          </div>

                          <div>
                            <strong>VAT %:</strong>
                            <Field
                              type="number"
                              name="vat_percentage"
                              className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                              placeholder="VAT %"
                              onChange={(e) =>
                                setFieldValue("vat_percentage", e.target.value)
                              }
                            />
                          </div>

                          <div>
                            <strong>Less EWT %:</strong>
                            <Field
                              type="number"
                              name="less_ewt"
                              className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                              placeholder="EWT %"
                              onChange={(e) =>
                                setFieldValue("less_ewt", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <strong>Discount:</strong>
                            <div className="w-full p-2 border border-gray-300 rounded-md shadow-sm">
                              ₱{parseFloat(values.discount || 0).toFixed(2)}
                            </div>
                          </div>

                          <div>
                            <strong>VAT Amount:</strong>
                            <div className="w-full p-2 border border-gray-300 rounded-md shadow-sm">
                              ₱
                              {(() => {
                                const totalBeforeDiscount =
                                  values.cash_requisition_items.reduce(
                                    (acc, item) =>
                                      acc +
                                      (item.quantity * item.unit_price || 0),
                                    0
                                  );
                                const discountedTotal =
                                  totalBeforeDiscount -
                                  parseFloat(values.discount || 0);
                                const vatAmount =
                                  (parseFloat(values.vat_percentage || 0) /
                                    100) *
                                  discountedTotal;
                                return vatAmount.toFixed(2);
                              })()}
                            </div>
                          </div>

                          <div>
                            <strong>Less EWT Amount:</strong>
                            <div className="w-full p-2 border border-gray-300 rounded-md shadow-sm">
                              ₱
                              {(() => {
                                const totalBeforeDiscount =
                                  values.cash_requisition_items.reduce(
                                    (acc, item) =>
                                      acc +
                                      (item.quantity * item.unit_price || 0),
                                    0
                                  );
                                const discountedTotal =
                                  totalBeforeDiscount -
                                  parseFloat(values.discount || 0);
                                const ewtAmount =
                                  (parseFloat(values.less_ewt || 0) / 100) *
                                  discountedTotal;
                                return ewtAmount.toFixed(2);
                              })()}
                            </div>
                          </div>

                          <div>
                            <strong>Grand Total:</strong>
                            <div className="w-full p-2 border border-gray-300 rounded-md shadow-sm">
                              ₱
                              {(() => {
                                const totalBeforeDiscount =
                                  values.cash_requisition_items.reduce(
                                    (acc, item) =>
                                      acc +
                                      (item.quantity * item.unit_price || 0),
                                    0
                                  );
                                const discountedTotal =
                                  totalBeforeDiscount -
                                  parseFloat(values.discount || 0);
                                const vatAmount =
                                  (parseFloat(values.vat_percentage || 0) /
                                    100) *
                                  discountedTotal;
                                const ewtAmount =
                                  (parseFloat(values.less_ewt || 0) / 100) *
                                  discountedTotal;
                                return (
                                  discountedTotal +
                                  vatAmount -
                                  ewtAmount
                                ).toFixed(2);
                              })()}
                            </div>
                          </div>
                        </div> */}
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* First Row: Input Fields */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <strong>Discount:</strong>
                              <Field
                                type="number"
                                name="discount"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                placeholder="Discount"
                                onChange={(e) =>
                                  setFieldValue("discount", e.target.value)
                                }
                              />
                            </div>

                            <div>
                              <strong>VAT %:</strong>
                              <Field
                                type="number"
                                name="vat_percentage"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                placeholder="VAT %"
                                onChange={(e) =>
                                  setFieldValue(
                                    "vat_percentage",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div>
                              <strong>Less EWT %:</strong>
                              <Field
                                type="number"
                                name="less_ewt"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                placeholder="EWT %"
                                onChange={(e) =>
                                  setFieldValue("less_ewt", e.target.value)
                                }
                              />
                            </div>
                          </div>

                          {/* Second Row: Calculated Results */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <strong>Discount:</strong>
                              <div className="w-full p-2 border border-gray-300 rounded-md shadow-sm">
                                ₱{parseFloat(values.discount || 0).toFixed(2)}
                              </div>
                            </div>

                            <div>
                              <strong>VAT Amount:</strong>
                              <div className="w-full p-2 border border-gray-300 rounded-md shadow-sm">
                                ₱
                                {(() => {
                                  const total =
                                    values.cash_requisition_items.reduce(
                                      (acc, item) =>
                                        acc +
                                        (item.quantity * item.unit_price || 0),
                                      0
                                    );
                                  const discounted =
                                    total - parseFloat(values.discount || 0);
                                  const vat =
                                    (parseFloat(values.vat_percentage || 0) /
                                      100) *
                                    discounted;
                                  return vat.toFixed(2);
                                })()}
                              </div>
                            </div>

                            {/* <div>
                              <strong>Less EWT Amount:</strong>
                              <div className="w-full p-2 border border-gray-300 rounded-md shadow-sm">
                                ₱
                                {(() => {
                                  const total =
                                    values.cash_requisition_items.reduce(
                                      (acc, item) =>
                                        acc +
                                        (item.quantity * item.unit_price || 0),
                                      0
                                    );
                                  const discounted =
                                    total - parseFloat(values.discount || 0);
                                  const ewt =
                                    (parseFloat(values.less_ewt || 0) / 100) *
                                    discounted;
                                  return ewt.toFixed(2);
                                })()}
                              </div>
                            </div>

                            <div>
                              <strong>Grand Total:</strong>
                              <div className="w-full p-2 border border-gray-300 rounded-md shadow-sm">
                                ₱
                                {(() => {
                                  const total =
                                    values.cash_requisition_items.reduce(
                                      (acc, item) =>
                                        acc +
                                        (item.quantity * item.unit_price || 0),
                                      0
                                    );
                                  const discounted =
                                    total - parseFloat(values.discount || 0);
                                  const vat =
                                    (parseFloat(values.vat_percentage || 0) /
                                      100) *
                                    discounted;
                                  const ewt =
                                    (parseFloat(values.less_ewt || 0) / 100) *
                                    discounted;
                                  return (discounted + vat - ewt).toFixed(2);
                                })()}
                              </div>
                            </div> */}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <strong>Less EWT Amount:</strong>
                              <div className="w-full p-2 border border-gray-300 rounded-md shadow-sm">
                                ₱
                                {(() => {
                                  const total =
                                    values.cash_requisition_items.reduce(
                                      (acc, item) =>
                                        acc +
                                        (item.quantity * item.unit_price || 0),
                                      0
                                    );
                                  const discounted =
                                    total - parseFloat(values.discount || 0);
                                  const ewt =
                                    (parseFloat(values.less_ewt || 0) / 100) *
                                    discounted;
                                  return ewt.toFixed(2);
                                })()}
                              </div>
                            </div>

                            <div>
                              <strong>Grand Total:</strong>
                              <div className="w-full p-2 border border-gray-300 rounded-md shadow-sm">
                                ₱
                                {(() => {
                                  const total =
                                    values.cash_requisition_items.reduce(
                                      (acc, item) =>
                                        acc +
                                        (item.quantity * item.unit_price || 0),
                                      0
                                    );
                                  const discounted =
                                    total - parseFloat(values.discount || 0);
                                  const vat =
                                    (parseFloat(values.vat_percentage || 0) /
                                      100) *
                                    discounted;
                                  const ewt =
                                    (parseFloat(values.less_ewt || 0) / 100) *
                                    discounted;
                                  return (discounted + vat - ewt).toFixed(2);
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </FieldArray>

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
