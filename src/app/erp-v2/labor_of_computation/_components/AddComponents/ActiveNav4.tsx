import { fetchDefaultsList } from "@/api/bill_of_materials/fetchDefaults";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";

const ActiveNav4 = () => {
  const [activeNav, setActiveNav] = useState(4);
  const [deviceRows4, setDeviceRows4] = useState<DeviceRow[]>([]);

  const [newHeaders4, setNewHeaders4] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);
  const [headers4, setHeaders4] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);
  const {
    data: LaborData,
    isLoading: Rloading,
    isError: ReceiptError,
    error: rerror,
    refetch: fetchDefaults,
  } = useQuery({
    queryKey: ["defaults"],
    queryFn: fetchDefaultsList,
    enabled: false, // prevent automatic fetch
  });
  useEffect(() => {
    if (LaborData && LaborData.length) {
      const sectionKeys = Object.keys(LaborData[0]);

      const newHeadersData = {
        roughing_ins: [],
        wiring_ins: [],
        device_installations: [],
        configurations: [],
        testing_and_commissionings: [],
      };

      sectionKeys.forEach((sectionKey) => {
        const sectionArray = LaborData[0][sectionKey];

        if (Array.isArray(sectionArray)) {
          sectionArray.forEach((sectionEntry) => {
            const mainHeaderTitle =
              sectionEntry.header ||
              sectionKey.replace(/_/g, " ").toUpperCase();

            const subHeaders =
              sectionEntry.sub_headers && sectionEntry.sub_headers.length
                ? sectionEntry.sub_headers
                : [
                    {
                      sub_header: "",
                      items: sectionEntry.items || [],
                    },
                  ];

            const formattedSubHeaders = subHeaders.map((sub) => ({
              title: sub.sub_header || "", // Optional sub-header title
              manuallyAdded: false,
              rows:
                sub.items?.map((item) => ({
                  item: item.item || "",
                  ratio: item.ratio || "",
                  unit: item.unit || "",
                  quantity: "",
                  manpower: "",
                  no_of_days: "",
                  labor_cost: item.labor_cost?.toString() || "",
                  per_unit_cost: "",
                })) || [],
            }));

            // Track if sub_header is empty
            const showSubHeaderButton = formattedSubHeaders.some(
              (sub) => sub.title === ""
            );

            newHeadersData[sectionKey].push({
              header: mainHeaderTitle,
              rows: formattedSubHeaders,
              showSubHeaderButton, // Flag to indicate if "Add Sub-header" should show
            });
          });
        }
      });

      // setNewHeaders(newHeadersData.roughing_ins);
      // setNewHeaders2(newHeadersData.wiring_ins);
      // setNewHeaders3(newHeadersData.device_installations);
      setNewHeaders4(newHeadersData.configurations);
      // setNewHeaders5(newHeadersData.testing_and_commissionings);
    }
  }, [LaborData]);
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

  return (
    <>
      {activeNav === 4 && (
        <>
          <div className="space-y-6 text-sm">
            {/* <div className="flex justify-end gap-4">
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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
              <button
                                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                  onClick={addHeader4}
                                >
                                  Add Header
                                </button>
            </div> */}

            {/* Device Table */}
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm text-left  border">
                <thead className="bg-gray-100 dark:bg-gray-dark">
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
                            className="w-full border p-1 rounded bg-gray-100 text-gray-700"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              className="bg-red-500 text-white px-2 py-1 rounded"
                              onClick={() => removeDeviceRow4(index)}
                            >
                              Remove
                            </button>
                            <button
                              type="button"
                              className="bg-blue-500 text-white px-2 py-1 rounded"
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
                              value={subrow.amount}
                              readOnly
                              className="w-full border p-1 rounded bg-gray-100 text-gray-700"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <button
                              type="button"
                              className="bg-red-500 text-white px-2 py-1 rounded"
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
              {newHeaders4.map((header, headerIndex) => (
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
                            updateNewHeaderMainTitle4(
                              headerIndex,
                              e.target.value
                            )
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
                                  updateNewHeaderTitle4(
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
                                    updateNewHeaderRow4(
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
                                type="button"
                                className="bg-white text-red-800 uppercase border border-red-800 px-2 py-1 rounded"
                                onClick={() =>
                                  removeRowFromNewHeader4(
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

                      {/* Add Row button */}
                      <tr>
                        <td colSpan={8}>
                          <button
                            type="button"
                            className="bg-white text-black border border-black uppercase px-4 py-2 rounded"
                            onClick={() =>
                              addRowToNewHeader4(headerIndex, subIndex)
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
              Total Amount: ₱{getTotalAmountIncludingNew4().toFixed(2)}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ActiveNav4;
