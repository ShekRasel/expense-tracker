'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AiOutlineEye, AiOutlineEyeInvisible,AiOutlineUser,AiOutlineMail,AiOutlineLock } from 'react-icons/ai'; // Icons for password visibility toggle
import { toast, ToastContainer } from 'react-toastify'; // Toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
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

    if (!formData.fullname || !formData.username || !formData.email || !formData.password) {
      setError('All fields are required');
      toast.error('All fields are required');
      return;
    }

    if (!isPasswordValid(formData.password)) {
      setError(
        'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a digit, and a special character.'
      );
      toast.error(
        'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a digit, and a special character.'
      );
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/users/auth/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      const response = await res.json();
      console.log(response);

      toast.success('Sign Up Successful! Redirecting to Sign In...');

      // Redirect to the sign-in page after success
      setTimeout(() => {
        router.push('/sign-in');
      }, 2000);
    } catch (error) {
      console.error(error.message);
      setError(error.message || 'Something went wrong, please try again.');
      toast.error(error.message || 'Something went wrong, please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r bg-gray-200 flex items-center justify-center">
  <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full transform transition-all duration-500 hover:scale-105">
    <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6 animate__animated animate__fadeIn animate__delay-1s">
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

    <div className="mt-6 text-center">
      <div className="text-gray-700">
        Already have an account?{" "}
        <Link href="/sign-in">
          <h1 className="text-blue-600 hover:underline transition-all">Sign In</h1>
        </Link>
      </div>
    </div>
  </div>

  {/* React Toastify container to show notifications */}
  <ToastContainer />
</div>

  );
};

export default SignUp;