"use client";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCategoryForm from "../_components/AddCategoryForm";

function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [addedCategories, setAddedCategories] = useState([]);
  const [expenseGoal, setExpenseGoal] = useState(0);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (addedCategories.length > 0) {
      localStorage.setItem("addedCategories", JSON.stringify(addedCategories));
    }
  }, [addedCategories]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const openGoalModal = () => setIsGoalModalOpen(true);
  const closeGoalModal = () => setIsGoalModalOpen(false);

  const handleCategoryAdded = (category, price) => {
    const currentDate = new Date().toLocaleDateString();
    const newCategories = [
      ...addedCategories,
      { category, price, dateAdded: currentDate },
    ];
    setAddedCategories(newCategories);
    closeModal();
  };

  const handleSubmitGoal = async () => {
    const parsedExpenseGoal = parseFloat(expenseGoal);
    if (isNaN(parsedExpenseGoal) || parsedExpenseGoal <= 0) {
      toast.error("Please enter a valid goal amount.");
      return;
    }

    const goalData = {
      id: Date.now(),
      total_expense_goal: parsedExpenseGoal,
      data: addedCategories.reduce((acc, item) => {
        acc[item.category] = item.price;
        return acc;
      }, {}),
    };

    try {
      const response = await fetch("http://localhost:3000/expense/goal", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(goalData),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success("Expense goal set successfully!");
        closeGoalModal();
      } else {
        toast.error(`Error: ${responseData.message || "Unable to set goal"}`);
      }
    } catch (error) {
      toast.error("There was an error while setting the goal.");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br  min-h-screen">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Manage Your Budgets</h1>
        <p className="text-gray-600 mt-2">Track your expenses and set goals effortlessly</p>
      </div>

      <div className="space-y-8">
        {/* Add Budget Box */}
        <div
          className="bg-white shadow-lg border rounded-xl p-8 flex justify-center items-center cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"
          onClick={openModal}
        >
          <div className="flex flex-col items-center">
            <div className="text-6xl font-bold text-blue-600">+</div>
            <p className="text-2xl font-semibold text-gray-800 mt-4">Add Your Budget</p>
          </div>
        </div>

        {/* Set Goal Button */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Set Your Expense Goal</h2>
          <button
            onClick={openGoalModal}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105"
          >
            Set Expense Goal
          </button>
        </div>

        {/* Added Budgets Section */}
        {addedCategories.length > 0 && (
          <div className="mt-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Added Budgets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {addedCategories.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-all transform hover:scale-105"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{item.category}</h3>
                    <p className="text-sm text-gray-500 mt-1">Added on: {item.dateAdded}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-blue-600">BDT {item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modals */}
        {isGoalModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Set Your Expense Goal</h2>
                <button
                  onClick={closeGoalModal}
                  className="text-gray-600 text-2xl hover:text-gray-800"
                >
                  &times;
                </button>
              </div>

              <input
                type="number"
                placeholder="Enter Goal Amount"
                value={expenseGoal}
                onChange={(e) => setExpenseGoal(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-lg mb-6 focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={handleSubmitGoal}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
              >
                Submit Goal
              </button>
            </div>
          </div>
        )}

        {/* Modal for Adding Category */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Create New Budget</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-600 text-2xl hover:text-gray-800"
                >
                  &times;
                </button>
              </div>

              <AddCategoryForm onCategoryAdded={handleCategoryAdded} />
            </div>
          </div>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default Page;