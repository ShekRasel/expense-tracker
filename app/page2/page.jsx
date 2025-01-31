"use client"
import React, { useState } from "react";
import Link from 'next/link'
import { useRouter } from "next/navigation";
const Page = () => {
   const [currentPage, setCurrentPage] = useState(2);
    const totalPages = 3;
    const router = useRouter(); 
  return (
    <div className="min-h-screen bg-gradient-to-br mt-16 from-purple-900 to-blue-900 text-white font-sans">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 flex flex-col lg:flex-row items-center justify-between">
        <div className="lg:w-1/2 mb-10 lg:mb-0">
          <h1 className="text-5xl font-bold mb-6">Track Your Expenses Effortlessly</h1>
          <p className="text-xl text-purple-200 mb-8">
            Take control of your finances with our intuitive expense tracker.
          </p>
          <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300">
            Get Started
          </button>
        </div>
        <div className="lg:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            alt="Expense Tracker"
            className="rounded-lg shadow-2xl"
          />
        </div>
      </section>

      {/* Video Slider Section */}
      <section className="bg-white text-gray-900 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-10">How It Works</h2>
          <div className="flex justify-center">
          <iframe width="660" height="315" src="https://www.youtube.com/embed/T9TD1WJQ4DY?si=gQmLREj8ILLQ6Q2U" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Feature Card 1 */}
          <div className="bg-white text-gray-900 p-8 rounded-lg shadow-2xl transform hover:scale-105 transition duration-300">
            <img
              src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Real-Time Tracking"
              className="mx-auto mb-6 w-24 h-24 object-cover rounded-full"
            />
            <h3 className="text-2xl font-bold mb-4">Real-Time Tracking</h3>
            <p className="text-gray-700">
              Monitor your expenses in real-time with our advanced tools.
            </p>
          </div>
          {/* Feature Card 2 */}
          <div className="bg-white text-gray-900 p-8 rounded-lg shadow-2xl transform hover:scale-105 transition duration-300">
            <img
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Budget Planning"
              className="mx-auto mb-6 w-24 h-24 object-cover rounded-full"
            />
            <h3 className="text-2xl font-bold mb-4">Budget Planning</h3>
            <p className="text-gray-700">
              Create and manage budgets to achieve your financial goals.
            </p>
          </div>
          {/* Feature Card 3 */}
          <div className="bg-white text-gray-900 p-8 rounded-lg shadow-2xl transform hover:scale-105 transition duration-300">
            <img
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Reports & Analytics"
              className="mx-auto mb-6 w-24 h-24 object-cover rounded-full"
            />
            <h3 className="text-2xl font-bold mb-4">Reports & Analytics</h3>
            <p className="text-gray-700">
              Get detailed reports and insights into your spending habits.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-br from-blue-800 to-purple-800 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Testimonial Card 1 */}
            <div className="bg-white text-gray-900 p-8 rounded-lg shadow-2xl">
              <p className="text-lg italic mb-6">
                "This app changed the way I manage my finances. Highly recommended!"
              </p>
              <h4 className="text-xl font-bold">- John Doe</h4>
            </div>
            {/* Testimonial Card 2 */}
            <div className="bg-white text-gray-900 p-8 rounded-lg shadow-2xl">
              <p className="text-lg italic mb-6">
                "Simple, intuitive, and powerful. Perfect for tracking expenses."
              </p>
              <h4 className="text-xl font-bold">- Jane Smith</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-8">Ready to Take Control of Your Finances?</h2>
        <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300">
          Sign Up Now
        </button>
      </section>

      <div className="flex justify-center items-center py-10 space-x-2">
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <Link key={page} href={page === 1 ? "/" : `/page${page}`}>
          <button
            className={`px-4 py-2 border rounded-lg text-lg font-semibold transition-all duration-300 ease-in-out ${
              page === currentPage
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        </Link>
      ))}
      <h1 className="mt-4">....</h1>
    </div>
    </div>
  );
};

export default Page;