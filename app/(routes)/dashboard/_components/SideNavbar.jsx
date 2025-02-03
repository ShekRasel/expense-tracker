'use client';
import React, { useEffect } from "react";
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";


function SideNavbar({ isSidebarOpen, toggleSidebar }) {
  const menuList = [
    { id: 1, name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    { id: 2, name: "Budgets", icon: PiggyBank, path: "/dashboard/budgets" },
    { id: 3, name: "Expenses", icon: ReceiptText, path: "/dashboard/expenses" },
    { id: 4, name: "Feedback", icon: ShieldCheck, path: "/dashboard/feedback" },
  ];

  const path = usePathname();

  

  return (
    <div className="md:pt-16 ">
      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-white shadow-lg h-full relative">
            <button
              className="absolute top-4 right-4 bg-gray-100 p-2 rounded-md hover:bg-gray-200"
              onClick={toggleSidebar}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Logo for Mobile */}
            <div className="flex items-center p-5">
              <Image src="/logo.svg" alt="logo" width={50} height={100} />
              <h1 className="text-blue-500 font-semibold italic ml-2">Expense</h1>
            </div>

            <div className="mt-5">
              {menuList.map((menu) => (
                <Link key={menu.id} href={menu.path}>
                  <h2
                    className={`flex gap-2 mb-2 items-center text-gray-500 font-medium p-5 cursor-pointer rounded-md hover:text-primary hover:bg-blue-100 ${
                      path === menu.path && "text-primary bg-blue-100"
                    }`}
                  >
                    <menu.icon />
                    {menu.name}
                  </h2>
                </Link>
              ))}
            </div>
          </div>

          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={toggleSidebar}
          ></div>
        </div>
      )}

      {/* Sidebar for lg+ devices */}
      <div className="hidden lg:block fixed h-screen w-64 p-5 border shadow-sm bg-white z-20">
        <div className="mt-5">
          {menuList.map((menu) => (
            <Link key={menu.id} href={menu.path}>
              <h2
                className={`flex gap-2 mb-2 items-center text-gray-500 font-medium p-5 cursor-pointer rounded-md hover:text-primary hover:bg-blue-100 ${
                  path === menu.path && "text-primary bg-blue-100"
                }`}
              >
                <menu.icon />
                {menu.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SideNavbar;