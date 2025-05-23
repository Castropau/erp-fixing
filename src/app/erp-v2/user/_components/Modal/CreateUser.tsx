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

export default function CreateUser() {
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
          className="btn bg-white border border-black uppercase text-black mr-4"
          onClick={() => setShowRegisterModal(true)}
        >
          {/* <FaCirclePlus className="w-6 h-6 btn-info" /> */}
          Add User
        </button>
      </div>
      <div>
        {/* Registration Modal */}
        {showRegisterModal && (
          <dialog open className="modal mt-15 backdrop-blur-sm">
            <div className="modal-box w-11/12 max-w-7xl max-h-[80vh] overflow-y-auto dark:bg-gray-dark">
              <h3 className="font-bold text-lg dark:text-white uppercase text-center">
                Register User
              </h3>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
                    {[
                      {
                        type: "text",
                        name: "first_name",
                        placeholder: "Enter first name",
                        label: "First Name",
                      },
                      {
                        type: "text",
                        name: "middle_name",
                        placeholder: "Enter middle name",
                        label: "Middle Name",
                      },
                      {
                        type: "text",
                        name: "last_name",
                        placeholder: "Enter last name",
                        label: "Last Name",
                      },
                      {
                        type: "text",
                        name: "suffix",
                        placeholder: "Enter suffix",
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
                        placeholder: "Enter birth date",
                        label: "Date of Birth",
                      },
                      {
                        type: "text",
                        name: "address",
                        placeholder: "Enter address",
                        label: "Address",
                      },
                      {
                        type: "email",
                        name: "email",
                        placeholder: "Enter email",
                        label: "Email",
                      },
                      {
                        type: "text",
                        name: "contact_number",
                        placeholder: "Enter contact number",
                        label: "Contact Number",
                      },
                      {
                        type: "select",
                        name: "department",
                        label: "Department",
                        options:
                          departmentList?.map((d) => ({
                            value: d.id.toString(),
                            label: d.department,
                          })) || [],
                      },
                      {
                        type: "select",
                        name: "role",
                        label: "Role",
                        options:
                          RoleList?.map((r) => ({
                            value: r.id.toString(),
                            label: r.role,
                          })) || [],
                      },
                      {
                        type: "text",
                        name: "username",
                        placeholder: "Enter username",
                        label: "Username",
                      },
                      {
                        type: "password",
                        name: "password",
                        placeholder: "Enter password",
                        label: "Password",
                      },
                      {
                        type: "password",
                        name: "password2",
                        placeholder: "Confirm password",
                        label: "Confirm Password",
                      },
                    ].map((item) => (
                      <div key={item.name} className="space-y-1">
                        <label
                          htmlFor={item.name}
                          className="text-sm font-medium block"
                        >
                          {item.label}
                        </label>

                        {item.type === "select" ? (
                          <Field
                            as="select"
                            id={item.name}
                            name={item.name}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                            required
                          >
                            <option value="">Select {item.label}</option>
                            {item.options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Field>
                        ) : item.type === "radio" ? (
                          <div className="flex gap-4 mt-1">
                            {item.options.map((option) => (
                              <label
                                key={option.value.toString()}
                                className="flex items-center"
                              >
                                <Field
                                  type="radio"
                                  name={item.name}
                                  value={option.value}
                                  className="mr-2"
                                />
                                {option.label}
                              </label>
                            ))}
                          </div>
                        ) : (
                          <Field
                            type={item.type}
                            id={item.name}
                            name={item.name}
                            placeholder={item.placeholder}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                            required={
                              item.name !== "middle_name" &&
                              item.type !== "password2"
                            }
                          />
                        )}
                      </div>
                    ))}
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
