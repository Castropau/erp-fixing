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
import { CiCirclePlus } from "react-icons/ci";
import { CreateCategory } from "@/api/inventory/CreateCategory";
import { CreateClient } from "@/api/clients/addClients";

export default function AddClients() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const queryClient = useQueryClient();

  const {
    mutate: registerClient,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: CreateClient) => CreateClient(data),
    onSuccess: () => {
      console.log("client registered successfully");
      queryClient.invalidateQueries({ queryKey: ["client"] });
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

  // roles
  const { data: RoleList } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoleList,
  });

  return (
    <>
      <div className="flex justify-start">
        <button
          className="btn bg-white border border-black text-black mr-4 uppercase"
          onClick={() => setShowRegisterModal(true)}
        >
          {/* <FaCirclePlus className="w-6 h-6 btn-info" /> */}
          Add Clients
        </button>
      </div>
      <div>
        {/* Registration Modal */}
        {showRegisterModal && (
          <dialog open className="modal mt-15 backdrop-blur-sm">
            <div className="modal-box w-11/12 max-w-7xl max-h-[80vh] overflow-y-auto dark:bg-gray-dark dark:text-white">
              {/* <h3 className="font-bold text-lg">Create Client</h3> */}
              <span className="font-bold">
                Fill out this information below to create new client
              </span>

              {/* Error Message Display */}
              <div style={{ color: "red" }}>{errorMessage}</div>

              <Formik
                initialValues={{
                  client: "",
                  address: "",
                  contact_person: "",
                  position: "",
                  contact_number: "",
                  email: "",
                }}
                onSubmit={(values, { resetForm }) => {
                  registerClient(values);
                  resetForm();
                  console.log(values);
                }}
              >
                <Form className="py-1">
                  <div className="grid grid-cols-3 gap-3  uppercase">
                    {/* Category Field */}
                    {[
                      {
                        type: "text",
                        name: "client",
                        placeholder: "Enter Client name",
                        label: "Client Name",
                      },
                      {
                        type: "text",
                        name: "address",
                        placeholder: "Enter Company address",
                        label: "Company address",
                      },
                      {
                        type: "text",
                        name: "contact_person",
                        placeholder: "Enter contact",
                        label: "contact person",
                      },
                      {
                        type: "text",
                        name: "position",
                        placeholder: "Enter Position",
                        label: "Position",
                      },
                      {
                        type: "text",
                        name: "contact_number",
                        placeholder: "Enter Contact Number",
                        label: "Contact Number",
                      },
                      {
                        type: "text",
                        name: "email",
                        placeholder: "Enter Email",
                        label: "Email",
                      },
                    ].map((item) => (
                      <div key={item.name} className="space-y-4">
                        <label className=" block mb-2 text-sm font-bold text-gray-900 dark:text-white">
                          {item.label}
                        </label>
                        <Field
                          type={item.type}
                          id={item.name}
                          name={item.name}
                          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder={item.placeholder}
                          required
                        />
                      </div>
                    ))}
                  </div>

                  {/* Submit and Close Buttons */}
                  <div className="modal-action">
                    <button type="submit" className="btn">
                      Submit
                    </button>
                    <button
                      className="btn"
                      onClick={() => setShowRegisterModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </Form>
              </Formik>

              {/* Error Handling */}
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
