'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import * as XLSX from 'xlsx';

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

  const totalSpending = report?.totalSpending || 0;
  const expenseGoal = report?.total_expense_goal || 0;
  const isOverBudget = totalSpending > expenseGoal;

  const handleRemoveExpense = (category) => {
    // Function to remove the expense
    console.log(`Remove expense for category: ${category}`);
    // Implement the actual removal here by updating the state or making an API call
  };

  return (
    <div className="h-auto bg-gray-50 flex">
      <div className="w-full max-w-4xl bg-white rounded-xl ">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center pt-10">Expense Report</h1>
        <p className="text-gray-600 mb-6 text-center">
          View your detailed expense report along with total spending.
        </p>

        <div className="flex justify-center space-x-4 mb-6">
          <Button onClick={fetchExpenseReport} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md">
            Refresh Report
          </Button>
          <Button onClick={exportToExcel} className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md">
            Export to Excel
          </Button>
        </div>

        {loading ? (
          <div className="text-center text-blue-500 font-semibold">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 font-semibold">{error}</div>
        ) : report && report.data ? (
          <div>
            <div className="bg-blue-50 border p-4 rounded-md mb-6  flex flex-col items-center">
              <div className="text-lg font-bold text-gray-800 mb-2">
                Total Spending: <span className="text-blue-500">BDT {totalSpending}</span>
              </div>
              {isOverBudget ? (
                <div className="text-red-500 font-semibold ">
                  You have exceeded your expense goal! <br />
                  <span className="text-sm text-gray-600">Expense Goal: BDT {expenseGoal}</span>
                </div>
              ) : (
                <div className="text-green-500 font-semibold">
                  You are within the budget! <br />
                  <span className="text-sm text-gray-600 mt-2">Expense Goal: BDT {expenseGoal}</span>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(report.data).map(([category, price], index) => (
                    <tr key={index} className="odd:bg-white even:bg-gray-100">
                      <td className="px-4 py-2 font-medium text-gray-800">{category}</td>
                      <td className="px-4 py-2 text-gray-600">BDT {price}</td>
                      <td className="px-4 py-2 text-center">
                        <Button
                          onClick={() => handleRemoveExpense(category)}
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-lg transition-colors duration-200"
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">No expense report available.</div>
        )}
      </div>
    </div>
  );
}

export default ExpenseReport;
