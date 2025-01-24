import { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BudgetForm() {
  const [formData, setFormData] = useState({
    total_expense_goal: 5000,
    categories: [
      { name: 'Food', price: 2000 },
      { name: 'Transport', price: 1000 },
    ],
  });
  const [submittedData, setSubmittedData] = useState(null);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const newCategories = [...formData.categories];
    newCategories[index] = { ...newCategories[index], [name]: value };
    setFormData((prevData) => ({
      ...prevData,
      categories: newCategories,
    }));
  };

  const handleAddCategory = () => {
    setFormData((prevData) => ({
      ...prevData,
      categories: [...prevData.categories, { name: '', price: 0 }],
    }));
  };

  const handleRemoveCategory = (index) => {
    const newCategories = formData.categories.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      categories: newCategories,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

     // Ensure category prices are numbers and the total is recalculated
  const updatedCategories = formData.categories.map((category) => ({
    ...category,
    price: parseFloat(category.price) || 0, // Ensure price is a number
  }));

  const updatedFormData = {
    ...formData,
    total_expense_goal: parseFloat(formData.total_expense_goal) || 0, // Ensure total is a number
    categories: updatedCategories,
  };

    try {
      const response = await axios.post('http://localhost:3000/guest/budget', updatedFormData);
      toast.success('Budget submitted successfully!');
      setSubmittedData(response.data);
    } catch (error) {
      console.error('Error creating budget:', error);
      toast.error('Failed to submit budget. Please try again.');
    }
  };

  const generateExcel = () => {
    if (!submittedData) {
      toast.error('No data to generate Excel. Please submit the form first.');
      return;
    }
    const data = submittedData.categories.map((category) => ({
      Category: category.name,
      Price: category.price,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Budget Report');
    XLSX.writeFile(wb, 'Budget_Report.xlsx');
    toast.success('Excel file generated successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 flex justify-center items-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 sm:p-10">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          Budget Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="total_expense_goal" className="block text-lg font-medium text-gray-700">
              Total Expense Goal
            </label>
            <input
              type="number"
              placeholder='Your Budget in Tk'
              id="total_expense_goal"
              name="total_expense_goal"
              value={formData.total_expense_goal}
              onChange={(e) => setFormData({ ...formData, total_expense_goal: e.target.value })}
              className="mt-2 w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700">Categories</h3>
            {formData.categories.map((category, index) => (
              <div
              key={index}
              className="space-y-2 mt-4 md:space-y-0 md:flex md:items-center md:space-x-4"
            >
              <input
                type="text"
                name="name"
                value={category.name}
                onChange={(e) => handleChange(e, index)}
                placeholder="Category Name"
                className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                name="price"
                value={category.price}
                onChange={(e) => handleChange(e, index)}
                placeholder="Price"
                className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => handleRemoveCategory(index)}
                className="w-full md:w-auto text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
            
            ))}
            <button
              type="button"
              onClick={handleAddCategory}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Add Category
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Submit Budget
          </button>
        </form>

        {submittedData && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800">Submitted Data</h3>
            <p className="mt-2 text-gray-700">
              Total Expense Goal: <strong>BDT-{submittedData.total_expense_goal}</strong>
            </p>
            <h4 className="mt-4 text-lg font-semibold text-gray-700">Categories:</h4>
            <ul className="mt-2 space-y-2">
              {submittedData.categories.map((category, index) => (
                <li key={index} className="flex justify-between">
                  <span>{category.name}</span>
                  <span>BDT {category.price}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-gray-700">
              Total Spending: <strong>BDT- {submittedData.total_spending}</strong>
            </p>
            <button
              onClick={generateExcel}
              className="mt-4 bg-green-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-green-700 transition"
            >
              Generate Excel
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
