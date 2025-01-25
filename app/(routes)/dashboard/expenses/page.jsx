'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import * as XLSX from 'xlsx'; // Import the xlsx library

function ExpenseReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Expense Report
  const fetchExpenseReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:3000/expense/user/expensereport", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setReport(response.data);
    } catch (err) {
      setError("Failed to fetch expense report. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    // Convert report data to a format compatible with Excel
    const expenseData = Object.entries(report.data).map(([category, price]) => ({
      Category: category,
      Price: `BDT ${price}`,
      'Date Added': 'N/A',
    }));

    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(expenseData);

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expense Report");

    // Export to Excel file
    XLSX.writeFile(wb, "ExpenseReport.xlsx");
  };

  useEffect(() => {
    fetchExpenseReport();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Expense Report</h1>
      <p className="text-gray-600 mb-4">
        View your detailed expense report along with total spending.
      </p>

      <div className="flex justify-end mb-6">
        <Button onClick={fetchExpenseReport} className="bg-blue-500 hover:bg-blue-600 text-white">
          Refresh Report
        </Button>
        <Button
          onClick={exportToExcel}
          className="ml-4 bg-green-500 hover:bg-green-600 text-white"
        >
          Export to Excel
        </Button>
      </div>

      {loading ? (
        <div className="text-center text-blue-500 font-semibold">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 font-semibold">{error}</div>
      ) : report && report.data ? (
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Expense Details</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Date Added</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(report.data).map(([category, price], index) => (
                  <tr key={index} className="odd:bg-white even:bg-gray-100">
                    <td className="px-4 py-2 font-medium text-gray-800">{category}</td>
                    <td className="px-4 py-2 text-gray-600">BDT {price}</td>
                    <td className="px-4 py-2 text-gray-500">N/A</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-lg font-bold text-gray-700">
            Total Spending: <span className="text-blue-500">BDT {report.totalSpending}</span>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">No expense report available.</div>
      )}
    </div>
  );
}

export default ExpenseReport;
