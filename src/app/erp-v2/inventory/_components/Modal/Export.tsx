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

export default function Export() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const queryClient = useQueryClient();

  const {
    mutate: registerEmployee,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: RegisterEmployee) => registerUser(data),
    onSuccess: () => {
      console.log("User registered successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
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
      <div className="flex justify-end mb-4">
        <button
          className="btn bg-white border border-black uppercase text-black"
          onClick={() => setShowRegisterModal(true)}
        >
          Export
        </button>
      </div>
      <div>
        {/* Registration Modal */}
        {showRegisterModal && (
          <dialog open className="modal">
            <div className="modal-box w-11/12 max-w-7xl">
              <h3 className="font-bold text-lg">Register User</h3>
              <Formik
                initialValues={{
                  first_name: "",
                  middle_name: "",
                  last_name: "",
                  suffix: "",
                  sex: false,
                  birth_date: "",
                  contact_number: "",
                  address: "",
                  email: "",
                  department: "",
                  role: "",
                  username: "",
                  password: "",
                  password2: "",
                }}
                onSubmit={(values, { resetForm }) => {
                  registerEmployee(values);
                  resetForm();
                  console.log(values);
                }}
              >
                <Form className="py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      {[
                        { type: "heading", level: 2, text: "User Information" },
                      ].map((item) => (
                        <div key="user-info-heading" className="mb-4">
                          {item.type === "heading" && item.level === 2 && (
                            <h2 className="font-bold text-lg">{item.text}</h2>
                          )}
                        </div>
                      ))}

                      {[
                        {
                          type: "text",
                          name: "first_name",
                          placeholder: "Enter your first name",
                          label: "First Name",
                        },
                        {
                          type: "text",
                          name: "middle_name",
                          placeholder: "Enter your middle name",
                          label: "Middle Name",
                        },
                        {
                          type: "text",
                          name: "last_name",
                          placeholder: "Enter your last name",
                          label: "Last Name",
                        },
                        {
                          type: "text",
                          name: "suffix",
                          placeholder: "Enter your suffix",
                          label: "Suffix",
                        },
                        {
                          type: "radio",
                          name: "sex",
                          label: "Sex",
                          options: [
                            { value: false, label: "Male" },
                            { value: true, label: "Female" },
                          ],
                        },
                        {
                          type: "date",
                          name: "birth_date",
                          placeholder: "Enter your birth date",
                          label: "Date of Birth",
                        },
                      ].map((item) => (
                        <div key={item.name} className="mb-4">
                          <label
                            htmlFor={item.name}
                            className="block text-sm font-medium text-gray-700"
                          >
                            {item.label}
                          </label>

                          {item.type === "text" ||
                          item.type === "date" ||
                          item.type === "tel" ||
                          item.type === "email" ? (
                            <Field
                              type={item.type}
                              id={item.name}
                              name={item.name}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                              placeholder={item.placeholder}
                              required={item.name !== "middle_name"}
                            />
                          ) : item.type === "radio" ? (
                            <div className="flex items-center">
                              {item.options?.map((option) => (
                                <div
                                  key={option.value.toString()}
                                  className="mr-4"
                                >
                                  <Field
                                    type="radio"
                                    id={option.value.toString()}
                                    name={item.name}
                                    value={option.value}
                                    className="mr-2"
                                    required
                                  />
                                  <label htmlFor={option.value.toString()}>
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))}

                      {[
                        {
                          type: "heading",
                          level: 2,
                          text: "Contact Information",
                        },
                      ].map((item) => (
                        <div key="contact-info-heading" className="mb-4">
                          {item.type === "heading" && item.level === 2 && (
                            <h2 className="font-bold text-lg">{item.text}</h2>
                          )}
                        </div>
                      ))}

                      {/* contact information */}
                      {[
                        {
                          type: "text",
                          name: "address",
                          placeholder: "Enter your address",
                          label: "Address",
                        },
                        {
                          type: "email",
                          name: "email",
                          placeholder: "Enter your email",
                          label: "Email",
                        },
                        {
                          type: "text",
                          name: "contact_number",
                          placeholder: "Enter your contact number",
                          label: "Contact number",
                        },
                      ].map((item) => (
                        <div key={item.name} className="mb-4">
                          <label
                            htmlFor={item.name}
                            className="block text-sm font-medium text-gray-700"
                          >
                            {item.label}
                          </label>
                          <Field
                            type={item.type}
                            id={item.name}
                            name={item.name}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder={item.placeholder}
                            required
                          />
                        </div>
                      ))}
                    </div>

                    {/* 2nd column */}
                    <div>
                      {/* heading for org */}
                      {[
                        {
                          type: "heading",
                          level: 2,
                          text: "Organization Information",
                        },
                      ].map((item) => (
                        <div key="org-info-heading" className="mb-4">
                          {item.type === "heading" && item.level === 2 && (
                            <h2 className="font-bold text-lg">{item.text}</h2>
                          )}
                        </div>
                      ))}

                      {/* organization fnformation  */}
                      {[
                        {
                          type: "select",
                          name: "department",
                          label: "Department",
                          options:
                            departmentList?.map((department) => ({
                              value: department.id.toString(),
                              label: department.department,
                            })) || [],
                        },
                        {
                          type: "select",
                          name: "role",
                          label: "Role",
                          options:
                            RoleList?.map((roles) => ({
                              value: roles.id.toString(),
                              label: roles.role,
                            })) || [],
                        },
                      ].map((item) => (
                        <div key={item.name} className="mb-4">
                          <label
                            htmlFor={item.name}
                            className="block text-sm font-medium text-gray-700"
                          >
                            {item.label}
                          </label>
                          <Field
                            as="select"
                            id={item.name}
                            name={item.name}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                          >
                            {item.options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Field>
                        </div>
                      ))}

                      {/* heading for account information */}
                      {[
                        {
                          type: "heading",
                          level: 2,
                          text: "Account Information",
                        },
                      ].map((item) => (
                        <div key="account-info-heading" className="mb-4">
                          {item.type === "heading" && item.level === 2 && (
                            <h2 className="font-bold text-lg">{item.text}</h2>
                          )}
                        </div>
                      ))}

                      {/* account information */}
                      {[
                        {
                          type: "text",
                          name: "username",
                          placeholder: "Enter your username",
                          label: "Username",
                        },
                        {
                          type: "password",
                          name: "password",
                          placeholder: "Enter your password",
                          label: "Password",
                        },
                        {
                          type: "password",
                          name: "password2",
                          placeholder: "Confirm your password",
                          label: "Confirm Password",
                        },
                      ].map((item) => (
                        <div key={item.name} className="mb-4">
                          <label
                            htmlFor={item.name}
                            className="block text-sm font-medium text-gray-700"
                          >
                            {item.label}
                          </label>
                          <Field
                            type={item.type}
                            id={item.name}
                            name={item.name}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder={item.placeholder}
                            required
                          />
                        </div>
                      ))}
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
