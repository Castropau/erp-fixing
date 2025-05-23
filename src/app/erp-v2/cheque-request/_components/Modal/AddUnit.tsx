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
import { CreateLocation } from "@/api/inventory/CreateLocation";
import { CreateUnits } from "@/api/cheque-request/CreateUnits";

export default function AddUnit() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const queryClient = useQueryClient();

  const {
    mutate: registerLocation,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: CreateUnits) => CreateUnits(data),
    onSuccess: () => {
      console.log("location registered successfully");
      queryClient.invalidateQueries({ queryKey: ["units"] });
      setShowRegisterModal(false);
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
    },
  });

  //   const {
  //     isLoading: DisLoading,
  //     error: Derror,
  //     data: departmentList,
  //   } = useQuery({
  //     queryKey: ["location"],
  //     queryFn: fetchDepartmentsList,
  //   });

  //   const { data: RoleList } = useQuery({
  //     queryKey: ["roles"],
  //     queryFn: fetchRoleList,
  //   });

  //   if (DisLoading) return <div>Loading...</div>;
  //   if (Derror instanceof Error)
  //     return <div>An error has occurred: {Derror.message}</div>;

  return (
    <>
      <div className="flex justify-start mb-4 up">
        <button
          className="btn bg-white border border-black uppercase text-black"
          onClick={() => setShowRegisterModal(true)}
        >
          {/* <FaCirclePlus className="w-6 h-6 btn-info" /> */}
          Add Unit
        </button>
      </div>
      <div>
        {/* Registration Modal */}
        {showRegisterModal && (
          <dialog open className="modal">
            <div className="modal-box w-11/12 max-w-md rounded-lg shadow-lg bg-white p-6">
              <h3 className="text-xl font-semibold text-center mb-4">Unit</h3>

              <Formik
                initialValues={{
                  unit_of_measurement: "",
                }}
                onSubmit={(values, { resetForm }) => {
                  registerLocation(values);
                  resetForm();
                  console.log(values);
                }}
              >
                <Form className="space-y-6 md:space-y-8">
                  {isError && (
                    <div className="text-red-500 mt-4 text-sm">
                      <p>Error: {error?.message || "An error occurred"}</p>
                    </div>
                  )}
                  {[
                    {
                      type: "text",
                      name: "unit_of_measurement",
                      placeholder: "Enter unit",
                      label: "Unit of Measurement",
                    },
                  ].map((item) => (
                    <div key={item.name} className="space-y-4">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
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

                  {/* Buttons */}
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="submit"
                      className="btn bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
                      onClick={() => setShowRegisterModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </Form>
              </Formik>
            </div>
          </dialog>
        )}
      </div>
    </>
  );
}
