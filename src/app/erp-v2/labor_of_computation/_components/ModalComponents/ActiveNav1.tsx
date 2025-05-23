import { BomUser, fetchbomUser } from "@/api/bill_of_materials/fetchUsers";
import { Bom, fetchBomList } from "@/api/bom-quotation/fetchBom";
import { fetchlaborId } from "@/api/labor_of_computation/FetchLaborId";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
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
const ActiveNav1 = (props: BomIds) => {
  const [activeNav, setActiveNav] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deviceRows, setDeviceRows] = useState<DeviceRow[]>([]);
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
  return (
    <>
      {activeNav === 1 && (
        <>
          <div className="space-y-1">
            {/* <div className="flex justify-end gap-4">
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={addHeader}
              >
                Add Header
              </button>
            </div> */}

            {/* Device Table */}
            <table className="table-auto w-full text-sm text-left  border">
              <thead className="bg-gray-100 dark:bg-gray-dark uppercase">
                <tr>
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">ratio</th>
                  <th className="px-4 py-2">unit</th>
                  <th className="px-4 py-2">qty in manpower</th>
                  <th className="px-4 py-2">no of days</th>
                  <th className="px-4 py-2">labor cost total</th>
                  <th className="px-4 py-2">per unit cost</th>
                  <th className="px-4 py-2">action</th>
                </tr>
              </thead>
              <tbody>
                {deviceRows.map((row, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={row.item}
                        onChange={(e) =>
                          updateDeviceRow(index, "item", e.target.value)
                        }
                        className="w-full border p-1 rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) =>
                          updateDeviceRow(index, "description", e.target.value)
                        }
                        className="w-full border p-1 rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={row.quantity}
                        onChange={(e) => {
                          const updatedQuantity = parseFloat(e.target.value);
                          const updatedTotalAmount = updatedQuantity * row.srp; // Recalculate total_amount based on updated quantity
                          updateDeviceRow(index, "quantity", updatedQuantity);
                          updateDeviceRow(
                            index,
                            "total_amount",
                            updatedTotalAmount
                          ); // Update the total_amount field
                        }}
                        className="w-full border p-1 rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={row.unit_of_measurement}
                        onChange={(e) =>
                          updateDeviceRow(
                            index,
                            "unit_of_measurement",
                            e.target.value
                          )
                        }
                        className="w-full border p-1 rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={row.srp} // Fetch only the srp (unit price) value from your API data
                        onChange={(e) => {
                          const updatedSrp = parseFloat(e.target.value);
                          const updatedTotalAmount = row.quantity * updatedSrp; // Recalculate total_amount based on updated SRP
                          updateDeviceRow(index, "srp", updatedSrp);
                          updateDeviceRow(
                            index,
                            "total_amount",
                            updatedTotalAmount
                          ); // Update total_amount
                        }}
                        className="w-full border p-1 rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={row.total_amount} // Display total_amount as calculated
                        onChange={(e) => {
                          // If you want to allow reverse calculation, implement logic here
                          // Optionally: Recalculate quantity or srp based on the total amount
                        }}
                        readOnly // Optional: Make it readonly or editable depending on your requirements
                        className="w-full border p-1 rounded bg-gray-100 text-gray-700"
                      />
                    </td>

                    <td className="px-4 py-2">
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => removeDeviceRow(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* {newHeaders.map((header, headerIndex) => (
                                 <tr key={headerIndex}>
                                   <td colSpan={8}>
                                     <div className="border p-4 bg-gray-50 rounded space-y-4 mt-4">
                                       <input
                                         type="text"
                                         placeholder="Main Header Title"
                                         value={header.mainTitle}
                                         onChange={(e) =>
                                           updateNewMainHeaderTitle(
                                             headerIndex,
                                             e.target.value
                                           )
                                         }
                                         className="w-full p-2 border border-blue-300 rounded font-bold bg-white"
                                       />
       
                                       <input
                                         type="text"
                                         placeholder="Sub Header Title"
                                         value={header.title}
                                         onChange={(e) =>
                                           updateNewHeaderTitle(
                                             headerIndex,
                                             e.target.value
                                           )
                                         }
                                         className="w-full p-2 border rounded"
                                       />
       
                                       {header.rows.map((row, rowIndex) => (
                                         <div
                                           key={rowIndex}
                                           className="grid grid-cols-8 gap-2"
                                         >
                                           {[
                                             "item",
                                             "ratio",
                                             "unit",
                                             "quantity",
                                             "manpower",
                                             "no_of_days",
                                             "labor_cost",
                                             "per_unit_cost",
                                           ].map((field) => (
                                             <input
                                               key={field}
                                               type="text"
                                               placeholder={field}
                                               value={row[field as keyof RoughingRow]}
                                               onChange={(e) =>
                                                 updateNewHeaderRow(
                                                   headerIndex,
                                                   rowIndex,
                                                   field as keyof RoughingRow,
                                                   e.target.value
                                                 )
                                               }
                                               className="p-2 border rounded"
                                             />
                                           ))}
       
                                           <button
                                             className="bg-red-400 text-white px-2 py-1 rounded"
                                             onClick={() =>
                                               removeRowFromNewHeader(
                                                 headerIndex,
                                                 rowIndex
                                               )
                                             }
                                           >
                                             Remove
                                           </button>
                                         </div>
                                       ))}
       
                                       <div className="flex justify-between items-center">
                                         <button
                                           type="button"
                                           className="bg-green-500 text-white px-4 py-2 rounded"
                                           onClick={() =>
                                             addRowToNewHeader(headerIndex)
                                           }
                                         >
                                           Add Row
                                         </button>
       
                                         <div className="space-x-2 flex items-center">
                                           <button
                                             className="bg-blue-600 text-white px-4 py-2 rounded"
                                             onClick={() => saveNewHeader(headerIndex)}
                                           >
                                             Save Header
                                           </button>
                                           <button
                                             className="bg-gray-500 text-white px-4 py-2 rounded"
                                             onClick={() =>
                                               cancelNewHeader(headerIndex)
                                             }
                                           >
                                             Cancel
                                           </button>
                                         </div>
                                       </div>
                                     </div>
                                   </td>
                                 </tr>
                               ))} */}
            {/* {newHeaders.map((header, headerIndex) => (
                                 <tr key={headerIndex}>
                                   <td colSpan={8}>
                                     <div className="border p-4 bg-gray-50 rounded space-y-4 mt-4">
                                       {header.mainTitle && (
                                         <input
                                           type="text"
                                           placeholder="Main Header Title"
                                           value={header.mainTitle}
                                           onChange={(e) =>
                                             updateNewHeaderMainTitle(
                                               headerIndex,
                                               e.target.value
                                             )
                                           }
                                           className="w-full p-2 border rounded"
                                         />
                                       )}
       
                                       {header.title && (
                                         <input
                                           type="text"
                                           placeholder="Sub Header Title"
                                           value={header.title}
                                           onChange={(e) =>
                                             updateNewHeaderTitle(
                                               headerIndex,
                                               e.target.value
                                             )
                                           }
                                           className="w-full p-2 border rounded"
                                         />
                                       )}
       
                                       {header.rows.map((row, rowIndex) => (
                                         <div
                                           key={rowIndex}
                                           className="grid grid-cols-8 gap-2"
                                         >
                                           {[
                                             "item",
                                             "ratio",
                                             "unit",
                                             "quantity",
                                             "manpower",
                                             "no_of_days",
                                             "labor_cost",
                                             "per_unit_cost",
                                           ].map((field) => (
                                             <input
                                               key={field}
                                               type="text"
                                               placeholder={field}
                                               value={row[field as keyof RoughingRow]}
                                               onChange={(e) =>
                                                 updateNewHeaderRow(
                                                   headerIndex,
                                                   rowIndex,
                                                   field as keyof RoughingRow,
                                                   e.target.value
                                                 )
                                               }
                                               className="p-2 border rounded"
                                             />
                                           ))}
       
                                           <button
                                             className="bg-red-400 text-white px-2 py-1 rounded"
                                             onClick={() =>
                                               removeRowFromNewHeader(
                                                 headerIndex,
                                                 rowIndex
                                               )
                                             }
                                           >
                                             Remove
                                           </button>
                                         </div>
                                       ))}
       
                                       <div className="flex justify-between items-center">
                                         <button
                                           type="button"
                                           className="bg-green-500 text-white px-4 py-2 rounded"
                                           onClick={() =>
                                             addRowToNewHeader(headerIndex)
                                           }
                                         >
                                           Add Row
                                         </button>
       
                                         <div className="space-x-2 flex items-center">
                                           <button
                                             className="bg-blue-600 text-white px-4 py-2 rounded"
                                             onClick={() => saveNewHeader(headerIndex)}
                                           >
                                             Save Header
                                           </button>
                                           <button
                                             className="bg-gray-500 text-white px-4 py-2 rounded"
                                             onClick={() =>
                                               cancelNewHeader(headerIndex)
                                             }
                                           >
                                             Cancel
                                           </button>
                                         </div>
                                       </div>
                                     </div>
                                   </td>
                                 </tr>
                               ))} */}
            {/* {newHeaders.map((header, headerIndex) => (
                                 <tr key={headerIndex}>
                                   <td colSpan={8}>
                                     <div className="border p-4 bg-gray-50 rounded space-y-4 mt-4">
                                      
                                       <input
                                         type="text"
                                         placeholder="Main Header Title"
                                         value={header.mainTitle}
                                         onChange={(e) =>
                                           updateNewHeaderMainTitle(
                                             headerIndex,
                                             e.target.value
                                           )
                                         }
                                         className="w-full p-2 border rounded"
                                       />
       
                                       
                                       {header.title || header.title === "" ? (
                                         <input
                                           type="text"
                                           placeholder="Sub Header Title"
                                           value={header.title}
                                           onChange={(e) =>
                                             updateNewHeaderTitle(
                                               headerIndex,
                                               e.target.value
                                             )
                                           }
                                           className="w-full p-2 border rounded"
                                         />
                                       ) : null}
       
                                      
                                       {header.rows.map((row, rowIndex) => (
                                         <div
                                           key={rowIndex}
                                           className="grid grid-cols-8 gap-2"
                                         >
                                           {[
                                             "item",
                                             "ratio",
                                             "unit",
                                             "quantity",
                                             "manpower",
                                             "no_of_days",
                                             "labor_cost",
                                             "per_unit_cost",
                                           ].map((field) => (
                                             <input
                                               key={field}
                                               type="text"
                                               placeholder={field}
                                               value={
                                                 row[field as keyof RoughingRow] || ""
                                               }
                                               onChange={(e) =>
                                                 updateNewHeaderRow(
                                                   headerIndex,
                                                   rowIndex,
                                                   field as keyof RoughingRow,
                                                   e.target.value
                                                 )
                                               }
                                               className="p-2 border rounded"
                                             />
                                           ))}
       
                                           <button
                                             className="bg-red-400 text-white px-2 py-1 rounded"
                                             onClick={() =>
                                               removeRowFromNewHeader(
                                                 headerIndex,
                                                 rowIndex
                                               )
                                             }
                                           >
                                             Remove
                                           </button>
                                         </div>
                                       ))}
       
                                      
                                       <div className="flex justify-between items-center">
                                         <button
                                           type="button"
                                           className="bg-green-500 text-white px-4 py-2 rounded"
                                           onClick={() =>
                                             addRowToNewHeader(headerIndex)
                                           }
                                         >
                                           Add Row
                                         </button>
       
                                       
                                         <div className="space-x-2 flex items-center">
                                           <button
                                             className="bg-blue-600 text-white px-4 py-2 rounded"
                                             onClick={() => saveNewHeader(headerIndex)}
                                           >
                                             Save Header
                                           </button>
                                           <button
                                             className="bg-gray-500 text-white px-4 py-2 rounded"
                                             onClick={() =>
                                               cancelNewHeader(headerIndex)
                                             }
                                           >
                                             Cancel
                                           </button>
                                         </div>
                                       </div>
                                     </div>
                                   </td>
                                 </tr>
                               ))} */}
            {/* {newHeaders.map((header, headerIndex) => (
                                 <tr key={headerIndex}>
                                   <td colSpan={8}>
                                     <div className="border p-4 bg-gray-50 rounded space-y-4 mt-4">
                                       <input
                                         type="text"
                                         placeholder="Main Header Title"
                                         value={header.mainTitle}
                                         onChange={(e) =>
                                           updateNewHeaderMainTitle(
                                             headerIndex,
                                             e.target.value
                                           )
                                         }
                                         className="w-full p-2 border-2 border-red-500 rounded"
                                       />
       
                                       {header.title || header.title === "" ? (
                                         <input
                                           type="text"
                                           placeholder="Sub Header Title"
                                           value={header.title}
                                           onChange={(e) =>
                                             updateNewHeaderTitle(
                                               headerIndex,
                                               e.target.value
                                             )
                                           }
                                           className="w-full p-2 border-2 border-blue-500 rounded"
                                         />
                                       ) : null}
       
                                       {header.rows.map((row, rowIndex) => (
                                         <div
                                           key={rowIndex}
                                           className="grid grid-cols-8 gap-2"
                                         >
                                           {[
                                             "item",
                                             "ratio",
                                             "unit",
                                             "quantity",
                                             "manpower",
                                             "no_of_days",
                                             "labor_cost",
                                             "per_unit_cost",
                                           ].map((field) => (
                                             <input
                                               key={field}
                                               type="text"
                                               placeholder={field}
                                               value={
                                                 row[field as keyof RoughingRow] || ""
                                               }
                                               onChange={(e) =>
                                                 updateNewHeaderRow(
                                                   headerIndex,
                                                   rowIndex,
                                                   field as keyof RoughingRow,
                                                   e.target.value
                                                 )
                                               }
                                               className="p-2 border rounded"
                                             />
                                           ))}
       
                                           <button
                                             className="bg-red-400 text-white px-2 py-1 rounded"
                                             onClick={() =>
                                               removeRowFromNewHeader(
                                                 headerIndex,
                                                 rowIndex
                                               )
                                             }
                                           >
                                             Remove
                                           </button>
                                         </div>
                                       ))}
                                       <div className="flex justify-between items-center">
                                         <button
                                           type="button"
                                           className="bg-green-500 text-white px-4 py-2 rounded"
                                           onClick={() =>
                                             addRowToNewHeader(headerIndex)
                                           }
                                         >
                                           Add Row
                                         </button>
       
                                         <div className="space-x-2 flex items-center">
                                           <button
                                             className="bg-blue-600 text-white px-4 py-2 rounded"
                                             onClick={() => saveNewHeader(headerIndex)}
                                           >
                                             Save Header
                                           </button>
                                           <button
                                             className="bg-gray-500 text-white px-4 py-2 rounded"
                                             onClick={() =>
                                               cancelNewHeader(headerIndex)
                                             }
                                           >
                                             Cancel
                                           </button>
                                         </div>
                                       </div>
                                     </div>
                                   </td>
                                 </tr>
                               ))} */}
            {/* {newHeaders.map((header, headerIndex) => (
                                 <React.Fragment key={headerIndex}>
                                   
                                   <tr>
                                     <td colSpan={8}>
                                       <div className="border p-4 bg-gray-50 rounded space-y-4 mt-4">
                                         <input
                                           type="text"
                                           placeholder="Main Header Title"
                                           value={header.header}
                                           onChange={(e) =>
                                             updateNewHeaderMainTitle(
                                               headerIndex,
                                               e.target.value
                                             )
                                           }
                                           className="w-full p-2 border-2 border-red-500 rounded"
                                         />
                                       </div>
                                     </td>
                                   </tr>
       
                                  
                                   {header.rows.map((subHeader, subIndex) => (
                                     <React.Fragment key={subIndex}>
                                       {subHeader.title && (
                                         <tr>
                                           <td colSpan={8}>
                                             <div className="border p-4 bg-gray-100 rounded space-y-4 mt-4">
                                               <input
                                                 type="text"
                                                 placeholder="Sub Header Title"
                                                 value={subHeader.title}
                                                 onChange={(e) =>
                                                   updateNewHeaderTitle(
                                                     headerIndex,
                                                     subIndex,
                                                     e.target.value
                                                   )
                                                 }
                                                 className="w-full p-2 border-2 border-blue-500 rounded"
                                               />
                                             </div>
                                           </td>
                                         </tr>
                                       )}
       
                                      
                                       {subHeader.rows.map((row, rowIndex) => (
                                         <tr key={rowIndex}>
                                           <td colSpan={8}>
                                             <div className="grid grid-cols-8 gap-2">
                                               {[
                                                 "item",
                                                 "ratio",
                                                 "unit",
                                                 "quantity",
                                                 "manpower",
                                                 "no_of_days",
                                                 "labor_cost",
                                                 "per_unit_cost",
                                               ].map((field) => (
                                                 <input
                                                   key={field}
                                                   type="text"
                                                   placeholder={field}
                                                   value={row[field] || ""}
                                                   onChange={(e) =>
                                                     updateNewHeaderRow(
                                                       headerIndex,
                                                       subIndex,
                                                       rowIndex,
                                                       field,
                                                       e.target.value
                                                     )
                                                   }
                                                   className="p-2 border rounded"
                                                 />
                                               ))}
       
                                               <button
                                                 className="bg-red-400 text-white px-2 py-1 rounded"
                                                 onClick={() =>
                                                   removeRowFromNewHeader(
                                                     headerIndex,
                                                     subIndex,
                                                     rowIndex
                                                   )
                                                 }
                                               >
                                                 Remove
                                               </button>
                                             </div>
                                           </td>
                                         </tr>
                                       ))}
                                     </React.Fragment>
                                   ))}
                                 </React.Fragment>
                               ))} */}
            {/* {newHeaders.map((header, headerIndex) => (
                                 <React.Fragment key={headerIndex}>
                                   <tr>
                                     <td colSpan={8}>
                                       <div className="border p-4 bg-gray-50 rounded space-y-4 mt-4">
                                         <input
                                           type="text"
                                           placeholder="Main Header Title"
                                           value={header.header}
                                           onChange={(e) =>
                                             updateNewHeaderMainTitle(
                                               headerIndex,
                                               e.target.value
                                             )
                                           }
                                           className="w-full p-2 border-2 border-red-500 rounded"
                                         />
                                       </div>
                                     </td>
                                   </tr>
       
                                   {header.rows.map((subHeader, subIndex) => (
                                     <React.Fragment key={subIndex}>
                                       {subHeader.title && (
                                         <tr>
                                           <td colSpan={8}>
                                             <div className="border p-4 bg-gray-100 rounded space-y-4 mt-4">
                                               <input
                                                 type="text"
                                                 placeholder="Sub Header Title"
                                                 value={subHeader.title}
                                                 onChange={(e) =>
                                                   updateNewHeaderTitle(
                                                     headerIndex,
                                                     subIndex,
                                                     e.target.value
                                                   )
                                                 }
                                                 className="w-full p-2 border-2 border-blue-500 rounded"
                                               />
                                             </div>
                                           </td>
                                         </tr>
                                       )}
       
                                       {subHeader.rows.map((row, rowIndex) => (
                                         <tr key={rowIndex}>
                                           <td colSpan={8}>
                                             <div className="grid grid-cols-8 gap-2">
                                               {[
                                                 "item",
                                                 "ratio",
                                                 "unit",
                                                 "quantity",
                                                 "manpower",
                                                 "no_of_days",
                                                 "labor_cost",
                                                 "per_unit_cost",
                                               ].map((field) => (
                                                 <input
                                                   key={field}
                                                   type="text"
                                                   placeholder={field}
                                                   value={row[field] || ""}
                                                   onChange={(e) =>
                                                     updateNewHeaderRow(
                                                       headerIndex,
                                                       subIndex,
                                                       rowIndex,
                                                       field,
                                                       e.target.value
                                                     )
                                                   }
                                                   className="p-2 border rounded"
                                                 />
                                               ))}
       
                                               <button
                                                 className="bg-red-400 text-white px-2 py-1 rounded"
                                                 onClick={() =>
                                                   removeRowFromNewHeader(
                                                     headerIndex,
                                                     subIndex,
                                                     rowIndex
                                                   )
                                                 }
                                               >
                                                 Remove
                                               </button>
                                             </div>
                                           </td>
                                         </tr>
                                       ))}
       
                                       <tr>
                                         <td colSpan={8}>
                                           <button
                                             className="bg-green-400 text-white px-4 py-2 rounded"
                                             onClick={() =>
                                               addRowToNewHeader(headerIndex, subIndex)
                                             }
                                           >
                                             Add Row
                                           </button>
                                         </td>
                                       </tr>
                                     </React.Fragment>
                                   ))}
                                 </React.Fragment>
                               ))} */}
            {newHeaders.map((header, headerIndex) => (
              <React.Fragment key={headerIndex}>
                {/* Main Header */}
                <tr>
                  <td colSpan={8}>
                    <div className="border p-4 bg-gray-50 rounded space-y-4 mt-4 dark:bg-gray-dark">
                      <input
                        type="text"
                        placeholder="Main Header Title"
                        value={header.header}
                        onChange={(e) =>
                          updateNewHeaderMainTitle(headerIndex, e.target.value)
                        }
                        className="w-full p-2 border-2 border-red-500 rounded"
                      />
                    </div>
                  </td>
                </tr>

                {/* Sub-header Input */}
                {header.rows.map((subHeader, subIndex) => (
                  <React.Fragment key={subIndex}>
                    {/* Conditionally render the sub-header title input ONLY if title exists */}
                    {(subHeader.title?.trim() || subHeader.manuallyAdded) && (
                      <tr>
                        <td colSpan={8}>
                          <div className="ml-5 border p-4 bg-gray-100 rounded space-y-4 mt-4 dark:bg-gray-dark">
                            <input
                              type="text"
                              placeholder="Sub Header Title"
                              value={subHeader.title}
                              onChange={(e) =>
                                updateNewHeaderTitle(
                                  headerIndex,
                                  subIndex,
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border-2 border-blue-500 rounded"
                            />
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Always render the rows */}
                    {subHeader.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td colSpan={8}>
                          <div className="grid grid-cols-8 gap-2">
                            {[
                              "item",
                              "ratio",
                              "unit",
                              "quantity",
                              "manpower",
                              "no_of_days",
                              "labor_cost",
                              "per_unit_cost",
                            ].map((field) => (
                              <input
                                key={field}
                                type="text"
                                placeholder={field}
                                value={row[field] || ""}
                                onChange={(e) =>
                                  updateNewHeaderRow(
                                    headerIndex,
                                    subIndex,
                                    rowIndex,
                                    field,
                                    e.target.value
                                  )
                                }
                                className="p-2 border rounded"
                              />
                            ))}
                            <div className="text-start">
                              <button
                                type="button"
                                className="bg-white  uppercase border border-red-800  text-red-800  px-5 mb-1 py-2 rounded"
                                onClick={() =>
                                  removeRowFromNewHeader(
                                    headerIndex,
                                    subIndex,
                                    rowIndex
                                  )
                                }
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* Add Row button */}
                    <tr className="text-start">
                      <td colSpan={8}>
                        <button
                          type="button"
                          className="bg-white  uppercase text-black border border-black px-4 py-2 rounded"
                          onClick={() =>
                            addRowToNewHeader(headerIndex, subIndex)
                          }
                        >
                          Add Row
                        </button>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}

                {/* Add Sub-header Button under Header */}
                {/* <tr>
                                     <td colSpan={8}>
                                       <button
                                         className="bg-yellow-400 text-white px-4 py-2 rounded"
                                         onClick={() => addSubHeader(headerIndex)}
                                       >
                                         Add Sub-header
                                       </button>
                                     </td>
                                   </tr> */}
              </React.Fragment>
            ))}
          </div>

          <div className="text-right text-xl font-bold mt-6">
            Total Amount: ₱{getTotalAmountIncludingNew().toFixed(2)}
          </div>
        </>
      )}
    </>
  );
};

export default ActiveNav1;
