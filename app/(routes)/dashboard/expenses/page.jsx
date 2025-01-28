'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { FaTrashAlt, FaArrowLeft } from 'react-icons/fa'; // Importing icons
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ExpenseReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(false);
  const [editingPrice, setEditingPrice] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [editPrice, setEditPrice] = useState(null);
  const [categoryInput, setCategoryInput] = useState('');
  const [priceInput, setPriceInput] = useState('');

  const fetchExpenseReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3000/expense/user/expensereport', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setReport(response.data);
    } catch (err) {
      setError('Failed to fetch expense report. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const expenseData = Object.entries(report.data).map(([category, price]) => ({
      Category: category,
      Price: `BDT ${price}`,
    }));
    const ws = XLSX.utils.json_to_sheet(expenseData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expense Report');
    XLSX.writeFile(wb, 'ExpenseReport.xlsx');
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
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      fetchExpenseReport(); // Refresh the report after successful update
      handleCancelEdit(); // Reset states
      toast.success('Expense updated successfully!');
    } catch (err) {
      setError('Failed to update expense. Please try again later.');
      toast.error('Failed to update expense. Please try again later.');
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(false);
    setEditingPrice(false);
    setEditCategory(null);
    setEditPrice(null);
    setCategoryInput('');
    setPriceInput('');
  };

  const handleRemoveExpense = async (category) => {
    try {
      await axios.patch(`http://localhost:3000/expense/user/${category}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      fetchExpenseReport();
      toast.success('Expense removed successfully!');
    } catch (err) {
      setError('Failed to remove expense. Please try again later.');
      toast.error('Failed to remove expense. Please try again later.');
    }
  };

  useEffect(() => {
    fetchExpenseReport();
  }, []);

  const totalSpending = report?.totalSpending || 0;
  const expenseGoal = report?.total_expense_goal || 0;
  const isOverBudget = totalSpending > expenseGoal;

  return (
    <div className="h-auto flex  justify-center   2xl:ml-4">
      <div className="w-full px-4 max-w-4xl bg-white rounded-xl py-10 border">
        <ToastContainer position="top-right" autoClose={3000} /> {/* Toast Container */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Expense Report
        </h1>
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
            <div className="bg-blue-50 border p-4 rounded-md items-center mb-6 flex flex-col">
              <div className="text-lg font-bold text-start  text-gray-800 mb-2">
                Total Spending: <span className="text-blue-500">BDT {totalSpending}</span>
              </div>
              {expenseGoal === 0 ? (
                <p className="text-red-500 font-semibold">Please add a budget to track your expenses.</p>
              ) : isOverBudget ? (
                <div className="text-red-500 font-semibold border flex flex-col items-center">
                  You have exceeded your expense goal! <br />
                  <span className="text-sm text-gray-600 mt-2">Expense Goal: BDT {expenseGoal}</span>
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
                      <td className="px-4 py-2 font-medium text-gray-800">
                        {editingCategory && editCategory === category ? (
                          <input
                            type="text"
                            value={categoryInput}
                            onChange={(e) => setCategoryInput(e.target.value)}
                            className="px-2 py-1 border rounded"
                          />
                        ) : (
                          category
                        )}
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {editingPrice && editCategory === category ? (
                          <input
                            type="number"
                            value={priceInput}
                            onChange={(e) => setPriceInput(e.target.value)}
                            className="px-2 py-1 border border-black rounded w-24"
                          />
                        ) : (
                          `BDT ${price}`
                        )}
                      </td>
                      <td className="px-4 py-2 text-center space-x-2">
                        {!editingCategory && !editingPrice && (
                          <div className="flex justify-start items-center gap-2 flex-wrap sm:flex-col md:flex-row">
                            <Button
                              onClick={() => handleEditCategory(category)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-4 rounded-sm w-full md:w-auto"
                            >
                              Edit Category
                            </Button>
                            <Button
                              onClick={() => handleEditPrice(category, price)}
                              className="bg-orange-500 hover:bg-orange-600 text-white py-1 px-4 rounded-sm w-full md:w-auto"
                            >
                              Add Price
                            </Button>
                          </div>
                        )}
                        {(editingCategory || editingPrice) && editCategory === category && (
                          <div className="flex justify-start items-center gap-2 flex-wrap sm:flex-col md:flex-row">
                            <Button
                              onClick={() => handleCancelEdit()}
                              className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded-md flex items-center w-full md:w-auto"
                            >
                              <FaArrowLeft size={16} className="" /> {/* Back Icon */}
                              Back
                            </Button>
                            <Button
                              onClick={() => handleUpdateExpense(category)}
                              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-md w-full md:w-auto"
                            >
                              Update
                            </Button>
                          </div>
                        )}
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
