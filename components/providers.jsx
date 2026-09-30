"use client";
import { ToastContainer } from "react-toastify";
export default function Providers({ children }) {
  return (
    <>
      {children}
      <ToastContainer position="bottom-right" autoClose={3500} theme="light" />
    </>
  );
}
