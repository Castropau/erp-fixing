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
const ActiveNav2 = (props: BomIds) => {
  const [activeNav, setActiveNav] = useState(2);

  const [deviceRows2, setDeviceRows2] = useState<DeviceRow[]>([]);
  const [newHeaders2, setNewHeaders2] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);
  const [headers2, setHeaders2] = useState<
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
  return (
    <>
      {activeNav === 2 && (
        <>
          <div className="space-y-1">
            {/* <div className="flex justify-end gap-4">
              <button
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
              </button>
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={addHeader2}
              >
                Add Header
              </button>
            </div> */}

            {/* Device Table */}
            <table className="table-auto w-full text-sm text-left  border ">
              <thead className="bg-gray-100 dark:bg-gray-dark">
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
                        className="bg-red-500 text-white px-3 py-1 rounded"
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
                          updateNewHeaderMainTitle2(headerIndex, e.target.value)
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
                                updateNewHeaderTitle2(
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
                                  updateNewHeaderRow2(
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
                                removeRowFromNewHeader2(
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
                            addRowToNewHeader2(headerIndex, subIndex)
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
            Total Amount: ₱{getTotalAmountIncludingNew2().toFixed(2)}
          </div>
        </>
      )}
    </>
  );
};

export default ActiveNav2;
