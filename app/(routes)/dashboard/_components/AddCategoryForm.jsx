'use client';
import React, { useState } from "react";
import { List, DollarSign } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCategoryForm = ({ onCategoryAdded }) => {
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !price) {
      setMessage("Please fill out all fields.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setMessage("You must be logged in to add a category.");
        return;
      }

      const response = await fetch(`http://localhost:3000/expense/user/${category}/${price}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Category and price added successfully!");
        onCategoryAdded(category, price);
        setCategory("");
        setPrice("");
        setMessage("");
      } else {
        toast.error(data.error || "Failed to add category.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Expense Category</label>
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <List size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="e.g., Groceries, Rent, Utilities"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full ml-3 p-2 text-gray-700 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <DollarSign size={20} className="text-gray-400" />
            <input
              type="number"
              placeholder="e.g., 100.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full ml-3 p-2 text-gray-700 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Add Expense
        </button>
      </form>

      {/* Message Display */}
      {message && (
        <div
          className={`mt-6 p-4 rounded-lg text-center text-white ${message.includes("success") ? "bg-green-500" : "bg-red-500"}`}
        >
          {message}
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default AddCategoryForm;
