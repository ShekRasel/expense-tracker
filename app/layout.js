"use client"; // use client directive remains for client components
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { usePathname } from "next/navigation"; // usePathname hook
import { metadata } from './_components/metadata';

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname(); // Current path

  const hideLayout = pathname.startsWith("/dashboard");

  return (
    <html lang="en">
      <body className={outfit.className}>
        {/* Navbar & Footer will be hidden on route pages */}
        {!hideLayout && <Header />}

        {/* ToastContainer globally added */}
        <ToastContainer />

        {/* Main Content */}
        <main className="min-h-screen">{children}</main>

        {/* Navbar & Footer */}
        {!hideLayout && <Footer />}
      </body>
    </html>
  );
}
