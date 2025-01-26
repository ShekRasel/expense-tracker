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
        setMessage("Category and price added successfully!");

        // Show success toast notification
        toast.success("Category and price added successfully!");

        // Notify the parent component that the category is added
        onCategoryAdded(category, price);
      } else {
        setMessage(data.error || "Failed to add category and price.");
        toast.error(data.error || "Failed to add category and price.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto rounded-3xl shadow-lg border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-xl">
        {/* Category Name Input */}
        <div>
          <label className="block text-gray-600 font-medium mb-3">Category Name</label>
          <div className="flex items-center border-2 border-gray-300 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition-all">
            <List size={22} className="text-gray-400 mx-3" />
            <input
              type="text"
              placeholder="Enter category name"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 outline-none text-gray-700 placeholder:text-gray-400 rounded-xl"
            />
          </div>
        </div>

        {/* Price Input */}
        <div>
          <label className="block text-gray-600 font-medium mb-3">Price</label>
          <div className="flex items-center border-2 border-gray-300 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition-all">
            <DollarSign size={22} className="text-gray-400 mx-3" />
            <input
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 outline-none text-gray-700 placeholder:text-gray-400 rounded-xl"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-4 rounded-xl shadow-lg hover:bg-blue-600 hover:shadow-2xl transition-all"
        >
          Add Category
        </button>
      </form>

      {/* Message Display */}
      {message && (
        <div
          className={`mt-6 p-4 rounded-lg text-center text-white transition-all ${
            message.includes("success") ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message}
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer /> 
    </div>
  );
};

export default AddCategoryForm;
