'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideNavbar from "./_components/SideNavbar";
import DashboardHeader from "./_components/DashboardHeader";

function DashboardLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      router.push("/sign-in");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <SideNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main content */}
      <div className="flex-1 md:ml-64"> {/* Give space for the sidebar */}
        <DashboardHeader toggleSidebar={toggleSidebar} />
        <div className="pt-20 px-5">{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
