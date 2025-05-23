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

export default function AddCategory() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const queryClient = useQueryClient();

  const {
    mutate: registerCategory,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: CreateCategory) => CreateCategory(data),
    onSuccess: () => {
      console.log("category registered successfully");
      queryClient.invalidateQueries({ queryKey: ["category"] });
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

  if (DisLoading) return <div>Loading...</div>;
  if (Derror instanceof Error)
    return <div>An error has occurred: {Derror.message}</div>;

  return (
    <>
      <div className="flex justify-start mb-4">
        <button
          className="btn btn-info text-white uppercase"
          onClick={() => setShowRegisterModal(true)}
        >
          {/* <CiCirclePlus className="w-6 h-6 btn-info" /> */}
          Add Category
        </button>
      </div>
      <div>
        {/* Registration Modal */}
        {showRegisterModal && (
          <dialog open className="modal backdrop-blur-sm">
            <div className="modal-box w-11/12 max-w-7xl dark:bg-gray-dark ">
              <h3 className="font-bold text-lg">Register category</h3>
              <Formik
                initialValues={{
                  category: "",
                }}
                onSubmit={(values, { resetForm }) => {
                  registerCategory(values);
                  resetForm();
                  console.log(values);
                }}
              >
                <Form className="py-4">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="mb-4">
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium "
                      >
                        Category
                      </label>
                      <Field
                        type="text"
                        id="category"
                        name="category"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="Enter category"
                        required
                      />
                    </div>
                  </div>

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
