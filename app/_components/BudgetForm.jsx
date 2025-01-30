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
  const [isPopupVisible, setIsPopupVisible] = useState(false);

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

    const updatedCategories = formData.categories.map((category) => ({
      ...category,
      price: parseFloat(category.price) || 0,
    }));

    const updatedFormData = {
      ...formData,
      total_expense_goal: parseFloat(formData.total_expense_goal) || 0,
      categories: updatedCategories,
    };

    try {
      const response = await axios.post('http://localhost:3000/guest/budget', updatedFormData);
      toast.success('Budget submitted successfully!');
      setSubmittedData(response.data);
      setIsPopupVisible(true); // Show the popup smoothly
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

  const closePopup = () => {
    setIsPopupVisible(false);
    setSubmittedData(null);
  };

  return (
    <div className="h-auto flex justify-center items-center p-4">
      <div className="w-full max-w-2xl bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-2xl p-6 sm:p-10">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Budget Planner</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Total Expense Goal */}
          <div>
            <label htmlFor="total_expense_goal" className="block text-sm font-medium text-gray-700">
              Total Expense Goal
            </label>
            <input
              type="number"
              placeholder="Your Budget in Tk"
              id="total_expense_goal"
              name="total_expense_goal"
              value={formData.total_expense_goal}
              onChange={(e) => setFormData({ ...formData, total_expense_goal: e.target.value })}
              className="mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Categories</h3>
            {formData.categories.map((category, index) => (
              <div key={index} className="space-y-2 mt-4 flex items-center gap-4">
                <input
                  type="text"
                  name="name"
                  value={category.name}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Category Name"
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <input
                  type="number"
                  name="price"
                  value={category.price}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Price"
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(index)}
                  className="text-red-600 hover:text-red-800 transition-all"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddCategory}
              className="mt-4 text-blue-600 hover:text-blue-800 transition-all"
            >
              + Add Category
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg"
          >
            Submit Budget
          </button>
        </form>

        {/* Submitted Data Popup */}
        {isPopupVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-transform duration-300 scale-100">
              <h3 className="text-2xl font-bold text-gray-900">Submitted Data</h3>
              <p className="mt-4 text-gray-700">
                Total Expense Goal: <strong>BDT {submittedData.total_expense_goal}</strong>
              </p>
              <h4 className="mt-6 text-lg font-semibold text-gray-700">Categories:</h4>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead>
                    <tr>
                      <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Category</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submittedData.categories.map((category, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-all">
                        <td className="p-3 text-sm text-gray-700 border-b">{category.name}</td>
                        <td className="p-3 text-sm text-gray-700 border-b">BDT {category.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-6 text-gray-700">
                Total Spending: <strong>BDT {submittedData.total_spending}</strong>
              </p>
              <div className="flex justify-between mt-8">
                <button
                  onClick={generateExcel}
                  className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all shadow-lg"
                >
                  Generate Excel
                </button>
                <button
                  onClick={closePopup}
                  className="text-red-600 hover:text-red-800 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}