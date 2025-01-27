"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineLock, AiOutlineHome } from "react-icons/ai"; // Added the home icon
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Both fields are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/users/auth/userlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Sign-in failed");
      }

      const response = await res.json();
      // Store the token in local storage
      localStorage.setItem("authToken", response.access_token); // Assuming response.token contains the JWT

      // Notify success
      toast.success("Sign In Successful! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard"); // Update this route as per your app
      }, 2000);
    } catch (error) {
      toast.error(error.message || "Invalid credentials, please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r bg-gray-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full transform transition-all duration-500 hover:scale-105">
        
        {/* Back to Home Button */}
        <div className="absolute top-4 left-4">
          <Link href="/">
            <button className="text-blue-600 p-2 hover:bg-blue-100 rounded-full transition-all">
              <AiOutlineHome className="h-6 w-6" />
            </button>
          </Link>
        </div>

        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6 animate__animated animate__fadeIn animate__delay-1s">
          Sign In
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <div className="relative">
              <AiOutlineMail className="absolute mt-1 left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 mt-2 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <div className="relative">
              <AiOutlineLock className="absolute left-3 mt-1 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 mt-2 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 transition-transform duration-300"
              >
                {passwordVisible ? (
                  <AiOutlineEyeInvisible className="h-5 w-5 mt-3" />
                ) : (
                  <AiOutlineEye className="h-5 w-5 mt-3" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition transform duration-300 hover:scale-105"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <div className="text-gray-700">
            Don't have an account?{" "}
            <Link href="/sign-up">
              <h1 className="text-blue-600 hover:underline transition-all">
                Sign Up
              </h1>
            </Link>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default SignIn;
