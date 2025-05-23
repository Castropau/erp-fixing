"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaCirclePlus } from "react-icons/fa6";
import { Field, Form, Formik } from "formik";
import { CreateItem } from "@/api/cheque-request/CreateItem";

export default function AddItem() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: registerItems } = useMutation({
    mutationFn: (data: CreateItem) => CreateItem(data),
    onSuccess: () => {
      console.log("registered");
      queryClient.invalidateQueries({ queryKey: ["items"] });
      setShowRegisterModal(false);
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          className="btn bg-white border border-black text-black uppercase"
          onClick={() => setShowRegisterModal(true)}
        >
          {/* <FaCirclePlus className="w-6 h-6 btn-info" /> */}
          Add item
        </button>
      </div>
      <div>
        {showRegisterModal && (
          <dialog open className="modal">
            <div className="modal-box w-11/12 max-w-md rounded-lg shadow-lg bg-white p-6">
              <h3 className="text-xl font-semibold text-center mb-4">
                Enter Item
              </h3>

              <Formik
                initialValues={{
                  item: "",
                }}
                onSubmit={(values, { resetForm }) => {
                  registerItems(values);
                  resetForm();
                  console.log(values);
                }}
              >
                <Form className="space-y-6 md:space-y-8">
                  {[
                    {
                      type: "text",
                      name: "item",
                      placeholder: "Enter item name",
                      label: "Item Name",
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
