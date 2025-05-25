"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { fetchCashRequestId } from "@/api/cash-request/fetchCashRequestId";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

Font.register({
  family: 'Helvetica',
  src: 'https://fonts.googleapis.com/css2?family=Helvetica&display=swap',
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 20,
  },
  title: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 15,
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    color: '#fff',
    padding: 10,
    justifyContent: 'space-between',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableCell: {
    textAlign: 'center',
    fontSize: 12,
    padding: 8,
    borderRight: '1px solid #ddd',
    borderBottom: '1px solid #ddd',
  },
  tableCellNoBorder: {
    borderRight: 'none',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
  },
  zebraRowEven: {
    backgroundColor: '#f2f2f2', 
  },
  zebraRowOdd: {
    backgroundColor: '#ffffff', 
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  signature: {
    width: '45%',
    paddingTop: 10,
  },
  footer: {
    marginTop: 20,
    fontSize: 10,
    textAlign: 'center',
    color: '#888',
  },
  button: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 'bold',
    borderRadius: 5,
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#218838',
  },
});

const OpenFile = () => {
  const [cashRequestData, setCashRequestData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const id = pathname?.split("/").pop(); 

  useEffect(() => {
    if (id) {
      setLoading(true); 
      fetchCashRequestId(id)
        .then((data) => {
          setCashRequestData(data); 
          setLoading(false); 
        })
        .catch((err) => {
          setError("Error fetching cash request data.");
          setLoading(false);
        });
    }
  }, [id]); 

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!cashRequestData) {
    return <div>No data available</div>;
  }

  const CashRequestDocument = () => (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src="/images/logo.png" />
          <Text style={styles.title}>
            Payment/Purchase Request #{cashRequestData.serial_no}
          </Text>
        </View>
  
        <View style={styles.section}>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { width: '25%' }]}>Item</Text>
              <Text style={[styles.tableCell, { width: '12%' }]}>Qty</Text>
              <Text style={[styles.tableCell, { width: '13%' }]}>Unit</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Supplier</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>Unit Price</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>Total</Text>
            </View>
  
            {cashRequestData.cash_requisition_items.map((item: any, index: number) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  index % 2 === 0 ? styles.zebraRowEven : styles.zebraRowOdd,
                ]}
              >
                <Text style={[styles.tableCell, { width: '25%' }]}>{item.item}</Text>
                <Text style={[styles.tableCell, { width: '12%' }]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, { width: '13%' }]}>{item.unit_of_measurement}</Text>
                <Text style={[styles.tableCell, { width: '20%' }]}>{item.supplier}</Text>
                <Text style={[styles.tableCell, { width: '15%' }]}>{item.unit_price}</Text>
                <Text style={[styles.tableCell, { width: '15%' }]}>{item.total}</Text>
              </View>
            ))}
          </View>
        </View>
  
        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Summary:</Text>
          <Text>Discount: {cashRequestData.discount || "N/A"}</Text>
          <Text>VAT: {cashRequestData.vat_value || "N/A"}%</Text>
          <Text>EWT: {cashRequestData.ewt_value || "N/A"}%</Text>
          <Text>Total: {cashRequestData.total || "0.00"}</Text>
        </View>
  
        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Special Instructions:</Text>
          <Text>{cashRequestData.special_instructions || "N/A"}</Text>
        </View>
  
        <View style={styles.signatureSection}>
          <View style={styles.signature}>
            <Text style={{ fontWeight: 'bold' }}>Requested By</Text>
            <Text>{cashRequestData.requested_by?.full_name || "N/A"}</Text>
            <Text style={{ marginTop: 20 }}>______________________</Text>
          </View>
          <View style={styles.signature}>
            <Text style={{ fontWeight: 'bold' }}>Approved By</Text>
            <Text style={{ marginTop: 40 }}>______________________</Text>
          </View>
        </View>
        <View style={styles.signatureSection}>
          <View style={styles.signature}>
            <Text style={{ fontWeight: 'bold' }}>Requested By</Text>
            <Text>{cashRequestData.requested_by?.full_name || "N/A"}</Text>
            <Text style={{ marginTop: 20 }}>______________________</Text>
          </View>
          <View style={styles.signature}>
            <Text style={{ fontWeight: 'bold' }}>Approved By</Text>
            <Text style={{ marginTop: 40 }}>______________________</Text>
          </View>
        </View>
  
        <View style={styles.footer}>
          <Text>Generated on: {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
  

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-center mb-10">
        <img src="/images/logo.png" alt="Logo" className="h-12 w-12 mr-4" />
        <h1 className="text-2xl md:text-3xl font-bold uppercase text-center text-gray-800">
          Payment/Purchase Request Voucher #{cashRequestData.serial_no}
        </h1>
      </div>
  
      <div className="flex justify-end mb-6">
        <PDFDownloadLink
          document={<CashRequestDocument />}
          fileName={`${cashRequestData.serial_no}.pdf`}
        >
          {({ loading }) => (
            <button
              className={`${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              } text-white py-2 px-6 rounded-md font-semibold shadow-md transition`}
              disabled={loading}
            >
              {loading ? "Preparing PDF..." : "Download as PDF"}
            </button>
          )}
        </PDFDownloadLink>
      </div>
  
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-center">Item</th>
              <th className="px-4 py-3 text-center">Quantity</th>
              <th className="px-4 py-3 text-center">Unit</th>
              <th className="px-4 py-3 text-center">Supplier</th>
              <th className="px-4 py-3 text-center">Unit Price</th>
              <th className="px-4 py-3 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {cashRequestData.cash_requisition_items.map((item: any, index: number) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} text-center`}
              >
                <td className="px-4 py-2">{item.item}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">{item.unit_of_measurement}</td>
                <td className="px-4 py-2">{item.supplier}</td>
                <td className="px-4 py-2">{item.unit_price}</td>
                <td className="px-4 py-2">{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      <div className="bg-white p-6 rounded-lg shadow-md space-y-2 mb-8">
        <p><strong>Discount:</strong> {cashRequestData.discount || "N/A"}</p>
        <p><strong>VAT:</strong> {cashRequestData.vat_value || "N/A"}%</p>
        <p><strong>EWT:</strong> {cashRequestData.ewt_value || "N/A"}%</p>
        <p><strong>Total:</strong> {cashRequestData.total || "0.00"}</p>
      </div>
  
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <p><strong>Special Instructions:</strong> {cashRequestData.special_instructions || "N/A"}</p>
      </div>
  
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <p className="font-semibold mb-2">Requested By:</p>
          <p>{cashRequestData.requested_by?.full_name || "N/A"}</p>
          <div className="border-t border-gray-300 mt-6 pt-2 text-center">
            ______________________
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <p className="font-semibold mb-2 ">Approved By:</p>
          <p>{cashRequestData.requested_by?.full_name || "N/A"}</p>
          <div className="border-t border-gray-300 mt-6 pt-2 text-center">
            ______________________
          </div>
        </div>
      </div>
  
      <p className="text-xs text-center text-gray-500 mt-10">
        Generated on: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
  
};

export default OpenFile;
