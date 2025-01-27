"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the styles for toast notifications

export default function Home() {
  return (
    <div>
      {/* Include Header */}
      <Header />

      {/* Include Hero */}
      <Hero />

      {/* Add the ToastContainer */}
      <ToastContainer />
    </div>
  );
}
