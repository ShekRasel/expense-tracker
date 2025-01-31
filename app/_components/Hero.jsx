import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import Slider from "react-slick"; // Importing a slider library

// Add slider settings (you can adjust the settings as per your preference)
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

function Hero() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  return (
    <section className="pt-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#5C5CFF] to-[#2E2EFF] py-20 overflow-hidden">
        <div className="flex flex-col xl:flex-row items-center justify-between 2xl:px-64 px-6">
          <div className="w-full xl:w-1/2 text-center xl:text-left text-white">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6 animate-fade-in">
              Budgeting Meets Simplicity
            </h1>
            <p className="text-lg sm:text-xl mb-8 opacity-90 animate-fade-in delay-100">
              The easy-to-use zero-based budgeting app that helps you keep tabs
              on your money at a glance—anytime, anywhere.
            </p>

            <Link href={"/sign-up"}>
              <Button className="bg-white text-primary font-semibold text-lg py-3 px-8 rounded-lg shadow-lg hover:bg-opacity-90 hover:text-white transition-all duration-300 ease-in-out animate-fade-in delay-200">
                Create Your Free Account
              </Button>
            </Link>
          </div>

          <div className="w-full xl:w-1/2 mt-10 xl:mt-0 animate-fade-in delay-300">
            <img
              src="/hero.webp"
              alt="hero image"
              className="w-full h-auto rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-500 ease-in-out"
            />
          </div>
        </div>
      </div>

      {/* New Feature Showcase */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 py-20">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 animate-fade-in">
            Key Features
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 opacity-90 mb-8 animate-fade-in delay-100">
            Explore the key features that make our budgeting app a powerful tool
            for managing your finances.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 px-6">
          {/* Feature 1 */}
          <div className="w-full sm:w-1/2 md:w-1/3 animate-fade-in delay-200">
            <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
              <Image
                src="/dashboard1.png"
                width={400}
                height={250}
                alt="Feature 1"
                className="w-full h-auto object-cover rounded-lg mb-4"
              />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Zero-Based Budgeting
              </h3>
              <p className="text-base text-gray-600">
                Track your income and expenses effortlessly with a zero-based
                budgeting approach that ensures every penny is accounted for.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="w-full sm:w-1/2 md:w-1/3 animate-fade-in delay-300">
            <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
              <Image
                src="/dashboard2.png"
                width={400}
                height={250}
                alt="Feature 2"
                className="w-full h-auto object-cover rounded-lg mb-4"
              />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Expense Tracking
              </h3>
              <p className="text-base text-gray-600">
                Stay on top of your finances by tracking your daily, weekly, and
                monthly expenses with ease.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="w-full sm:w-1/2 md:w-1/3 animate-fade-in delay-400">
            <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
              <Image
                src="/dashboard3.png"
                width={400}
                height={250}
                alt="Feature 3"
                className="w-full h-auto object-cover rounded-lg mb-4"
              />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Financial Insights
              </h3>
              <p className="text-base text-gray-600">
                Get visual insights into your financial health with interactive
                charts and reports.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-[#5C5CFF] to-[#2E2EFF] text-white py-20 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 animate-fade-in">
          Ready to Take Control of Your Finances?
        </h2>
        <p className="text-lg sm:text-xl mb-8 opacity-90 animate-fade-in delay-100">
          Sign up now and start budgeting with ease. It's free and easy to get
          started.
        </p>
        <Link href={"/sign-up"}>
          <Button className="bg-white text-primary font-semibold text-lg py-3 px-8 rounded-lg shadow-lg hover:bg-opacity-90 hover:text-white transition-all duration-300 ease-in-out animate-fade-in delay-200">
            Get Started
          </Button>
        </Link>
      </div>

      {/* Testimonial Slider */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 animate-fade-in">
            What Our Users Are Saying
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 opacity-90 animate-fade-in delay-100">
            Hear from our users about how the app has helped them manage their
            finances better.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 animate-fade-in delay-200">
          <Slider {...sliderSettings}>
            {/* Testimonial 1 */}
            <div className="text-center p-6">
              <p className="text-xl text-gray-600 mb-4">
                "This app has completely transformed the way I budget my money.
                It's so easy to use, and the zero-based budgeting method has
                really helped me stay on track."
              </p>
              <p className="text-2xl font-bold text-gray-900">Robin</p>
              <p className="text-sm text-gray-600">Freelancer</p>
            </div>

            {/* Testimonial 2 */}
            <div className="text-center p-6">
              <p className="text-xl text-gray-600 mb-4">
                "I've tried so many budgeting apps, but none of them offer the
                simplicity and ease of use that this one does. Highly
                recommend!"
              </p>
              <p className="text-2xl font-bold text-gray-900">Arif</p>
              <p className="text-sm text-gray-600">Small Business Owner</p>
            </div>

            {/* Testimonial 3 */}
            <div className="text-center p-6">
              <p className="text-xl text-gray-600 mb-4">
                "With this app, I feel in control of my finances like never
                before. It's incredibly user-friendly and visually appealing."
              </p>
              <p className="text-2xl font-bold text-gray-900">Rasel</p>
              <p className="text-sm text-gray-600">Teacher</p>
            </div>
          </Slider>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center py-10 space-x-2">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <Link key={page} href={`/page${page}`}>
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
    </section>
  );
}

export default Hero;