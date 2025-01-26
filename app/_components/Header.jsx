"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { useState } from "react";
import { UserIcon, ShieldCheckIcon } from "@heroicons/react/solid";
import Link from "next/link";

function Header() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="p-5 flex justify-between items-center border-b shadow-lg bg-white lg:px-24 2xl:px-44">
      {/* Logo Section */}
      <div className="flex items-center">
        <Image src={"/logo.svg"} alt="logo" width={50} height={100} />
        <h1 className="text-blue-500 font-semibold italic ml-2">Expense</h1>
      </div>

      {/* Sign Up Button with Pop-Up */}
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Sign-Up Button */}
        <Button variant="default" className="px-6 py-2">
          Sign Up
        </Button>

        {/* Pop-Up */}
        <div
          className={`absolute right-0 pt-5 z-40 bg-white rounded-lg shadow-xl border border-gray-200 w-72 transform transition-all duration-500 ${
            isHovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-5 pointer-events-none"
          }`}
        >
          <div className="flex flex-col items-center py-6 space-y-4 p-2">
            {/* Title */}
            <h1 className="font-semibold text-lg text-gray-800">
              Choose Your Role
            </h1>

            {/* User Sign-Up Option */}
            <div className="w-full">
              <Link href={"/sign-up"}>
                <Button className="w-full flex items-center justify-start px-4 py-3 rounded-md bg-blue-50 hover:bg-blue-100 transition">
                  <UserIcon className="h-6 w-6 text-blue-500 mr-3" />
                  <span className="text-gray-700 font-medium">
                    Sign Up as a User
                  </span>
                </Button>
              </Link>

              {/* Admin Sign-Up Option */}
              <Link href={'/sign-in'}>
              <Button className="w-full flex items-center mt-4 justify-start px-4 py-3 rounded-md bg-red-50 hover:bg-red-100 transition">
                <ShieldCheckIcon className="h-6 w-6 text-red-500 mr-3" />
                <span className="text-gray-700 font-medium">
                  Log in as Guest
                </span>
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
