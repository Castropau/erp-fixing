"use client";
import { Formik, Form, Field } from "formik";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChequeItems } from "@/api/cheque-request/fetchItems";
import { ChequeUnits } from "@/api/cheque-request/fetchUnits";
import { UpdateItems, updateItems } from "@/api/cheque-request/UpdateItem";
import {
  updateLocation,
  UpdateLocation,
} from "@/api/cheque-request/UpdateLocation";
import { deleteItem } from "@/api/cheque-request/DeleteItem";
import { deleteLocation } from "@/api/cheque-request/DeleteLocation";
import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io";
import { fetchVendorDataById } from "@/api/vendor/fetchVendorId";
import { useParams } from "next/navigation";
// import { UpdateView, updateView } from "@/api/vendor/updateView";
import { fetchVendorDataByIds } from "@/api/vendor/fetchVendorIds";
import { UpdateView, updateView } from "@/api/vendor/updateVendor";
import { fetchVendorsList } from "@/api/vendor/fetchVendor";
import { fetchItemsList } from "@/api/vendor/fetchCategory";

function ViewItem() {
  // const { id } = props;
  const [isEditable, setIsEditable] = useState(false); // State to toggle between edit and view mode
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermLocation, setSearchTermLocation] = useState("");
  const [currentPageItems, setCurrentPageItems] = useState(1);
  const [currentPageUnits, setCurrentPageUnits] = useState(1);
  // const params = useParams();
  // const id = Number(params?.id);
  const params = useParams();
  const item_no = Number(params?.item_no);

  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditToggle = () => {
    setIsEditable(!isEditable);
  };
  const handleCancel = () => {
    setIsEditable(false); // Switch back to readonly mode without saving
  };
  const queryClient = useQueryClient();

  const rowsPerPage = 10;

  const {
    isLoading: isItemsLoading,
    error: itemsError,
    data: itemsData,
  } = useQuery({
    queryKey: ["items"],
    queryFn: ChequeItems,
  });

  const {
    isLoading: isUnitsLoading,
    error: UnitsError,
    data: unitsData,
  } = useQuery({
    queryKey: ["units"],
    queryFn: ChequeUnits,
  });
  const {
    isLoading: isVendorsLoading,
    error: VendorsError,
    data: vendorsData,
  } = useQuery({
    queryKey: ["vendors"],
    queryFn: fetchVendorsList,
  });

  const {
    isLoading: isCLoading,
    error: CError,
    data: cData,
  } = useQuery({
    queryKey: ["category"],
    queryFn: fetchItemsList,
  });
  const {
    data: VendorData,
    isLoading: isLvendor,
    isError,
    error,
  } = useQuery({
    queryKey: ["vendor", item_no],
    queryFn: () => fetchVendorDataByIds(item_no),

    enabled: !!item_no,
  });
  useEffect(() => {
    if (VendorData) {
      console.log("Fetched Vendor JSON Response:", VendorData);
    }
  }, [VendorData]);

  const { mutate: updateVendor } = useMutation({
    mutationFn: (data: UpdateView) => updateView(VendorData!.id, data),
    onSuccess: () => {
      console.log("vendor updated successfully");

      queryClient.invalidateQueries({ queryKey: ["vendor", id] });
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
      setShowEditModal(false);
    },
    onError: (error) => {
      console.error("Error updating cheque:", error);
    },
  });

  const totalPagesItems = Math.ceil((itemsData?.length || 0) / rowsPerPage);
  const totalPagesUnits = Math.ceil((unitsData?.length || 0) / rowsPerPage);

  const filteredItemsData = itemsData?.filter((item) =>
    item.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUnitsData = unitsData?.filter((location) =>
    location.unit_of_measurement
      .toLowerCase()
      .includes(searchTermLocation.toLowerCase())
  );

  const indexOfLastRowItems = currentPageItems * rowsPerPage;
  const indexOfFirstRowItems = indexOfLastRowItems - rowsPerPage;
  const currentItemsRows = filteredItemsData?.slice(
    indexOfFirstRowItems,
    indexOfLastRowItems
  );

  const indexOfLastRowUnits = currentPageUnits * rowsPerPage;
  const indexOfFirstRowUnits = indexOfLastRowUnits - rowsPerPage;
  const currentUnitsRows = filteredUnitsData?.slice(
    indexOfFirstRowUnits,
    indexOfLastRowUnits
  );

  const handlePrevItems = () => {
    if (currentPageItems > 1) setCurrentPageItems(currentPageItems - 1);
  };

  const handleNextItems = () => {
    if (currentPageItems < totalPagesItems)
      setCurrentPageItems(currentPageItems + 1);
  };

  const handlePrevUnits = () => {
    if (currentPageUnits > 1) setCurrentPageUnits(currentPageUnits - 1);
  };

  const handleNextUnits = () => {
    if (currentPageUnits < totalPagesUnits)
      setCurrentPageUnits(currentPageUnits + 1);
  };

  // update item mutation
  const { mutate: updatedItem } = useMutation({
    mutationFn: (data: UpdateItems) => updateItems(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      setIsItemModalOpen(false);
    },
  });

  // update location mutation
  const { mutate: updateLoc } = useMutation({
    mutationFn: (data: UpdateLocation) => updateLocation(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      setIsLocationModalOpen(false);
    },
  });

  // delete item mutation
  const { mutate: deleteItemMutation } = useMutation({
    mutationFn: (id: number) => deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  // delete location mutation
  const { mutate: deleteLocationMutation } = useMutation({
    mutationFn: (id: number) => deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
  if (isLvendor) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          {/* Loading Spinner */}
          <div className="dark:border-gray-200 dark:border-t-white  w-16 h-16 border-4 border-t-4 border-gray-800 border-dashed rounded-full animate-spin"></div>

          <span className="text-lg text-gray-700 dark:text-white">
            Please wait...
          </span>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="ml-auto">
        <Link href="/erp-v2/vendors">
          <button className="btn btn-info text-white uppercase">
            {/* <IoMdArrowBack /> */}
            Back to vendor list
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {/* First Column: Personal Information Input */}
        <div className="space-y-4">
          {/* Button to toggle between Edit and Update */}
          <div className="flex space-x-2 justify-end">
            {!isEditable ? (
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 uppercase"
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                {/* <button
                    onClick={handleEditToggle} // This would be where you handle the update logic
                    className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
                  >
                    Update
                  </button> */}
              </>
            )}
          </div>

          {/* Profile Image */}
          <div className="flex flex-col items-center mb-4">
            <img
              src="/images/logo.png" // Replace with the actual profile image URL
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-gray-300"
            />
            <span className="ml-4 text-lg text-center font-semibold">
              {VendorData?.item_no}
            </span>
          </div>

          {/* Name Input */}
          {/* Formik Form for Personal Information */}
          <Formik
            initialValues={{
              item: VendorData?.item || "",
              vendor: VendorData?.vendor || "",
              brand: VendorData?.brand || "",
              category: VendorData?.category || "",
              model: VendorData?.model || "",
              srp: VendorData?.srp || "",
              unit_of_measurement: VendorData?.unit_of_measurement || "",
              unit_price: VendorData?.unit_price || "",
              vat_percentage: VendorData?.vat_percentage || "",
              description: VendorData?.description || "",
            }}
            enableReinitialize={true}
            onSubmit={(values) => {
              console.log(values);
              updateVendor(values); // Handle form submission by calling the mutation
            }}
          >
            <Form className="space-y-1 md:space-y-1 uppercase">
              <div style={{ color: "red" }}>
                {/* Display error messages here if needed */}
              </div>

              {/* Input Fields */}
              {[
                {
                  type: "text",
                  name: "item",
                  placeholder: "item",
                  label: "Item",
                },
                // {
                //   type: "select",
                //   name: "vendor",
                //   placeholder: "Contact",
                //   label: "vendor",
                //   options:
                //     vendorsData?.map((vendor) => ({
                //       value: vendor.id,
                //       label: vendor.vendor,
                //     })) || [], // fallback to empty array while loading
                // },
                {
                  type: "text",
                  name: "brand",
                  placeholder: "Enter brand",
                  label: "brand",
                },
                // {
                //   type: "select",
                //   name: "category",
                //   placeholder: "Enter address",
                //   label: "category",
                //   options:
                //     cData?.map((category) => ({
                //       value: category.id,
                //       label: category.category,
                //     })) || [], // fallback to empty array while loading
                // },
                // {
                //   type: "select",
                //   name: "country",
                //   label: "Country",
                //   options: ["PH", "KR", "US", "CAN"],
                // },
                {
                  type: "text",
                  name: "srp",
                  placeholder: "Enter srp",
                  label: "srp",
                },
                {
                  type: "text",
                  name: "unit_of_measurement",
                  placeholder: "Enter bank",
                  label: "contact person",
                },
                {
                  type: "text",
                  name: "unit_price",
                  placeholder: "Enter bank",
                  label: "Bank details",
                },
                {
                  type: "text",
                  name: "vat_percentage",
                  placeholder: "Enter description",
                  label: "description",
                },
                {
                  type: "text",
                  name: "description",
                  placeholder: "Enter description",
                  label: "description",
                },
              ].map((item) => (
                <div key={item.name} className="space-y-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {item.label}
                  </label>
                  {item.type === "select" ? (
                    <Field
                      as="select"
                      name={item.name}
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      disabled={!isEditable}
                    >
                      <option value="">Select {item.label}</option>
                      {item.options?.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label}
                          {/* Use 'option.label' to display the label */}
                        </option>
                      ))}
                    </Field>
                  ) : (
                    <Field
                      type={item.type}
                      id={item.name}
                      name={item.name}
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder={item.placeholder}
                      readOnly={!isEditable}
                    />
                  )}
                </div>
              ))}

              {/* Submit Button */}
              {isEditable && (
                <div className="modal-action">
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
                  >
                    Update
                  </button>
                </div>
              )}
            </Form>
          </Formik>
        </div>

        {/* Second Column: Table */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          {/* <AddUnit /> */}
          {isUnitsLoading ? (
            <div>Loading locations...</div>
          ) : (
            <>
              <input
                type="search"
                className="w-120 mb-4 p-2 border rounded"
                placeholder="Search"
                value={searchTermLocation}
                onChange={(e) => {
                  setSearchTermLocation(e.target.value);
                  setCurrentPageUnits(1);
                }}
              />
              <table className="min-w-full table-zebra border-collapse">
                <thead className="border border-black">
                  <tr className="text-blue-500 uppercase bg-gray-200">
                    <th className="p-2 text-center">created by</th>
                    <th className="p-2 text-center">Date created</th>
                  </tr>
                </thead>
                <tbody>
                  {VendorData && (
                    <tr key={VendorData.id} className=" border border-black">
                      <td className="p-2 text-center">
                        {VendorData.created_by}
                      </td>
                      <td className="p-2 text-center">
                        {VendorData.date_created}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="flex justify-end items-center mt-4 gap-2">
                <button
                  onClick={handlePrevUnits}
                  className="btn bg-blue-500 text-xs text-white hover:bg-blue-600 disabled:bg-gray-300"
                  disabled={currentPageUnits === 1}
                >
                  Previous
                </button>
                <span className="text-xs mr-2">
                  Page {currentPageUnits} of {totalPagesUnits}
                </span>
                <button
                  onClick={handleNextUnits}
                  className="btn bg-blue-500 text-xs text-white hover:bg-blue-600 disabled:bg-gray-300"
                  disabled={currentPageUnits === totalPagesUnits}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ViewItem;
