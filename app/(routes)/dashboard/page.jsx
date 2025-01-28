'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaMoneyBillWave, FaChartPie } from "react-icons/fa";
import { AiOutlineFund, AiOutlineWarning } from "react-icons/ai"; 
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2'; // Import Pie chart
import { Chart as ChartJS, BarElement, Title, Tooltip, Legend, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { jwtDecode } from "jwt-decode"; 

ChartJS.register(BarElement, Title, Tooltip, Legend, CategoryScale, LinearScale, ArcElement); // Register ArcElement for Pie Chart

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
    <div className="xl:px-8 2xl:px-16 min-h-screen">
      <h1 className="font-medium text-2xl text-center mb-4 text-gray-700">
        Hi, {userName ? userName : "Loading..."}! 😀
      </h1>
      <p className="text-center text-gray-600 mb-8">Here's your expense report:</p>

      {loading ? (
        <div className="text-center text-blue-500 font-medium mt-4">Loading your expense report...</div>
      ) : error ? (
        <div className="text-center text-red-500 font-medium mt-4">{error}</div>
      ) : expenses && expenses.data ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 mt-6">
          <div className="bg-blue-500 text-white p-5 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <FaMoneyBillWave size={30} />
              <div>
                <h2 className="text-xl font-medium">Total Spending</h2>
                <p className="text-lg">BDT {expenses.totalSpending}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-500 text-white p-5 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <AiOutlineFund size={30} />
              <div>
                <h2 className="text-xl font-medium">Expense Goal</h2>
                <p className="text-lg">BDT {expenses.total_expense_goal}</p>
              </div>
            </div>
          </div>

          <div
            className={`p-5 rounded-lg shadow-md ${expenses.totalSpending > expenses.total_expense_goal ? "bg-red-400 text-white" : "bg-green-400 text-white"}`}
          >
            <div className="flex items-center space-x-3">
              <AiOutlineWarning size={30} />
              <div>
                <h2 className="text-xl font-medium">Budget Status</h2>
                {expenses.totalSpending > expenses.total_expense_goal ? (
                  <p className="text-lg">Over Budget!</p>
                ) : (
                  <p className="text-lg">Within Budget</p>
                )}
              </div>
            </div>
          </div>

          {Object.entries(expenses.data).map(([category, price], index) => (
            <div key={index} className="bg-gray-200 text-gray-800 p-5 rounded-md shadow-md">
              <div className="flex items-center space-x-3">
                <FaChartPie size={30} className="text-blue-500" />
                <div>
                  <h2 className="text-lg font-medium">{category}</h2>
                  <p className="text-sm">BDT {price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 mt-4">No expense data available.</div>
      )}

      {/* Bar and Pie Chart Section */}
      {expenses && expenses.data && (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white md:p-6 rounded-md shadow-md">
            <h2 className="text-xl font-medium text-gray-800 text-left mb-4">Expense Breakdown by Category</h2>
            <div className="w-full" style={{ height: '300px' }}>
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    title: {
                      display: true,
                      text: 'Expense Breakdown',
                      font: { size: 20, weight: 'bold' },
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
                      grid: { display: false },
                      ticks: { font: { size: 12 } },
                    },
                    y: {
                      grid: { color: '#ddd' },
                      ticks: { font: { size: 12 } },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 justify-center rounded-md shadow-md">
            <h2 className="text-xl font-medium text-gray-800 text-left mb-4">Expense Distribution</h2>
            <div className="w-full flex justify-center" style={{ height: '300px' }}>
              <Pie
                data={pieChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    title: { display: true, text: 'Expense Distribution' },
                    tooltip: { backgroundColor: '#000', titleColor: '#fff', bodyColor: '#fff' },
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
