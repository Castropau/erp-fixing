import React, { useState, useEffect } from "react";

/** api */
import { fetchUserDataById, updateUser } from "@/api/User/personalInformation";

/** components */
import TextField from "@/components/Input/TextField";

/** interfaces */
import { UpdateUser } from "@/api/User/personalInformation";

/**query */

import {
  QueryClient,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";

interface PersonalInformationProps {
  id: number;
}

function PersonalInformation(props: PersonalInformationProps) {
  const { id } = props;

  const queryClient = useQueryClient();

  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserDataById(id),
    enabled: !!id,
  });

  const [showEditModal, setShowEditModal] = useState(false);

  const { mutate: updatedUser } = useMutation({
    mutationFn: (data: UpdateUser) => updateUser(userData!.id, data),
    onSuccess: () => {
      console.log("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setShowEditModal(false);
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });

  // if (isUserLoading) return "Loading...";

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: type === "radio" ? checked : value,
  //   }));
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   updatedUser(formData);
  //   console.log(formData);
  // };

  // const [formData, setFormData] = useState<UpdateUser>({
  //   first_name: "",
  //   middle_name: "",
  //   last_name: "",
  //   sex: false,
  //   contact_number: "",
  //   email: "",
  //   address: "",
  //   is_active: false,
  //   role: 1,
  //   department: 1,
  //   username: "",
  //   suffix: "",
  //   birth_date: "",
  //   id: "",
  // });

  // useEffect(() => {
  //   setFormData({
  //     first_name: userData?.first_name || "",
  //     middle_name: userData?.middle_name || "",
  //     last_name: userData?.last_name || "",
  //     sex: userData?.sex || false,
  //     contact_number: userData?.contact_number || "",
  //     email: userData?.email || "",
  //     address: userData?.address || "",
  //     is_active: userData?.is_active || false,
  //     role: userData?.role.id || 1,
  //     department: userData?.department.id || 1,
  //     username: userData?.username || "",
  //     suffix: userData?.suffix || "",
  //     birth_date: userData?.birth_date || "",
  //     id: userData?.id || "",
  //   });
  // }, [userData]);

  return (
    <div>
      <button
        className="btn btn-xs bg-white"
        onClick={() => setShowEditModal(true)}
      >
        Personal Information
      </button>
      {showEditModal && (
        <dialog open className="modal mt-15">
          <div className="modal-box max-h-[80vh] overflow-y-auto">
            {/* <h3 className="font-bold text-lg">Edit User</h3> */}
            {isUserLoading ? (
              <p>Loading user data...</p>
            ) : userError instanceof Error ? (
              <p>An error occurred: {userError.message}</p>
            ) : (
              <Formik
                initialValues={{
                  first_name: userData?.first_name || "",
                  middle_name: userData?.middle_name || "",
                  last_name: userData?.last_name || "",
                  sex: userData?.sex || false,
                  contact_number: userData?.contact_number || "",
                  email: userData?.email || "",
                  address: userData?.address || "",
                  is_active: userData?.is_active || false,
                  role: userData?.role.id || 1,
                  department: userData?.department.id || 1,
                  username: userData?.username || "",
                  suffix: userData?.suffix || "",
                  birth_date: userData?.birth_date || "",
                  id: userData?.id || "",
                }}
                enableReinitialize={true}
                onSubmit={(values) => {
                  updatedUser(values); // Submit data when Formik form is submitted
                  console.log(values);
                }}
              >
                {({ values, handleChange, handleBlur }) => (
                  <Form className="py-4 text-start grid grid-cols-1 md:grid-cols-2 gap-1">
                    {/* <div className="mb-1">
                      <label
                        htmlFor="edit_user_id"
                        className="block text-sm font-medium text-gray-700"
                      >
                        User ID
                      </label>
                      <input
                        type="text"
                        id="edit_user_id"
                        value={values.id}
                        readOnly
                        className="input input-bordered w-full"
                      />
                    </div> */}

                    <div className="mb-1">
                      <label
                        htmlFor="birth_date"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Birth Date
                      </label>
                      <Field
                        type="date"
                        id="birth_date"
                        name="birth_date"
                        // value={values.birth_date}
                        // onChange={handleChange}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="mb-1">
                      <label
                        htmlFor="first_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        First Name
                      </label>
                      <Field
                        type="text"
                        id="first_name"
                        name="first_name"
                        // value={values.first_name}
                        // onChange={handleChange}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="mb-1">
                      <label
                        htmlFor="last_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </label>
                      <Field
                        type="text"
                        id="last_name"
                        name="last_name"
                        // value={values.last_name}
                        // onChange={handleChange}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="mb-1">
                      <label
                        htmlFor="middle_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Middle Name
                      </label>
                      <Field
                        type="text"
                        id="middle_name"
                        name="middle_name"
                        // value={values.middle_name}
                        // onChange={handleChange}
                        className="input input-bordered w-full"
                      />
                    </div>

                    {/* <div className="mb-1">
                      <label
                        htmlFor="sex"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Sex
                      </label>
                      <div className="flex items-center space-x-4">
                        <div>
                          <Field
                            type="radio"
                            id="male"
                            name="sex"
                            value={true}
                            checked={values.sex === true}
                            onChange={handleChange}
                            className="radio"
                          />
                          <label htmlFor="male" className="text-sm">
                            Male
                          </label>
                        </div>
                        <div>
                          <Field
                            type="radio"
                            id="female"
                            name="sex"
                            value={false}
                            checked={values.sex === false}
                            onChange={handleChange}
                            className="radio"
                          />
                          <label htmlFor="female" className="text-sm">
                            Female
                          </label>
                        </div>
                      </div>
                    </div> */}

                    <div className="mb-1">
                      <label
                        htmlFor="contact_number"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Contact Number
                      </label>
                      <Field
                        type="text"
                        id="contact_number"
                        name="contact_number"
                        // value={values.contact_number}
                        // onChange={handleChange}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="mb-1">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <Field
                        type="text"
                        id="email"
                        name="email"
                        // value={values.email}
                        // onChange={handleChange}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="mb-1">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address
                      </label>
                      <Field
                        type="text"
                        id="address"
                        name="address"
                        // value={values.address}
                        // onChange={handleChange}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="mb-1">
                      <label
                        htmlFor="role"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Role
                      </label>
                      <Field
                        as="select"
                        id="role"
                        name="role"
                        className="input input-bordered w-full"
                      >
                        <option value="1">HR</option>
                        <option value="2">Engineering</option>
                        <option value="3">Marketing</option>
                        <option value="4">Sales</option>
                        <option value="5">Finance</option>
                        <option value="6">IT</option>
                      </Field>
                    </div>

                    <div className="mb-1">
                      <label
                        htmlFor="department"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Department
                      </label>
                      <Field
                        as="select"
                        id="department"
                        name="department"
                        className="input input-bordered w-full"
                      >
                        <option value="1">HR</option>
                        <option value="2">Engineering</option>
                        <option value="3">Marketing</option>
                        <option value="4">Sales</option>
                        <option value="5">Finance</option>
                        <option value="6">IT</option>
                      </Field>
                    </div>

                    <div className="mb-1">
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Username
                      </label>
                      <Field
                        type="text"
                        id="username"
                        name="username"
                        // value={values.username}
                        // onChange={handleChange}
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div className="mb-1">
                      <label
                        htmlFor="sex"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Sex
                      </label>
                      <div className="flex items-center space-x-4">
                        <div>
                          <Field
                            type="radio"
                            id="male"
                            name="sex"
                            // value={true}
                            checked={values.sex === true}
                            onChange={handleChange}
                            className="radio"
                          />
                          <label htmlFor="male" className="text-sm ml-1">
                            Male
                          </label>
                        </div>
                        <div>
                          <Field
                            type="radio"
                            id="female"
                            name="sex"
                            // value={false}
                            checked={values.sex === false}
                            onChange={handleChange}
                            className="radio"
                          />
                          <label htmlFor="female" className="text-sm ml-1">
                            Female
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="modal-action">
                      <button
                        type="button"
                        className="btn"
                        onClick={() => setShowEditModal(false)}
                      >
                        Close
                      </button>
                      <button type="submit" className="btn">
                        Save
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </dialog>
      )}
    </div>
  );
}

export default PersonalInformation;
