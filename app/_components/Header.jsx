"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { UserIcon, ShieldCheckIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { LoginIcon } from '@heroicons/react/solid';
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
        className={`md:px-4 flex justify-between items-center bg-white shadow-lg border-b fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out px-6 lg:px-24 2xl:px-64 ${
          isSticky ? "bg-opacity-95 backdrop-blur-md shadow-xl py-3" : "py-4"
        }`}
      >
        {/* Logo Section */}
        <div>
          <Link href={'/'} className='flex items-center'>
            <Image src="/logo.svg" alt="logo" width={50} height={100} />
            <h1 className="text-blue-600 font-semibold italic ml-2 text-xl sm:text-2xl">Expense</h1>
          </Link>
        </div>

        {/* Sign Up Button with Pop-Up */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Sign-Up Button */}
          <Button
            variant="default"
            className="px-6 py-2 text-base font-medium rounded-md shadow-md bg-gradient-to-r from-[#576afb] to-[#2626f7] text-white hover:from-[#4A4AFF] hover:to-[#1E1EFF] transition duration-300"
          >
            Sign Up
          </Button>

          {/* Pop-Up */}
          <div
            className={`absolute right-0 pt-5 z-40 bg-white rounded-lg shadow-xl border border-gray-100 w-80 transform transition-all duration-300 ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-5 pointer-events-none"
            }`}
          >
            <div className="flex flex-col items-center py-6 space-y-4 p-4">
              {/* Title */}
              <h1 className="font-semibold text-lg text-gray-800">Choose Your Role</h1>

              {/* User Sign-Up Option */}
              <div className="w-full">
  <Link href="/sign-up">
    <Button className="w-full flex items-center justify-start px-4 py-3 rounded-md bg-blue-100 hover:bg-blue-200 transition duration-200">
      <UserIcon className="h-6 w-6 text-blue-500 mr-3" />
      <span className="text-black font-medium text-sm">Get Started as a User</span>
    </Button>
  </Link>

  <Button
    onClick={handleGuestLogin} // Handle guest login
    className="w-full flex items-center mt-4 justify-start px-4 py-3 rounded-md bg-red-100 hover:bg-red-200 transition duration-200"
  >
    <ShieldCheckIcon className="h-6 w-6 text-red-500 mr-3" />
    <span className="text-gray-700 font-medium text-sm">Explore as a Guest</span>
  </Button>

  <Link href="/sign-in">
    <Button className="w-full flex items-center mt-4 justify-start px-4 py-3 rounded-md bg-green-100 hover:bg-green-200 transition duration-200">
      <LoginIcon className="h-6 w-6 text-green-500 mr-3" />
      <span className="text-black font-medium text-sm">Sign In</span>
    </Button>
  </Link>
</div>



            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;