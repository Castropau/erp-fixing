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
const ActiveNav3 = (props: BomIds) => {
  const [activeNav, setActiveNav] = useState(3);

  const [deviceRows3, setDeviceRows3] = useState<DeviceRow[]>([]);
  const [newHeaders3, setNewHeaders3] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);
  const [headers3, setHeaders3] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);
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
  return (
    <>
      {activeNav === 3 && (
        <>
          <div className="space-y-1">
            {/* <div className="flex justify-end gap-4">
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={addHeader3}
              >
                Add Header
              </button>
            </div> */}

            {/* Device Table */}
            <table className="table-auto w-full text-sm text-left  border">
              <thead className="bg-gray-100 dark:bg-gray-dark">
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
                        className="w-full border p-1 rounded bg-gray-100 text-gray-700"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
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
                          updateNewHeaderMainTitle3(headerIndex, e.target.value)
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
                                updateNewHeaderTitle3(
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
                                  updateNewHeaderRow3(
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
                              className="bg-red-400 text-white px-2 py-1 rounded"
                              onClick={() =>
                                removeRowFromNewHeader3(
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
                    <tr className="text-start">
                      <td colSpan={8}>
                        <button
                          type="button"
                          className="bg-green-400 uppercase text-white px-4 py-2 rounded"
                          onClick={() =>
                            addRowToNewHeader3(headerIndex, subIndex)
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
            Total Amount: ₱{getTotalAmountIncludingNew3().toFixed(2)}
          </div>
        </>
      )}
    </>
  );
};

export default ActiveNav3;
