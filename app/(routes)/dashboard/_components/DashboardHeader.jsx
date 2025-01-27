'use client';
import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Link from 'next/link';
import { FaUserCircle } from "react-icons/fa"; // User profile icon
import { IoSettingsSharp, IoLogOutOutline } from "react-icons/io5"; // Settings and Logout icons
import { FaBell, FaBellSlash } from "react-icons/fa"; // Notification icons
import { IoPersonCircleOutline } from "react-icons/io5"; // Admin icon
import { Button } from "@/components/ui/button"; 
import { useRouter } from 'next/navigation';

function DashboardHeader({ toggleSidebar }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false); // State for managing notification dropdown
  const [notifications, setNotifications] = useState([]); // State for notifications
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false); // To highlight the bell icon
  const [maintenanceMessage, setMaintenanceMessage] = useState(""); // State for storing maintenance message
  const router = useRouter();

  // Fetch user info and notifications on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // Fetch user info from backend
      fetch('http://localhost:3000/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(response => response.json())
      .then(data => {
        setUserInfo({
          fullname: data.fullname,
          email: data.email,
          role: data.role,
        });
        localStorage.setItem("userName", data.fullname);
      })
      .catch(error => {
        console.error("Error fetching user info:", error);
      });

      // Fetch notifications
      fetch('http://localhost:3000/notifications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(response => response.json())
      .then(data => {
        setNotifications(data.notifications);
        console.log(data);
        const unreadNotifications = data.notifications.filter(notification => !notification.read);
        setHasUnreadNotifications(unreadNotifications.length > 0);
      })
      .catch(error => {
        console.error("Error fetching notifications:", error);
      });

      // Fetch maintenance alert
      fetch('http://localhost:3000/maintenance/alert', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data["Maintenance alert"]?.message) {
          setMaintenanceMessage(data["Maintenance alert"].message);
        }
      })
      .catch(error => {
        console.error("Error fetching maintenance alert:", error);
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/");
  };

  const handleNotificationClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (hasUnreadNotifications) {
      // Mark notifications as read when the dropdown is opened
      setHasUnreadNotifications(false);
      // Optionally send a request to mark notifications as read on the server
    }

    const token = localStorage.getItem("authToken");

    if (token) {
      // Send a request to the maintenance alert endpoint when the bell is clicked
      fetch('http://localhost:3000/maintenance/alert', {
        method: 'GET', // Adjust as needed (POST or GET)
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(response => response.json())
      .then(data => {
        
        // Display the maintenance message if available
        if (data["Maintenance alert"]?.message) {
          alert(data["Maintenance alert"].message); // You can display this in the UI if you prefer
        }
      })
      .catch(error => {
        console.error("Error fetching maintenance alert:", error);
      });
    } else {
      console.error("No auth token found in localStorage.");
    }
  };

  const getRoleIcon = (role) => {
    if (role === 'admin') {
      return <IoPersonCircleOutline className="w-6 h-6 mr-2" />;
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
        onClick={handleNotificationClick}
        className="flex items-center bg-gray-100 text-gray-600 p-2 rounded-md hover:bg-gray-200"
      >
        {hasUnreadNotifications ? (
          <FaBell className="w-6 h-6 text-red-500" /> // Highlighted bell icon for unread notifications
        ) : (
          <FaBellSlash className="w-6 h-6" />
        )}
      </button>

      {isNotificationsOpen && (
        <div className="absolute right-0 pt-5 z-40 bg-white rounded-lg shadow-xl border border-gray-200 w-60 transform transition-all duration-500 opacity-100 translate-y-0">
          <div className="flex flex-col items-start py-4 px-6 space-y-3">
            {notifications && notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div
                  key={index}
                  className="w-full flex items-center p-3 rounded-md hover:bg-gray-100"
                >
                  <span className="text-gray-700">{notification.message}</span>
                </div>
              ))
            ) : (
              <div className="w-full flex items-center p-3 rounded-md text-gray-600">
                No new notifications.
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
      <button className="flex items-center bg-gray-100 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-200">
        {userInfo ? getRoleIcon(userInfo.role) : <FaUserCircle className="w-6 h-6 mr-2" />}
        <span className="hidden md:inline">{userInfo ? userInfo.fullname : "Profile"}</span>
      </button>

      <div
        className={`absolute right-0 pt-5 z-40 bg-white rounded-lg shadow-xl border border-gray-200 w-60 transform transition-all duration-500 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5 pointer-events-none"}`}
      >
        <div className="flex flex-col items-start py-4 px-6 space-y-3">
          <div
            onClick={() => setIsProfileOpen(true)}
            className="w-full flex items-center hover:bg-gray-100 p-3 rounded-md cursor-pointer"
          >
            {userInfo ? getRoleIcon(userInfo.role) : <FaUserCircle className="w-5 h-5 mr-3 text-gray-600" />}
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
          <h3 className="text-xl font-semibold text-gray-800">User Profile</h3>
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
