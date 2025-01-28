"use client";
import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa"; // User profile icon
import { IoSettingsSharp, IoLogOutOutline } from "react-icons/io5"; // Settings and Logout icons
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaBell, FaBellSlash } from "react-icons/fa";

function DashboardHeader({ toggleSidebar }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [maintenanceMessage, setMaintenanceMessage] = useState(""); // State for storing maintenance message
  const router = useRouter();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState("");

  // Fetch user info and maintenance message on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // Fetch user info from backend
      fetch("http://localhost:3000/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserInfo({
            fullname: data.fullname,
            email: data.email,
            role: data.role,
          });
          localStorage.setItem("userName", data.fullname);
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
        });

      // Fetch maintenance alert
      fetch("http://localhost:3000/maintenance/alert", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            setMaintenanceMessage(data.message);
          }
        })
        .catch((error) => {
          console.error("Error fetching maintenance alert:", error);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/");
  };

  const getRoleIcon = (role) => {
    if (role === "admin") {
      return <FaUserCircle className="w-6 h-6 mr-2" />;
    }
    return <FaUserCircle className="w-6 h-6 mr-2" />;
  };

  return (
    <div className="flex p-4 justify-between shadow shadow: md:justify-end fixed w-full bg-white z-30 top-0 left-0">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 md:hidden"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Container for Bell Icon and User Profile */}
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Bell Icon */}
        <div className="relative">
          <button
            className="flex items-center bg-gray-100 text-gray-600 p-2 rounded-md hover:bg-gray-200"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} // Toggle popup
          >
            <FaBell className="w-6 h-6 mr-2" /> {/* Bell Icon */}
            
          </button>

          {isNotificationsOpen && ( // Show popup if isNotificationsOpen is true
            <div className="absolute right-0 pt-5 z-40 bg-white rounded-lg shadow-xl border border-gray-200 w-60 transform transition-all duration-500 opacity-100 translate-y-0">
              <div className="flex flex-col items-start py-4 px-6 space-y-3">
                {maintenanceMessage ? (
                  <div className="w-full flex items-center p-3 rounded-md hover:bg-gray-100">
                    <span className="text-gray-700">{maintenanceMessage}</span>
                  </div>
                ) : (
                  <div className="w-full flex items-center p-3 rounded-md text-gray-600">
                    No maintenance updates.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Button */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button className="flex items-center bg-gray-100 text-gray-600 py-2 px-4 rounded-full hover:bg-gray-200">
            {userInfo ? (
              getRoleIcon(userInfo.role)
            ) : (
              <FaUserCircle className="w-6 h-6 mr-2" />
            )}
            <span className="hidden md:inline">
              {userInfo ? "" : "Profile"}
            </span>
          </button>

          <div
            className={`absolute right-0 pt-5 z-40 bg-white rounded-lg shadow-xl border border-gray-200 w-60 transform transition-all duration-500 ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-5 pointer-events-none"
            }`}
          >
            <div className="flex flex-col items-start py-4 px-6 space-y-3">
              <div
                onClick={() => setIsProfileOpen(true)}
                className="w-full flex items-center hover:bg-gray-100 p-3 rounded-md cursor-pointer"
              >
                {userInfo ? (
                  getRoleIcon(userInfo.role)
                ) : (
                  <FaUserCircle className="w-5 h-5 mr-3 text-gray-600" />
                )}
                <span className="text-gray-700">View Profile</span>
              </div>

              <div className="w-full hover:bg-gray-100 p-3 rounded-md cursor-pointer">
                <Link href="/dashboard/upgrade" className="flex items-center">
                  <IoSettingsSharp className="w-5 h-5 mr-3 text-gray-600" />
                  <span className="text-gray-700">Settings</span>
                </Link>
              </div>

              <div
                onClick={handleLogout}
                className="w-full flex items-center hover:bg-red-100 p-3 rounded-md cursor-pointer"
              >
                <IoLogOutOutline className="w-5 h-5 mr-3 text-red-500" />
                <span className="text-red-500">Logout</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                User Profile
              </h3>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>
            {userInfo ? (
              <div className="mt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Full Name:</span>
                  <span className="text-gray-600">{userInfo.fullname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="text-gray-600">{userInfo.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Role:</span>
                  <span className="text-gray-600">{userInfo.role}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Loading...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardHeader;
