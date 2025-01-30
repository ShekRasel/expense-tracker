"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineLock, AiOutlineHome } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import ForgetPasswordModal from '../_components/ForgetPasswordModal';

const SignIn = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      localStorage.setItem("authToken", response.access_token);

      toast.success("Sign In Successful! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      toast.error(error.message || "Invalid credentials, please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 flex items-center justify-center px-4 lg:px-8 lg:mt-8 2xl:mt-0">
      {/* Container for Image and Form */}
      <div className="flex items-stretch bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl">
        {/* Left Side: Sign-In Form */}
        <div className="w-full lg:w-1/2 p-8">
          {/* Back to Home Button */}
          <button
            onClick={() => router.push("/")}
            className="absolute top-6 left-6 text-gray-500 hover:text-gray-800 transition duration-300"
          >
            <AiOutlineHome className="h-6 w-6" />
          </button>

          <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">Sign In</h2>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-4 relative">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 mt-2 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  placeholder="Enter your email"
                  required
                />
                <AiOutlineMail className="absolute left-3 mt-1 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6 relative">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 mt-2 border rounded-md text-gray-700 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  placeholder="Enter your password"
                  required
                />
                <AiOutlineLock className="absolute left-3 mt-1 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 transition-transform duration-300"
                >
                  {passwordVisible ? (
                    <AiOutlineEyeInvisible className="h-5 w-5 mt-2" />
                  ) : (
                    <AiOutlineEye className="h-5 w-5 mt-2" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition transform duration-300 hover:scale-105"
            >
              Sign In
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-blue-600 hover:underline transition-all"
            >
              Forgot Password?
            </button>
          </div>

           {/* Forget Password Modal */}
      <ForgetPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <div className="text-gray-700">
              Don't have an account?{" "}
              <Link href="/sign-up">
                <h1 className="text-blue-600 hover:underline transition-all">Sign Up</h1>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Image with Text */}
        <div className="hidden lg:flex flex-col items-center justify-center w-1/2 bg-blue-600 p-8 text-white">
          <Image
            src="/signin.avif" // Update this path to your image
            alt="Expense Tracker"
            width={400}
            height={400}
            className="rounded-lg shadow-2xl mb-6 object-cover w-full h-full"
          />
          <h1 className="text-4xl font-bold mb-4 text-center">Welcome Back!</h1>
          <p className="text-lg text-center">
            Sign in to continue managing your expenses and take control of your finances.
          </p>
        </div>
      </div>

      {/* React Toastify container to show notifications */}
      <ToastContainer />
    </div>
  );
};

export default SignIn;