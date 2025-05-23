import { fetchbomId } from "@/api/bill_of_materials/fetchBomId";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
interface DeviceRow {
  item: string;
  description: string;
  quantity: string;
  unit_of_measurement: string;
  srp: number;
}

interface ActiveNav4Props {
  id: number;
  deviceRows4: DeviceRow[];
  setDeviceRows4: React.Dispatch<React.SetStateAction<DeviceRow[]>>;
  updateDeviceRow4: (
    index: number,
    key: keyof DeviceRow,
    value: string | number
  ) => void;
  getTotalAmountIncludingNew4: () => number;
  removeDeviceRow4: (index: number) => void;
  addSubRow4: (index: number) => void;
  updateSubRow4: (
    rowIndex: number,
    subRowIndex: number,
    key: keyof DeviceRow,
    value: string
  ) => void;
  removeSubRow4: (rowIndex: number, subRowIndex: number) => void;
}

const ActiveNav4 = ({
  id,
  deviceRows4,
  setDeviceRows4,
  updateDeviceRow4,
  getTotalAmountIncludingNew4,
  removeDeviceRow4,
  addSubRow4,
  updateSubRow4,
  removeSubRow4,
}: ActiveNav4Props) => {
  const [activeNav, setActiveNav] = useState(4);
  //   const [deviceRows4, setDeviceRows4] = useState<DeviceRow[]>([]);

  const [newHeaders4, setNewHeaders4] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);
  const [headers4, setHeaders4] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);

  //   const updateDeviceRow4 = (
  //     rowIndex: number,
  //     key: keyof DeviceRow,
  //     value: string | number
  //   ) => {
  //     setDeviceRows4((prevRows) => {
  //       const updated = [...prevRows];
  //       updated[rowIndex] = {
  //         ...updated[rowIndex],
  //         [key]: value,
  //       };
  //       return updated;
  //     });
  //   };
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

  const getNewHeaderSubtotal4 = (rows: DeviceRow[]) => {
    return rows.reduce((sum, row) => {
      const amount = parseFloat(row.amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  };

  //   const getTotalAmountIncludingNew4 = () => {
  //     const savedTotal = headers4.reduce((sum, header) => {
  //       return sum + getHeaderSubtotal(header.rows);
  //     }, 0);

  //     const newHeadersTotal = newHeaders4.reduce((sum, newHeader) => {
  //       return sum + getNewHeaderSubtotal4(newHeader.rows);
  //     }, 0);

  //     return savedTotal + newHeadersTotal;
  //   };
  //   const removeDeviceRow4 = (index: number) => {
  //     const updated = [...deviceRows4];
  //     updated.splice(index, 1);
  //     setDeviceRows4(updated);
  //   };

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

  //   useEffect(() => {
  //     if (BomData?.general_header) {
  //       const generalRowsFormatted: DeviceRow[] = BomData.general_header.map(
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
  //   }, [BomData]);

  //   const addSubRow4 = (rowIndex: number) => {
  //     const updatedRows = [...deviceRows4];
  //     const currentRow = updatedRows[rowIndex];

  //     const newSubRow = {
  //       item: "",
  //       description: "",
  //       quantity: "",
  //       unit_of_measurement: "",
  //       srp: "",
  //       amount: "0.00",
  //     };

  //     if (!currentRow.subrows) {
  //       currentRow.subrows = [];
  //     }

  //     currentRow.subrows.push(newSubRow);
  //     setDeviceRows4(updatedRows);
  //   };

  //   const updateSubRow4 = (
  //     rowIndex: number,
  //     subRowIndex: number,
  //     key: keyof SubRow,
  //     value: string
  //   ) => {
  //     setDeviceRows4((prevRows) => {
  //       const updatedRows = [...prevRows];
  //       const subrow = updatedRows[rowIndex].subrows?.[subRowIndex];
  //       if (subrow) {
  //         subrow[key] = value;

  //         // Update amount if quantity or unit price changed
  //         const quantity = parseFloat(subrow.quantity || "0");
  //         const unitPrice = parseFloat(subrow.unit_of_measurement || "0");
  //         subrow.amount = (quantity * unitPrice).toFixed(2);
  //       }
  //       return updatedRows;
  //     });
  //   };

  //   const removeSubRow4 = (rowIndex: number, subRowIndex: number) => {
  //     setDeviceRows4((prevRows) => {
  //       const updatedRows = [...prevRows];
  //       updatedRows[rowIndex].subrows?.splice(subRowIndex, 1);
  //       return updatedRows;
  //     });
  //   };
  //   const removeSubRow4 = (rowIndex: number, subRowIndex: number) => {
  //     setDeviceRows4((prevRows) => {
  //       const updatedRows = [...prevRows];

  //       // Clone the subrows safely
  //       const currentSubRows = updatedRows[rowIndex].subrows || [];

  //       // Filter out the subrow at the specified index
  //       const newSubRows = currentSubRows.filter((_, i) => i !== subRowIndex);

  //       // Assign the filtered subrows back
  //       updatedRows[rowIndex] = {
  //         ...updatedRows[rowIndex],
  //         subrows: newSubRows,
  //       };

  //       return updatedRows;
  //     });
  //   };
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
                      srp: "",
                      subrows: [],
                    },
                  ])
                }
              >
                Add Row
              </button>
            </div>

            {/* Device Table */}
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm text-left  border">
                <thead className="bg-gray-100 dark:bg-gray-dark uppercase">
                  <tr>
                    <th className="px-4 py-2">Item4</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Unit of measurement</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {deviceRows4.map((row, index) => (
                    <React.Fragment key={index}>
                      {/* Main Row */}
                      <tr>
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
                            onChange={(e) =>
                              updateDeviceRow4(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                            className="w-full border p-1 rounded"
                          />
                        </td>

                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={row.unit_of_measurement}
                            onChange={(e) =>
                              updateDeviceRow4(
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
                            value={row.srp}
                            onChange={(e) =>
                              updateDeviceRow4(index, "srp", e.target.value)
                            }
                            className="w-full border p-1 rounded"
                          />
                        </td>

                        {/* <td className="px-4 py-2">
                                            <input
                                              type="text"
                                              readOnly
                                              value={(
                                                (parseFloat(row.quantity || "0") ||
                                                  0) *
                                                (parseFloat(row.srp || "0") || 0)
                                              ).toFixed(2)}
                                              className="w-full border p-1 rounded bg-gray-100 dark:bg-gray-dark"
                                            />
                                          </td> */}

                        <td className="px-4 py-2">
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              className="bg-white border border-red-800 text-red-800 uppercase px-2 py-1 rounded"
                              onClick={() => removeDeviceRow4(index)}
                            >
                              Remove
                            </button>
                            <button
                              type="button"
                              className="bg-white border border-blue-800 uppercase text-blue-800 px-2 py-1 rounded"
                              onClick={() => addSubRow4(index)}
                            >
                              + Subrow
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Subrows (if any) */}
                      {row.subrows?.map((subrow, subIndex) => (
                        <tr key={subIndex}>
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
                              className="w-full border p-1 rounded"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={subrow.srp}
                              onChange={(e) => {
                                const srp = e.target.value;
                                updateSubRow4(index, subIndex, "srp", srp);

                                // Recalculate amount based on updated SRP and quantity
                                const quantity = parseFloat(
                                  subrow.quantity || "0"
                                );
                              }}
                              className="w-full border p-1 rounded"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <button
                              type="button"
                              className="bg-white border border-red-800 text-red-800 uppercase px-2 py-1 rounded"
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

            <div className="text-right text-xl font-bold mt-6">
              Total Amount: ₱{getTotalAmountIncludingNew4().toFixed(2)}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ActiveNav4;
