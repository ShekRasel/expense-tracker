import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import BudgetForm from "./BudgetForm";
import Link from "next/link";

function Hero() {
  return (
    <section className="pt-20">
      <div className="relative bg-gradient-to-r from-[#5C5CFF] to-[#2E2EFF] py-20">
        <div className="flex flex-col xl:flex-row items-center justify-between 2xl:px-64 px-6">
          <div className="w-full xl:w-1/2 text-center xl:text-left text-white">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
              Budgeting Meets Simplicity
            </h1>
            <p className="text-lg sm:text-xl mb-8 opacity-80">
              The easy-to-use zero-based budgeting app that helps you keep tabs
              on your money at a glance—anytime, anywhere.
            </p>

           <Link href={'/sign-up'}>

            <Button className="bg-white text-primary font-semibold text-lg py-3 px-8 rounded-lg shadow-lg hover:bg-opacity-90 transition duration-300 ease-in-out hover:text-white">
              Create Your Free Account
            </Button>
           </Link>
          </div>

          <div className="w-full xl:w-1/2 mt-10 xl:mt-0">
            <img
              src="/hero.webp"
              alt="hero image"
              className="w-full h-auto rounded-lg shadow-2xl transform hover:scale-105 transition duration-500 ease-in-out"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 flex flex-col items-center  z-0">
        <div className="mx-auto max-w-screen-xl px-4 py-12 md:py-24 lg:flex">
          <div className="mx-auto max-w-xl text-center">
            <h1 className="text-3xl font-extrabold sm:text-5xl">
              Manage Your Expense
              <strong className="font-extrabold text-primary sm:block">
                {" "}
                Controll Your Money{" "}
              </strong>
            </h1>

            <p className="mt-4 sm:text-xl/relaxed">
              LogIn as a guest and explore the features....
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                className="block w-full rounded bg-[#5C5CFF] px-12 py-3 text-sm font-medium text-white shadow hover:bg-[#2E2EFF] focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
                href="#"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center bg-gray-50 gap-10 px-4 sm:px-6 md:px-12  2xl:px-20">
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
          <Image
            src="/dashboard.jpg"
            width={500}
            height={300}
            alt="dashboard"
            className="border rounded-md w-full h-auto object-cover"
          />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
          <Image
            src="/dashboard.jpg"
            width={500}
            height={300}
            alt="dashboard"
            className="border rounded-md w-full h-auto object-cover"
          />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
          <Image
            src="/dashboard.jpg"
            width={500}
            height={300}
            alt="dashboard"
            className="border rounded-md w-full h-auto object-cover"
          />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-50">
  <div className="max-w-screen-xl mx-auto">
    {/* Title Section */}
    <div className="text-center mb-12">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 leading-tight mb-6">
        Discover How to Manage Your Finances
      </h1>
    </div>

    {/* Flex Section */}
    <div className="flex flex-col-reverse lg:flex-row gap-12 items-center">
      {/* Video Section */}
      <div className="w-full lg:w-1/2">
        <div className="relative pb-[56.25%]">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/YOUR_VIDEO_URL" // Replace with your expense tracker video URL
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Info Section */}
      <div className="w-full lg:w-1/2 text-center lg:text-left">
        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-4">
          Manage Your Money Efficiently with Our Expense Tracker
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 opacity-80">
          Learn how to keep track of your spending, create budgets, and plan
          your savings with our easy-to-use expense tracker. This tool helps
          you visualize your financial health and empowers you to make better
          financial decisions. Start mastering your finances today!
        </p>

        <Button className="bg-[#5C5CFF] text-white font-semibold text-lg py-3 px-8 rounded-lg shadow-lg hover:bg-[#2E2EFF] transition duration-300 ease-in-out hover:text-white">
          Start Tracking Your Expenses Now
        </Button>
      </div>
    </div>
  </div>
</div>


    </section>
  );
}

export default Hero;
