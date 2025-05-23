// import { fetchbomId } from "@/api/bill_of_materials/fetchBomId";
import { registerBom } from "@/api/bill_of_materials/addBom";
import { BomId, fetchbomId } from "@/api/bill_of_materials/fetchBomId";
import { fetchbomClient } from "@/api/bill_of_materials/fetchClients";
import { fetchEicUser, EicUser } from "@/api/bill_of_materials/fetchEic";
import { fetchSicUser, SicUser } from "@/api/bill_of_materials/fetchSic";
import { updateBomId, updatebomId } from "@/api/bill_of_materials/updateBomId";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import ActiveNav1 from "../AddComponents/ActiveNav1";
import ActiveNav2 from "../AddComponents/ActiveNav2";
import ActiveNav3 from "../AddComponents/ActiveNav3";
import ActiveNav4 from "../AddComponents/ActiveNav4";

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
const AddBom = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeNav, setActiveNav] = useState(1);
  // const [deviceRows, setDeviceRows] = useState<DeviceRow[]>([]);

  const queryClient = useQueryClient();

  const {
    mutate: registerbom,
    isError,
    error,
  } = useMutation({
    mutationFn: (bomData: AddBom) => registerBom(bomData),
    onSuccess: () => {
      console.log("bom registered successfully");
      queryClient.invalidateQueries({ queryKey: ["bom"] });
      setShowEditModal(false);
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
    },
  });
  const {
    isLoading: Uloading,
    error: uerror,
    data: udata,
  } = useQuery<SicUser[]>({
    queryKey: ["users_sic"],
    queryFn: fetchSicUser,
  });

  const {
    isLoading: Eicloading,
    error: Eicerror,
    data: eicData,
  } = useQuery<EicUser[]>({
    queryKey: ["users_eic"],
    queryFn: fetchEicUser,
  });
  const {
    isLoading: Clientloading,
    error: clienterror,
    data: clientdata,
  } = useQuery<ClientUser[]>({
    queryKey: ["client"],
    queryFn: fetchbomClient,
  });

  // Handle changes in input fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [headers, setHeaders] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);
  const [newHeaders, setNewHeaders] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);

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

  const addHeader = () => {
    setNewHeaders([
      ...newHeaders,
      {
        title: "",
        rows: [
          {
            item: "",
            description: "",
            quantity: "",
            unit_of_measurement: "",
            srp: 0,
          },
        ],
      },
    ]);
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
  const updateNewHeaderTitle = (headerIndex: number, newTitle: string) => {
    setNewHeaders((prevHeaders) => {
      const updatedHeaders = [...prevHeaders];
      updatedHeaders[headerIndex].title = newTitle;
      return updatedHeaders;
    });
  };

  const updateNewHeaderRow = (
    headerIndex: number,
    rowIndex: number,
    field: keyof DeviceRow,
    newValue: string
  ) => {
    setNewHeaders((prevHeaders) => {
      const updatedHeaders = [...prevHeaders];
      updatedHeaders[headerIndex].rows[rowIndex][field] = newValue;
      return updatedHeaders;
    });
  };

  const addRowToNewHeader = (headerIndex: number) => {
    const updated = [...newHeaders];
    updated[headerIndex].rows.push({
      item: "",
      description: "",
      quantity: "",
      unit_of_measurement: "",
      srp: 0,
    });
    setNewHeaders(updated);
  };
  const removeRowFromNewHeader = (headerIndex: number, rowIndex: number) => {
    setNewHeaders((prevHeaders) => {
      const updatedHeaders = [...prevHeaders];
      updatedHeaders[headerIndex].rows.splice(rowIndex, 1);
      return updatedHeaders;
    });
  };

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

  //   const getNewHeaderSubtotal = (rows: DeviceRow[]) => {
  //     return rows.reduce((sum, row) => {
  //       const amount = parseFloat(row.amount);
  //       return sum + (isNaN(amount) ? 0 : amount);
  //     }, 0);
  //   };
  const getNewHeaderSubtotal = (rows: DeviceRow[]) => {
    return rows.reduce((total, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const unit_of_measurement = parseFloat(row.unit_of_measurement) || 0;
      return total + quantity * unit_of_measurement;
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

  const [deviceRows3, setDeviceRows3] = useState<DeviceRow[]>([]);
  const [newHeaders3, setNewHeaders3] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);
  const [headers3, setHeaders3] = useState<
    { title: string; rows: DeviceRow[] }[]
  >([]);

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

  const updateNewHeaderRow3 = (
    headerIndex: number,
    rowIndex: number,
    key: keyof DeviceRow,
    value: string
  ) => {
    const updated = [...newHeaders3];
    const row = updated[headerIndex].rows[rowIndex];
    row[key] = value;

    const quantity = parseFloat(row.quantity);
    const unitPrice = parseFloat(row.unitPrice);
    row.amount =
      !isNaN(quantity) && !isNaN(unitPrice)
        ? (quantity * unitPrice).toFixed(2)
        : "";

    setNewHeaders3(updated);
  };
  const addRowToNewHeader3 = (headerIndex: number) => {
    const updated = [...newHeaders3];
    updated[headerIndex].rows.push({
      item: "",
      description: "",
      quantity: "",
      unitPrice: "",
      amount: "",
    });
    setNewHeaders3(updated);
  };

  const removeRowFromNewHeader3 = (headerIndex: number, rowIndex: number) => {
    const updated = [...newHeaders3];
    updated[headerIndex].rows.splice(rowIndex, 1);
    setNewHeaders3(updated);
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

  const updateNewHeaderRow4 = (
    headerIndex: number,
    rowIndex: number,
    key: keyof DeviceRow,
    value: string
  ) => {
    const updated = [...newHeaders4];
    const row = updated[headerIndex].rows[rowIndex];
    row[key] = value;

    const quantity = parseFloat(row.quantity);
    const unitPrice = parseFloat(row.unit_of_measurement);
    row.amount =
      !isNaN(quantity) && !isNaN(unitPrice)
        ? (quantity * unitPrice).toFixed(2)
        : "";

    setNewHeaders4(updated);
  };
  const addRowToNewHeader4 = (headerIndex: number) => {
    const updated = [...newHeaders4];
    updated[headerIndex].rows.push({
      item: "",
      description: "",
      quantity: "",
      unit_of_measurement: "",
      amount: "",
    });
    setNewHeaders4(updated);
  };

  const removeRowFromNewHeader4 = (headerIndex: number, rowIndex: number) => {
    const updated = [...newHeaders4];
    updated[headerIndex].rows.splice(rowIndex, 1);
    setNewHeaders4(updated);
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
  const [deviceRows, setDeviceRows] = useState([
    {
      item: "",
      description: "",
      quantity: "",
      unit_of_measurement: "",
      srp: 0,
    },
  ]);

  //   if (Rloading) {
  //     return <div>Loading...</div>;
  //   }

  //   if (ReceiptError) {
  //     return <div>Error: {rerror?.message}</div>;
  //   }
  return (
    <div>
      <button
        // className="btn btn-primary uppercase text-white px-6 py-2 rounded-md shadow hover:bg-blue-600"
        className="btn bg-white text-black border border-black mr-4 uppercase"
        onClick={() => setShowEditModal(true)}
      >
        {/* <FaPlus /> */}
        Add BOM
      </button>

      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 mt-19 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={() => setShowEditModal(false)}
          />
          <div
            className="relative z-10 bg-white p-8 rounded-lg shadow-xl w-full max-w-5xl overflow-y-auto max-h-[90vh] dark:bg-gray-dark"
            onClick={(e) => e.stopPropagation()} // Prevent modal click from closing
          >
            {/* <h2 className="text-2xl font-semibold mb-6 text-center uppercase dark:text-white">
              Add BOM
            </h2> */}
            <Formik
              initialValues={{
                input1: "",
                input2: "",
                input3: "",
                input4: "",
                input5: "",
                input6: "",
                input7: "",
                input8: "",
                input9: "",
              }}
              enableReinitialize={true} // important to update if BomData changes
              onSubmit={(values) => {
                const payload = {
                  bom_no: values.input1,
                  date: values.input2,
                  sic: values.input3,
                  client: values.input4,
                  status: values.input5,
                  eic: values.input6,
                  project_name: values.input7,
                  project_site: values.input8,
                  first_header: values.input9,

                  // 👇 device
                  device_items: deviceRows.map((row, index) => ({
                    item: row.item,
                    description: row.description,
                    quantity: Number(row.quantity),
                    srp: Number(row.srp),
                    unit_of_measurement: row.unit_of_measurement || "",
                    total_amount: Number(row.amount),
                    order: index + 1,
                  })),

                  // 👇 Add device header
                  device_header: newHeaders.map((header, hIndex) => ({
                    header: header.title,
                    header_sub_total: header.rows.reduce(
                      (sum, row) => sum + Number(row.amount),
                      0
                    ),
                    items: header.rows.map((row, rIndex) => ({
                      item: row.item,
                      description: row.description,
                      quantity: Number(row.quantity),
                      srp: Number(row.srp),
                      unit_of_measurement: row.unit_of_measurement || "",
                      total_amount: Number(row.amount),
                      order: rIndex + 1,
                    })),
                  })),
                  // material
                  material_items: deviceRows2.map((row, index) => ({
                    item: row.item,
                    description: row.description,
                    quantity: Number(row.quantity),
                    srp: Number(row.srp),
                    unit_of_measurement: row.unit_of_measurement || "",
                    total_amount: Number(row.amount),
                    order: index + 1,
                  })),

                  material_header: newHeaders2.map((header, hIndex) => ({
                    header: header.title,
                    header_sub_total: header.rows.reduce((sum, row) => {
                      const quantity = Number(row.quantity) || 0;
                      const srp = Number(row.srp) || 0;
                      return sum + quantity * srp;
                    }, 0),
                    items: header.rows.map((row, rIndex) => {
                      const quantity = Number(row.quantity) || 0;
                      const srp = Number(row.srp) || 0;
                      return {
                        item: row.item,
                        description: row.description,
                        quantity,
                        srp,
                        unit_of_measurement: row.unit_of_measurement || "",
                        total_amount: quantity * srp,
                        order: rIndex + 1,
                      };
                    }),
                  })),

                  // labor
                  labor_items: deviceRows3.map((row, index) => ({
                    item: row.item,
                    description: row.description,
                    quantity: row.quantity || 0,
                    srp: row.srp || 0,
                    unit_of_measurement: row.unit_of_measurement || "",
                    total_amount: Number(row.total_amount),
                    order: index + 1,
                  })),
                  labor_header: newHeaders3.map((header, hIndex) => ({
                    header: header.title,
                    header_sub_total: header.rows.reduce((sum, row) => {
                      const quantity = Number(row.quantity) || 0;
                      const unitPrice = Number(row.srp) || 0;
                      return sum + quantity * unitPrice;
                    }, 0),
                    items: header.rows.map((row, rIndex) => {
                      const quantity = Number(row.quantity) || 0;
                      const unitPrice = Number(row.srp) || 0;
                      return {
                        item: row.item,
                        description: row.description,
                        quantity,
                        srp: unitPrice,
                        unit_of_measurement: row.unit_of_measurement || "",
                        total_amount: quantity * unitPrice,
                        order: rIndex + 1,
                      };
                    }),
                  })),

                  general_header: deviceRows4.map((row, index) => ({
                    // id: index + 1,
                    order: index + 1,
                    item: row.item,
                    description: row.description,
                    quantity: Number(row.quantity) || 0,
                    unit_of_measurement: row.unit_of_measurement,
                    srp: Number(row.srp) || 0,
                    header_sub_total:
                      (Number(row.quantity) || 0) * (Number(row.srp) || 0),
                    items:
                      row.subrows?.map((sub, subIndex) => ({
                        // id: subIndex + 1,
                        order: subIndex + 1,
                        item: sub.item,
                        description: sub.description,
                        quantity: Number(sub.quantity),
                        unit_of_measurement: sub.unit_of_measurement,
                        srp: 0, // or assign the actual SRP if available
                        total_amount: (Number(sub.quantity) || 0) * 0, // update if subrow has srp
                      })) || [],
                  })),
                };

                console.log(payload);
                registerbom(payload);
              }}
            >
              {({ values, handleChange }) => (
                <Form>
                  {/* <div className="grid grid-cols-2 gap-3 mb-1 uppercase"> */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-1 gap-1">
                    {Object.keys(values).map((key, index) => {
                      const labelText = (() => {
                        switch (key) {
                          case "input1":
                            return "BOM No.";
                          case "input2":
                            return "Date Created";
                          case "input3":
                            return "SIC";
                          case "input4":
                            return "Client";
                          case "input5":
                            return "Status";
                          case "input6":
                            return "EIC";
                          case "input7":
                            return "Project Name";
                          case "input8":
                            return "Project Site";
                          case "input9":
                            return "Header";
                          default:
                            return `Input ${index + 1}`;
                        }
                      })();

                      return (
                        <div key={key} className="flex flex-col">
                          <label className="text-sm font-bold mb-1 dark:text-white">
                            {labelText}
                          </label>

                          {key === "input2" ? (
                            <Field
                              type="date"
                              name={key}
                              value={values[key]}
                              onChange={handleChange}
                              className="input input-bordered w-full p-3 rounded-md border border-gray-300 dark:bg-gray-800 dark:text-white"
                            />
                          ) : ["input3", "input4", "input5", "input6"].includes(
                              key
                            ) ? (
                            <select
                              name={key}
                              value={values[key]}
                              onChange={handleChange}
                              className="input input-bordered w-full rounded-md border border-gray-300 dark:bg-gray-800 dark:text-white"
                            >
                              <option value="">
                                {key === "input3"
                                  ? "Select SIC"
                                  : key === "input4"
                                  ? "Select Client"
                                  : key === "input5"
                                  ? "Select Status"
                                  : "Select EIC"}
                              </option>

                              {key === "input3"
                                ? udata?.map((user) => (
                                    <option key={user.id} value={user.id}>
                                      {user.full_name}
                                    </option>
                                  ))
                                : key === "input6"
                                ? eicData?.map((eic) => (
                                    <option key={eic.id} value={eic.id}>
                                      {eic.full_name}
                                    </option>
                                  ))
                                : key === "input4"
                                ? clientdata?.map((client) => (
                                    <option key={client.id} value={client.id}>
                                      {client.client}
                                    </option>
                                  ))
                                : [
                                    "Pending",
                                    "Approved",
                                    "Revise",
                                    "Noted",
                                    "Cancelled",
                                  ].map((status) => (
                                    <option key={status} value={status}>
                                      {status}
                                    </option>
                                  ))}
                            </select>
                          ) : (
                            <Field
                              type="text"
                              name={key}
                              value={values[key]}
                              onChange={handleChange}
                              className="input input-bordered w-full rounded-md border border-gray-300 dark:bg-gray-800 dark:text-white"
                              placeholder={`Enter ${labelText}`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md"
                  >
                    Save
                  </button> */}
                  {/* Navigation */}
                  <div className="flex justify-between gap-2 mb-2">
                    {["Devices", "Materials", "Labor", "General"].map(
                      (label, index) => (
                        <button
                          type="button"
                          key={label}
                          onClick={() => setActiveNav(index + 1)}
                          className={`flex-1 py-2 rounded-md font-medium transition-all ${
                            activeNav === index + 1
                              ? "bg-blue-500 text-white shadow-md"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {label}
                        </button>
                      )
                    )}
                  </div>
                  {/* Devices Section */}
                  {activeNav === 1 && (
                    <ActiveNav1
                      deviceRows={deviceRows}
                      setDeviceRows={setDeviceRows}
                      newHeaders={newHeaders}
                      addHeader={addHeader}
                      updateNewHeaderTitle={updateNewHeaderTitle}
                      updateNewHeaderRow={updateNewHeaderRow}
                      addRowToNewHeader={addRowToNewHeader}
                      removeRowFromNewHeader={removeRowFromNewHeader}
                      cancelNewHeader={cancelNewHeader}
                      getNewHeaderSubtotal={getNewHeaderSubtotal}
                    />
                  )}
                  {activeNav === 2 && (
                    <ActiveNav2
                      deviceRows2={deviceRows2}
                      setDeviceRows2={setDeviceRows2}
                      newHeaders2={newHeaders2}
                      addHeader2={addHeader2}
                      updateNewHeaderTitle2={updateNewHeaderTitle2}
                      updateNewHeaderRow2={updateNewHeaderRow2}
                      addRowToNewHeader2={addRowToNewHeader2}
                      removeRowFromNewHeader2={removeRowFromNewHeader2}
                      cancelNewHeader2={cancelNewHeader2}
                      getNewHeaderSubtotal={getNewHeaderSubtotal}
                    />
                  )}
                  {activeNav === 3 && (
                    <ActiveNav3
                      deviceRows3={deviceRows3}
                      setDeviceRows3={setDeviceRows3}
                      newHeaders3={newHeaders3}
                      addHeader3={addHeader3}
                      updateNewHeaderTitle3={updateNewHeaderTitle3}
                      updateNewHeaderRow3={updateNewHeaderRow3}
                      addRowToNewHeader3={addRowToNewHeader3}
                      removeRowFromNewHeader3={removeRowFromNewHeader3}
                      cancelNewHeader3={cancelNewHeader3}
                      getNewHeaderSubtotal={getNewHeaderSubtotal}
                    />
                  )}
                  {/* Unit Price{" "} */}
                  {activeNav === 4 && (
                    <ActiveNav4
                      deviceRows4={deviceRows4}
                      setDeviceRows4={setDeviceRows4}
                      newHeaders4={newHeaders4}
                      addHeader4={addHeader4}
                      updateNewHeaderTitle4={updateNewHeaderTitle4}
                      updateNewHeaderRow4={updateNewHeaderRow4}
                      addRowToNewHeader4={addRowToNewHeader4}
                      removeRowFromNewHeader4={removeRowFromNewHeader4}
                      cancelNewHeader4={cancelNewHeader4}
                      getNewHeaderSubtotal4={getNewHeaderSubtotal4}
                    />
                  )}
                  {/* Render Saved Headers */}
                  <div className="mt-6 space-y-4">
                    {headers4.map((header, hIdx) => (
                      <div
                        key={hIdx}
                        className="border p-4 bg-gray-50 rounded space-y-2"
                      >
                        <h3 className="text-xl font-semibold">
                          {header.title}
                        </h3>
                        <table className="table-auto w-full text-sm text-left text-gray-700">
                          <thead className="bg-gray-200">
                            <tr>
                              <th className="px-4 py-2">Item</th>
                              <th className="px-4 py-2">Description</th>
                              <th className="px-4 py-2">Quantity</th>
                              <th className="px-4 py-2">Unit Price</th>
                              <th className="px-4 py-2">Amount</th>
                              <th className="px-4 py-2">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {header.rows.map((row, rIdx) => (
                              <tr key={rIdx}>
                                {[
                                  "item",
                                  "description",
                                  "quantity",
                                  "unitPrice",
                                  "amount",
                                ].map((field) => (
                                  <td key={field} className="px-4 py-2">
                                    <input
                                      type="text"
                                      value={row[field as keyof DeviceRow]}
                                      onChange={(e) =>
                                        updateHeaderRow4(
                                          hIdx,
                                          rIdx,
                                          field as keyof DeviceRow,
                                          e.target.value
                                        )
                                      }
                                      className="p-2 border rounded"
                                    />
                                  </td>
                                ))}
                                <td className="px-4 py-2">
                                  <button
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                    onClick={() => removeHeaderRow4(hIdx, rIdx)}
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Subtotal Display */}
                        <div className="text-right text-sm font-semibold text-gray-700 mt-2">
                          Subtotal: ₱
                          {getHeaderSubtotal4(header.rows).toFixed(2)}
                        </div>

                        <button
                          className="bg-green-500 text-white px-4 py-1 rounded mt-2"
                          onClick={() => addRowToHeader4(hIdx)}
                        >
                          Add Row
                        </button>
                      </div>
                    ))}
                  </div>
                  {/* Footer Buttons */}
                  <div className="flex justify-end gap-4 mt-8">
                    <button
                      className="py-2 px-6 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="py-2 px-6 rounded-md text-white bg-blue-500 hover:bg-blue-600"
                      //   onClick={handleSave}
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBom;
