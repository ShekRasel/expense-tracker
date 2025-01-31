'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaMoneyBillWave, FaChartPie } from "react-icons/fa";
import { AiOutlineFund, AiOutlineWarning } from "react-icons/ai";
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, Title, Tooltip, Legend, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { jwtDecode } from "jwt-decode";

ChartJS.register(BarElement, Title, Tooltip, Legend, CategoryScale, LinearScale, ArcElement);

function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [expenses, setExpenses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUserName = localStorage.getItem("userName");

    if (!token) {
      router.push("/sign-in");
    } else {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userName");
        router.push("/sign-in");
      } else {
        setIsAuthenticated(true);
        setUserName(storedUserName || "Guest");
        fetchExpenseReport(token);
      }
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

  const barChartData = {
    labels: expenses ? Object.keys(expenses.data) : [],
    datasets: [
      {
        label: 'Expense Categories',
        data: expenses ? Object.values(expenses.data) : [],
        backgroundColor: '#4CAF50',
        borderColor: '#388E3C',
        borderWidth: 1,
      },
    ],
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const pieChartData = {
    labels: expenses ? Object.keys(expenses.data) : [],
    datasets: [
      {
        data: expenses ? Object.values(expenses.data) : [],
        backgroundColor: expenses ? Object.keys(expenses.data).map(() => getRandomColor()) : [],
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
    <div className="xl:px-8 2xl:px-16 min-h-screen bg-gradient-to-br">
      {/* Welcome Section */}
      <div className="pt-8 pb-6 text-center">
        <h1 className="font-bold text-3xl text-gray-800 mb-2">Welcome to Your Dashboard,😀</h1>
        <p className="text-gray-600">Here's your personalized expense report and budget overview.</p>
      </div>

      {/* Budget Overview Section */}
      {expenses && (
        <div className="bg-white p-6 rounded-xl shadow-lg mx-4 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Budget Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-4">
                <FaMoneyBillWave size={30} />
                <div>
                  <h3 className="text-xl font-medium">Total Spending</h3>
                  <p className="text-2xl font-bold">BDT {expenses.totalSpending}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-4">
                <AiOutlineFund size={30} />
                <div>
                  <h3 className="text-xl font-medium">Expense Goal</h3>
                  <p className="text-2xl font-bold">BDT {expenses.total_expense_goal}</p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-lg shadow-md ${expenses.totalSpending > expenses.total_expense_goal ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-green-500 to-green-600"} text-white`}>
              <div className="flex items-center space-x-4">
                <AiOutlineWarning size={30} />
                <div>
                  <h3 className="text-xl font-medium">Budget Status</h3>
                  <p className="text-2xl font-bold">
                    {expenses.totalSpending > expenses.total_expense_goal ? "Over Budget!" : "Within Budget"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expense Categories Section */}
      {expenses && expenses.data && (
        <div className="bg-white p-6 rounded-xl shadow-lg mx-4 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Expense Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(expenses.data).map(([category, price], index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <FaChartPie size={24} className="text-blue-500" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">{category}</h3>
                    <p className="text-gray-600">BDT {price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Section */}
      {expenses && expenses.data && (
        <div className="bg-white p-6 rounded-xl shadow-lg mx-4 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Visual Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-800 mb-4">Expense Breakdown by Category</h3>
              <div className="w-full h-72">
                <Bar
                  data={barChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      title: { display: false },
                      tooltip: { backgroundColor: '#000', titleColor: '#fff', bodyColor: '#fff' },
                    },
                    scales: {
                      x: { grid: { display: false }, ticks: { font: { size: 12 } } },
                      y: { grid: { color: '#ddd' }, ticks: { font: { size: 12 } } },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-800 mb-4">Expense Distribution</h3>
              <div className="w-full h-72 flex justify-center">
                <Pie
                  data={pieChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      title: { display: false },
                      tooltip: { backgroundColor: '#000', titleColor: '#fff', bodyColor: '#fff' },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center text-blue-500 font-medium mt-8">Loading your expense report...</div>
      )}
      {error && (
        <div className="text-center text-red-500 font-medium mt-8">{error}</div>
      )}
    </div>
  );
}

export default Page;