"use client";
import { PDFViewer } from "@react-pdf/renderer";
import React from "react";
const handlePrint = () => {
  window.print();
};
const OpenFile = () => {
  return (
    <>
      <div>
        {/* <button
          className="ml-250 border border-black text-black uppercase bg-white px-2 py-2"
          onClick={handlePrint}
        >
          print
        </button> */}
        {/* <PDFViewer document={<OpenFile />} fileName="document.pdf"></PDFViewer> */}
        <div className="flex justify-center">
          <img
            className="mr-4"
            src="/images/logo.png"
            height={44}
            width={44}
            alt=""
          />
          <h1 className="uppercase font-bold text-center mt-2">
            Payment/purchase request voucher cashreq#1124
          </h1>
        </div>
        <table className="table-zebra table-xs w-full border-t rounded-lg shadow-lg bg-white text-sm">
          <thead className="bg-gray-700 text-white">
            <tr className="text-white-600 text-sm uppercase">
              <th className="py-2 px-4 text-center">Item</th>
              <th className="py-2 px-4 text-center">Quantity</th>
              <th className="py-2 px-4 text-center">Unit</th>
              <th className="py-2 px-4 text-center">Supplier</th>
              <th className="py-2 px-4 text-center">Unit Price</th>
              <th className="py-2 px-4 text-center">Total</th>
              {/* <th className="py-2 px-4 text-center">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-xs text-center">asd</td>
              <td className="text-xs text-center">asd</td>
              <td className="text-xs text-center">asd</td>
              <td className="text-xs text-center">asd</td>
              <td className="text-xs text-center">asd</td>
              <td className="text-xs text-center">asd</td>
              {/* <td className="text-xs text-center">asd2</td> */}
              {/* <td className="text-xs flex gap-2 justify-center"></td> */}
            </tr>
            <tr>
              <td className="text-xs text-center">asd</td>
              <td className="text-xs text-center">asd</td>
              <td className="text-xs text-center">asd</td>
              <td className="text-xs text-center">asd</td>
              <td className="text-xs text-center">asd</td>
              <td className="text-xs text-center">asd</td>
              {/* <td className="text-xs text-center">asd2</td> */}
              {/* <td className="text-xs flex gap-2 justify-center"></td> */}
            </tr>
          </tbody>
        </table>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 uppercase text-center">
          {/* First Row: Input inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <strong>Discount:</strong>
              <input
                type="number"
                name="discount"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-center"
                placeholder="Discount"
              />
            </div>

            <div>
              <strong>VAT %:</strong>
              <input
                type="number"
                name="vat_percentage"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-center"
                placeholder="VAT %"
              />
            </div>

            <div>
              <strong>Less EWT %:</strong>
              <input
                type="number"
                name="less_ewt"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-center"
                placeholder="EWT %"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <strong>Discount:</strong>
              <div className="w-full p-2 border border-gray-300 rounded-md shadow-sm"></div>
            </div>

            <div>
              <strong>VAT Amount:</strong>
              <div className="w-full p-2 border border-gray-300 rounded-md shadow-sm"></div>
            </div>

            <div>
              <strong>EWT Amount:</strong>
              <div className="w-full p-2 border border-gray-300 rounded-md shadow-sm"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <div>
              <strong>Total:</strong>
              <div className="w-full p-2 border border-gray-300 rounded-md shadow-sm"></div>
            </div>

            <div>
              <strong>Grand Total:</strong>
              <div className="w-full p-2 border border-gray-300 rounded-md shadow-sm"></div>
            </div>
          </div>
        </div>

        <div className="flex justify-start mb-4 mt-4 ">
          <h3>al instructions</h3>
          <h3>FRPv15 Renewal</h3>
        </div>
      </div>
      <table className="table-zebra table-xs w-full border-t rounded-lg shadow-lg bg-white text-sm">
        <thead className="bg-gray-700 text-white">
          <tr className="text-white-600 text-sm uppercase">
            <th className="py-2 px-4 text-center">Requested by</th>
            <th className="py-2 px-4 text-center">date requested</th>
            <th className="py-2 px-4 text-center">noted by</th>
            <th className="py-2 px-4 text-center">date noted</th>
            <th className="py-2 px-4 text-center">approved by</th>
            <th className="py-2 px-4 text-center">date approved</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-xs text-center">name</td>
            <td className="text-xs text-center">date requested</td>
            <td className="text-xs text-center">signature of who noted</td>
            <td className="text-xs text-center">write the date</td>
            <td className="text-xs text-center">signature</td>
            <td className="text-xs text-center">write date</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default OpenFile;
