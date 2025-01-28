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
      } else {
        toast.error(data.error || "Failed to add category.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 border rounded-sm shadow-md">
        <div>
          <label className="block text-gray-600 font-medium">Expense Name</label>
          <div className="flex items-center border-2 border-gray-300 rounded-md mt-2">
            <List size={22} className="text-gray-400 mx-3" />
            <input
              type="text"
              placeholder="Enter category name"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border-none focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-gray-600 font-medium">Price</label>
          <div className="flex items-center border-2 border-gray-300 rounded-md mt-2">
            <DollarSign size={22} className="text-gray-400 mx-3" />
            <input
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border-none focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Category
        </button>
      </form>

      {/* Message Display */}
      {message && (
        <div
          className={`mt-6 p-4 rounded-md text-center text-white ${message.includes("success") ? "bg-green-500" : "bg-red-500"}`}
        >
          {message}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default AddCategoryForm;
