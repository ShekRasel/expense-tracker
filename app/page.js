'use client'
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import BudgetForm from "./_components/BudgetForm";
export default function Home() {
  return (
   <div>
    <Header/>
    <Hero/>


    {/* <BudgetForm/> */}

   </div>
  );
}
