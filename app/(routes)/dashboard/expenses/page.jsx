"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { FaTrashAlt, FaArrowLeft } from "react-icons/fa"; // Importing icons
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
      setReport(response.data);
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
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
      } else {
        const updatedExpense = {
          data: {
            [category]: parseFloat(priceInput), // Use category as key and priceInput as value
          },
        };

        await axios.patch(
          `http://localhost:3000/expense/category/price`,
          updatedExpense,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
      }

      fetchExpenseReport(); // Refresh the report after successful update
      handleCancelEdit(); // Reset states
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

  const authToken = localStorage.getItem("authToken");

const handleRemoveExpense = async (categoryKey) => {
  try {
    await axios.patch(
      `http://localhost:3000/expense/category/delete/${categoryKey}`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
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
    fetchExpenseReport();
  }, []);

  const totalSpending = report?.totalSpending || 0;
  const expenseGoal = report?.total_expense_goal || 0;
  const isOverBudget = totalSpending > expenseGoal;

  return (
    <div className="h-auto md:px-6 xl:px-12">
      <div className="w-full  mx-auto px-4 py-4 bg-white rounded-lg shadow-lg border">
        <ToastContainer position="top-right" autoClose={3000} />
        <h1 className="text-4xl font-semibold text-gray-800 mb-6 text-center">
          Expense Report
        </h1>
        <p className="text-gray-600 mb-6 text-center text-lg">
          View your detailed expense report along with total spending.
        </p>

        {/* Current Expense Situation Section */}
        <div className="flex  sm:flex-row   justify-between items-center mb-6">
          <div>
            <div className="text-xl font-bold text-start text-gray-800 mb-2">
              Total Spending:{" "}
              <span className="text-blue-500">BDT {totalSpending}</span>
            </div>
            {expenseGoal === 0 ? (
              <p className="text-red-500 font-semibold">
                Please add a budget to track your expenses.
              </p>
            ) : isOverBudget ? (
              <div className="text-red-500 font-semibold flex flex-col items-center">
                You have exceeded your expense goal! <br />
                <span className="text-sm text-gray-600 mt-2">
                  Expense Goal: BDT {expenseGoal}
                </span>
              </div>
            ) : (
              <div className="text-green-500 font-semibold">
                You are within the budget! <br />
                <span className="text-md text-gray-600 mt-2">
                  Expense Goal: BDT {expenseGoal}
                </span>
              </div>
            )}
          </div>

          {/* Report Action Buttons */}
          <div className="flex flex-col items-center sm:items-end space-y-4">
            <Button
              onClick={fetchExpenseReport}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md"
            >
              Refresh Report
            </Button>
            <Button
              onClick={exportToExcel}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md"
            >
              Export to Excel
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-blue-500 font-semibold">
            Loading...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 font-semibold">{error}</div>
        ) : report && report.data ? (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse shadow-md">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-6 py-3 font-medium text-gray-700">ID</th>
                    <th className="px-6 py-3 font-medium text-gray-700">
                      Category
                    </th>
                    <th className="px-6 py-3 font-medium text-gray-700">
                      Price
                    </th>
                    <th className="px-6 py-3 font-medium text-gray-700 text-center">
                      Actions
                    </th>
                    <th className="px-6 py-3 font-medium text-gray-700 text-center">
                      Delete Category
                    </th> {/* New column for Delete */}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(report.data).map(
                    ([category, price], index) => (
                      <tr
                        key={index}
                        className="odd:bg-white even:bg-gray-100 hover:bg-gray-50 transition duration-300"
                      >
                        <td className="px-6 py-3 font-medium text-gray-800">
                          {index + 1}
                        </td>
                        <td className="px-6 py-3 font-medium text-gray-800">
                          {editingCategory && editCategory === category ? (
                            <input
                              type="text"
                              value={categoryInput}
                              onChange={(e) => setCategoryInput(e.target.value)}
                              className="px-4 py-2 border border-gray-300 rounded-md"
                            />
                          ) : (
                            category
                          )}
                        </td>
                        <td className="px-6 py-3 text-gray-600">
                          {editingPrice && editCategory === category ? (
                            <input
                              type="number"
                              value={priceInput}
                              onChange={(e) => setPriceInput(e.target.value)}
                              className="px-4 py-2 border border-gray-300 rounded-md w-32"
                            />
                          ) : (
                            `BDT ${price}`
                          )}
                        </td>
                        <td className="px-6 py-3 text-center">
                          {/* Centered "Actions" text */}
                          {!editingCategory && !editingPrice && (
                            <div className="flex justify-center items-center gap-2 flex-wrap sm:flex-col md:flex-row">
                              <Button
                                onClick={() => handleEditCategory(category)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded-md"
                              >
                                Edit Category
                              </Button>
                              <Button
                                onClick={() => handleEditPrice(category, price)}
                                className="bg-orange-500 hover:bg-orange-600 text-white py-2  px-9 rounded-md"
                              >
                                Add Price
                              </Button>
                            </div>
                          )}
                          {(editingCategory || editingPrice) &&
                            editCategory === category && (
                              <div className="flex justify-center gap-3">
                                <Button
                                  onClick={() => handleUpdateExpense(category)}
                                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md"
                                >
                                  Update
                                </Button>
                                <Button
                                  onClick={handleCancelEdit}
                                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-md"
                                >
                                  Cancel
                                </Button>
                              </div>
                            )}
                        </td>
                        <td className="px-6 py-3 text-center">
                          <Button
                            onClick={() => handleRemoveExpense(category)}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-md"
                          >
                            <FaTrashAlt />
                          </Button>
                        </td> {/* Delete button */}
                      </tr>
                    )
                  )}
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
