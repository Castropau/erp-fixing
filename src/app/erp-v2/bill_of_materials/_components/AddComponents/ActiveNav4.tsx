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

interface ActiveNav4Props {
  deviceRows4: DeviceRow[];
  setDeviceRows4: React.Dispatch<React.SetStateAction<DeviceRow[]>>;
  newHeaders4: Header[];
  addHeader4: () => void;
  updateNewHeaderTitle4: (headerIndex: number, newTitle: string) => void;
  updateNewHeaderRow4: (
    headerIndex: number,
    rowIndex: number,
    field: keyof DeviceRow,
    newValue: string
  ) => void;
  addRowToNewHeader4: (headerIndex: number) => void;
  removeRowFromNewHeader4: (headerIndex: number, rowIndex: number) => void;
  cancelNewHeader4: (headerIndex: number) => void;
  getNewHeaderSubtotal4: (rows: DeviceRow[]) => number;
}

const ActiveNav4 = ({
  deviceRows4,
  setDeviceRows4,
  newHeaders4,
  addHeader4,
  updateNewHeaderTitle4,
  updateNewHeaderRow4,
  addRowToNewHeader4,
  removeRowFromNewHeader4,
  cancelNewHeader4,
  getNewHeaderSubtotal4,
}: ActiveNav4Props) => {
  const [activeNav, setActiveNav] = useState(4);
  //   const [deviceRows4, setDeviceRows4] = useState<DeviceRow[]>([]);

  //   const [newHeaders4, setNewHeaders4] = useState<
  //     { title: string; rows: DeviceRow[] }[]
  //   >([]);
  const [headers4, setHeaders4] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);

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
  //   const addHeader4 = () => {
  //     setNewHeaders4([
  //       ...newHeaders4,
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

  //   const updateNewHeaderTitle4 = (index: number, value: string) => {
  //     const updated = [...newHeaders4];
  //     updated[index].title = value;
  //     setNewHeaders4(updated);
  //   };

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

  //   const removeRowFromNewHeader4 = (headerIndex: number, rowIndex: number) => {
  //     const updated = [...newHeaders4];
  //     updated[headerIndex].rows.splice(rowIndex, 1);
  //     setNewHeaders4(updated);
  //   };
  //   const saveNewHeader4 = (index: number) => {
  //     const headerToSave = newHeaders4[index];
  //     if (!headerToSave.title.trim()) return;
  //     setHeaders4([...headers4, headerToSave]);
  //     const updated = [...newHeaders4];
  //     updated.splice(index, 1);
  //     setNewHeaders4(updated);
  //   };

  //   const cancelNewHeader4 = (index: number) => {
  //     const updated = [...newHeaders4];
  //     updated.splice(index, 1);
  //     setNewHeaders4(updated);
  //   };
  //   const getNewHeaderSubtotal4 = (rows: DeviceRow[]) => {
  //     return rows.reduce((sum, row) => {
  //       const amount = parseFloat(row.amount);
  //       return sum + (isNaN(amount) ? 0 : amount);
  //     }, 0);
  //   };

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

  return (
    <>
      {activeNav === 4 && (
        <>
          <div className="space-y-6">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="bg-white text-black px-4 py-2 rounded border border-black uppercase"
                onClick={() =>
                  setDeviceRows4([
                    ...deviceRows4,
                    {
                      item: "",
                      description: "",
                      quantity: "",
                      unit_of_measurement: "",
                      amount: "",
                      subrows: [], // Add this!
                    },
                  ])
                }
              >
                Add Row
              </button>
              {/* <button
                                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                  onClick={addHeader4}
                                >
                                  Add Header
                                </button> */}
            </div>

            {/* Device Table */}
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm text-left border">
                <thead className="bg-gray-100 dark:bg-gray-dark dark:text-white uppercase">
                  <tr>
                    <th className="px-4 py-2">Item4</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Unit Price</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {deviceRows4.map((row, index) => (
                    <React.Fragment key={index}>
                      {/* Main Row */}
                      <tr className="dark:text-white">
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={row.item}
                            onChange={(e) =>
                              updateDeviceRow4(index, "item", e.target.value)
                            }
                            className="w-full border p-1 rounded"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={row.description}
                            onChange={(e) =>
                              updateDeviceRow4(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full border p-1 rounded"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={row.quantity}
                            onChange={(e) => {
                              const quantity = e.target.value;
                              const amount = (
                                parseFloat(quantity) *
                                parseFloat(row.unit_of_measurement || "0")
                              ).toFixed(2);
                              updateDeviceRow4(index, "quantity", quantity);
                              updateDeviceRow4(index, "amount", amount);
                            }}
                            className="w-full border p-1 rounded"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={row.unit_of_measurement || ""}
                            onChange={(e) => {
                              const unitPrice = e.target.value;
                              const amount = (
                                parseFloat(row.quantity || "0") *
                                parseFloat(unitPrice)
                              ).toFixed(2);
                              updateDeviceRow4(
                                index,
                                "unit_of_measurement",
                                unitPrice
                              );
                              updateDeviceRow4(index, "amount", amount);
                            }}
                            className="w-full border p-1 rounded"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={row.amount}
                            readOnly
                            className="w-full border p-1 rounded bg-gray-100 dark:bg-gray-dark"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              className="bg-white text-red-800 border border-red-800 uppercase px-2 py-1 rounded"
                              onClick={() => removeDeviceRow4(index)}
                            >
                              Remove
                            </button>
                            <button
                              type="button"
                              className="bg-white border uppercase border-blue-800  text-blue-800 px-2 py-1 rounded"
                              onClick={() => addSubRow4(index)}
                            >
                              + Subrow
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Subrows (if any) */}
                      {row.subrows?.map((subrow, subIndex) => (
                        <tr key={subIndex} className="dark:text-white">
                          <td className="px-4 py-2 pl-10">
                            {" "}
                            {/* Indentation for subrow */}
                            <input
                              type="text"
                              value={subrow.item}
                              onChange={(e) =>
                                updateSubRow4(
                                  index,
                                  subIndex,
                                  "item",
                                  e.target.value
                                )
                              }
                              className="w-full border p-1 rounded"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={subrow.description}
                              onChange={(e) =>
                                updateSubRow4(
                                  index,
                                  subIndex,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="w-full border p-1 rounded"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={subrow.quantity}
                              onChange={(e) => {
                                const quantity = e.target.value;
                                const amount = (
                                  parseFloat(quantity) *
                                  parseFloat(subrow.unit_of_measurement || "0")
                                ).toFixed(2);
                                updateSubRow4(
                                  index,
                                  subIndex,
                                  "quantity",
                                  quantity
                                );
                                updateSubRow4(
                                  index,
                                  subIndex,
                                  "amount",
                                  amount
                                );
                              }}
                              className="w-full border p-1 rounded"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={subrow.unit_of_measurement || ""}
                              onChange={(e) => {
                                const unitPrice = e.target.value;
                                const amount = (
                                  parseFloat(subrow.quantity || "0") *
                                  parseFloat(unitPrice)
                                ).toFixed(2);
                                updateSubRow4(
                                  index,
                                  subIndex,
                                  "unit_of_measurement",
                                  unitPrice
                                );
                                updateSubRow4(
                                  index,
                                  subIndex,
                                  "amount",
                                  amount
                                );
                              }}
                              className="w-full border p-1 rounded "
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={subrow.amount}
                              readOnly
                              className="w-full border p-1 rounded bg-gray-100 dark:bg-gray-dark"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <button
                              type="button"
                              className="bg-white text-red-800 border border-red-800 uppercase px-2 py-1 rounded"
                              onClick={() => removeSubRow4(index, subIndex)}
                            >
                              Remove Subrow
                            </button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-right text-xl font-bold mt-6 dark:text-white">
              Total Amount: ₱{getTotalAmountIncludingNew4().toFixed(2)}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ActiveNav4;
