"use client"; // use client directive remains for client components
import { Inter, Outfit, Roboto } from "next/font/google"; // Import Roboto
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { usePathname } from "next/navigation"; // usePathname hook
import Head from "next/head";

// Define Roboto font
const roboto = Roboto({
  subsets: ["latin"], // Specify subsets
  weight: ["400", "500", "700"], // Specify font weights you need
  variable: "--font-roboto", // Optional: Define a CSS variable for the font
});

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname(); // Current path

  const hideLayout = pathname.startsWith("/dashboard");

  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body className={`${outfit.className} ${roboto.className}`}>
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