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
  const [isSticky, setIsSticky] = useState(false);

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

  // Track the scroll position for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-screen-xl mx-auto">
        {/* Navbar */}
        <div
          className={`p-5 flex justify-between items-center bg-white shadow-lg border-b fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out px-5 lg:px-24 xl:px-32 2xl:px-64 ${
            isSticky ? "bg-opacity-90 backdrop-blur-md shadow-xl py-2" : "py-4"
          }`}
        >
          {/* Back Home Button */}
          <Link href={"/"}>
            <Button className="bg-[#5C5CFF] text-white font-semibold text-lg py-3 px-8 rounded-lg shadow-lg flex items-center gap-2 hover:bg-[#2E2EFF] transition duration-300 ease-in-out">
              <ChevronLeftIcon className="h-5 w-5 text-white" />
              Back Home
            </Button>
          </Link>

          {/* Countdown Timer */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 rounded-lg shadow-lg">
            
            <div className="text-xl font-bold">{timeRemaining}s</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center py-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 leading-tight mb-6">
            Test Your Budgeting Skills
          </h1>
        </div>

        {/* Flex Section */}
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-between">
          {/* Budget Form Section */}
          <div className="w-full lg:w-1/2">
            <BudgetForm />
          </div>

          {/* Info Section */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-4">
              Create and Test Your Personal Budget
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 opacity-80">
              Ready to test your budgeting skills? Start by creating a budget
              for your personal expenses and see how well you manage your
              finances. This tool allows you to easily plan your income,
              expenses, and savings, helping you get a clearer picture of your
              financial health.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestPage;
