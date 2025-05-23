"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CiCirclePlus } from "react-icons/ci";

/** Formik */
import { ErrorMessage, Field, Form, Formik, useFormikContext } from "formik";

/** APIs */
import { CreateInventory } from "@/api/inventory/CreateInventory";
import { FetchItems } from "@/api/inventory/Items";
// import { fetchingLocations } from "@/api/inventory/fetchLocations";
import { FetchCategories } from "@/api/inventory/FetchCategory";
import { FetchItemInventory } from "@/api/inventory/fetchItemNumber";

/** Interfaces */
import { CreateInventories } from "@/api/inventory/CreateInventory";
import { AllLocation } from "@/api/inventory/fetchLocations";

export default function AddCategory() {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const queryClient = useQueryClient();

  const {
    mutate: createCategory,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: CreateInventories) => CreateInventory(data),
    onSuccess: () => {
      console.log("Category created successfully");
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
      setShowCategoryModal(false);
    },
    onError: (error: any) => {
      console.error("Error creating category:", error);
    },
  });

  const {
    isLoading: itemLoading,
    error: itemError,
    data: itemList,
  } = useQuery({
    queryKey: ["items"],
    queryFn: FetchItems,
  });

  const {
    isLoading: locationLoading,
    error: locationError,
    data: locationList,
  } = useQuery({
    queryKey: ["location"],
    queryFn: AllLocation,
  });

  const {
    isLoading: isCategoriesLoading,
    error: categoriesError,
    data: categoriesData,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: FetchCategories,
  });

  const {
    isLoading: isItemLoading,
    error: errors,
    data: itemData,
  } = useQuery({
    queryKey: ["item_no"],
    queryFn: FetchItemInventory,
  });

  const AutoFillFields = ({ itemData }) => {
    const { values, setFieldValue } = useFormikContext<any>();

    useEffect(() => {
      if (values.item_reference) {
        const selectedItem = itemData?.find(
          (item) => item.id === parseInt(values.item_reference)
        );

        if (selectedItem) {
          setFieldValue("item", selectedItem.item || "");
          setFieldValue("description", selectedItem.description || "");
          setFieldValue("brand", selectedItem.brand || "");
          setFieldValue("model", selectedItem.model || "");
          setFieldValue(
            "unit_of_measurement",
            selectedItem.unit_of_measurement || ""
          );
          setFieldValue("srp", selectedItem.srp || 0);
        }
      }
    }, [values.item_reference, itemData, setFieldValue]);

    return null;
  };

  if (itemLoading) return <div>Loading items...</div>;
  if (itemError instanceof Error)
    return <div>Error loading items: {itemError.message}</div>;

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          className="btn bg-white border border-black text-black uppercase"
          onClick={() => setShowCategoryModal(true)}
        >
          {/* <CiCirclePlus className="w-6 h-6" /> */}
          Add Inventory
        </button>
      </div>

      {showCategoryModal && (
        <dialog open className="modal mt-15 backdrop-blur-sm">
          <div className="modal-box w-11/12 max-w-7xl max-h-[80vh] overflow-y-auto dark:bg-gray-dark dark:text-white">
            <h3 className="font-bold text-lg text-center uppercase">
              Add Category
            </h3>

            <Formik
              initialValues={{
                item: "",
                brand: "",
                serial: "",
                model: "",
                specification: "",
                unit_of_measurement: "",
                srp: 0,
                quantity: 0,
                description: "",
                item_reference: 0,
                location: 0,
                category: 0,
              }}
              validate={(values) => {
                const errors: Record<string, string> = {};
                if (!values.item_reference)
                  errors.item_reference = "This field is required";
                if (!values.item) errors.item = "This field is required";
                if (!values.location)
                  errors.location = "This field is required";
                if (!values.category)
                  errors.category = "This field is required";
                return errors;
              }}
              onSubmit={(values, { resetForm }) => {
                createCategory(values);
                resetForm();
              }}
            >
              <>
                <AutoFillFields itemData={itemData} />

                <Form className="py-1">
                  <div className="grid grid-cols-1 gap-6 uppercase text-center">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      {/* <h2 className="font-bold text-lg">
                        Category Information
                      </h2> */}

                      <div className="mb-1">
                        <label
                          htmlFor="item_reference"
                          className="block text-sm font-bold"
                        >
                          Item Reference
                        </label>
                        <Field
                          as="select"
                          id="item_reference"
                          name="item_reference"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-center"
                          required
                        >
                          <option value="">Select an item reference</option>
                          {itemData?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.item_no}
                            </option>
                          ))}
                        </Field>
                      </div>

                      <div className="mb-1">
                        <label
                          htmlFor="item"
                          className="block text-sm font-bold"
                        >
                          Item Name
                        </label>
                        <Field
                          type="text"
                          id="item"
                          name="item"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-center"
                          required
                        />
                      </div>

                      <div className="mb-1">
                        <label
                          htmlFor="brand"
                          className="block text-sm font-bold"
                        >
                          Brand
                        </label>
                        <Field
                          type="text"
                          id="brand"
                          name="brand"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-center"
                        />
                      </div>

                      <div className="mb-1">
                        <label
                          htmlFor="serial"
                          className="block text-sm font-bold"
                        >
                          Serial Number
                        </label>
                        <Field
                          type="text"
                          id="serial"
                          name="serial"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-center"
                        />
                      </div>

                      <div className="mb-1">
                        <label
                          htmlFor="model"
                          className="block text-sm font-bold"
                        >
                          Model
                        </label>
                        <Field
                          type="text"
                          id="model"
                          name="model"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-center"
                        />
                      </div>

                      <div className="mb-1">
                        <label
                          htmlFor="specification"
                          className="block text-sm font-bold"
                        >
                          Specification
                        </label>
                        <Field
                          type="text"
                          id="specification"
                          name="specification"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-center"
                        />
                      </div>

                      <div className="mb-1">
                        <label
                          htmlFor="unit_of_measurement"
                          className="block text-sm font-bold"
                        >
                          Unit of Measurement
                        </label>
                        <Field
                          type="text"
                          id="unit_of_measurement"
                          name="unit_of_measurement"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-center"
                        />
                      </div>

                      <div className="mb-1">
                        <label
                          htmlFor="srp"
                          className="block text-sm font-bold"
                        >
                          SRP (Suggested Retail Price)
                        </label>
                        <Field
                          type="text"
                          id="srp"
                          name="srp"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-center"
                        />
                      </div>

                      <div className="mb-1">
                        <label
                          htmlFor="quantity"
                          className="block text-sm font-bold"
                        >
                          Quantity
                        </label>
                        <Field
                          type="number"
                          id="quantity"
                          name="quantity"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-center"
                        />
                      </div>

                      <div className="mb-1">
                        <label
                          htmlFor="description"
                          className="block text-sm font-bold"
                        >
                          Description
                        </label>
                        <Field
                          type="text"
                          id="description"
                          name="description"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-center"
                        />
                      </div>

                      <div className="mb-1">
                        <label
                          htmlFor="location"
                          className="block text-sm font-bold"
                        >
                          Location
                        </label>
                        <Field
                          as="select"
                          id="location"
                          name="location"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-dark text-center"
                          required
                        >
                          <option value="">Select a location</option>
                          {locationList?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.location}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="location"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="category"
                          className="block text-sm font-bold"
                        >
                          Category Name
                        </label>
                        <Field
                          as="select"
                          id="category"
                          name="category"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-center"
                          required
                        >
                          <option value="">Select a category</option>
                          {categoriesData?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.category}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="category"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-action">
                    <button type="submit" className="btn">
                      Submit
                    </button>
                    <button
                      className="btn"
                      onClick={() => setShowCategoryModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </Form>
              </>
            </Formik>

            {isError && (
              <div className="text-red-500 mt-4">
                <p>Error: {error?.message || "An error occurred"}</p>
              </div>
            )}
          </div>
        </dialog>
      )}
    </>
  );
}
