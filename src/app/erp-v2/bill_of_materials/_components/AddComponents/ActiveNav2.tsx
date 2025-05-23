import React, { useState } from "react";

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

interface ActiveNav2Props {
  deviceRows2: DeviceRow[];
  setDeviceRows2: React.Dispatch<React.SetStateAction<DeviceRow[]>>;
  newHeaders2: Header[];
  addHeader2: () => void;
  updateNewHeaderTitle2: (headerIndex: number, newTitle: string) => void;
  updateNewHeaderRow2: (
    headerIndex: number,
    rowIndex: number,
    field: keyof DeviceRow,
    newValue: string
  ) => void;
  addRowToNewHeader2: (headerIndex: number) => void;
  removeRowFromNewHeader2: (headerIndex: number, rowIndex: number) => void;
  cancelNewHeader2: (headerIndex: number) => void;
  getNewHeaderSubtotal: (rows: DeviceRow[]) => number;
}

const ActiveNav2 = ({
  deviceRows2,
  setDeviceRows2,
  newHeaders2,
  addHeader2,
  updateNewHeaderTitle2,
  updateNewHeaderRow2,
  addRowToNewHeader2,
  removeRowFromNewHeader2,
  cancelNewHeader2,
  getNewHeaderSubtotal,
}: ActiveNav2Props) => {
  const [activeNav, setActiveNav] = useState(2);
  //   const [deviceRows2, setDeviceRows2] = useState<DeviceRow[]>([]);
  //   const [newHeaders2, setNewHeaders2] = useState<
  //     { title: string; rows: DeviceRow[] }[]
  //   >([]);
  const [headers2, setHeaders2] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);
  //   const addHeader2 = () => {
  //     setNewHeaders2([
  //       ...newHeaders2,
  //       {
  //         title: "",
  //         rows: [
  //           {
  //             item: "",
  //             description: "",
  //             quantity: "",
  //             unitPrice: "",
  //             amount: "",
  //           },
  //         ],
  //       },
  //     ]);
  //   };
  //   const updateNewHeaderTitle2 = (index: number, value: string) => {
  //     const updated = [...newHeaders2];
  //     updated[index].title = value;
  //     setNewHeaders2(updated);
  //   };

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
  //   const addRowToNewHeader2 = (headerIndex: number) => {
  //     const updated = [...newHeaders2];
  //     updated[headerIndex].rows.push({
  //       item: "",
  //       description: "",
  //       quantity: "",
  //       unitPrice: "",
  //       amount: "",
  //     });
  //     setNewHeaders2(updated);
  //   };

  //   const removeRowFromNewHeader2 = (headerIndex: number, rowIndex: number) => {
  //     const updated = [...newHeaders2];
  //     updated[headerIndex].rows.splice(rowIndex, 1);
  //     setNewHeaders2(updated);
  //   };
  //   const saveNewHeader2 = (index: number) => {
  //     const headerToSave = newHeaders2[index];
  //     if (!headerToSave.title.trim()) return;
  //     setHeaders2([...headers2, headerToSave]);
  //     const updated = [...newHeaders2];
  //     updated.splice(index, 1);
  //     setNewHeaders2(updated);
  //   };

  //   const cancelNewHeader2 = (index: number) => {
  //     const updated = [...newHeaders2];
  //     updated.splice(index, 1);
  //     setNewHeaders2(updated);
  //   };
  //   const getNewHeaderSubtotal2 = (rows: DeviceRow[]) => {
  //     return rows.reduce((sum, row) => {
  //       const amount = parseFloat(row.amount);
  //       return sum + (isNaN(amount) ? 0 : amount);
  //     }, 0);
  //   };

  const getTotalAmountIncludingNew2 = () => {
    const savedTotal = headers2.reduce((sum, header) => {
      return sum + getHeaderSubtotal(header.rows);
    }, 0);

    const newHeadersTotal = newHeaders2.reduce((sum, newHeader) => {
      return sum + getNewHeaderSubtotal(newHeader.rows);
    }, 0);

    return savedTotal + newHeadersTotal;
  };
  const removeDeviceRow2 = (index: number) => {
    const updated = [...deviceRows2];
    updated.splice(index, 1);
    setDeviceRows2(updated);
  };
  return (
    <>
      {activeNav === 2 && (
        <>
          <div className="space-y-6">
            <div className="flex justify-end gap-4">
              {/* <button
                            type="button"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            onClick={() =>
                              setDeviceRows2([
                                ...deviceRows2,
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
                          </button> */}
              <button
                type="button"
                className="bg-white border border-black text-black uppercase px-4 py-2 rounded hover:bg-blue-600"
                onClick={addHeader2}
              >
                Add Header
              </button>
            </div>

            {/* Device Table */}
            <table className="table-auto w-full text-sm text-left  border">
              <thead className="bg-gray-100 dark:bg-gray-dark dark:text-white uppercase">
                <tr>
                  <th className="px-4 py-2">Item2</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Unit Price</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {deviceRows2.map((row, idx) => (
                  <tr key={idx}>
                    {Object.keys(row).map((field) => (
                      <td key={field} className="px-4 py-2">
                        {row[field as keyof DeviceRow]}
                      </td>
                    ))}
                    <td className="px-4 py-2">
                      <button
                        className="bg-white border border-red-800 text-red-800  px-3 py-1 rounded"
                        onClick={() => removeDeviceRow2(idx)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* New Header Forms */}
            {newHeaders2.map((header, headerIndex) => (
              <tr key={headerIndex}>
                <td colSpan={6}>
                  <div className="border p-4 bg-gray-50 rounded space-y-4 mt-4 dark:text-white dark:bg-gray-dark">
                    <label htmlFor="">header title</label>
                    <input
                      type="text"
                      placeholder="Header Title"
                      value={header.title}
                      onChange={(e) =>
                        updateNewHeaderTitle2(headerIndex, e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    />

                    {header.rows.map((row, rowIndex) => (
                      <div
                        key={rowIndex}
                        className="grid grid-cols-6 gap-2 mb-4"
                      >
                        {[
                          { key: "item", label: "Item" },
                          {
                            key: "description",
                            label: "Description",
                          },
                          { key: "quantity", label: "Quantity" },
                          {
                            key: "unit_of_measurement",
                            label: "Unit of Measurement",
                          },
                          { key: "srp", label: "SRP" },
                        ].map(({ key, label }) => (
                          <div key={key} className="flex flex-col">
                            <label className="text-xs  mb-1">{label}</label>
                            <input
                              type="text"
                              placeholder={label}
                              value={row[key as keyof DeviceRow]}
                              onChange={(e) =>
                                updateNewHeaderRow2(
                                  headerIndex,
                                  rowIndex,
                                  key as keyof DeviceRow,
                                  e.target.value
                                )
                              }
                              className="p-2 border rounded"
                            />
                          </div>
                        ))}
                        <div className="flex items-end">
                          <button
                            className="bg-white border border-red-800 text-red-800 uppercase px-2 py-1 rounded"
                            onClick={() =>
                              removeRowFromNewHeader2(headerIndex, rowIndex)
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-between items-center">
                      <button
                        type="button"
                        className="bg-white text-black border border-black uppercase px-4 py-2 rounded"
                        onClick={() => addRowToNewHeader2(headerIndex)}
                      >
                        Add Row
                      </button>

                      <div className="space-x-2 flex items-center">
                        <span className="text-sm font-semibold ">
                          Subtotal: ₱
                          {getNewHeaderSubtotal(header.rows).toFixed(2)}
                        </span>
                        {/* <button
                                      className="bg-blue-600 text-white px-4 py-2 rounded"
                                      onClick={() =>
                                        saveNewHeader2(headerIndex)
                                      }
                                    >
                                      Save Header
                                    </button> */}
                        <button
                          className="bg-white text-black border border-black uppercase px-4 py-2 rounded"
                          onClick={() => cancelNewHeader2(headerIndex)}
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
            Total Amount: ₱{getTotalAmountIncludingNew2().toFixed(2)}
          </div>
        </>
      )}
    </>
  );
};

export default ActiveNav2;
