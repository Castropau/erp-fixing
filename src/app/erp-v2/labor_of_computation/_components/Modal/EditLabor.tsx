// import { fetchbomId } from "@/api/bill_of_materials/fetchBomId";
import { BomId, fetchbomId } from "@/api/bill_of_materials/fetchBomId";
import { fetchbomClient } from "@/api/bill_of_materials/fetchClients";
import { fetchbomUser } from "@/api/bill_of_materials/fetchUsers";
import { updateBomId, updatebomId } from "@/api/bill_of_materials/updateBomId";
import { Bom, fetchBomList } from "@/api/bom-quotation/fetchBom";
import { fetchlaborId } from "@/api/labor_of_computation/FetchLaborId";
import {
  updateLabor,
  UpdateLabor,
} from "@/api/labor_of_computation/updateLabor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa6";
import ActiveNav1 from "../ModalComponents/ActiveNav1";
import ActiveNav2 from "../ModalComponents/ActiveNav2";
import ActiveNav3 from "../ModalComponents/ActiveNav3";
import ActiveNav4 from "../ModalComponents/ActiveNav4";
import ActiveNav5 from "../ModalComponents/ActiveNav5";

interface DeviceRow {
  item: string;
  description: string;
  quantity: string;
  unit_of_measurement: string;
  //   amount: string;
  srp: number;
}
interface BomIds {
  id: number;
}
const EditLabor = (props: BomIds) => {
  const queryClient = useQueryClient();

  const { id } = props;

  const {
    data: LaborData,
    isLoading: Rloading,
    isError: ReceiptError,
    error: rerror,
  } = useQuery({
    queryKey: ["labor", id],
    queryFn: () => fetchlaborId(id),
    enabled: !!id,
  });

  const {
    data: BomData,
    isLoading: Bloading,
    isError: BeceiptError,
    error: berror,
  } = useQuery({
    queryKey: ["bom"],
    queryFn: fetchBomList,
  });

  const { mutate: updatedLabor } = useMutation({
    mutationFn: (laborData: UpdateLabor) => updateLabor(id, laborData),
    onSuccess: () => {
      console.log("labor updated successfully");
      queryClient.invalidateQueries({ queryKey: ["labor", id] });
    },
    onError: (error) => {
      console.error("Error updating quotation:", error);
    },
  });
  const [activeNav, setActiveNav] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deviceRows, setDeviceRows] = useState<DeviceRow[]>([]);

  const [formData, setFormData] = useState({
    input1: LaborData?.bom_no || "",
    input2: LaborData?.date_created || "",
    input3: "",
    input4: "",
    input5: "",
    input6: "",
    input7: "",
    input8: "",
  });
  const {
    isLoading: Uloading,
    error: uerror,
    data: udata,
  } = useQuery<BomUser[]>({
    queryKey: ["users"],
    queryFn: fetchbomUser,
  });

  const {
    isLoading: Clientloading,
    error: clienterror,
    data: clientdata,
  } = useQuery<Bom[]>({
    queryKey: ["bom"],
    queryFn: fetchBomList,
  });

  useEffect(() => {
    if (LaborData && LaborData.device_header) {
      const headersFromData = LaborData.device_header.map((header) => ({
        title: header.header || "",
        rows: header.items.map((item) => ({
          item: item.item,
          description: item.description,
          quantity: item.quantity.toString(),
          unit_of_measurement: item.unit_of_measurement.toString(),
          srp: item.srp,
        })),
      }));

      setNewHeaders(headersFromData);
    }
  }, [LaborData]);

  useEffect(() => {
    if (LaborData?.device_items) {
      // If device_items is an array:
      const devices = Array.isArray(LaborData.device_items)
        ? LaborData.device_items
        : [LaborData.device_items]; // fallback for single item

      const formattedDevices = devices.map((device) => ({
        item: device.item || "",
        description: device.description || "",
        quantity: device.quantity || 0,
        unit_of_measurement: device.unit_of_measurement || "", // or you can hardcode a default
        // srp: device.item.srp || 0,
        srp: device.srp || 0,

        // total_amount: device.total_amount || 0, // Fetching the total_amount
        // total_amount: device.srp * device.quantity || 0,
        // total_amount: (device.srp || 0) * (device.quantity || 0), // ✅ computed from srp * quantity
        total_amount: (device.srp || 0) * (device.quantity || 0), // ✅ computed from srp * quantity
      }));

      setDeviceRows(formattedDevices);
    }
  }, [LaborData]);
  useEffect(() => {
    if (LaborData) {
      setFormData({
        input1: LaborData.lc_no || "",
        input2: LaborData.lc_no || "", // Add any other default values as needed
        input3: LaborData.lc_no || "",
        input4: LaborData.lc_no || "",
        input5: LaborData.lc_no || "",
        input6: LaborData.lc_no || "",
        input7: LaborData.lc_no || "",
        input8: LaborData.lc_no || "",
      });
    }
  }, [LaborData]);

  // Handle changes in input fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [headers, setHeaders] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);
  //   const [newHeaders, setNewHeaders] = useState<
  //     { title: string; rows: DeviceRow[] }[]
  //   >([]);
  //   const [newHeaders, setNewHeaders] = useState<
  //     {
  //       mainTitle: string; // <-- new field for roughing_ins.header
  //       title: string; // <-- sub-header
  //       rows: RoughingRow[];
  //     }[]
  //   >([]);
  const [newHeaders, setNewHeaders] = useState([]);

  const handleSave = () => {
    console.log("Form Data:", formData);
    console.log("Device Rows:", deviceRows);
    console.log("Headers:", headers);
    setShowEditModal(false);
  };

  const removeDeviceRow = (index: number) => {
    const updated = [...deviceRows];
    updated.splice(index, 1);
    setDeviceRows(updated);
  };

  //   const addHeader = () => {
  //     setNewHeaders([
  //       ...newHeaders,
  //       {
  //         title: "",
  //         rows: [
  //           {
  //             item: "",
  //             description: "",
  //             quantity: "",
  //             unit_of_measurement: "",
  //             srp: 0,
  //           },
  //         ],
  //       },
  //     ]);
  //   };
  //   const addHeader = () => {
  //     setNewHeaders([
  //       ...newHeaders,
  //       {
  //         mainTitle: "", // Initialize with an empty main title.
  //         title: "", // Initialize with an empty sub-header title.
  //         rows: [
  //           {
  //             item: "",
  //             description: "",
  //             quantity: "",
  //             unit_of_measurement: "",
  //             srp: 0,
  //           },
  //         ],
  //       },
  //     ]);
  //   };
  //   const addHeader = () => {
  //     const newHeader = {
  //       header: "", // Main title for the header, initially empty
  //       rows: [], // An empty array for rows
  //     };

  //     // Update the state with the new header
  //     setNewHeaders([...newHeaders, newHeader]);
  //   };
  const addHeader = () => {
    const newHeader = {
      header: "", // Main title for the header
      rows: [
        {
          title: "", // Sub-header title
          manuallyAdded: true, // <-- Add this flag
          rows: [
            {
              item: "",
              ratio: "",
              unit: "",
              quantity: "",
              manpower: "",
              no_of_days: "",
              labor_cost: "",
              per_unit_cost: "",
            },
          ], // Initial row for the sub-header
        },
      ],
    };

    // Add the new header to the existing state
    setNewHeaders([...newHeaders, newHeader]);
  };

  const updateDeviceRow = (
    rowIndex: number,
    key: keyof DeviceRow,
    value: string | number
  ) => {
    setDeviceRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        [key]: value,
      };
      return updatedRows;
    });
  };

  //   const updateNewHeaderTitle = (headerIndex: number, newTitle: string) => {
  //     setNewHeaders((prevHeaders) => {
  //       const updatedHeaders = [...prevHeaders];
  //       updatedHeaders[headerIndex].title = newTitle;
  //       return updatedHeaders;
  //     });
  //   };
  const updateNewHeaderTitle = (headerIndex, subIndex, value) => {
    const updatedHeaders = [...newHeaders];
    updatedHeaders[headerIndex].rows[subIndex].title = value;
    setNewHeaders(updatedHeaders);
  };

  //   const updateNewHeaderRow = (
  //     headerIndex: number,
  //     rowIndex: number,
  //     field: keyof DeviceRow,
  //     newValue: string
  //   ) => {
  //     setNewHeaders((prevHeaders) => {
  //       const updatedHeaders = [...prevHeaders];
  //       updatedHeaders[headerIndex].rows[rowIndex][field] = newValue;
  //       return updatedHeaders;
  //     });
  //   };

  //   const addRowToNewHeader = (headerIndex: number) => {
  //     const updated = [...newHeaders];
  //     updated[headerIndex].rows.push({
  //       item: "",
  //       description: "",
  //       quantity: "",
  //       unit_of_measurement: "",
  //       srp: 0,
  //     });
  //     setNewHeaders(updated);
  //   };
  //   const removeRowFromNewHeader = (headerIndex: number, rowIndex: number) => {
  //     setNewHeaders((prevHeaders) => {
  //       const updatedHeaders = [...prevHeaders];
  //       updatedHeaders[headerIndex].rows.splice(rowIndex, 1);
  //       return updatedHeaders;
  //     });
  //   };
  //   const removeRowFromNewHeader = (headerIndex, subIndex, rowIndex) => {
  //     const updatedHeaders = [...newHeaders];

  //     // Remove the row from the correct sub-header's rows
  //     updatedHeaders[headerIndex].rows[subIndex].rows.splice(rowIndex, 1);

  //     // Update the state with the modified headers
  //     setNewHeaders(updatedHeaders);
  //   };

  const saveNewHeader = (index: number) => {
    const headerToSave = newHeaders[index];
    if (!headerToSave.title.trim()) return;
    setHeaders([...headers, headerToSave]);
    const updated = [...newHeaders];
    updated.splice(index, 1);
    setNewHeaders(updated);
  };

  const cancelNewHeader = (index: number) => {
    const updated = [...newHeaders];
    updated.splice(index, 1);
    setNewHeaders(updated);
  };

  const addRowToHeader = (headerIndex: number) => {
    const updated = [...headers];
    updated[headerIndex].rows.push({
      item: "",
      description: "",
      quantity: "",
      unit_of_measurement: "",
      amount: "",
    });
    setHeaders(updated);
  };

  const updateHeaderRow = (
    headerIndex: number,
    rowIndex: number,
    key: keyof DeviceRow,
    value: string
  ) => {
    const updated = [...headers];
    const row = updated[headerIndex].rows[rowIndex];
    row[key] = value;

    const quantity = parseFloat(row.quantity);
    const unit_of_measurement = parseFloat(row.unit_of_measurement);
    row.amount =
      !isNaN(quantity) && !isNaN(unit_of_measurement)
        ? (quantity * unit_of_measurement).toFixed(2)
        : "";

    setHeaders(updated);
  };

  const removeHeaderRow = (headerIndex: number, rowIndex: number) => {
    const updated = [...headers];
    updated[headerIndex].rows.splice(rowIndex, 1);
    setHeaders(updated);
  };
  const getHeaderSubtotal = (rows: DeviceRow[]) => {
    return rows.reduce((sum, row) => {
      const amount = parseFloat(row.amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  };

  const getTotalAmountIncludingNew = () => {
    const savedTotal = headers.reduce((sum, header) => {
      return sum + getHeaderSubtotal(header.rows);
    }, 0);

    const newHeadersTotal = newHeaders.reduce((sum, newHeader) => {
      return sum + getNewHeaderSubtotal(newHeader.rows);
    }, 0);

    return savedTotal + newHeadersTotal;
  };

  const getNewHeaderSubtotal = (rows: DeviceRow[]) => {
    return rows.reduce((total, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const unit_of_measurement = parseFloat(row.unit_of_measurement) || 0;
      return total + quantity * unit_of_measurement;
    }, 0);
  };

  //   useEffect(() => {
  //     if (LaborData?.roughing_ins && Array.isArray(LaborData.roughing_ins)) {
  //       const headersFromData = LaborData.roughing_ins.map((headerBlock) => {
  //         const rows: DeviceRow[] = [];

  //         headerBlock.sub_headers?.forEach((subHeader) => {
  //           subHeader.items?.forEach((item) => {
  //             rows.push({
  //               item: item.item || "",
  //               ratio: item.ratio || "",
  //               unit: item.unit || "",
  //               quantity: item.quantity.toString() || "0",
  //               manpower: item.manpower?.toString() || "0",
  //               no_of_days: item.no_of_days?.toString() || "0",
  //               labor_cost: item.labor_cost?.toString() || "0",
  //               per_unit_cost: item.per_unit_cost?.toString() || "0",
  //             });
  //           });
  //         });

  //         return {
  //           title: headerBlock.header || "Untitled Header",
  //           rows,
  //         };
  //       });

  //       setNewHeaders(headersFromData);
  //     }
  //   }, [LaborData]);
  //   useEffect(() => {
  //     if (LaborData?.roughing_ins && Array.isArray(LaborData.roughing_ins)) {
  //       const subHeadersMapped = LaborData.roughing_ins.flatMap((headerBlock) => {
  //         return headerBlock.sub_headers.map((subHeader) => {
  //           const rows: DeviceRow[] = subHeader.items.map((item) => ({
  //             item: item.item || "",
  //             ratio: item.ratio || "",
  //             unit: item.unit || "",
  //             quantity: item.quantity.toString() || "0",
  //             manpower: item.manpower?.toString() || "0",
  //             no_of_days: item.no_of_days?.toString() || "0",
  //             labor_cost: item.labor_cost?.toString() || "0",
  //             per_unit_cost: item.per_unit_cost?.toString() || "0",
  //           }));

  //           return {
  //             title: subHeader.sub_header || "Untitled Subheader",
  //             rows,
  //           };
  //         });
  //       });

  //       setNewHeaders(subHeadersMapped);
  //     }
  //   }, [LaborData]);
  //   useEffect(() => {
  //     if (LaborData?.roughing_ins && Array.isArray(LaborData.roughing_ins)) {
  //       const flattenedHeaders = LaborData.roughing_ins.flatMap((header) =>
  //         header.sub_headers.map((subHeader) => ({
  //           mainTitle: header.header || "", // <-- top-level header
  //           title: subHeader.sub_header || "", // <-- subheader title
  //           rows: subHeader.items.map((item) => ({
  //             item: item.item || "",
  //             ratio: item.ratio || "",
  //             unit: item.unit || "",
  //             quantity: item.quantity.toString(),
  //             manpower: item.manpower?.toString() || "",
  //             no_of_days: item.no_of_days?.toString() || "",
  //             labor_cost: item.labor_cost?.toString() || "",
  //             per_unit_cost: item.per_unit_cost?.toString() || "",
  //           })),
  //         }))
  //       );
  //       setNewHeaders(flattenedHeaders);
  //     }
  //   }, [LaborData]);
  //   useEffect(() => {
  //     if (LaborData?.roughing_ins && Array.isArray(LaborData.roughing_ins)) {
  //       const allHeaders = LaborData.roughing_ins.flatMap((section) => {
  //         const headerTitle = section.header || "";

  //         // If section has sub_headers, loop through them
  //         if (section.sub_headers && section.sub_headers.length > 0) {
  //           return section.sub_headers.map((sub) => ({
  //             mainTitle: headerTitle,
  //             title: sub.sub_header || "",
  //             rows: sub.items.map((item) => ({
  //               item: item.item || "",
  //               ratio: item.ratio || "",
  //               unit: item.unit || "",
  //               quantity: item.quantity?.toString() || "",
  //               manpower: item.manpower?.toString() || "",
  //               no_of_days: item.no_of_days?.toString() || "",
  //               labor_cost: item.labor_cost?.toString() || "",
  //               per_unit_cost: item.per_unit_cost?.toString() || "",
  //             })),
  //           }));
  //         }

  //         // Otherwise, just use the items at the top level
  //         return [
  //           {
  //             mainTitle: headerTitle,
  //             title: "", // no sub-header
  //             rows: section.items.map((item) => ({
  //               item: item.item || "",
  //               ratio: item.ratio || "",
  //               unit: item.unit || "",
  //               quantity: item.quantity?.toString() || "",
  //               manpower: item.manpower?.toString() || "",
  //               no_of_days: item.no_of_days?.toString() || "",
  //               labor_cost: item.labor_cost?.toString() || "",
  //               per_unit_cost: item.per_unit_cost?.toString() || "",
  //             })),
  //           },
  //         ];
  //       });

  //       setNewHeaders(allHeaders);
  //     }
  //   }, [LaborData]);
  //   useEffect(() => {
  //     if (LaborData?.roughing_ins && Array.isArray(LaborData.roughing_ins)) {
  //       const allHeaders = LaborData.roughing_ins.flatMap((section) => {
  //         const headerTitle = section.header || "";

  //         // If section has sub_headers
  //         if (section.sub_headers && section.sub_headers.length > 0) {
  //           return section.sub_headers.map((sub) => {
  //             const hasSubHeader = !!sub.sub_header?.trim(); // Check if sub_header has a value

  //             const headerObject: any = {
  //               mainTitle: headerTitle,
  //               rows: sub.items.map((item) => ({
  //                 item: item.item || "",
  //                 ratio: item.ratio || "",
  //                 unit: item.unit || "",
  //                 quantity: item.quantity?.toString() || "",
  //                 manpower: item.manpower?.toString() || "",
  //                 no_of_days: item.no_of_days?.toString() || "",
  //                 labor_cost: item.labor_cost?.toString() || "",
  //                 per_unit_cost: item.per_unit_cost?.toString() || "",
  //               })),
  //             };

  //             // Only assign the title if there's a sub_header
  //             if (hasSubHeader) {
  //               headerObject.title = sub.sub_header;
  //             }

  //             return headerObject;
  //           });
  //         }

  //         // No sub_headers, handle top-level items
  //         return [
  //           {
  //             mainTitle: headerTitle,
  //             rows: section.items.map((item) => ({
  //               item: item.item || "",
  //               ratio: item.ratio || "",
  //               unit: item.unit || "",
  //               quantity: item.quantity?.toString() || "",
  //               manpower: item.manpower?.toString() || "",
  //               no_of_days: item.no_of_days?.toString() || "",
  //               labor_cost: item.labor_cost?.toString() || "",
  //               per_unit_cost: item.per_unit_cost?.toString() || "",
  //             })),
  //           },
  //         ];
  //       });

  //       setNewHeaders(allHeaders);
  //     }
  //   }, [LaborData]);
  //   useEffect(() => {
  //     if (LaborData?.roughing_ins && Array.isArray(LaborData.roughing_ins)) {
  //       const allHeaders = LaborData.roughing_ins.flatMap((section) => {
  //         if (
  //           Array.isArray(section.sub_headers) &&
  //           section.sub_headers.length > 0
  //         ) {
  //           return section.sub_headers.map((sub) => {
  //             const hasSubHeader = !!sub.sub_header?.trim();

  //             const headerObject: any = {
  //               mainTitle: headerTitle,
  //               rows: sub.items.map((item) => ({
  //                 item: item.item || "",
  //                 ratio: item.ratio || "",
  //                 unit: item.unit || "",
  //                 quantity: item.quantity?.toString() || "",
  //                 manpower: item.manpower?.toString() || "",
  //                 no_of_days: item.no_of_days?.toString() || "",
  //                 labor_cost: item.labor_cost?.toString() || "",
  //                 per_unit_cost: item.per_unit_cost?.toString() || "",
  //               })),
  //             };

  //             if (hasSubHeader) {
  //               headerObject.title = sub.sub_header;
  //             }

  //             return headerObject;
  //           });
  //         }
  //         if (section.items && section.items.length > 0) {
  //           return [
  //             {
  //               mainTitle: headerTitle,
  //               rows: section.items.map((item) => ({
  //                 item: item.item || "",
  //                 ratio: item.ratio || "",
  //                 unit: item.unit || "",
  //                 quantity: item.quantity?.toString() || "",
  //                 manpower: item.manpower?.toString() || "",
  //                 no_of_days: item.no_of_days?.toString() || "",
  //                 labor_cost: item.labor_cost?.toString() || "",
  //                 per_unit_cost: item.per_unit_cost?.toString() || "",
  //               })),
  //             },
  //           ];
  //         }

  //         return []; // 🧹 Nothing to add if both sub_headers and items are empty
  //       });

  //       setNewHeaders(allHeaders);
  //     }
  //   }, [LaborData]);
  useEffect(() => {
    if (LaborData?.roughing_ins && Array.isArray(LaborData.roughing_ins)) {
      const allHeaders = LaborData.roughing_ins.flatMap((section) => {
        const headerObject: any = {
          header: section.header, // Main Title or Header from "roughing_ins"
          rows: [],
        };

        // If there are sub_headers, process them
        if (
          Array.isArray(section.sub_headers) &&
          section.sub_headers.length > 0
        ) {
          section.sub_headers.forEach((sub) => {
            const hasSubHeader = !!sub.sub_header?.trim();
            const subHeaderObject = {
              title: sub.sub_header || "",
              rows: sub.items.map((item) => ({
                item: item.item || "",
                ratio: item.ratio || "",
                unit: item.unit || "",
                quantity: item.quantity?.toString() || "",
                manpower: item.manpower?.toString() || "",
                no_of_days: item.no_of_days?.toString() || "",
                labor_cost: item.labor_cost?.toString() || "",
                per_unit_cost: item.per_unit_cost?.toString() || "",
              })),
            };
            headerObject.rows.push(subHeaderObject);
          });
        }

        // If no sub_headers but items exist, just process the items
        if (section.items && section.items.length > 0) {
          headerObject.rows.push({
            rows: section.items.map((item) => ({
              item: item.item || "",
              ratio: item.ratio || "",
              unit: item.unit || "",
              quantity: item.quantity?.toString() || "",
              manpower: item.manpower?.toString() || "",
              no_of_days: item.no_of_days?.toString() || "",
              labor_cost: item.labor_cost?.toString() || "",
              per_unit_cost: item.per_unit_cost?.toString() || "",
            })),
          });
        }

        return headerObject;
      });

      setNewHeaders(allHeaders);
    }
  }, [LaborData]);
  const updateNewHeaderMainTitle = (headerIndex, value) => {
    const updatedHeaders = [...newHeaders];
    updatedHeaders[headerIndex].header = value;
    setNewHeaders(updatedHeaders);
  };

  const updateNewHeaderRow = (
    headerIndex,
    subIndex,
    rowIndex,
    field,
    value
  ) => {
    const updatedHeaders = [...newHeaders];
    updatedHeaders[headerIndex].rows[subIndex].rows[rowIndex][field] = value;
    setNewHeaders(updatedHeaders);
  };

  const removeRowFromNewHeader = (headerIndex, subIndex, rowIndex) => {
    const updatedHeaders = [...newHeaders];
    updatedHeaders[headerIndex].rows[subIndex].rows.splice(rowIndex, 1);
    setNewHeaders(updatedHeaders);
  };

  const addRowToNewHeader = (headerIndex, subIndex) => {
    const updatedHeaders = [...newHeaders];
    updatedHeaders[headerIndex].rows[subIndex].rows.push({
      item: "",
      ratio: "",
      unit: "",
      quantity: "",
      manpower: "",
      no_of_days: "",
      labor_cost: "",
      per_unit_cost: "",
    });
    setNewHeaders(updatedHeaders);
  };

  const [deviceRows2, setDeviceRows2] = useState<DeviceRow[]>([]);
  const [newHeaders2, setNewHeaders2] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);
  const [headers2, setHeaders2] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);

  useEffect(() => {
    if (LaborData?.wiring_ins && Array.isArray(LaborData.wiring_ins)) {
      const allHeaders = LaborData.wiring_ins.flatMap((section) => {
        const headerObject = {
          header: section.header || "",
          rows: [],
        };

        if (
          Array.isArray(section.sub_headers) &&
          section.sub_headers.length > 0
        ) {
          section.sub_headers.forEach((sub) => {
            const subHeaderObject = {
              title: sub.sub_header || "",
              manuallyAdded: false, // fetched = not manually added
              rows: sub.items.map((item) => ({
                item: item.item || "",
                ratio: item.ratio || "",
                unit: item.unit || "",
                quantity: item.quantity?.toString() || "",
                manpower: item.manpower?.toString() || "",
                no_of_days: item.no_of_days?.toString() || "",
                labor_cost: item.labor_cost?.toString() || "",
                per_unit_cost: item.per_unit_cost?.toString() || "",
              })),
            };
            headerObject.rows.push(subHeaderObject);
          });
        }

        // Fallback: Items without sub-headers
        if (section.items && section.items.length > 0) {
          headerObject.rows.push({
            title: "", // no title
            manuallyAdded: false,
            rows: section.items.map((item) => ({
              item: item.item || "",
              ratio: item.ratio || "",
              unit: item.unit || "",
              quantity: item.quantity?.toString() || "",
              manpower: item.manpower?.toString() || "",
              no_of_days: item.no_of_days?.toString() || "",
              labor_cost: item.labor_cost?.toString() || "",
              per_unit_cost: item.per_unit_cost?.toString() || "",
            })),
          });
        }

        return headerObject;
      });

      setNewHeaders2(allHeaders); // <- update your newHeaders2 state
    }
  }, [LaborData]);

  const addHeader2 = () => {
    setNewHeaders2([
      ...newHeaders2,
      {
        title: "",
        rows: [
          {
            item: "",
            description: "",
            quantity: "",
            unitPrice: "",
            amount: "",
          },
        ],
      },
    ]);
  };
  const updateNewHeaderTitle2 = (index: number, value: string) => {
    const updated = [...newHeaders2];
    updated[index].title = value;
    setNewHeaders2(updated);
  };

  //   const updateNewHeaderRow2 = (
  //     headerIndex: number,
  //     rowIndex: number,
  //     key: keyof DeviceRow,
  //     value: string
  //   ) => {
  //     const updated = [...newHeaders2];
  //     const row = updated[headerIndex].rows[rowIndex];
  //     row[key] = value;

  //     const quantity = parseFloat(row.quantity);
  //     const unitPrice = parseFloat(row.unitPrice);
  //     row.amount =
  //       !isNaN(quantity) && !isNaN(unitPrice)
  //         ? (quantity * unitPrice).toFixed(2)
  //         : "";

  //     setNewHeaders2(updated);
  //   };
  const updateNewHeaderRow2 = (
    headerIndex: number,
    subIndex: number,
    rowIndex: number,
    key: keyof DeviceRow,
    value: string
  ) => {
    const updated = [...newHeaders2];
    const row = updated[headerIndex].rows[subIndex].rows[rowIndex];

    row[key] = value;

    const quantity = parseFloat(row.quantity || "0");
    const unitPrice = parseFloat(row.unitPrice || "0");

    row.amount =
      !isNaN(quantity) && !isNaN(unitPrice)
        ? (quantity * unitPrice).toFixed(2)
        : "";

    setNewHeaders2(updated);
  };

  const addRowToNewHeader2 = (headerIndex, subIndex) => {
    const updatedHeaders2 = [...newHeaders2];
    updatedHeaders2[headerIndex].rows[subIndex].rows.push({
      item: "",
      ratio: "",
      unit: "",
      quantity: "",
      manpower: "",
      no_of_days: "",
      labor_cost: "",
      per_unit_cost: "",
    });
    setNewHeaders2(updatedHeaders2);
  };

  //   const removeRowFromNewHeader2 = (headerIndex: number, rowIndex: number) => {
  //     const updated = [...newHeaders2];
  //     updated[headerIndex].rows.splice(rowIndex, 1);
  //     setNewHeaders2(updated);
  //   };
  const removeRowFromNewHeader2 = (headerIndex, subIndex, rowIndex) => {
    const updatedHeaders2 = [...newHeaders2];
    updatedHeaders2[headerIndex].rows[subIndex].rows.splice(rowIndex, 1);
    setNewHeaders2(updatedHeaders2);
  };

  const saveNewHeader2 = (index: number) => {
    const headerToSave = newHeaders2[index];
    if (!headerToSave.title.trim()) return;
    setHeaders2([...headers2, headerToSave]);
    const updated = [...newHeaders2];
    updated.splice(index, 1);
    setNewHeaders2(updated);
  };

  const cancelNewHeader2 = (index: number) => {
    const updated = [...newHeaders2];
    updated.splice(index, 1);
    setNewHeaders2(updated);
  };
  const getNewHeaderSubtotal2 = (rows: DeviceRow[]) => {
    return rows.reduce((sum, row) => {
      const amount = parseFloat(row.amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  };

  const getTotalAmountIncludingNew2 = () => {
    const savedTotal = headers2.reduce((sum, header) => {
      return sum + getHeaderSubtotal(header.rows);
    }, 0);

    const newHeadersTotal = newHeaders2.reduce((sum, newHeader) => {
      return sum + getNewHeaderSubtotal2(newHeader.rows);
    }, 0);

    return savedTotal + newHeadersTotal;
  };
  const removeDeviceRow2 = (index: number) => {
    const updated = [...deviceRows2];
    updated.splice(index, 1);
    setDeviceRows2(updated);
  };

  useEffect(() => {
    if (LaborData?.material_header) {
      const headersFromMaterial = LaborData.material_header.map((header) => ({
        title: header.header || "Untitled Header",
        rows: header.items.map((item) => ({
          item: item.item,
          description: item.description,
          quantity: item.quantity.toString(),
          unit_of_measurement: item.unit_of_measurement,
          srp: item.srp.toString(),
          amount: item.total_amount.toString(),
        })),
      }));

      setNewHeaders2(headersFromMaterial);
    }
  }, [LaborData]);

  const [deviceRows3, setDeviceRows3] = useState<DeviceRow[]>([]);
  const [newHeaders3, setNewHeaders3] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);
  const [headers3, setHeaders3] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);

  useEffect(() => {
    if (
      LaborData?.device_installations &&
      Array.isArray(LaborData.device_installations)
    ) {
      const allHeaders = LaborData.device_installations.flatMap((section) => {
        const headerObject = {
          header: section.header || "",
          rows: [],
        };

        if (
          Array.isArray(section.sub_headers) &&
          section.sub_headers.length > 0
        ) {
          section.sub_headers.forEach((sub) => {
            const subHeaderObject = {
              title: sub.sub_header || "",
              manuallyAdded: false, // fetched = not manually added
              rows: sub.items.map((item) => ({
                item: item.item || "",
                ratio: item.ratio || "",
                unit: item.unit || "",
                quantity: item.quantity?.toString() || "",
                manpower: item.manpower?.toString() || "",
                no_of_days: item.no_of_days?.toString() || "",
                labor_cost: item.labor_cost?.toString() || "",
                per_unit_cost: item.per_unit_cost?.toString() || "",
              })),
            };
            headerObject.rows.push(subHeaderObject);
          });
        }

        // Fallback: Items without sub-headers
        if (section.items && section.items.length > 0) {
          headerObject.rows.push({
            title: "", // no title
            manuallyAdded: false,
            rows: section.items.map((item) => ({
              item: item.item || "",
              ratio: item.ratio || "",
              unit: item.unit || "",
              quantity: item.quantity?.toString() || "",
              manpower: item.manpower?.toString() || "",
              no_of_days: item.no_of_days?.toString() || "",
              labor_cost: item.labor_cost?.toString() || "",
              per_unit_cost: item.per_unit_cost?.toString() || "",
            })),
          });
        }

        return headerObject;
      });

      setNewHeaders3(allHeaders); // <- update your newHeaders2 state
    }
  }, [LaborData]);
  const addHeader3 = () => {
    setNewHeaders3([
      ...newHeaders3,
      {
        title: "",
        rows: [
          {
            item: "",
            description: "",
            quantity: "",
            unitPrice: "",
            amount: "",
          },
        ],
      },
    ]);
  };
  const updateNewHeaderTitle3 = (index: number, value: string) => {
    const updated = [...newHeaders3];
    updated[index].title = value;
    setNewHeaders3(updated);
  };

  //   const updateNewHeaderRow3 = (
  //     headerIndex: number,
  //     rowIndex: number,
  //     key: keyof DeviceRow,
  //     value: string
  //   ) => {
  //     const updated = [...newHeaders3];
  //     const row = updated[headerIndex].rows[rowIndex];
  //     row[key] = value;

  //     const quantity = parseFloat(row.quantity);
  //     const unitPrice = parseFloat(row.unitPrice);
  //     row.amount =
  //       !isNaN(quantity) && !isNaN(unitPrice)
  //         ? (quantity * unitPrice).toFixed(2)
  //         : "";

  //     setNewHeaders3(updated);
  //   };
  const updateNewHeaderRow3 = (
    headerIndex: number,
    subIndex: number,
    rowIndex: number,
    key: keyof DeviceRow,
    value: string
  ) => {
    const updated = [...newHeaders3];
    const row = updated[headerIndex].rows[subIndex].rows[rowIndex];

    row[key] = value;

    const quantity = parseFloat(row.quantity || "0");
    const unitPrice = parseFloat(row.unitPrice || "0");

    row.amount =
      !isNaN(quantity) && !isNaN(unitPrice)
        ? (quantity * unitPrice).toFixed(2)
        : "";

    setNewHeaders3(updated);
  };
  //   const addRowToNewHeader3 = (headerIndex: number) => {
  //     const updated = [...newHeaders3];
  //     updated[headerIndex].rows.push({
  //       item: "",
  //       description: "",
  //       quantity: "",
  //       unitPrice: "",
  //       amount: "",
  //     });
  //     setNewHeaders3(updated);
  //   };
  const addRowToNewHeader3 = (headerIndex, subIndex) => {
    const updatedHeaders3 = [...newHeaders3];
    updatedHeaders3[headerIndex].rows[subIndex].rows.push({
      item: "",
      ratio: "",
      unit: "",
      quantity: "",
      manpower: "",
      no_of_days: "",
      labor_cost: "",
      per_unit_cost: "",
    });
    setNewHeaders3(updatedHeaders3);
  };

  //   const removeRowFromNewHeader3 = (headerIndex: number, rowIndex: number) => {
  //     const updated = [...newHeaders3];
  //     updated[headerIndex].rows.splice(rowIndex, 1);
  //     setNewHeaders3(updated);
  //   };
  const removeRowFromNewHeader3 = (headerIndex, subIndex, rowIndex) => {
    const updatedHeaders3 = [...newHeaders3];
    updatedHeaders3[headerIndex].rows[subIndex].rows.splice(rowIndex, 1);
    setNewHeaders3(updatedHeaders3);
  };
  const saveNewHeader3 = (index: number) => {
    const headerToSave = newHeaders3[index];
    if (!headerToSave.title.trim()) return;
    setHeaders3([...headers3, headerToSave]);
    const updated = [...newHeaders3];
    updated.splice(index, 1);
    setNewHeaders3(updated);
  };

  const cancelNewHeader3 = (index: number) => {
    const updated = [...newHeaders3];
    updated.splice(index, 1);
    setNewHeaders3(updated);
  };
  const getNewHeaderSubtotal3 = (rows: DeviceRow[]) => {
    return rows.reduce((sum, row) => {
      const amount = parseFloat(row.amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  };

  const getTotalAmountIncludingNew3 = () => {
    const savedTotal = headers3.reduce((sum, header) => {
      return sum + getHeaderSubtotal(header.rows);
    }, 0);

    const newHeadersTotal = newHeaders3.reduce((sum, newHeader) => {
      return sum + getNewHeaderSubtotal3(newHeader.rows);
    }, 0);

    return savedTotal + newHeadersTotal;
  };
  const removeDeviceRow3 = (index: number) => {
    const updated = [...deviceRows3];
    updated.splice(index, 1);
    setDeviceRows3(updated);
  };
  useEffect(() => {
    if (LaborData?.labor_header) {
      const headersFromLabor = LaborData.labor_header.map((header) => ({
        title: header.header || "Labor Header",
        rows: Array.isArray(header.items)
          ? header.items.map((item) => ({
              item: item.item,
              description: item.description || "",
              quantity: item.quantity?.toString() || "0",
              unit_of_measurement: item.unit_of_measurement || "",
              amount: item.total_amount?.toString() || "0",
            }))
          : [],
      }));

      setNewHeaders3(headersFromLabor);
    }
  }, [LaborData]);

  useEffect(() => {
    if (LaborData?.labor_items) {
      const laborItemsFormatted: DeviceRow[] = LaborData.labor_items.map(
        (labor) => ({
          item: labor.item || "",
          description: labor.description || "",
          quantity: labor.quantity?.toString() || "0",
          unit_of_measurement: labor.unit_of_measurement || "",
          amount: labor.total_amount?.toString() || "0",
        })
      );

      setDeviceRows3(laborItemsFormatted);
    }
  }, [LaborData]);

  const updateDeviceRow3 = (
    rowIndex: number,
    key: keyof DeviceRow,
    value: string | number
  ) => {
    setDeviceRows3((prevRows) => {
      const updated = [...prevRows];
      updated[rowIndex] = {
        ...updated[rowIndex],
        [key]: value,
      };
      return updated;
    });
  };

  const [deviceRows4, setDeviceRows4] = useState<DeviceRow[]>([]);

  const [newHeaders4, setNewHeaders4] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);
  const [headers4, setHeaders4] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);

  useEffect(() => {
    if (LaborData?.configurations && Array.isArray(LaborData.configurations)) {
      const allHeaders = LaborData.configurations.flatMap((section) => {
        const headerObject = {
          header: section.header || "",
          rows: [],
        };

        if (
          Array.isArray(section.sub_headers) &&
          section.sub_headers.length > 0
        ) {
          section.sub_headers.forEach((sub) => {
            const subHeaderObject = {
              title: sub.sub_header || "",
              manuallyAdded: false, // fetched = not manually added
              rows: sub.items.map((item) => ({
                item: item.item || "",
                ratio: item.ratio || "",
                unit: item.unit || "",
                quantity: item.quantity?.toString() || "",
                manpower: item.manpower?.toString() || "",
                no_of_days: item.no_of_days?.toString() || "",
                labor_cost: item.labor_cost?.toString() || "",
                per_unit_cost: item.per_unit_cost?.toString() || "",
              })),
            };
            headerObject.rows.push(subHeaderObject);
          });
        }

        // Fallback: Items without sub-headers
        if (section.items && section.items.length > 0) {
          headerObject.rows.push({
            title: "", // no title
            manuallyAdded: false,
            rows: section.items.map((item) => ({
              item: item.item || "",
              ratio: item.ratio || "",
              unit: item.unit || "",
              quantity: item.quantity?.toString() || "",
              manpower: item.manpower?.toString() || "",
              no_of_days: item.no_of_days?.toString() || "",
              labor_cost: item.labor_cost?.toString() || "",
              per_unit_cost: item.per_unit_cost?.toString() || "",
            })),
          });
        }

        return headerObject;
      });

      setNewHeaders4(allHeaders); // <- update your newHeaders2 state
    }
  }, [LaborData]);

  const updateDeviceRow4 = (
    rowIndex: number,
    key: keyof DeviceRow,
    value: string | number
  ) => {
    setDeviceRows4((prevRows) => {
      const updated = [...prevRows];
      updated[rowIndex] = {
        ...updated[rowIndex],
        [key]: value,
      };
      return updated;
    });
  };
  const addHeader4 = () => {
    setNewHeaders4([
      ...newHeaders4,
      {
        title: "",
        rows: [
          {
            item: "",
            description: "",
            quantity: "",
            unit_of_measurement: "",
            amount: "",
          },
        ],
      },
    ]);
  };

  const updateNewHeaderTitle4 = (index: number, value: string) => {
    const updated = [...newHeaders4];
    updated[index].title = value;
    setNewHeaders4(updated);
  };

  //   const updateNewHeaderRow4 = (
  //     headerIndex: number,
  //     rowIndex: number,
  //     key: keyof DeviceRow,
  //     value: string
  //   ) => {
  //     const updated = [...newHeaders4];
  //     const row = updated[headerIndex].rows[rowIndex];
  //     row[key] = value;

  //     const quantity = parseFloat(row.quantity);
  //     const unitPrice = parseFloat(row.unit_of_measurement);
  //     row.amount =
  //       !isNaN(quantity) && !isNaN(unitPrice)
  //         ? (quantity * unitPrice).toFixed(2)
  //         : "";

  //     setNewHeaders4(updated);
  //   };
  const updateNewHeaderRow4 = (
    headerIndex: number,
    subIndex: number,
    rowIndex: number,
    key: keyof DeviceRow,
    value: string
  ) => {
    const updated = [...newHeaders4];
    const row = updated[headerIndex].rows[subIndex].rows[rowIndex];

    row[key] = value;

    const quantity = parseFloat(row.quantity || "0");
    const unitPrice = parseFloat(row.unitPrice || "0");

    row.amount =
      !isNaN(quantity) && !isNaN(unitPrice)
        ? (quantity * unitPrice).toFixed(2)
        : "";

    setNewHeaders4(updated);
  };
  //   const addRowToNewHeader4 = (headerIndex: number) => {
  //     const updated = [...newHeaders4];
  //     updated[headerIndex].rows.push({
  //       item: "",
  //       description: "",
  //       quantity: "",
  //       unit_of_measurement: "",
  //       amount: "",
  //     });
  //     setNewHeaders4(updated);
  //   };
  const addRowToNewHeader4 = (headerIndex, subIndex) => {
    const updatedHeaders4 = [...newHeaders4];
    updatedHeaders4[headerIndex].rows[subIndex].rows.push({
      item: "",
      ratio: "",
      unit: "",
      quantity: "",
      manpower: "",
      no_of_days: "",
      labor_cost: "",
      per_unit_cost: "",
    });
    setNewHeaders4(updatedHeaders4);
  };

  //   const removeRowFromNewHeader4 = (headerIndex: number, rowIndex: number) => {
  //     const updated = [...newHeaders4];
  //     updated[headerIndex].rows.splice(rowIndex, 1);
  //     setNewHeaders4(updated);
  //   };
  const removeRowFromNewHeader4 = (headerIndex, subIndex, rowIndex) => {
    const updatedHeaders4 = [...newHeaders4];
    updatedHeaders4[headerIndex].rows[subIndex].rows.splice(rowIndex, 1);
    setNewHeaders4(updatedHeaders4);
  };
  const saveNewHeader4 = (index: number) => {
    const headerToSave = newHeaders4[index];
    if (!headerToSave.title.trim()) return;
    setHeaders4([...headers4, headerToSave]);
    const updated = [...newHeaders4];
    updated.splice(index, 1);
    setNewHeaders4(updated);
  };

  const cancelNewHeader4 = (index: number) => {
    const updated = [...newHeaders4];
    updated.splice(index, 1);
    setNewHeaders4(updated);
  };
  const getNewHeaderSubtotal4 = (rows: DeviceRow[]) => {
    return rows.reduce((sum, row) => {
      const amount = parseFloat(row.amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  };

  const getTotalAmountIncludingNew4 = () => {
    const savedTotal = headers4.reduce((sum, header) => {
      return sum + getHeaderSubtotal(header.rows);
    }, 0);

    const newHeadersTotal = newHeaders4.reduce((sum, newHeader) => {
      return sum + getNewHeaderSubtotal4(newHeader.rows);
    }, 0);

    return savedTotal + newHeadersTotal;
  };
  const removeDeviceRow4 = (index: number) => {
    const updated = [...deviceRows4];
    updated.splice(index, 1);
    setDeviceRows4(updated);
  };
  //   useEffect(() => {
  //     if (LaborData?.general_header) {
  //       const headersFromGeneral = LaborData.general_header.map((header) => ({
  //         title: header.item || "General Header",
  //         rows: [
  //           {
  //             item: header.item || "",
  //             description: header.description || "",
  //             unit_of_measurement: header.unit_of_measurement || "",
  //             quantity: header.quantity || 0,
  //             srp: header.srp || 0,
  //             amount: header.header_sub_total?.toString() || "0",
  //           },
  //         ],
  //       }));

  //       setNewHeaders4(headersFromGeneral);
  //     }
  //   }, [LaborData]);
  // useEffect(() => {
  //   if (LaborData?.labor_items) {
  //     const laborItemsFormatted: DeviceRow[] = LaborData.labor_items.map(
  //       (labor) => ({
  //         item: labor.item || "",
  //         description: labor.description || "",
  //         quantity: labor.quantity?.toString() || "0",
  //         unit_of_measurement: labor.unit_of_measurement || "",
  //         amount: labor.total_amount?.toString() || "0",
  //       })
  //     );

  //     setDeviceRows3(laborItemsFormatted);
  //   }
  // }, [LaborData]);
  //   useEffect(() => {
  //     if (LaborData?.general_header) {
  //       // Flatten the general_header data to populate deviceRows4
  //       const rowsFromGeneral = LaborData.general_header.flatMap((header) =>
  //         header.items.map((item) => ({
  //           item: item.item || "",
  //           description: item.description || "",
  //           quantity: item.quantity?.toString() || "", // Ensure this is a string for input
  //           unit_of_measurement: item.unit_of_measurement || "",
  //           amount: (item.quantity * item.srp).toFixed(2),
  //         }))
  //       );

  //       // Update deviceRows4 with the extracted rows
  //       setDeviceRows4(rowsFromGeneral);
  //     }
  //   }, [LaborData]);
  //   useEffect(() => {
  //     if (LaborData?.general_header) {
  //       setDeviceRows4((prevRows) => {
  //         const rowsFromGeneral = LaborData.general_header.flatMap(
  //           (header, hIndex) =>
  //             header.items.map((item, iIndex) => {
  //               const existing = prevRows.find(
  //                 (row) =>
  //                   row.item === item.item &&
  //                   row.description === item.description &&
  //                   row.quantity === item.quantity?.toString()
  //               );

  //               return {
  //                 item: item.item || "",
  //                 description: item.description || "",
  //                 quantity: item.quantity?.toString() || "",
  //                 unit_of_measurement: item.unit_of_measurement || "",
  //                 amount: (item.quantity * item.srp).toFixed(2),
  //                 subrows: existing?.subrows || [], // 🛠 Preserve existing subrows
  //               };
  //             })
  //         );

  //         return rowsFromGeneral;
  //       });
  //     }
  //   }, [LaborData]);
  useEffect(() => {
    if (LaborData?.general_header) {
      const rowsFromGeneral = LaborData.general_header.map((header) => {
        return {
          item: header.item || "",
          description: header.description || "",
          quantity: header.quantity?.toString() || "",
          unit_of_measurement: header.unit_of_measurement || "",
          amount: ((header.quantity || 0) * (header.srp || 0)).toFixed(2),
          srp: header.srp?.toString() || "0",
          subrows:
            header.items?.map((item) => ({
              item: item.item || "",
              description: item.description || "",
              quantity: item.quantity?.toString() || "",
              unit_of_measurement: item.unit_of_measurement || "",
              amount: ((item.quantity || 0) * (item.srp || 0)).toFixed(2),
            })) || [],
        };
      });

      setDeviceRows4(rowsFromGeneral);
    }
  }, [LaborData]);

  //   useEffect(() => {
  //     if (LaborData?.general_header) {
  //       const generalRowsFormatted: DeviceRow[] = LaborData.general_header.map(
  //         (general) => ({
  //           item: general.item || "",
  //           description: general.description || "",
  //           quantity: general.quantity?.toString() || "0",
  //           unitPrice: general.description?.toString() || "0",
  //           amount:
  //             (parseFloat(general.quantity) * parseFloat(general.srp)).toFixed(
  //               2
  //             ) || "0",
  //         })
  //       );

  //       setDeviceRows4(generalRowsFormatted);
  //     }
  //   }, [LaborData]);

  const addSubRow4 = (rowIndex: number) => {
    const updatedRows = [...deviceRows4];
    const currentRow = updatedRows[rowIndex];

    const newSubRow = {
      item: "",
      description: "",
      quantity: "",
      unit_of_measurement: "",
      amount: "",
    };

    if (!currentRow.subrows) {
      currentRow.subrows = [];
    }

    currentRow.subrows.push(newSubRow);
    setDeviceRows4(updatedRows);
  };

  const updateSubRow4 = (
    rowIndex: number,
    subRowIndex: number,
    key: keyof SubRow,
    value: string
  ) => {
    setDeviceRows4((prevRows) => {
      const updatedRows = [...prevRows];
      const subrow = updatedRows[rowIndex].subrows?.[subRowIndex];
      if (subrow) {
        subrow[key] = value;

        // Update amount if quantity or unit price changed
        const quantity = parseFloat(subrow.quantity || "0");
        const unitPrice = parseFloat(subrow.unit_of_measurement || "0");
        subrow.amount = (quantity * unitPrice).toFixed(2);
      }
      return updatedRows;
    });
  };

  //   const removeSubRow4 = (rowIndex: number, subRowIndex: number) => {
  //     setDeviceRows4((prevRows) => {
  //       const updatedRows = [...prevRows];
  //       updatedRows[rowIndex].subrows?.splice(subRowIndex, 1);
  //       return updatedRows;
  //     });
  //   };
  const removeSubRow4 = (rowIndex: number, subRowIndex: number) => {
    setDeviceRows4((prevRows) => {
      const updatedRows = [...prevRows];

      // Clone the subrows safely
      const currentSubRows = updatedRows[rowIndex].subrows || [];

      // Filter out the subrow at the specified index
      const newSubRows = currentSubRows.filter((_, i) => i !== subRowIndex);

      // Assign the filtered subrows back
      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        subrows: newSubRows,
      };

      return updatedRows;
    });
  };

  // 5

  const [deviceRows5, setDeviceRows5] = useState<DeviceRow[]>([]);

  const [newHeaders5, setNewHeaders5] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);
  const [headers5, setHeaders5] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);

  useEffect(() => {
    if (
      LaborData?.testing_and_commissionings &&
      Array.isArray(LaborData.testing_and_commissionings)
    ) {
      const allHeaders = LaborData.testing_and_commissionings.flatMap(
        (section) => {
          const headerObject = {
            header: section.header || "",
            rows: [],
          };

          if (
            Array.isArray(section.sub_headers) &&
            section.sub_headers.length > 0
          ) {
            section.sub_headers.forEach((sub) => {
              const subHeaderObject = {
                title: sub.sub_header || "",
                manuallyAdded: false, // fetched = not manually added
                rows: sub.items.map((item) => ({
                  item: item.item || "",
                  ratio: item.ratio || "",
                  unit: item.unit || "",
                  quantity: item.quantity?.toString() || "",
                  manpower: item.manpower?.toString() || "",
                  no_of_days: item.no_of_days?.toString() || "",
                  labor_cost: item.labor_cost?.toString() || "",
                  per_unit_cost: item.per_unit_cost?.toString() || "",
                })),
              };
              headerObject.rows.push(subHeaderObject);
            });
          }

          // Fallback: Items without sub-headers
          if (section.items && section.items.length > 0) {
            headerObject.rows.push({
              title: "", // no title
              manuallyAdded: false,
              rows: section.items.map((item) => ({
                item: item.item || "",
                ratio: item.ratio || "",
                unit: item.unit || "",
                quantity: item.quantity?.toString() || "",
                manpower: item.manpower?.toString() || "",
                no_of_days: item.no_of_days?.toString() || "",
                labor_cost: item.labor_cost?.toString() || "",
                per_unit_cost: item.per_unit_cost?.toString() || "",
              })),
            });
          }

          return headerObject;
        }
      );

      setNewHeaders5(allHeaders); // <- update your newHeaders2 state
    }
  }, [LaborData]);

  const updateDeviceRow5 = (
    rowIndex: number,
    key: keyof DeviceRow,
    value: string | number
  ) => {
    setDeviceRows5((prevRows) => {
      const updated = [...prevRows];
      updated[rowIndex] = {
        ...updated[rowIndex],
        [key]: value,
      };
      return updated;
    });
  };
  const addHeader5 = () => {
    setNewHeaders5([
      ...newHeaders5,
      {
        title: "",
        rows: [
          {
            item: "",
            description: "",
            quantity: "",
            unit_of_measurement: "",
            amount: "",
          },
        ],
      },
    ]);
  };

  const updateNewHeaderTitle5 = (index: number, value: string) => {
    const updated = [...newHeaders4];
    updated[index].title = value;
    setNewHeaders4(updated);
  };

  //   const updateNewHeaderRow5 = (
  //     headerIndex: number,
  //     rowIndex: number,
  //     key: keyof DeviceRow,
  //     value: string
  //   ) => {
  //     const updated = [...newHeaders4];
  //     const row = updated[headerIndex].rows[rowIndex];
  //     row[key] = value;

  //     const quantity = parseFloat(row.quantity);
  //     const unitPrice = parseFloat(row.unit_of_measurement);
  //     row.amount =
  //       !isNaN(quantity) && !isNaN(unitPrice)
  //         ? (quantity * unitPrice).toFixed(2)
  //         : "";

  //     setNewHeaders4(updated);
  //   };
  const updateNewHeaderRow5 = (
    headerIndex: number,
    subIndex: number,
    rowIndex: number,
    key: keyof DeviceRow,
    value: string
  ) => {
    const updated = [...newHeaders5];
    const row = updated[headerIndex].rows[subIndex].rows[rowIndex];

    row[key] = value;

    const quantity = parseFloat(row.quantity || "0");
    const unitPrice = parseFloat(row.unitPrice || "0");

    row.amount =
      !isNaN(quantity) && !isNaN(unitPrice)
        ? (quantity * unitPrice).toFixed(2)
        : "";

    setNewHeaders5(updated);
  };
  //   const addRowToNewHeader5 = (headerIndex: number) => {
  //     const updated = [...newHeaders4];
  //     updated[headerIndex].rows.push({
  //       item: "",
  //       description: "",
  //       quantity: "",
  //       unit_of_measurement: "",
  //       amount: "",
  //     });
  //     setNewHeaders4(updated);
  //   };
  const addRowToNewHeader5 = (headerIndex, subIndex) => {
    const updatedHeaders5 = [...newHeaders5];
    updatedHeaders5[headerIndex].rows[subIndex].rows.push({
      item: "",
      ratio: "",
      unit: "",
      quantity: "",
      manpower: "",
      no_of_days: "",
      labor_cost: "",
      per_unit_cost: "",
    });
    setNewHeaders5(updatedHeaders5);
  };

  //   const removeRowFromNewHeader5 = (headerIndex: number, rowIndex: number) => {
  //     const updated = [...newHeaders4];
  //     updated[headerIndex].rows.splice(rowIndex, 1);
  //     setNewHeaders4(updated);
  //   };
  const removeRowFromNewHeader5 = (headerIndex, subIndex, rowIndex) => {
    const updatedHeaders5 = [...newHeaders5];
    updatedHeaders5[headerIndex].rows[subIndex].rows.splice(rowIndex, 1);
    setNewHeaders(updatedHeaders5);
  };

  const saveNewHeader5 = (index: number) => {
    const headerToSave = newHeaders4[index];
    if (!headerToSave.title.trim()) return;
    setHeaders4([...headers4, headerToSave]);
    const updated = [...newHeaders4];
    updated.splice(index, 1);
    setNewHeaders4(updated);
  };

  const cancelNewHeader5 = (index: number) => {
    const updated = [...newHeaders4];
    updated.splice(index, 1);
    setNewHeaders4(updated);
  };
  const getNewHeaderSubtotal5 = (rows: DeviceRow[]) => {
    return rows.reduce((sum, row) => {
      const amount = parseFloat(row.amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  };

  const getTotalAmountIncludingNew5 = () => {
    const savedTotal = headers4.reduce((sum, header) => {
      return sum + getHeaderSubtotal(header.rows);
    }, 0);

    const newHeadersTotal = newHeaders4.reduce((sum, newHeader) => {
      return sum + getNewHeaderSubtotal5(newHeader.rows);
    }, 0);

    return savedTotal + newHeadersTotal;
  };
  const removeDeviceRow5 = (index: number) => {
    const updated = [...deviceRows4];
    updated.splice(index, 1);
    setDeviceRows4(updated);
  };
  //   useEffect(() => {
  //     if (LaborData?.general_header) {
  //       const headersFromGeneral = LaborData.general_header.map((header) => ({
  //         title: header.item || "General Header",
  //         rows: [
  //           {
  //             item: header.item || "",
  //             description: header.description || "",
  //             unit_of_measurement: header.unit_of_measurement || "",
  //             quantity: header.quantity || 0,
  //             srp: header.srp || 0,
  //             amount: header.header_sub_total?.toString() || "0",
  //           },
  //         ],
  //       }));

  //       setNewHeaders4(headersFromGeneral);
  //     }
  //   }, [LaborData]);
  // useEffect(() => {
  //   if (LaborData?.labor_items) {
  //     const laborItemsFormatted: DeviceRow[] = LaborData.labor_items.map(
  //       (labor) => ({
  //         item: labor.item || "",
  //         description: labor.description || "",
  //         quantity: labor.quantity?.toString() || "0",
  //         unit_of_measurement: labor.unit_of_measurement || "",
  //         amount: labor.total_amount?.toString() || "0",
  //       })
  //     );

  //     setDeviceRows3(laborItemsFormatted);
  //   }
  // }, [LaborData]);
  //   useEffect(() => {
  //     if (LaborData?.general_header) {
  //       // Flatten the general_header data to populate deviceRows4
  //       const rowsFromGeneral = LaborData.general_header.flatMap((header) =>
  //         header.items.map((item) => ({
  //           item: item.item || "",
  //           description: item.description || "",
  //           quantity: item.quantity?.toString() || "", // Ensure this is a string for input
  //           unit_of_measurement: item.unit_of_measurement || "",
  //           amount: (item.quantity * item.srp).toFixed(2),
  //         }))
  //       );

  //       // Update deviceRows4 with the extracted rows
  //       setDeviceRows4(rowsFromGeneral);
  //     }
  //   }, [LaborData]);
  //   useEffect(() => {
  //     if (LaborData?.general_header) {
  //       setDeviceRows4((prevRows) => {
  //         const rowsFromGeneral = LaborData.general_header.flatMap(
  //           (header, hIndex) =>
  //             header.items.map((item, iIndex) => {
  //               const existing = prevRows.find(
  //                 (row) =>
  //                   row.item === item.item &&
  //                   row.description === item.description &&
  //                   row.quantity === item.quantity?.toString()
  //               );

  //               return {
  //                 item: item.item || "",
  //                 description: item.description || "",
  //                 quantity: item.quantity?.toString() || "",
  //                 unit_of_measurement: item.unit_of_measurement || "",
  //                 amount: (item.quantity * item.srp).toFixed(2),
  //                 subrows: existing?.subrows || [], // 🛠 Preserve existing subrows
  //               };
  //             })
  //         );

  //         return rowsFromGeneral;
  //       });
  //     }
  //   }, [LaborData]);
  useEffect(() => {
    if (LaborData?.general_header) {
      const rowsFromGeneral = LaborData.general_header.map((header) => {
        return {
          item: header.item || "",
          description: header.description || "",
          quantity: header.quantity?.toString() || "",
          unit_of_measurement: header.unit_of_measurement || "",
          amount: ((header.quantity || 0) * (header.srp || 0)).toFixed(2),
          srp: header.srp?.toString() || "0",
          subrows:
            header.items?.map((item) => ({
              item: item.item || "",
              description: item.description || "",
              quantity: item.quantity?.toString() || "",
              unit_of_measurement: item.unit_of_measurement || "",
              amount: ((item.quantity || 0) * (item.srp || 0)).toFixed(2),
            })) || [],
        };
      });

      setDeviceRows5(rowsFromGeneral);
    }
  }, [LaborData]);

  //   useEffect(() => {
  //     if (LaborData?.general_header) {
  //       const generalRowsFormatted: DeviceRow[] = LaborData.general_header.map(
  //         (general) => ({
  //           item: general.item || "",
  //           description: general.description || "",
  //           quantity: general.quantity?.toString() || "0",
  //           unitPrice: general.description?.toString() || "0",
  //           amount:
  //             (parseFloat(general.quantity) * parseFloat(general.srp)).toFixed(
  //               2
  //             ) || "0",
  //         })
  //       );

  //       setDeviceRows4(generalRowsFormatted);
  //     }
  //   }, [LaborData]);

  const addSubRow5 = (rowIndex: number) => {
    const updatedRows = [...deviceRows4];
    const currentRow = updatedRows[rowIndex];

    const newSubRow = {
      item: "",
      description: "",
      quantity: "",
      unit_of_measurement: "",
      amount: "",
    };

    if (!currentRow.subrows) {
      currentRow.subrows = [];
    }

    currentRow.subrows.push(newSubRow);
    setDeviceRows4(updatedRows);
  };

  const updateSubRow5 = (
    rowIndex: number,
    subRowIndex: number,
    key: keyof SubRow,
    value: string
  ) => {
    setDeviceRows5((prevRows) => {
      const updatedRows = [...prevRows];
      const subrow = updatedRows[rowIndex].subrows?.[subRowIndex];
      if (subrow) {
        subrow[key] = value;

        // Update amount if quantity or unit price changed
        const quantity = parseFloat(subrow.quantity || "0");
        const unitPrice = parseFloat(subrow.unit_of_measurement || "0");
        subrow.amount = (quantity * unitPrice).toFixed(2);
      }
      return updatedRows;
    });
  };

  //   const removeSubRow4 = (rowIndex: number, subRowIndex: number) => {
  //     setDeviceRows4((prevRows) => {
  //       const updatedRows = [...prevRows];
  //       updatedRows[rowIndex].subrows?.splice(subRowIndex, 1);
  //       return updatedRows;
  //     });
  //   };
  const removeSubRow5 = (rowIndex: number, subRowIndex: number) => {
    setDeviceRows5((prevRows) => {
      const updatedRows = [...prevRows];

      // Clone the subrows safely
      const currentSubRows = updatedRows[rowIndex].subrows || [];

      // Filter out the subrow at the specified index
      const newSubRows = currentSubRows.filter((_, i) => i !== subRowIndex);

      // Assign the filtered subrows back
      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        subrows: newSubRows,
      };

      return updatedRows;
    });
  };

  if (Rloading) {
    return (
      <div className="flex justify-center items-center space-x-2">
        {/* Spinner */}
        <div className="w-6 h-6 border-4 border-dashed border-gray-400 border-t-transparent rounded-full animate-spin dark:border-gray-200 dark:border-t-transparent"></div>

        <span className="text-sm text-gray-700 dark:text-gray-300">
          Loading...
        </span>
      </div>
    );
  }

  if (ReceiptError) {
    return <div>Error: {rerror?.message}</div>;
  }
  return (
    <div>
      <button
        className="uppercase flex items-center gap-1 bg-white px-3 py-1.5 text-xs text-blue-800 border border-blue-800 rounded-md shadow"
        onClick={() => setShowEditModal(true)}
      >
        {/* <FaEye /> */}
        View
      </button>

      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 mt-17 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={() => setShowEditModal(false)}
          />
          <div
            className="relative z-10 bg-white p-8 rounded-lg shadow-xl w-full max-w-5xl overflow-y-auto max-h-[90vh] dark:bg-gray-dark"
            onClick={(e) => e.stopPropagation()} // Prevent modal click from closing
          >
            {/* <h2 className="text-2xl font-semibold mb-1 text-center">
              Edit BOM
            </h2> */}
            {/* Form Inputs */}
            {/* <div className="grid grid-cols-2 gap-6 mb-6">
              {Object.keys(formData).map((key, index) => (
                <div key={index} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    {`Input ${index + 1}`}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={formData[key as keyof typeof formData]}
                    onChange={handleInputChange}
                    className="input input-bordered w-full p-3 rounded-md border border-gray-300"
                    placeholder={`Input ${index + 1}`}
                  />
                </div>
              ))}
            </div> */}
            <Formik
              initialValues={{
                input1: LaborData?.project_name || "",
                input4:
                  BomData?.find(
                    (bom) => bom.bom_no === LaborData?.bom
                  )?.id?.toString() || "",
                input7: LaborData?.system || "",
                input8: LaborData?.project_duration || "",
              }}
              enableReinitialize={true}
              onSubmit={(values) => {
                const processHeaders = (headersArray) =>
                  headersArray
                    .filter((header) => header.rows?.length > 0)
                    .map((header, headerIndex) => ({
                      header: header.title || `Header ${headerIndex + 1}`,
                      items: header.rows
                        .filter(
                          (item) =>
                            !item.rows &&
                            Object.values(item).some(
                              (val) =>
                                val !== null &&
                                val !== undefined &&
                                val.toString().trim() !== ""
                            )
                        )
                        .map((item, itemIndex) => ({
                          item: item.item,
                          ratio: item.ratio,
                          unit: item.unit,
                          quantity: Number(item.quantity) || 0,
                          manpower: Number(item.manpower) || 0,
                          labor_cost: Number(item.labor_cost) || 0,
                          order: Number(item.order) || 0,
                        })),
                      sub_headers: header.rows
                        .filter((sub) => sub.rows?.length > 0)
                        .map((sub, subIndex) => ({
                          sub_header: sub.title || `Sub Header ${subIndex + 1}`,
                          items: sub.rows
                            .filter((item) =>
                              Object.values(item).some(
                                (val) =>
                                  val !== null &&
                                  val !== undefined &&
                                  val.toString().trim() !== ""
                              )
                            )
                            .map((item, itemIndex) => ({
                              item: item.item,
                              ratio: item.ratio,
                              unit: item.unit,
                              quantity: Number(item.quantity) || 0,
                              manpower: Number(item.manpower) || 0,
                              labor_cost: Number(item.labor_cost) || 0,
                              order: Number(item.order) || 0,
                            })),
                        })),
                    }));

                const formData = {
                  project_name: values.input1,
                  bom: values.input4,
                  system: values.input7,
                  project_duration: values.input8,
                  roughing_ins: [
                    ...processHeaders(newHeaders),
                    ...processHeaders(newHeaders2),
                    ...processHeaders(newHeaders3),
                    ...processHeaders(newHeaders4),
                    ...processHeaders(newHeaders5),
                  ],
                };

                console.log("Submitting:", formData);
                updatedLabor(formData);
              }}
            >
              {({ values, handleChange }) => (
                <Form>
                  {/* <div className="grid grid-cols-2 gap-3 mb-2 text-start"> */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1 mb-1 text-start">
                    {Object.keys(values).map((key, index) => (
                      <div key={index} className="flex flex-col">
                        <label className="text-sm font-bold  mb-2 uppercase ">
                          {(() => {
                            switch (key) {
                              case "input1":
                                return "Project name";
                              case "input4":
                                return "BOM";
                              case "input7":
                                return "system";
                              case "input8":
                                return "Project duration";

                              default:
                                return `Input ${index + 1}`;
                            }
                          })()}
                        </label>

                        {key === "input3" ? (
                          // 👤 SIC Dropdown
                          <select
                            name={key}
                            value={values[key]}
                            onChange={handleChange}
                            className="input input-bordered w-full p-3 rounded-md border border-gray-300"
                          >
                            <option value="">Select SIC</option>
                            {udata?.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.full_name}
                              </option>
                            ))}
                          </select>
                        ) : key === "input4" ? (
                          // 👥 Client Dropdown
                          <select
                            name={key}
                            value={values[key]}
                            onChange={handleChange}
                            className="dark:bg-gray-dark input input-bordered w-full  rounded-md border border-gray-300"
                          >
                            <option value="">Select BOM</option>
                            {BomData?.map((client) => (
                              <option key={client.id} value={client.id}>
                                {client.bom_no}
                              </option>
                            ))}
                          </select>
                        ) : key === "input5" ? (
                          // 🔄 Status Dropdown
                          <select
                            name={key}
                            value={values[key]}
                            onChange={handleChange}
                            className="input input-bordered w-full p-3 rounded-md border border-gray-300"
                          >
                            <option value="">Select Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Revise">Revise</option>
                            <option value="Noted">Noted</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        ) : key === "input6" ? (
                          // 🧑‍💼 EIC Dropdown
                          <select
                            name={key}
                            value={values[key]}
                            onChange={handleChange}
                            className="input input-bordered w-full p-3 rounded-md border border-gray-300"
                          >
                            <option value="">Select EIC</option>
                            {udata?.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.full_name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          // 📝 Default Text Input (including input9 for first_header)
                          <Field
                            type="text"
                            name={key}
                            value={values[key]}
                            onChange={handleChange}
                            className="dark:bg-gray-dark input input-bordered w-full p-3 rounded-md border border-gray-300"
                            placeholder={
                              key === "input9"
                                ? "Enter First Header"
                                : `Input ${index + 1}`
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  {/* <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md"
                  >
                    Save
                  </button> */}
                  {/* Navigation */}
                  <div className="flex justify-between gap-2 mb-1">
                    {[
                      "roughing-ins",
                      "wiring-ins",
                      "device installation",
                      "configuration",
                      "Testing & commissioning",
                      // "Save",
                    ].map((label, index) => (
                      <button
                        type="button"
                        key={label}
                        onClick={() => setActiveNav(index + 1)}
                        className={`flex-1 py-2 rounded-md uppercase font-medium transition-all ${
                          activeNav === index + 1
                            ? "bg-blue-500 text-white shadow-md"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div>
                    {/* Devices Section */}
                    {/* {activeNav ===  && <EditLabor id={labor.id} />} */}
                    {activeNav === 1 && <ActiveNav1 id={id} />}
                    {activeNav === 2 && <ActiveNav2 id={id} />}

                    {activeNav === 3 && <ActiveNav3 id={id} />}
                    {/* Unit Price{" "} */}
                    {activeNav === 4 && <ActiveNav4 id={id} />}
                    {activeNav === 5 && <ActiveNav5 id={id} />}
                  </div>
                  {/* Footer Buttons */}
                  <div className="flex justify-end gap-4 mt-8">
                    <button
                      className="py-2 px-6 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="py-2 px-6 rounded-md text-white bg-blue-500 hover:bg-blue-600"
                      //   onClick={handleSave}
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditLabor;
