'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      // If no token is found, redirect to login page
      router.push("/sign-in");
    } else {
      // Optionally, you can verify the token with your backend here
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    ); // Display a loading spinner in the center
  }

  return (
    <div>
      dashboard
    </div>
  );
}

export default Page;
