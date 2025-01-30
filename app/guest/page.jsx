"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BudgetForm from "../_components/BudgetForm";
import { ChevronLeftIcon } from "@heroicons/react/solid"; // Importing back icon

function GuestPage() {
  const [timeRemaining, setTimeRemaining] = useState(600); // Countdown starts at 10 minutes
  const router = useRouter();

  // Redirect to the sign-up page after countdown
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      router.push("/sign-up");
    }
  }, [timeRemaining, router]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-screen-xl mx-auto">
        {/* Countdown Timer */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg shadow-lg mb-10">
          <div className="text-sm font-medium text-center">
            Redirecting in {timeRemaining}s
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center py-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Master Your Budgeting Skills
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-10 opacity-90">
            Welcome to the guest demo! Explore our powerful budgeting tools and
            see how easy it is to take control of your finances. Create a sample
            budget, track expenses, and gain insights into your financial habits
            in just a few minutes.
          </p>
        </div>

        {/* Budget Form Section */}
        <div className="w-full lg:w-1/2 mx-auto mb-16">
          <BudgetForm />
        </div>

        {/* Features Section */}
        <div className="text-center py-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            Why Choose Our App?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-12">
            Our app is designed to simplify financial planning and help you
            achieve your goals. Here’s what makes us stand out:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Effortless Budgeting
              </h3>
              <p className="text-gray-600">
                Create and manage budgets with ease. Categorize expenses, set
                savings goals, and stay on top of your finances effortlessly.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Real-Time Insights
              </h3>
              <p className="text-gray-600">
                Track your spending in real-time and get actionable insights to
                improve your financial health.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Smart Financial Planning
              </h3>
              <p className="text-gray-600">
                Plan for the future with advanced tools that help you save,
                invest, and achieve your financial dreams.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            Sign up now to unlock the full potential of our budgeting tools and
            start your journey toward financial freedom.
          </p>
          <Link href="/sign-up">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold text-lg py-3 px-8 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GuestPage;