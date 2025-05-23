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

interface ActiveNav3Props {
  deviceRows3: DeviceRow[];
  setDeviceRows3: React.Dispatch<React.SetStateAction<DeviceRow[]>>;
  newHeaders3: Header[];
  addHeader3: () => void;
  updateNewHeaderTitle3: (headerIndex: number, newTitle: string) => void;
  updateNewHeaderRow3: (
    headerIndex: number,
    rowIndex: number,
    field: keyof DeviceRow,
    newValue: string
  ) => void;
  addRowToNewHeader3: (headerIndex: number) => void;
  removeRowFromNewHeader3: (headerIndex: number, rowIndex: number) => void;
  cancelNewHeader3: (headerIndex: number) => void;
  getNewHeaderSubtotal: (rows: DeviceRow[]) => number;
}

const ActiveNav3 = ({
  deviceRows3,
  setDeviceRows3,
  newHeaders3,
  addHeader3,
  updateNewHeaderTitle3,
  updateNewHeaderRow3,
  addRowToNewHeader3,
  removeRowFromNewHeader3,
  cancelNewHeader3,
  getNewHeaderSubtotal,
}: ActiveNav3Props) => {
  const [activeNav, setActiveNav] = useState(3);
  //   const [deviceRows3, setDeviceRows3] = useState<DeviceRow[]>([]);
  //   const [newHeaders3, setNewHeaders3] = useState<
  //     { title: string; rows: DeviceRow[] }[]
  //   >([]);
  const [headers3, setHeaders3] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);

  //   const addHeader3 = () => {
  //     setNewHeaders3([
  //       ...newHeaders3,
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
  //   const updateNewHeaderTitle3 = (index: number, value: string) => {
  //     const updated = [...newHeaders3];
  //     updated[index].title = value;
  //     setNewHeaders3(updated);
  //   };

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

  //   const removeRowFromNewHeader3 = (headerIndex: number, rowIndex: number) => {
  //     const updated = [...newHeaders3];
  //     updated[headerIndex].rows.splice(rowIndex, 1);
  //     setNewHeaders3(updated);
  //   };
  //   const saveNewHeader3 = (index: number) => {
  //     const headerToSave = newHeaders3[index];
  //     if (!headerToSave.title.trim()) return;
  //     setHeaders3([...headers3, headerToSave]);
  //     const updated = [...newHeaders3];
  //     updated.splice(index, 1);
  //     setNewHeaders3(updated);
  //   };

  //   const cancelNewHeader3 = (index: number) => {
  //     const updated = [...newHeaders3];
  //     updated.splice(index, 1);
  //     setNewHeaders3(updated);
  //   };
  //   const getNewHeaderSubtotal3 = (rows: DeviceRow[]) => {
  //     return rows.reduce((sum, row) => {
  //       const amount = parseFloat(row.amount);
  //       return sum + (isNaN(amount) ? 0 : amount);
  //     }, 0);
  //   };

  const getTotalAmountIncludingNew3 = () => {
    const savedTotal = headers3.reduce((sum, header) => {
      return sum + getHeaderSubtotal(header.rows);
    }, 0);

    const newHeadersTotal = newHeaders3.reduce((sum, newHeader) => {
      return sum + getNewHeaderSubtotal(newHeader.rows);
    }, 0);

    return savedTotal + newHeadersTotal;
  };
  const removeDeviceRow3 = (index: number) => {
    const updated = [...deviceRows3];
    updated.splice(index, 1);
    setDeviceRows3(updated);
  };

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

  return (
    <>
      {activeNav === 3 && (
        <>
          <div className="space-y-6">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="bg-white border border-black text-black uppercase px-4 py-2 rounded"
                onClick={() =>
                  setDeviceRows3([
                    ...deviceRows3,
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
                className="bg-white text-black px-4 py-2 rounded border border-black uppercase"
                onClick={addHeader3}
              >
                Add Header
              </button>
            </div>

            {/* Device Table */}
            <table className="table-auto w-full text-sm text-left  border">
              <thead className="bg-gray-100 dark:bg-gray-dark dark:text-white uppercase">
                <tr>
                  <th className="px-4 py-2">Item3</th>
                  <th className="px-4 py-2">Description</th>
                  {/* <th className="px-4 py-2">srp</th> */}
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Unit Price</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {deviceRows3.map((row, index) => (
                  <tr key={index} className="dark:text-white ">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={row.item}
                        onChange={(e) =>
                          updateDeviceRow3(index, "item", e.target.value)
                        }
                        className="w-full border p-1 rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) =>
                          updateDeviceRow3(index, "description", e.target.value)
                        }
                        className="w-full border p-1 rounded"
                      />
                    </td>
                    {/* <td className="px-4 py-2">
                                  <input
                                    type="text"
                                    value={row.srp}
                                    onChange={(e) =>
                                      updateDeviceRow3(
                                        index,
                                        "srp",
                                        e.target.value
                                      )
                                    }
                                    className="w-full border p-1 rounded"
                                  />
                                </td> */}
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={row.quantity}
                        onChange={(e) => {
                          const quantity = e.target.value;
                          const amount = (
                            parseFloat(quantity) *
                            parseFloat(row.unitPrice || "0")
                          ).toFixed(2);
                          updateDeviceRow3(index, "quantity", quantity);
                          updateDeviceRow3(index, "amount", amount);
                        }}
                        className="w-full border p-1 rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={row.unit_of_measurement || ""}
                        onChange={(e) => {
                          const unitPrice = e.target.value;
                          const amount = (
                            parseFloat(row.quantity || "0") *
                            parseFloat(unitPrice)
                          ).toFixed(2);
                          updateDeviceRow3(
                            index,
                            "unit_of_measurement",
                            unitPrice
                          );
                          updateDeviceRow3(index, "amount", amount);
                        }}
                        className="w-full border p-1 rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={row.amount}
                        readOnly
                        className="w-full border p-1 rounded bg-gray-100 dark:bg-gray-dark "
                      />
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-white text-red-800 border border-red-800 uppercase px-2 py-1 rounded"
                        onClick={() => removeDeviceRow3(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* New Header Forms */}
            {newHeaders3.map((header, headerIndex) => (
              <div
                key={headerIndex}
                className="border p-4 bg-gray-50 rounded space-y-4 mt-4 dark:bg-gray-dark dark:text-white"
              >
                <input
                  type="text"
                  placeholder="Header Title"
                  value={header.title}
                  onChange={(e) =>
                    updateNewHeaderTitle3(headerIndex, e.target.value)
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
                      "amount",
                    ].map((field) => (
                      <input
                        key={field}
                        type="text"
                        placeholder={field}
                        value={row[field as keyof DeviceRow]}
                        onChange={(e) =>
                          updateNewHeaderRow3(
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
                      className="bg-white uppercase text-red-800 border border-red-800 px-2 py-1 rounded"
                      onClick={() =>
                        removeRowFromNewHeader3(headerIndex, rowIndex)
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    className="bg-white border border-black text-black uppercase px-4 py-2 rounded"
                    onClick={() => addRowToNewHeader3(headerIndex)}
                  >
                    Add Row
                  </button>

                  <div className="space-x-2 flex items-center">
                    <span className="text-sm font-semibold">
                      Subtotal: ₱{getNewHeaderSubtotal(header.rows).toFixed(2)}
                    </span>
                    {/* <button
                                  className="bg-blue-600 text-white px-4 py-2 rounded"
                                  onClick={() => saveNewHeader3(headerIndex)}
                                >
                                  Save Header
                                </button> */}
                    <button
                      className="bg-white uppercase border border-black  text-black px-4 py-2 rounded"
                      onClick={() => cancelNewHeader3(headerIndex)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-right text-xl font-bold mt-6 dark:text-white">
            Total Amount: ₱{getTotalAmountIncludingNew3().toFixed(2)}
          </div>
        </>
      )}
    </>
  );
};

export default ActiveNav3;
