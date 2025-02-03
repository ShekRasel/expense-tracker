"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { FaTrashAlt, FaArrowLeft, FaEdit, FaFileExport } from "react-icons/fa";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ExpenseReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(false);
  const [editingPrice, setEditingPrice] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [editPrice, setEditPrice] = useState(null);
  const [categoryInput, setCategoryInput] = useState("");
  const [priceInput, setPriceInput] = useState("");


  const fetchExpenseReport2 = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:3000/expense/user/expensereport",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      setReport(response.data);
      
  
      console.log(response.data);
    } catch (err) {
      setError("Failed to fetch expense report. Please try again later.");
    } finally {
      setLoading(false);
    }
   };


 const fetchExpenseReport = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await axios.get(
      "http://localhost:3000/expense/user/expensereport",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );
    // Sort the categories in alphabetical order
    const sortedData = Object.entries(response.data.data).sort(([categoryA], [categoryB]) =>
      categoryA.localeCompare(categoryB) // Compare categories alphabetically
    );

    // Set the sorted data to the report state
    setReport((prevReport) => ({
      ...prevReport,
      data: Object.fromEntries(sortedData), // Convert back to an object after sorting
    }));

    console.log(response.data);
  } catch (err) {
    setError("Failed to fetch expense report. Please try again later.");
  } finally {
    setLoading(false);
  }
 };




  const exportToExcel = () => {
    const expenseData = Object.entries(report.data).map(
      ([category, price]) => ({
        Category: category,
        Price: `BDT ${price}`,
      })
    );
    const ws = XLSX.utils.json_to_sheet(expenseData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expense Report");
    XLSX.writeFile(wb, "ExpenseReport.xlsx");
  };

  const handleEditCategory = (category) => {
    setEditingCategory(true);
    setEditCategory(category);
    setCategoryInput(category);
  };

  const handleEditPrice = (category, price) => {
    setEditingPrice(true);
    setEditCategory(category);
    setEditPrice(price);
    setPriceInput(price);
  };

  const handleUpdateExpense = async (category) => {
    try {
      if (editingCategory) {
        await axios.patch(
          `http://localhost:3000/expense/category/rename/${editCategory}/${categoryInput}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
      } else {
        const updatedExpense = {
          data: {
            [category]: parseFloat(priceInput),
          },
        };

        await axios.patch(
          "http://localhost:3000/expense/category/price",
          updatedExpense,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
      }

      fetchExpenseReport();
      handleCancelEdit();
      toast.success("Expense updated successfully!");
    } catch (err) {
      setError("Failed to update expense. Please try again later.");
      toast.error("Failed to update expense. Please try again later.");
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(false);
    setEditingPrice(false);
    setEditCategory(null);
    setEditPrice(null);
    setCategoryInput("");
    setPriceInput("");
  };

  const handleRemoveExpense = async (categoryKey) => {
    try {
      await axios.patch(
        `http://localhost:3000/expense/category/delete/${categoryKey}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      fetchExpenseReport();
      toast.success("Expense removed successfully!");
    } catch (err) {
      console.error("Delete request error:", err.response?.data || err.message);
      setError("Failed to remove expense. Please try again later.");
      toast.error("Failed to remove expense. Please try again later.");
    }
  };

  useEffect(() => {
    fetchExpenseReport2();
  }, []);

  const totalSpending = report?.totalSpending || 0;
  const expenseGoal = report?.total_expense_goal || 0;
  const isOverBudget = totalSpending > expenseGoal;

  return (
    <div className="min-h-screen lg:p-4">
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl px-12 py-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
        Expense Report
      </h1>
      <p className="text-gray-600 mb-8 text-center text-lg">
        View your detailed expense report along with total spending.
      </p>
  
      {/* Current Expense Situation Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="text-center md:text-left">
          <div className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            Total Spending:{" "}
            <span className="text-blue-600">BDT {totalSpending}</span>
          </div>
          {expenseGoal === 0 ? (
            <p className="text-red-500 font-semibold">
              Please add a budget to track your expenses.
            </p>
          ) : isOverBudget ? (
            <div className="text-red-500 font-semibold">
              You have exceeded your expense goal! <br />
              <span className="text-sm text-gray-600 mt-2">
                Expense Goal: BDT {expenseGoal}
              </span>
            </div>
          ) : (
            <div className="text-green-600 font-semibold">
              You are within the budget! <br />
              <span className="text-sm text-gray-600 mt-2">
                Expense Goal: BDT {expenseGoal}
              </span>
            </div>
          )}
        </div>
  
        {/* Report Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-0">

          <Button
            onClick={fetchExpenseReport}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 md:py-3 md:px-6 rounded-lg flex items-center gap-2"
          >
            <FaArrowLeft />
            Refresh Report
          </Button>

          <Button
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 md:py-3 md:px-6 rounded-lg flex items-center gap-2"
          >
            <FaFileExport />
            Export to Excel
          </Button>
        </div>
      </div>
    </div>
  
    <div className="mt-10 shadow-lg rounded-lg border">
      {loading ? (
        <div className="text-center text-blue-600 font-semibold">
          Loading...
        </div>
      ) : error ? (
        <div className="text-center text-red-600 font-semibold">{error}</div>
      ) : report && report.data ? (
        <div className="w-full overflow-x-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse shadow-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-3 font-medium text-gray-700">ID</th>
                  <th className="px-4 py-3 font-medium text-gray-700">
                    Category
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-700">Price</th>
                  <th className="px-4 py-3 font-medium text-gray-700">
                    Actions
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-700">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(report.data).map(([category, price], index) => (
                  <tr
                    key={index}
                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition duration-300"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {editingCategory && editCategory === category ? (
                        <input
                          type="text"
                          value={categoryInput}
                          onChange={(e) => setCategoryInput(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded-lg"
                        />
                      ) : (
                        category
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {editingPrice && editCategory === category ? (
                        <input
                          type="number"
                          value={priceInput}
                          onChange={(e) => setPriceInput(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded-lg w-24"
                        />
                      ) : (
                        `BDT ${price}`
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {!editingCategory && !editingPrice && (
                        <div className="flex justify-center gap-2">
                          <Button
                            onClick={() => handleEditCategory(category)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 md:py-2 md:px-4 rounded-lg flex items-center gap-1"
                          >
                            <FaEdit />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleEditPrice(category, price)}
                            className="bg-orange-500 hover:bg-orange-600 text-white py-1 px-2 md:py-2 md:px-4 rounded-lg flex items-center gap-1"
                          >
                            <FaEdit />
                            Price
                          </Button>
                        </div>
                      )}
                      {(editingCategory || editingPrice) &&
                        editCategory === category && (
                          <div className="flex justify-center gap-2">
                            <Button
                              onClick={() => handleUpdateExpense(category)}
                              className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 md:py-2 md:px-4 rounded-lg"
                            >
                              Update
                            </Button>
                            <Button
                              onClick={handleCancelEdit}
                              className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-2 md:py-2 md:px-4 rounded-lg"
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        onClick={() => handleRemoveExpense(category)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 md:py-2 md:px-4 rounded-lg"
                      >
                        <FaTrashAlt />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 font-semibold">
          No data available.
        </div>
      )}
    </div>
  </div>
  );
}

export default ExpenseReport;
