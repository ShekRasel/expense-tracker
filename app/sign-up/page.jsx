"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineLock,
  AiOutlineHome,
} from "react-icons/ai"; // Icons for password visibility toggle
import { toast, ToastContainer } from "react-toastify"; // Toast notifications
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import Image from "next/image";
import ForgetPasswordModal from "../_components/ForgetPasswordModal";

const SignUp = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  // Validate password strength before submitting
  const isPasswordValid = (password) => {
    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullname ||
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      setError("All fields are required");
      toast.error("All fields are required");
      return;
    }

    if (!isPasswordValid(formData.password)) {
      setError(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a digit, and a special character."
      );
      toast.error(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a digit, and a special character."
      );
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3000/users/auth/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Signup failed");
      }

      const response = await res.json();

      // Store the token in localStorage if returned from the backend
      if (response.access_token) {
        localStorage.setItem("authToken", response.access_token);
      }

      toast.success("Sign Up Successful! Redirecting to Dashboard...");

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error(error.message);
      setError(error.message || "Something went wrong, please try again.");
      toast.error(error.message || "Something went wrong, please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 flex items-center justify-center px-4 lg:px-8 lg:mt-16 2xl:mt-0">
      {/* Container for Image and Form */}
      <div className="flex items-stretch bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl">
        {/* Left Side: Image with Text */}
        <div className="hidden lg:flex flex-col items-center justify-center w-1/2 bg-blue-600 p-8 text-white">
          <Image
            src="/signup.avif"
            alt="Expense Tracker"
            width={400}
            height={400}
            className="rounded-lg shadow-2xl mb-6 object-cover w-full h-full"
          />
          <h1 className="text-4xl font-bold mb-4 text-center">
            Welcome to Expense Tracker
          </h1>
          <p className="text-lg text-center">
            Take control of your finances with our easy-to-use expense tracker
            app. Sign up now to start managing your expenses effortlessly!
          </p>
        </div>

        {/* Right Side: Signup Form */}
        <div className="w-full lg:w-1/2 p-8">
          {/* Back Home Button */}
          <button
            onClick={() => router.push("/")}
            className="absolute top-6 left-6 text-gray-500 hover:text-gray-800 transition duration-300"
          >
            <AiOutlineHome className="h-6 w-6" />
          </button>

          <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
            Sign Up
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div className="mb-4 relative">
              <label htmlFor="fullname" className="block text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 mt-2 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  placeholder="Enter your full name"
                  required
                />
                <AiOutlineUser className="absolute left-3 mt-1 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              </div>
            </div>

            {/* Username Field */}
            <div className="mb-4 relative">
              <label htmlFor="username" className="block text-gray-700">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 mt-2 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  placeholder="Enter your username"
                  required
                />
                <AiOutlineUser className="absolute mt-1 left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              </div>
            </div>

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
                <AiOutlineMail className="absolute mt-1 left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
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
                <AiOutlineLock className="absolute mt-1 left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
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
              Sign Up
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

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <div className="text-gray-700">
              Already have an account?{" "}
              <Link href="/sign-in">
                <h1 className="text-blue-600 hover:underline transition-all">
                  Sign In
                </h1>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Forget Password Modal */}
      <ForgetPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* React Toastify container to show notifications */}
      <ToastContainer />
    </div>
  );
};

export default SignUp;
