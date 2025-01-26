import Image from "next/image";
import React from "react";


function Hero() {
  return (
    <section className="bg-gray-50 flex flex-col items-center px-5 z-0">
      <div className="mx-auto max-w-screen-xl px-4 py-24 lg:flex">
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

      <Image src={"/dashboard.jpg"} width={1000} height={700} alt="dashboard" className="border rounded-md "/>
    </section>
  );
}

export default Hero;
