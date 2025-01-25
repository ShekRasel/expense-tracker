"use client";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCategoryForm from "../_components/AddCategoryForm";

function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false); // Modal for expense goal
  const [addedCategories, setAddedCategories] = useState([]);
  const [expenseGoal, setExpenseGoal] = useState(0); // Goal state
  const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage

  // Store added categories in localStorage whenever it changes
  useEffect(() => {
    if (addedCategories.length > 0) {
      localStorage.setItem("addedCategories", JSON.stringify(addedCategories));
    }
  }, [addedCategories]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Open and close goal modal
  const openGoalModal = () => setIsGoalModalOpen(true);
  const closeGoalModal = () => setIsGoalModalOpen(false);

  const handleCategoryAdded = (category, price) => {
    const currentDate = new Date().toLocaleDateString(); // Get current date in a readable format
    const newCategories = [
      ...addedCategories,
      { category, price, dateAdded: currentDate }, // Store the category with the date
    ];
    setAddedCategories(newCategories); // Update the state and persist to localStorage
    closeModal(); // Close the modal after adding category
  };

  const handleSubmitGoal = async () => {
    const parsedExpenseGoal = parseFloat(expenseGoal);
    
    if (isNaN(parsedExpenseGoal) || parsedExpenseGoal <= 0) {
      toast.error("Please enter a valid goal amount.");
      return;
    }
  
    const goalData = {
      id: Date.now(),
      total_expense_goal: parsedExpenseGoal,  // Ensure it's a valid number
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
        toast.success("Expense goal set successfully!");  // Success notification
        closeGoalModal(); // Close modal after success
      } else {
        console.error("Error response:", responseData);
        toast.error(`Error: ${responseData.message || "Unable to set goal"}`);  // Error notification
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("There was an error while setting the goal.");  // Error notification
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">My Budgets</h1>
        <p className="text-gray-600 mt-2">Manage budgets and expenses</p>
      </div>

      <div>
        {/* Add Budget Box */}
        <div
          className="border-2 border-dashed border-gray-400 md:w-[450px] p-8 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={openModal}
        >
          <div className="flex justify-center items-center flex-col">
            <div className="text-4xl font-bold text-gray-600">+</div>
            <p className="text-lg font-medium text-gray-700 mt-2">Add Budget</p>
          </div>
        </div>

        {/* Set Goal Button */}
        <div className="mt-6">
          <h1 className="text-xl">You can set a goal</h1>
          <div className="mt-4">
            <button
              onClick={openGoalModal}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
            >
              Set Goal
            </button>
          </div>
        </div>

        {/* Added Categories List */}
        {addedCategories.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800">Added Budgets</h2>
            <div className="space-y-4 mt-4">
              {addedCategories.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between h-44 items-center md:w-[450px] p-4 bg-white rounded-xl shadow-md hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center w-full h-full justify-between font-semibold border-b border-gray-200 pb-4">
                    {/* Icon Section */}
                    <div className="flex items-center space-x-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-gray-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 011-1h12a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm3 1v12h10V4H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <h1 className="text-sm text-gray-500">Category:</h1>
                        <h1 className="text-lg font-semibold text-gray-800">{item.category}</h1>
                      </div>
                    </div>

                    {/* Price Section */}
                    <div className="flex flex-col items-end space-y-1">
                      <h1 className="text-sm text-gray-500">Amount</h1>
                      <h1 className="text-lg font-semibold text-gray-800">
                        BDT - {item.price}
                      </h1>
                      <h2 className="text-xs text-gray-400">Date : {item.dateAdded}</h2> {/* Display the dynamic date */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal for Goal */}
        {isGoalModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out opacity-100">
            <div className="bg-white pt-8 rounded-xl shadow-lg w-full max-w-md transform transition-transform duration-500 ease-in-out scale-100 opacity-100">
              <div className="flex justify-between items-center px-10">
                <h2 className="text-2xl font-semibold text-gray-800 pb-2">
                  Set Your Expense Goal
                </h2>
                <button
                  onClick={closeGoalModal}
                  className="text-gray-400 hover:text-gray-600 transition-all duration-300 ease-in-out text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="p-6">
                <label htmlFor="expenseGoal" className="block text-lg font-semibold text-gray-800">
                  Enter Goal Amount (BDT)
                </label>
                <input
                  type="number"
                  id="expenseGoal"
                  value={expenseGoal}
                  onChange={(e) => setExpenseGoal(e.target.value)} // Handle goal input change
                  placeholder="Enter your goal"
                  className="mt-2 p-3 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500 transition-all duration-300"
                />
              </div>

              <div className="p-6">
                <button
                  onClick={handleSubmitGoal}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Submit Goal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Adding Budget */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out opacity-100">
            <div className="bg-white pt-8 rounded-xl shadow-lg w-full max-w-md transform transition-transform duration-500 ease-in-out scale-100 opacity-100">
              <div className="flex justify-between items-center px-10">
                <h2 className="text-2xl font-semibold text-gray-800 pb-2">
                  Create new Budget
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-all duration-300 ease-in-out text-2xl"
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
