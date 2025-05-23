import { fetchbomId } from "@/api/bill_of_materials/fetchBomId";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
interface BomIds {
  id: number;
}
interface DeviceRow {
  item: string;
  description: string;
  quantity: string;
  unit_of_measurement: string;
  srp: number;
}

interface Header {
  title: string;
  rows: DeviceRow[];
}

interface ActiveNav1Props {
  id: number;
  deviceRows1: DeviceRow[];
  setDeviceRows1: React.Dispatch<React.SetStateAction<DeviceRow[]>>;
  newHeaders1: Header[];
  addHeader1: () => void;
  updateNewHeaderTitle1: (headerIndex: number, newTitle: string) => void;
  updateNewHeaderRow1: (
    headerIndex: number,
    rowIndex: number,
    field: keyof DeviceRow,
    newValue: string
  ) => void;
  addRowToNewHeader1: (headerIndex: number) => void;
  removeRowFromNewHeader1: (headerIndex: number, rowIndex: number) => void;
  cancelNewHeader1: (headerIndex: number) => void;
  getNewHeaderSubtotal1: (rows: DeviceRow[]) => number;
  removeDeviceRow1: (index: number) => void; // ✅ Add this
}

// NavInputs
const ActiveNav1 = ({
  id,
  deviceRows1,
  setDeviceRows1,
  newHeaders1,
  addHeader1,
  updateNewHeaderTitle1,
  updateNewHeaderRow1,
  addRowToNewHeader1,
  removeRowFromNewHeader1,
  cancelNewHeader1,
  getNewHeaderSubtotal1,
  removeDeviceRow1,
}: ActiveNav1Props) => {
  //   const { id } = props;
  const {
    data: BomData,
    isLoading: Rloading,
    isError: ReceiptError,
    error: rerror,
  } = useQuery({
    queryKey: ["bom", id],
    queryFn: () => fetchbomId(id),
    enabled: !!id,
  });
  const [activeNav, setActiveNav] = useState(1);
  const [headers, setHeaders] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);

  //   const [newHeaders, setNewHeaders] = useState<
  //     { title: string; rows: DeviceRow[] }[]
  //   >([]);
  //   const [deviceRows, setDeviceRows] = useState<DeviceRow[]>([]);
  //   useEffect(() => {
  //     if (BomData && BomData.device_header) {
  //       const headersFromData = BomData.device_header.map((header) => ({
  //         title: header.header || "",
  //         rows: header.items.map((item) => ({
  //           item: item.item,
  //           description: item.description,
  //           quantity: item.quantity.toString(),
  //           unit_of_measurement: item.unit_of_measurement.toString(),
  //           srp: item.srp,
  //         })),
  //       }));

  //       setNewHeaders1(headersFromData);
  //     }
  //   }, [BomData]);

  useEffect(() => {
    if (BomData?.device_items) {
      // If device_items is an array:
      const devices = Array.isArray(BomData.device_items)
        ? BomData.device_items
        : [BomData.device_items]; // fallback for single item

      const formattedDevices = devices.map((device) => ({
        item: device.item || "",
        description: device.description || "",
        quantity: device.quantity || 0,
        unit_of_measurement: device.unit_of_measurement || "", // or you can hardcode a default
        srp: device.srp || 0,
        total_amount: (device.srp || 0) * (device.quantity || 0), // ✅ computed from srp * quantity
      }));

      setDeviceRows1(formattedDevices);
    }
  }, [BomData]);
  const handleSave = () => {
    console.log("Form Data:", formData);
    console.log("Device Rows:", deviceRows1);
    console.log("Headers:", headers);
    setShowEditModal(false);
  };

  const removeDeviceRow = (index: number) => {
    const updated = [...deviceRows1];
    updated.splice(index, 1);
    setDeviceRows1(updated);
  };

  const updateDeviceRow = (
    rowIndex: number,
    key: keyof DeviceRow,
    value: string | number
  ) => {
    setDeviceRows1((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        [key]: value,
      };
      return updatedRows;
    });
  };

  //   const addHeader = (e?: React.MouseEvent<HTMLButtonElement>) => {
  //     e?.preventDefault(); // prevent default form behavior if event passed

  //     setNewHeaders((prev) => [
  //       ...prev,
  //       {
  //         title: "",
  //         rows: [
  //           {
  //             item: "",
  //             description: "",
  //             quantity: "",
  //             unit_of_measurement: "",
  //             amount: "",
  //           },
  //         ],
  //       },
  //     ]);
  //   };

  //   const updateNewHeaderTitle = (index: number, value: string) => {
  //     const updated = [...newHeaders];
  //     updated[index].title = value;
  //     setNewHeaders(updated);
  //   };

  //   const updateNewHeaderRow = (
  //     headerIndex: number,
  //     rowIndex: number,
  //     key: keyof DeviceRow,
  //     value: string
  //   ) => {
  //     const updated = [...newHeaders];
  //     const row = updated[headerIndex].rows[rowIndex];
  //     row[key] = value;

  //     const quantity = parseFloat(row.quantity);
  //     const unitPrice = parseFloat(row.unitPrice);
  //     row.amount =
  //       !isNaN(quantity) && !isNaN(unitPrice)
  //         ? (quantity * unitPrice).toFixed(2)
  //         : "";

  //     setNewHeaders(updated);
  //   };

  //   const addRowToNewHeader = (headerIndex: number) => {
  //     setNewHeaders((prevHeaders) => {
  //       const updatedHeaders = [...prevHeaders];
  //       updatedHeaders[headerIndex].rows.push({
  //         item: "",
  //         description: "",
  //         quantity: "",
  //         unit_of_measurement: "",
  //         amount: "",
  //       });
  //       return updatedHeaders;
  //     });
  //   };
  //   const addRowToNewHeader = (headerIndex: number) => {
  //     setNewHeaders((prevHeaders) => {
  //       const updatedHeaders = [...prevHeaders];

  //       // Ensure that we are adding only one row and not multiple
  //       updatedHeaders[headerIndex].rows = [
  //         ...updatedHeaders[headerIndex].rows,
  //         {
  //           item: "",
  //           description: "",
  //           quantity: "",
  //           unit_of_measurement: "",
  //           amount: "",
  //         },
  //       ];

  //       return updatedHeaders;
  //     });
  //   };

  //   const removeRowFromNewHeader = (headerIndex: number, rowIndex: number) => {
  //     const updated = [...newHeaders];
  //     updated[headerIndex].rows.splice(rowIndex, 1);
  //     setNewHeaders(updated);
  //   };

  const saveNewHeader = (index: number) => {
    const headerToSave = newHeaders1[index];
    if (!headerToSave.title.trim()) return;
    setHeaders([...headers, headerToSave]);
    const updated = [...newHeaders1];
    updated.splice(index, 1);
    setNewHeaders1(updated);
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
    const savedTotal = deviceRows1.reduce((sum, row) => {
      return sum + row.total_amount || 0;
    }, 0);

    const newHeadersTotal = newHeaders1.reduce((sum, newHeader) => {
      return sum + getNewHeaderSubtotal1(newHeader.rows);
    }, 0);

    return savedTotal + newHeadersTotal;
  };

  //   const getNewHeaderSubtotal = (rows: DeviceRow[]) => {
  //     return rows.reduce((sum, row) => {
  //       const amount = parseFloat(row.amount);
  //       return sum + (isNaN(amount) ? 0 : amount);
  //     }, 0);
  //   };
  //   const getNewHeaderSubtotal = (rows: DeviceRow[]) => {
  //     return rows.reduce((total, row) => {
  //       const quantity = parseFloat(row.quantity) || 0;
  //       const unit_of_measurement = parseFloat(row.unit_of_measurement) || 0;
  //       return total + quantity * unit_of_measurement;
  //     }, 0);
  //   };
  //   const getNewHeaderSubtotal = (rows: DeviceRow[]) => {
  //     return rows.reduce((total, row) => {
  //       const srp = parseFloat(row.srp) || 0; // Ensure srp is treated as a number
  //       return total + srp; // Sum all srp values
  //     }, 0);
  //   };
  //   const getNewHeaderSubtotal = (rows: DeviceRow[]) => {
  //     return rows.reduce((total, row) => {
  //       const srp = parseFloat(row.srp as any) || 0;
  //       const quantity = parseFloat(row.quantity as any) || 0;
  //       return total + quantity * srp;
  //     }, 0);
  //   };
  return (
    <>
      {activeNav === 1 && (
        <>
          <div className="space-y-1">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="bg-white-500 text-black px-4 py-2 rounded border border-black uppercase"
                onClick={() =>
                  setDeviceRows1([
                    ...deviceRows1,
                    {
                      item: "",
                      description: "",
                      quantity: "",
                      unit_of_measurement: "",
                      srp: 0,
                    },
                  ])
                }
              >
                Add Row
              </button>
              <button
                type="button"
                className="bg-white border border-black text-black uppercase px-4 py-2 rounded"
                onClick={addHeader1}
              >
                Add Header
              </button>
            </div>

            {/* Device Table */}
            <table className="table-auto w-full text-sm text-left  border ">
              <thead className="bg-gray-100 dark:bg-gray-dark uppercase">
                <tr>
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Unit of measurement</th>
                  <th className="px-4 py-2">Unit Price</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {deviceRows1.map((row, index) => (
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
                        className="w-full border p-1 rounded bg-gray-100 text-gray-700 dark:bg-gray-dark dark:border-white dark:text-white"
                      />
                    </td>

                    <td className="px-4 py-2">
                      <button
                        className="bg-white border border-red-800  text-red-800 uppercase px-2 py-1 rounded"
                        onClick={() => removeDeviceRow1(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-2 text-right font-semibold"
                  >
                    Subtotal:
                  </td>
                  <td className="px-4 py-2 font-semibold">
                    ₱
                    {deviceRows1
                      .reduce((sum, row) => sum + (row.total_amount || 0), 0)
                      .toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>

            {newHeaders1.map((header, headerIndex) => (
              <tr key={headerIndex}>
                <td colSpan={6}>
                  <div className="border p-4 bg-gray-50 rounded space-y-4 mt-4 dark:bg-gray-dark">
                    <input
                      type="text"
                      placeholder="Header Title"
                      value={header.title}
                      onChange={(e) =>
                        updateNewHeaderTitle1(headerIndex, e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    />

                    {header.rows.map((row, rowIndex) => (
                      <div key={rowIndex} className="grid grid-cols-6 gap-2">
                        {[
                          "item",
                          "description",
                          "quantity",
                          "unit_of_measurement",
                          "srp",
                        ].map((field) => (
                          <input
                            key={field}
                            type="text"
                            placeholder={field}
                            value={row[field as keyof DeviceRow]}
                            onChange={(e) =>
                              updateNewHeaderRow1(
                                headerIndex,
                                rowIndex,
                                field as keyof DeviceRow,
                                e.target.value
                              )
                            }
                            className="p-2 border rounded"
                          />
                        ))}
                        <button
                          type="button"
                          className="bg-white border border-reed-800  text-red-800 uppercase px-2 py-1 rounded"
                          onClick={() =>
                            removeRowFromNewHeader1(headerIndex, rowIndex)
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    <div className="flex justify-between items-center">
                      <button
                        type="button"
                        className="bg-white text-black border border-black uppercase px-4 py-2 rounded"
                        onClick={() => addRowToNewHeader1(headerIndex)}
                      >
                        Add Row
                      </button>

                      <div className="space-x-2 flex items-center">
                        <span className="text-sm font-semibold ">
                          Subtotal: ₱
                          {getNewHeaderSubtotal1(header.rows).toFixed(2)}
                        </span>
                        {/* <button
                                      className="bg-blue-600 text-white px-4 py-2 rounded"
                                      onClick={() => saveNewHeader(headerIndex)}
                                    >
                                      Save Header
                                    </button> */}
                        <button
                          type="button"
                          className="bg-white text-black uppercase border border-black px-4 py-2 rounded"
                          onClick={() => cancelNewHeader1(headerIndex)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </div>

          <div className="text-right text-xl font-bold mt-6">
            Total Amounts: ₱{getTotalAmountIncludingNew().toFixed(2)}
          </div>
        </>
      )}
    </>
  );
};

export default ActiveNav1;
