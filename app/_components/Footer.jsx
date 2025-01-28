import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto text-center">
        {/* Copyright */}
        <p className="text-gray-400 mb-4">
          &copy; {new Date().getFullYear()} ExpensePro. All rights reserved.
        </p>

        {/* Start Now Button */}
        <Link href="/sign-up">
          <Button className="bg-primary text-white py-3 px-8 rounded-md hover:bg-opacity-90 transition duration-300 ease-in-out">
            Start Now
          </Button>
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
