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
          "Authorization": `Bearer ${token}`,
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
    <div className="p-6 h-auton">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Manage Your Budgets</h1>
        <p className="text-gray-600 mt-2">Track your expenses and set goals</p>
      </div>

      <div className="space-y-6">
        {/* Add Budget Box */}
        <div
          className="bg-white shadow-md border rounded-sm p-6 flex justify-center items-center cursor-pointer hover:bg-gray-100 transition-all"
          onClick={openModal}
        >
          <div className="flex flex-col items-center">
            <div className="text-4xl font-semibold text-blue-600">+</div>
            <p className="text-lg font-medium text-gray-800 mt-3">Add Your Budget</p>
          </div>
        </div>

        {/* Set Goal Button */}
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-800">Set Your Expense Goal</h2>
          <button
            onClick={openGoalModal}
            className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
          >
            Set Expense Goal
          </button>
        </div>

        {/* Added Categories List */}
        {addedCategories.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Your Added Budgets</h2>
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {addedCategories.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border rounded-sm p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-all"
                >
                  <div>
                    <h1 className="text-lg font-medium text-gray-800">{item.category}</h1>
                    <p className="text-sm text-gray-500">{item.dateAdded}</p>
                  </div>
                  <div className="text-right">
                    <h1 className="text-lg font-semibold text-gray-800">BDT {item.price}</h1>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modals */}
        {isGoalModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Set Your Expense Goal</h2>
                <button onClick={closeGoalModal} className="text-gray-600 text-2xl">&times;</button>
              </div>

              <input
                type="number"
                placeholder="Enter Goal Amount"
                value={expenseGoal}
                onChange={(e) => setExpenseGoal(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-md mb-4"
              />
              <button
                onClick={handleSubmitGoal}
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit Goal
              </button>
            </div>
          </div>
        )}

        {/* Modal for Adding Category */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Create New Budget</h2>
                <button onClick={closeModal} className="text-gray-600 text-2xl">&times;</button>
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
