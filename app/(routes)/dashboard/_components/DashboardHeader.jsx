'use client';
import React from "react";
import { Menu } from "lucide-react";

function DashboardHeader({ toggleSidebar }) {
  return (
    <div className="border-b flex p-4 justify-between md:justify-end fixed w-full bg-white z-30 top-0 left-0">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 md:hidden"
      >
        <Menu className="w-6 h-6" />
      </button>

      <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
        Logout
      </button>
    </div>
  );
}

export default DashboardHeader;
