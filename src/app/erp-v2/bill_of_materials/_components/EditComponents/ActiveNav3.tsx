import { fetchbomId } from "@/api/bill_of_materials/fetchBomId";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
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

interface ActiveNav3Props {
  id: number;
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
  getNewHeaderSubtotal3: (rows: DeviceRow[]) => number;
  removeDeviceRow3: (index: number) => void; // ✅ Add this
}

// NavInputs
const ActiveNav3 = ({
  id,
  deviceRows3,
  setDeviceRows3,
  newHeaders3,
  addHeader3,
  updateNewHeaderTitle3,
  updateNewHeaderRow3,
  addRowToNewHeader3,
  removeRowFromNewHeader3,
  cancelNewHeader3,
  getNewHeaderSubtotal3,
  removeDeviceRow3, // ✅ Accept here
}: ActiveNav3Props) => {
  const [activeNav, setActiveNav] = useState(3);

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

  useEffect(() => {
    if (BomData?.labor_items) {
      const laborItemsFormatted: DeviceRow[] = BomData.labor_items.map(
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
  }, [BomData]);

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

  useEffect(() => {
    if (BomData?.labor_items) {
      const laborItemsFormatted: DeviceRow[] = BomData.labor_items.map(
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
  }, [BomData]);
  const getHeaderSubtotal = (rows: DeviceRow[]) => {
    return rows.reduce((sum, row) => {
      const amount = parseFloat(row.amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  };

  const getTotalAmountIncludingNew = () => {
    const savedTotal = deviceRows.reduce((sum, row) => {
      return sum + row.total_amount || 0;
    }, 0);

    const newHeadersTotal = newHeaders.reduce((sum, newHeader) => {
      return sum + getNewHeaderSubtotal(newHeader.rows);
    }, 0);

    return savedTotal + newHeadersTotal;
  };

  const getNewHeaderSubtotal = (rows: DeviceRow[]) => {
    return rows.reduce((total, row) => {
      const srp = parseFloat(row.srp as any) || 0;
      const quantity = parseFloat(row.quantity as any) || 0;
      return total + quantity * srp;
    }, 0);
  };
  const [deviceRows2, setDeviceRows2] = useState<DeviceRow[]>([]);
  const [newHeaders2, setNewHeaders2] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);
  const [headers2, setHeaders2] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);
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

  const updateNewHeaderRow2 = (
    headerIndex: number,
    rowIndex: number,
    key: keyof DeviceRow,
    value: string
  ) => {
    const updated = [...newHeaders2];
    const row = updated[headerIndex].rows[rowIndex];
    row[key] = value;

    const quantity = parseFloat(row.quantity);
    const unitPrice = parseFloat(row.unitPrice);
    row.amount =
      !isNaN(quantity) && !isNaN(unitPrice)
        ? (quantity * unitPrice).toFixed(2)
        : "";

    setNewHeaders2(updated);
  };
  const addRowToNewHeader2 = (headerIndex: number) => {
    const updated = [...newHeaders2];
    updated[headerIndex].rows.push({
      item: "",
      description: "",
      quantity: "",
      unitPrice: "",
      amount: "",
    });
    setNewHeaders2(updated);
  };

  const removeRowFromNewHeader2 = (headerIndex: number, rowIndex: number) => {
    const updated = [...newHeaders2];
    updated[headerIndex].rows.splice(rowIndex, 1);
    setNewHeaders2(updated);
  };
  const saveNewHeader2 = (index: number) => {
    const headerToSave = newHeaders2[index];
    if (!headerToSave.title.trim()) return;
    setHeaders2([...headers2, headerToSave]);
    const updated = [...newHeaders2];
    updated.splice(index, 1);
    setNewHeaders2(updated);
  };

  useEffect(() => {
    if (BomData?.material_header) {
      const headersFromMaterial = BomData.material_header.map((header) => ({
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
  }, [BomData]);

  const [headers3, setHeaders3] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);

  const getTotalAmountIncludingNew3 = () => {
    const savedTotal = headers2.reduce((sum, header) => {
      return sum + getHeaderSubtotal(header.rows);
    }, 0);

    const newHeadersTotal = newHeaders3.reduce((sum, newHeader) => {
      return sum + getNewHeaderSubtotal3(newHeader.rows);
    }, 0);

    const deviceRowsTotal = deviceRows3.reduce((sum, row) => {
      return sum + (parseFloat(row.amount) || 0);
    }, 0);

    return savedTotal + newHeadersTotal + deviceRowsTotal;
  };

  useEffect(() => {
    if (BomData?.labor_items) {
      const laborItemsFormatted: DeviceRow[] = BomData.labor_items.map(
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
  }, [BomData]);

  const [deviceRows4, setDeviceRows4] = useState<DeviceRow[]>([]);

  const [newHeaders4, setNewHeaders4] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);
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

  useEffect(() => {
    if (BomData?.general_header) {
      const rowsFromGeneral = BomData.general_header.map((header) => {
        return {
          item: header.item || "",
          description: header.description || "",
          quantity: header.quantity?.toString() || "",
          unit_of_measurement: header.unit_of_measurement || "",
          //   amount: ((header.quantity || 0) * (header.srp || 0)).toFixed(2),
          amount: header.header_sub_total?.toString() || "", // ✅ Use this, not calculation

          srp: header.srp?.toString() || "0",
          subrows:
            header.items?.map((item) => ({
              item: item.item || "",
              description: item.description || "",
              quantity: item.quantity?.toString() || "",
              unit_of_measurement: item.unit_of_measurement || "",
              srp: item.srp?.toString() || "0", // ✅ this line is essential

              //   amount: ((item.quantity || 0) * (item.srp || 0)).toFixed(2),
              amount: item.total_amount?.toString() || "", // ⬅️ FIXED
            })) || [],
        };
      });

      setDeviceRows4(rowsFromGeneral);
    }
  }, [BomData]);

  const addSubRow4 = (rowIndex: number) => {
    const updatedRows = [...deviceRows4];
    const currentRow = updatedRows[rowIndex];

    const newSubRow = {
      item: "",
      description: "",
      quantity: "",
      unit_of_measurement: "",
      srp: "",
      amount: "0.00",
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
      {activeNav === 3 && (
        <>
          <div className="space-y-6">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="bg-white text-black border border-black px-4 py-2 rounded uppercase"
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
              <thead className="bg-gray-100 dark:bg-gray-dark uppercase">
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
                  <tr key={index}>
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
                            parseFloat(row.unit_of_measurement || "0")
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
                        className="w-full border p-1 rounded bg-gray-100 dark:bg-gray-dark dark:border-white dark:text-white"
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
                    {deviceRows3
                      .reduce(
                        (sum, row) => sum + (parseFloat(row.amount) || 0),
                        0
                      )
                      .toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>

            {/* New Header Forms */}
            {newHeaders3.map((header, headerIndex) => (
              <div
                key={headerIndex}
                className="border p-4 bg-gray-50 rounded space-y-4 mt-4 dark:bg-gray-dark"
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
                      className="bg-white border border-red-800  text-red-800 uppercase px-2 py-1 rounded"
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
                    className="bg-white text-black border border-black uppercase px-4 py-2 rounded"
                    onClick={() => addRowToNewHeader3(headerIndex)}
                  >
                    Add Row
                  </button>

                  <div className="space-x-2 flex items-center">
                    <span className="text-sm font-semibold ">
                      Subtotal: ₱{getNewHeaderSubtotal3(header.rows).toFixed(2)}
                    </span>
                    {/* <button
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                      onClick={() => saveNewHeader3(headerIndex)}
                    >
                      Save Header
                    </button> */}
                    <button
                      className="bg-white text-black border border-black uppercase px-4 py-2 rounded"
                      onClick={() => cancelNewHeader3(headerIndex)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-right text-xl font-bold mt-6">
            Total Amount: ₱{getTotalAmountIncludingNew3().toFixed(2)}
          </div>
        </>
      )}
    </>
  );
};

export default ActiveNav3;
