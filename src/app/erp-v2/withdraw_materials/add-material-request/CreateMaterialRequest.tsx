import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { Formik, Form, Field } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  registerUser,
  RegisterWithdraw,
} from "@/api/withdraw-materials/addWithdraw";
import {
  fetchWithdrawList,
  Withdraw,
} from "@/api/withdraw-materials/fetchWithdraw";
import { FetchInventoriesData } from "@/api/withdraw-materials/fetchInventory";
import { Inventories } from "@/api/inventory/Inventory";
import { User } from "@/interfaces/User";
import { fetchUserList } from "@/api/User/fetchUserList";

function CreateMaterialRequest() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const toggleModal = () => setShowModal(!showModal);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const {
    data: WithdrawData,
    isLoading: withdrawLoading,
    error: withdrawError,
  } = useQuery<Withdraw[]>({
    queryKey: ["withdraw"],
    queryFn: fetchWithdrawList,
  });
  const {
    isLoading: inventoriesLoading,
    error: inventoriesError,
    data: inventoriesData,
  } = useQuery<Inventories[]>({
    queryKey: ["inventory"],
    queryFn: FetchInventoriesData,
  });
  const {
    isLoading: loading,
    error: errors,
    data: UserList,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUserList,
  });

  const {
    mutate: registerWithdraw,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: RegisterWithdraw) => registerUser(data),
    onSuccess: () => {
      console.log("Registered successfully");
      queryClient.invalidateQueries({ queryKey: ["withdraw"] });
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
    },
  });

  return (
    <>
      <h3 className="font-bold">Withdraw Materials</h3>
      <Link href="/erp-v2/withdraw_materials">
        <button className="btn bg-white border border-black uppercase text-black">
          {/* <FaArrowLeft /> */}
          back
        </button>
      </Link>

      <div className="p-6 bg-gray-50 dark:bg-gray-dark dark:text-white">
        <h2 className="text-xl font-bold mb-1">Create Material Request</h2>

        <Formik
          initialValues={{
            name_of_requestor: "",
            date_of_request: "",
            date_needed: "",
            purpose: "",
            material_items: [] as any[],
            created_by: 1,
          }}
          onSubmit={(values, { resetForm }) => {
            console.log(values);
            registerWithdraw({
              ...values,

              material_items: values.material_items.map((item) => ({
                inventory_item: item.id,
                quantity: item.quantity,
              })),
            });
            resetForm();
          }}
        >
          {({ values, setFieldValue }) => {
            const handleSelectRow = (row: any) => {
              if (!values.material_items.some((item) => item.id === row.id)) {
                setFieldValue("material_items", [
                  ...values.material_items,
                  row,
                ]);
                toggleModal();
              }
            };

            return (
              <Form>
                <div className="mb-1 flex gap-4 uppercase">
                  <div className="w-1/3">
                    <label className="block text-sm font-bold ">
                      Name of Requestor
                    </label>
                    <Field
                      as="select"
                      name="name_of_requestor"
                      className="mt-1 p-2 border border-gray-300 rounded w-full dark:bg-gray-dark"
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

                  <div className="w-1/3">
                    <label className="block text-sm font-bold ">
                      Date of Request
                    </label>
                    <Field
                      type="date"
                      name="date_of_request"
                      className="mt-1 p-2 border border-gray-300 rounded w-full"
                    />
                  </div>

                  <div className="w-1/3">
                    <label className="block text-sm font-bold ">
                      Date Needed
                    </label>
                    <Field
                      type="date"
                      name="date_needed"
                      className="mt-1 p-2 border border-gray-300 rounded w-full"
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-bold ">Purpose</label>
                  <Field
                    type="text"
                    name="purpose"
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                  />
                </div>

                <div className="mb-2">
                  <button
                    type="button"
                    onClick={toggleModal}
                    className=" bg-white uppercase border border-blue-800 text-blue-800 py-2 rounded-md pr-3 pl-4"
                  >
                    Select Items
                  </button>
                </div>

                <div className="mb-2">
                  <h3 className="font-bold uppercase">Selected Items:</h3>
                  <table className="min-w-full border-collapse table-auto">
                    <thead className="uppercase">
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
                      {values.material_items.map((row, index) => (
                        <tr key={index}>
                          <td className="border px-4 py-2 text-center">
                            {row.id}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {row.item}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {row.quantity}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {row.unit_of_measurement}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {row.specification}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {row.description}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            <button
                              type="button"
                              onClick={() =>
                                setFieldValue(
                                  "material_items",
                                  values.material_items.filter(
                                    (_, i) => i !== index
                                  )
                                )
                              }
                              className="bg-white text-red-800 border border-red-800 uppercase py-1 px-2 rounded-md"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex gap-4">
                  <Link
                    className="pr-4 pl-4 uppercase bg-white text-blue-800 border border-blue-800 text-center py-2 rounded-md"
                    href="/erp-v2/withdraw_materials"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="pr-4 pl-4 uppercase bg-white border border-black text-black py-2 rounded-md"
                  >
                    Submit
                  </button>
                </div>

                {/* Modal */}
                {showModal && (
                  <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm ">
                    <div className="bg-white p-6 rounded-lg w-2/4 shadow-lg dark:bg-gray-dark">
                      <h3 className="text-lg font-semibold mb-4">
                        Select Items1
                      </h3>

                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="p-2 border border-gray-300 rounded w-full mb-4"
                      />

                      {withdrawLoading ? (
                        <p>Loading...</p>
                      ) : withdrawError ? (
                        <p className="text-red-500">{withdrawError.message}</p>
                      ) : (
                        <div className="max-h-[400px] overflow-y-auto">
                          <table className="min-w-full border-collapse table-auto">
                            <thead className="uppercase">
                              <tr>
                                <th className="border px-4 py-2">ID</th>
                                <th className="border px-4 py-2">Name</th>
                                <th className="border px-4 py-2">Quantity</th>
                                <th className="border px-4 py-2">Unit</th>
                                <th className="border px-4 py-2">
                                  Specification
                                </th>
                                <th className="border px-4 py-2">
                                  Description
                                </th>
                                <th className="border px-4 py-2">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {inventoriesData
                                ?.filter((row) =>
                                  row.item
                                    ?.replace(/\s+/g, "")
                                    .toLowerCase()
                                    .includes(
                                      searchTerm
                                        .replace(/\s+/g, "")
                                        .toLowerCase()
                                    )
                                )
                                .map((row) => (
                                  <tr key={row.id}>
                                    <td className="border px-4 py-2 text-center">
                                      {row.id}
                                    </td>
                                    <td className="border px-4 py-2 text-center">
                                      {row.item}
                                    </td>
                                    <td className="border px-4 py-2 text-center">
                                      {row.quantity}
                                    </td>
                                    <td className="border px-4 py-2 text-center">
                                      {row.unit_of_measurement}
                                    </td>
                                    <td className="border px-4 py-2 text-center">
                                      {row.specification}
                                    </td>
                                    <td className="border px-4 py-2 text-center">
                                      {row.description}
                                    </td>
                                    <td className="border px-4 py-2 text-center">
                                      <button
                                        type="button"
                                        onClick={() => handleSelectRow(row)}
                                        disabled={values.material_items.some(
                                          (selected) => selected.id === row.id
                                        )}
                                        className={`${
                                          values.material_items.some(
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
                      )}

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
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
}

export default CreateMaterialRequest;
