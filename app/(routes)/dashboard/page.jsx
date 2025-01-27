'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaMoneyBillWave, FaChartPie } from "react-icons/fa";
import { AiOutlineFund, AiOutlineWarning } from "react-icons/ai"; 
import { Bar } from 'react-chartjs-2'; // Import Bar chart from react-chartjs-2
import { Chart as ChartJS, BarElement, Title, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js'; // Import necessary Chart.js components

// Register Chart.js components
ChartJS.register(BarElement, Title, Tooltip, Legend, CategoryScale, LinearScale);

function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState(""); // State to store user name
  const [expenses, setExpenses] = useState(null); // State for expense data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUserName = localStorage.getItem("userName"); // Assuming name is stored in localStorage

    if (!token) {
      router.push("/sign-in");
    } else {
      setIsAuthenticated(true);
      setUserName(storedUserName || "Guest"); // Set the user's name

      // Fetch expense report
      fetchExpenseReport(token);
    }
  }, [router]);

  const fetchExpenseReport = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/expense/user/expensereport",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExpenses(response.data);
    } catch (err) {
      setError("Failed to fetch expense report. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Prepare Bar chart data
  const barChartData = {
    labels: expenses ? Object.keys(expenses.data) : [],
    datasets: [
      {
        label: 'Expense Categories', 
        data: expenses ? Object.values(expenses.data) : [],
        backgroundColor: '#4CAF50', // Cool green bar color
        borderColor: '#388E3C',
        borderWidth: 1,
      },
    ],
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen">
      <h1 className="font-bold text-3xl text-center mb-4 text-gray-800">Hi, {userName}! 😀</h1>
      <p className="text-center text-gray-500 mb-8">Here's what's happening with you:</p>

      {loading ? (
        <div className="text-center text-blue-500 font-semibold mt-4">Loading your expense report...</div>
      ) : error ? (
        <div className="text-center text-red-500 font-semibold mt-4">{error}</div>
      ) : expenses && expenses.data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {/* Total Spending Box */}
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-4">
              <FaMoneyBillWave size={40} />
              <div>
                <h2 className="text-2xl font-bold">Total Spending</h2>
                <p className="text-lg">BDT {expenses.totalSpending}</p>
              </div>
            </div>
          </div>

          {/* Expense Goal Box */}
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-4">
              <AiOutlineFund size={40} />
              <div>
                <h2 className="text-2xl font-bold">Expense Goal</h2>
                <p className="text-lg">BDT {expenses.total_expense_goal}</p>
              </div>
            </div>
          </div>

          {/* Over Budget Box */}
          <div
            className={`p-6 rounded-lg shadow-lg ${
              expenses.totalSpending > expenses.total_expense_goal
                ? "bg-red-500 text-white"
                : "bg-green-400 text-white"
            }`}
          >
            <div className="flex items-center space-x-4">
              <AiOutlineWarning size={40} />
              <div>
                <h2 className="text-2xl font-bold">Budget Status</h2>
                {expenses.totalSpending > expenses.total_expense_goal ? (
                  <p className="text-lg">Over Budget!</p>
                ) : (
                  <p className="text-lg">Within Budget</p>
                )}
              </div>
            </div>
          </div>

          {/* Expense Categories */}
          {Object.entries(expenses.data).map(([category, price], index) => (
            <div
              key={index}
              className="bg-gray-200 text-gray-800 p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center space-x-4">
                <FaChartPie size={40} className="text-blue-500" />
                <div>
                  <h2 className="text-xl font-bold">{category}</h2>
                  <p className="text-lg">BDT {price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-4">No expense data available.</div>
      )}

      {/* Bar Chart Section - positioned at the start */}
      {expenses && expenses.data && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 text-left mb-4">Expense Breakdown by Category</h2>
          <div className="flex justify-start">
            <Bar 
              data={barChartData} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: 'Expense Breakdown',
                    font: {
                      size: 24,
                      weight: 'bold',
                    },
                  },
                  tooltip: {
                    backgroundColor: '#000',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#fff',
                    borderWidth: 1,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      font: {
                        size: 14,
                      },
                    },
                  },
                  y: {
                    grid: {
                      color: '#ddd',
                    },
                    ticks: {
                      font: {
                        size: 14,
                      },
                    },
                  },
                },
              }} 
              style={{ width: '100%', height: '400px' }} // Set height and full width for better appearance
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
