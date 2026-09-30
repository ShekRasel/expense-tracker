import Brand from "@/components/brand";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <header className="auth-header">
        <Brand />
        <Link href="/" className="text-link">
          <ArrowLeft size={16} /> Back to home
        </Link>
      </header>
      <main id="main-content">{children}</main>
      <footer className="auth-footer">
        A little clarity. A lot more control.
      </footer>
    </div>
  );
}
