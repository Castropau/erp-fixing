"use client";
import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import { FaEllipsisV, FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchInventoryDataById } from "@/api/inventory/FetchInventoryId";
import {
  updateInventory,
  UpdateInventory,
} from "@/api/inventory/updateInventory";
import { FetchItems } from "@/api/inventory/Items";
// import { FetchLocation } from "@/api/inventory/FetchLocation";
import { FetchCategories } from "@/api/inventory/FetchCategory";
import { FetchItemInventory } from "@/api/inventory/fetchItemNumber";
import { fetchingLocations } from "@/api/inventory/FetchLocation";

function View() {
  const [showMenu, setShowMenu] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false); // Track whether in edit mode
  const params = useParams();
  const id = typeof params?.id === "string" ? Number(params.id) : undefined;
  const queryClient = useQueryClient();

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleMenuClick = (action: any) => {
    setShowMenu(false);

    if (action === "edit") {
      setIsEditMode(true);
    } else if (action === "delete") {
      alert("Delete clicked");
    }
  };

  const { mutate: updatedView } = useMutation({
    mutationFn: (viewData: UpdateInventory) => updateInventory(id, viewData),
    onSuccess: () => {
      console.log("inventory updated successfully");
      queryClient.invalidateQueries({ queryKey: ["inventory", id] });
    },
    onError: (error) => {
      console.error("Error updating inventory:", error);
    },
  });

  const {
    data: InventoryData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["inventory", id],
    queryFn: () => fetchInventoryDataById(id!),
    enabled: !!id,
  });

  const { data: itemData } = useQuery({
    queryKey: ["item_no"],
    queryFn: FetchItemInventory,
  });

  const { data: locationList } = useQuery({
    queryKey: ["location"],
    queryFn: fetchingLocations,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: FetchCategories,
  });

  if (!id) return <div>Loading route params...</div>;
  if (isLoading) return <div>Loading data...</div>;
  if (isError) return <div>Error fetching data: {error.message}</div>;

  return (
    <>
      <Link className="btn btn-info text-white" href="/erp-v2/inventory/">
        <FaArrowLeft />
        Back
      </Link>
      <div className="flex justify-between p-6 bg-gray-50 dark:bg-gray-800 dark:text-white">
        <div className="w-1/3">
          <img
            src="https://via.placeholder.com/150" // Replace with your image URL
            alt="View"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        <div className="w-2/3 pl-6">
          {/* 3-Dot Menu - Show when not in edit mode */}
          {!isEditMode && (
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="absolute top-0 right-0 text-gray-500"
              >
                <FaEllipsisV size={20} />
              </button>
              {showMenu && (
                <div className="absolute top-8 right-0 w-32 bg-white shadow-lg rounded-md z-10">
                  <div
                    onClick={() => handleMenuClick("edit")}
                    className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    <FaEdit className="inline mr-2" /> Edit
                  </div>
                  <div
                    onClick={() => handleMenuClick("delete")}
                    className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    <FaTrash className="inline mr-2" /> Delete
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Formik Form */}
          <Formik
            initialValues={{
              description: InventoryData?.description || "",
              brand: InventoryData?.brand || "",
              serial: InventoryData?.serial || "",
              model: InventoryData?.model || "",
              specification: InventoryData?.specification || "",
              quantity: InventoryData?.quantity || 0,
              unit_of_measurement: InventoryData?.unit_of_measurement || "",
              srp: InventoryData?.srp || 0,
              category: InventoryData?.category.id || 0,
              location: InventoryData?.location.id || 0,
              item_reference: InventoryData?.item_reference.id || "",
              item: InventoryData?.item_no || "",
              photos: InventoryData?.photos || "",
            }}
            onSubmit={(values, { setSubmitting }) => {
              const payload: UpdateInventory = {
                id: id!,
                ...values,
                quantity: Number(values.quantity),
                srp: Number(values.srp),
              };
              updatedView(payload);
              console.log(payload);
              setSubmitting(false);
              setIsEditMode(false);
            }}
          >
            <Form className="space-y-4 uppercase ">
              {/* Error Message */}
              {errorMessage && (
                <div style={{ color: "red" }}>{errorMessage}</div>
              )}

              {/* Conditional rendering for item_reference and item_no */}
              {isEditMode ? (
                <div>
                  <label className="block mb-2 text-sm font-bold">
                    Item Reference
                  </label>
                  <Field
                    as="select"
                    name="item_reference"
                    className="bg-gray-50 border border-gray-300 dark:bg-gray-dark rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    disabled={!isEditMode} // Disable if not in edit mode
                  >
                    <option value="">Select Item Reference</option>
                    {itemData?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.item_no}
                      </option>
                    ))}
                  </Field>
                </div>
              ) : (
                <div>
                  <label className="block mb-2 text-sm font-bold">
                    Item No
                  </label>
                  <Field
                    type="text"
                    name="item"
                    className="bg-gray-50 border border-gray-300 dark:bg-gray-dark rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    readOnly={!isEditMode} // Set as readonly if not in edit mode
                  />
                </div>
              )}

              {/* Rest of the fields (including Profile Image) */}
              {[
                {
                  type: "text",
                  name: "description",
                  placeholder: "Enter your Description",
                  label: "Description",
                },
                {
                  type: "text",
                  name: "brand",
                  placeholder: "Enter your brand",
                  label: "Brand",
                },
                {
                  type: "text",
                  name: "serial",
                  placeholder: "Enter your serial",
                  label: "Serial",
                },
                {
                  type: "text",
                  name: "model",
                  placeholder: "Enter your model",
                  label: "Model",
                },
                {
                  type: "text",
                  name: "specification",
                  placeholder: "Enter your specification",
                  label: "Specification",
                },
                {
                  type: "text",
                  name: "quantity",
                  placeholder: "Enter your quantity",
                  label: "Quantity",
                },
                {
                  type: "text",
                  name: "unit_of_measurement",
                  placeholder: "Enter unit of measurement",
                  label: "Unit of Measurement",
                },
                {
                  type: "text",
                  name: "srp",
                  placeholder: "Enter SRP",
                  label: "SRP",
                },
                {
                  type: "select",
                  name: "category",
                  label: "Category",
                  options:
                    categoriesData?.map((loc) => ({
                      value: loc.id,
                      label: loc.category,
                    })) || [],
                },
                {
                  type: "select",
                  name: "location",
                  label: "Location",
                  options:
                    locationList?.map((loc) => ({
                      value: loc.id,
                      label: loc.location,
                    })) || [],
                },
              ].map((item) => (
                <div key={item.name} className="space-y-4">
                  <label className="block mb-2 text-sm font-bold">
                    {item.label}
                  </label>
                  {item.type === "select" ? (
                    <Field
                      as="select"
                      name={item.name}
                      className="bg-gray-50 border border-gray-300 dark:bg-gray-dark rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      disabled={!isEditMode} // Disable if not in edit mode
                    >
                      <option value="">Select a {item.label}</option>
                      {item.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                  ) : (
                    <Field
                      type={item.type}
                      name={item.name}
                      className="bg-gray-50 border border-gray-300 dark:bg-gray-dark rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      disabled={!isEditMode} // Disable all fields if not in edit mode
                    />
                  )}
                </div>
              ))}

              {/* Profile Image Field (conditionally hidden if not in edit mode) */}
              {isEditMode && (
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Profile Image
                  </label>
                  <Field
                    type="file"
                    name="photos"
                    placeholder="Upload your photos"
                    className="bg-gray-50 border border-gray-300 dark:bg-gray-dark rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                </div>
              )}

              <div className="flex gap-4">
                {/* Cancel Button */}
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => setIsEditMode(false)}
                    className="w-full bg-gray-500 text-white py-2 rounded-md"
                  >
                    Cancel
                  </button>
                )}

                {/* Update Button */}
                {isEditMode && (
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md"
                  >
                    Update
                  </button>
                )}
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
}

export default View;
