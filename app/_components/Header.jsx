"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { UserIcon, ShieldCheckIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Header() {
  const [isHovered, setIsHovered] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const router = useRouter();

  // Handle "Log in as Guest" API call
  const handleGuestLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/joinasguest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        toast.success("Successfully logged in as guest!", {
          position: "top-right",
        });
        setTimeout(() => {
          router.push("/guest");
        }, 2000); // Redirect after showing the notification
      } else {
        toast.error("Failed to log in as guest. Please try again.", {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.", {
        position: "top-right",
      });
      console.error("Error logging in as guest:", error);
    }
  };

  // Track the scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsSticky(true); // Add sticky class when scroll position is greater than 20px
      } else {
        setIsSticky(false); // Remove sticky class when scroll position is less than 20px
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
  {/* Toast Container */}
  <ToastContainer />

  <div
    className={`p-5 flex justify-between items-center bg-white shadow-lg border-b fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out px-5 lg:px-24  2xl:px-64 ${
      isSticky ? "bg-opacity-90 backdrop-blur-md shadow-xl py-4" : "py-6"
    }`}
  >
    {/* Logo Section */}
    <div className="flex items-center">
      <Image src="/logo.svg" alt="logo" width={50} height={100} />
      <h1 className="text-blue-500 font-semibold italic ml-2 text-xl sm:text-2xl">Expense</h1>
    </div>

    {/* Sign Up Button with Pop-Up */}
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Sign-Up Button */}
      <Button variant="default" className="px-6 py-2 text-base font-medium rounded-md shadow-md bg-gradient-to-r from-[#5C5CFF] to-[#2E2EFF] text-white hover:bg-blue-600 transition duration-300">
        Sign Up
      </Button>

      {/* Pop-Up */}
      <div
        className={`absolute right-0 pt-5  z-40 bg-white rounded-md shadow-xl border border-gray-200 w-72 transform transition-all duration-500 ${
          isHovered
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-5 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center py-6 space-y-4 p-2">
          {/* Title */}
          <h1 className="font-semibold text-md text-gray-800">Choose Your Role</h1>

          {/* User Sign-Up Option */}
          <div className="w-full">
            <Link href="/sign-up">
              <Button className="w-full flex items-center justify-start px-4 py-3 rounded-md bg-blue-50 hover:bg-blue-100 transition">
                <UserIcon className="h-6 w-6 text-blue-500 mr-3" />
                <span className="text-gray-700 font-medium text-sm">Sign Up as a User</span>
              </Button>
            </Link>

            {/* Admin Sign-Up Option */}
            <Button
              onClick={handleGuestLogin} // Handle guest login
              className="w-full flex items-center mt-4 justify-start px-4 py-3 rounded-md bg-red-50 hover:bg-red-100 transition"
            >
              <ShieldCheckIcon className="h-6 w-6 text-red-500 mr-3" />
              <span className="text-gray-700 font-medium text-sm">Log in as Guest</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</>

  );
}

export default Header;
