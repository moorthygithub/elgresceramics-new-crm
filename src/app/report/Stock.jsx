import React, { useRef, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Page from "@/app/dashboard/page";
import BASE_URL from "@/config/BaseUrl";
import { Download, Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import { useReactToPrint } from "react-to-print";
import { ButtonConfig } from "@/config/ButtonConfig";
import moment from "moment";
import { Input } from "@/components/ui/input";
import { STOCK_REPORT } from "@/api";
import Loader from "@/components/loader/Loader";
import { RiFileExcel2Line, RiFileExcelLine } from "react-icons/ri";
import ExcelJS from "exceljs";

const Stock = () => {
  const containerRef = useRef();
  const [formData, setFormData] = useState({
    from_date: moment().startOf("month").format("YYYY-MM-DD"),
    to_date: moment().format("YYYY-MM-DD"),
  });
  const { toast } = useToast();

  const fetchBuyerData = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${STOCK_REPORT}`,
      { ...formData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.stock;
  };

  const {
    data: buyerData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["buyerData", formData],
    queryFn: fetchBuyerData,
  });

  const handlePrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "Stock",
    pageStyle: `
      @page {
    size: A4 portrait;
         margin: 5mm;
      }
      @media print {
        body {
          font-size: 10px; 
          margin: 0mm;
          padding: 0mm;
        }
        table {
          font-size: 11px;
        }
        .print-hide {
          display: none;
        }
      }
    `,
  });

  const downloadExcel = async () => {
    if (!buyerData || buyerData.length === 0) {
      toast({
        title: "No Data",
        description: "No data available to export",
        variant: "destructive",
      });
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Stock Report");
    worksheet.addRow(["Stock Report"]).font = { bold: true };
    worksheet.addRow([
      `From: ${moment(formData.from_date).format("DD-MM-YYYY")} To: ${moment(
        formData.to_date
      ).format("DD-MM-YYYY")}`,
    ]);
    worksheet.addRow([]);
    const headers = [
      "Item Name",
      "Opening Balance",
      "Purchase",
      "Dispatch",
      "Closing Balance",
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "F3F4F6" },
      };
      cell.alignment = { horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
      };
    });
    buyerData.forEach((transaction) => {
      const opening =
        transaction.openpurch -
        transaction.closesale -
        Number(transaction.purchR) +
        Number(transaction.saleR);
      const purchase = transaction.purch;
      const dispatch = transaction.sale;
      const closing = opening + (purchase - dispatch);

      worksheet.addRow([
        transaction.item_name,
        opening,
        purchase,
        dispatch,
        closing,
      ]);
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Stock_Report_${moment().format("YYYY-MM-DD")}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-full">
          <Loader />
        </div>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page>
        <Card className="w-full max-w-md mx-auto mt-10">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Fetching Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </Page>
    );
  }
  const handleInputChange = (field, valueOrEvent) => {
    const value =
      typeof valueOrEvent === "object" && valueOrEvent.target
        ? valueOrEvent.target.value
        : valueOrEvent;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const BranchHeader = () => (
    <div
      className={`sticky top-0 z-10 border border-gray-200 rounded-lg ${ButtonConfig.cardheaderColor} shadow-sm p-4 mb-2`}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4 sm:gap-8">
        {/* Title Section */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Stock Summary
          </h1>
          <p className="text-gray-600 mt-1">Add a Stock to Visit Report</p>
        </div>

        {/* Date Inputs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="w-full sm:w-auto">
            <label
              className={`block ${ButtonConfig.cardLabel} text-sm mb-1 font-medium`}
            >
              From Date <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={formData.from_date}
              className="bg-white w-full sm:w-auto"
              onChange={(e) => handleInputChange("from_date", e)}
              placeholder="Enter From Date"
            />
          </div>

          <div className="w-full sm:w-auto">
            <label
              className={`block ${ButtonConfig.cardLabel} text-sm mb-1 font-medium`}
            >
              To Date <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              className="bg-white w-full sm:w-auto"
              value={formData.to_date}
              onChange={(e) => handleInputChange("to_date", e)}
              placeholder="Enter To Date"
            />
          </div>
        </div>
        <div className="flex gap-2  mt-5">
          <Button
            type="button"
            size="sm"
            className={`w-full sm:w-auto ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            // className="h-8 w-24"
            onClick={handlePrintPdf}
          >
            <Printer className="h-3 w-3 mr-1" /> Print
          </Button>
          <Button
            type="button"
            size="sm"
            className={`w-full sm:w-auto ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            // className="h-8 w-24"
            onClick={downloadExcel}
          >
            <RiFileExcel2Line className="h-3 w-3 mr-1" /> Excel
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Page>
      <div className="p-0 md:p-4">
        <div className="sm:hidden">
          <div
            className={`sm:sticky relative top-0 z-10 border border-gray-200 rounded-lg ${ButtonConfig.cardheaderColor} shadow-sm px-3 pb-3 mb-2`}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-2 sm:gap-4">
              <div className="flex justify-between items-center">
                <h1 className="text-base font-bold text-gray-800 px-2">
                  Stock Summary
                </h1>
                <div className="flex gap-[2px]">
                  <button
                    className={` sm:w-auto ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} text-sm p-3 rounded-b-md `}
                    onClick={downloadExcel}
                  >
                    <RiFileExcel2Line className="h-3 w-3 " />
                  </button>
                  <button
                    className={` sm:w-auto ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} text-sm p-3 rounded-b-md `}
                    onClick={handlePrintPdf}
                  >
                    <Printer className="h-3 w-3 " />
                  </button>
                </div>
              </div>
              {/* Date Inputs */}
              <div className="flex  flex-row items-center gap-2 w-full md:w-auto">
                <div className="w-full sm:w-auto">
                  <label
                    className={`block ${ButtonConfig.cardLabel} text-xs mb-1 font-medium`}
                  >
                    From Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.from_date}
                    className="bg-white w-full sm:w-auto text-sm p-1"
                    onChange={(e) => handleInputChange("from_date", e)}
                    placeholder="From Date"
                  />
                </div>

                <div className="w-full sm:w-auto">
                  <label
                    className={`block ${ButtonConfig.cardLabel} text-xs mb-1 font-medium`}
                  >
                    To Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    className="bg-white w-full sm:w-auto text-sm p-1"
                    value={formData.to_date}
                    onChange={(e) => handleInputChange("to_date", e)}
                    placeholder="To Date"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden sm:block">
          <BranchHeader />
        </div>

        <div
          className="overflow-x-auto text-[11px] grid grid-cols-1"
          ref={containerRef}
        >
          <div className="hidden print:block">
            <div className="flex justify-between ">
              <h1 className="text-left text-2xl font-semibold mb-3 ">
                Stock Summary
              </h1>
              <div className="flex space-x-6">
                <h1>
                  {" "}
                  From - {moment(formData.from_date).format("DD-MMM-YYYY")}
                </h1>
                <h1>To -{moment(formData.to_date).format("DD-MMM-YYYY")}</h1>
              </div>
            </div>
          </div>

          <table className="w-full border-collapse border border-black">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="border border-black px-2 py-2 text-center">
                  Item Name
                </th>
                <th className="border border-black px-2 py-2 text-center">
                  Open Balance
                </th>
                <th className="border border-black px-2 py-2 text-center">
                  Purchase
                </th>
                <th className="border border-black px-2 py-2 text-center">
                  PR
                </th>
                <th className="border border-black px-2 py-2 text-center">
                  Dispatch
                </th>
                <th className="border border-black px-2 py-2 text-center">
                  DR
                </th>

                <th className="border border-black px-2 py-2 text-center">
                  Close Balance
                </th>
              </tr>
            </thead>
            {buyerData && (
              <tbody>
                {buyerData.map((buyer, index) => (
                  <>
                    <tr
                      key={buyer.id || buyer.item_name}
                      className="hover:bg-gray-50"
                    >
                      <td className="border border-black px-2 py-2 ">
                        {buyer.item_name}
                      </td>
                      <td className="border border-black px-2 py-2 text-center">
                        {buyer.openpurch - buyer.closesale}
                      </td>
                      <td className="border border-black px-2 py-2 text-center">
                        {buyer.purch}
                      </td>
                      <td className="border border-black px-2 py-2 text-center">
                        {buyer.purchR}
                      </td>
                      <td className="border border-black px-2 py-2 text-center">
                        {buyer.sale}
                      </td>
                      <td className="border border-black px-2 py-2 text-center">
                        {buyer.saleR}
                      </td>

                      <td className="border border-black px-2 py-2 text-center">
                        {Number(buyer.openpurch) -
                          Number(buyer.closesale) +
                          (Number(buyer.purch) - Number(buyer.sale)) -
                          Number(buyer.purchR) +
                          Number(buyer.saleR)}
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </Page>
  );
};

export default Stock;
