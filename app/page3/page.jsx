"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
const page = () => {
  const [currentPage, setCurrentPage] = useState(3);
  const totalPages = 3;
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br mt-16 from-purple-50 to-blue-50 pt-20 font-sans">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-purple-900 mb-4">
            About Our Expense Tracker App
          </h1>
          <p className="text-xl text-gray-700">
            Everything you need to know about managing your finances
            effortlessly.
          </p>
        </div>

        {/* App Overview */}
        <div className="bg-white rounded-lg shadow-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-purple-800 mb-6">
            App Overview
          </h2>
          <p className="text-gray-700 mb-6">
            Our expense tracker app is designed to help you take control of your
            finances. Whether you're managing personal expenses, tracking
            business costs, or planning a budget, our app provides the tools you
            need to stay organized and make informed financial decisions.
          </p>
          <p className="text-gray-700">
            With a user-friendly interface and powerful features, you can easily
            monitor your spending, set financial goals, and generate detailed
            reports to understand your financial habits better.
          </p>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-lg shadow-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-purple-800 mb-6">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-purple-800 mb-4">
                Real-Time Tracking
              </h3>
              <p className="text-gray-700">
                Monitor your expenses in real-time and get instant updates on
                your spending.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-purple-800 mb-4">
                Budget Planning
              </h3>
              <p className="text-gray-700">
                Create and manage budgets to achieve your financial goals
                effectively.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-purple-800 mb-4">
                Reports & Analytics
              </h3>
              <p className="text-gray-700">
                Generate detailed reports and gain insights into your spending
                habits.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-purple-800 mb-6">
            How It Works
          </h2>
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex items-start">
              <div className="bg-purple-800 text-white rounded-full w-12 h-12 flex items-center justify-center mr-6">
                <span className="text-xl font-bold">1</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-purple-800 mb-2">
                  Sign Up
                </h3>
                <p className="text-gray-700">
                  Create an account to get started. It's quick, easy, and free!
                </p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex items-start">
              <div className="bg-purple-800 text-white rounded-full w-12 h-12 flex items-center justify-center mr-6">
                <span className="text-xl font-bold">2</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-purple-800 mb-2">
                  Add Expenses
                </h3>
                <p className="text-gray-700">
                  Start adding your expenses manually or by syncing your bank
                  accounts.
                </p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex items-start">
              <div className="bg-purple-800 text-white rounded-full w-12 h-12 flex items-center justify-center mr-6">
                <span className="text-xl font-bold">3</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-purple-800 mb-2">
                  Analyze & Improve
                </h3>
                <p className="text-gray-700">
                  Use our analytics tools to understand your spending and
                  improve your financial habits.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-purple-900 mb-6">
            Ready to Take Control of Your Finances?
          </h2>
          <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300">
            Get Started Now
          </button>
        </div>

        <div className="flex justify-center items-center py-10 mt-10 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <Link key={page} href={page === 1 ? "/" : `/page${page}`}>
                <button
                  className={`px-4 py-2 border rounded-lg text-lg font-semibold transition-all duration-300 ease-in-out ${
                    page === currentPage
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              </Link>
            )
          )}
          <h1 className="mt-4">....</h1>
        </div>
      </div>
    </div>
  );
};

export default page;
