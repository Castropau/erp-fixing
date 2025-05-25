"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { fetchCashRequestId } from "@/api/cash-request/fetchCashRequestId";

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
  },
  section: {
    marginBottom: 10,
  },
  table: {
    display: "table",
    width: "100%",
    border: "1px solid black",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    border: "1px solid black",
    padding: 5,
    textAlign: "center",
  },
  heading: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    marginTop: 20,
  },
});

const OpenFile = () => {
  const [cashRequestData, setCashRequestData] = useState<any>(null);
  const [id, setId] = useState<string | null>(null);

  // Get `id` from query string
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id) {
      setId(id);
    }
  }, []);

  // Fetch the data based on `id` when the `id` is available
  const { data, isLoading, error } = useQuery(
    ["cashRequest", id],
    () => fetchCashRequestId(id as string),
    {
      enabled: !!id, // Only fetch when `id` is present
    }
  );

  useEffect(() => {
    if (data) {
      setCashRequestData(data);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data</div>;
  }

  if (!cashRequestData) {
    return <div>No data available</div>;
  }

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.heading}>Payment/Purchase Request Voucher</Text>
        <View style={styles.section}>
          <Text>Payment/Purchase Request: cashreq#{cashRequestData.id}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Item</Text>
            <Text style={styles.tableCell}>Quantity</Text>
            <Text style={styles.tableCell}>Unit</Text>
            <Text style={styles.tableCell}>Supplier</Text>
            <Text style={styles.tableCell}>Unit Price</Text>
            <Text style={styles.tableCell}>Total</Text>
          </View>
          {/* Repeat for each item in cashRequestData */}
          {cashRequestData.cash_requisition_items.map((item: any, index: number) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{item.item}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>{item.unit_of_measurement}</Text>
              <Text style={styles.tableCell}>{item.supplier}</Text>
              <Text style={styles.tableCell}>{item.unit_price}</Text>
              <Text style={styles.tableCell}>{item.total}</Text>
            </View>
          ))}
        </View>

        {/* Additional info */}
        <View style={styles.section}>
          <Text>Discount: {cashRequestData.discount}</Text>
          <Text>VAT: {cashRequestData.vat_value}</Text>
          <Text>EWT: {cashRequestData.ewt_value}</Text>
        </View>

        <View style={styles.description}>
          <Text>Special Instructions: {cashRequestData.special_instructions}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default OpenFile;
