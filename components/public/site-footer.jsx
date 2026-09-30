import Link from "next/link";
import Brand from "@/components/brand";
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-inner">
        <div>
          <Brand />
          <p>A little clarity. A lot more control.</p>
        </div>
        <nav aria-label="Footer">
          <Link href="/#features">Features</Link>
          <Link href="/guest">Budget planner</Link>
          <Link href="/sign-in">Sign in</Link>
        </nav>
        <p>© {new Date().getFullYear()} Expense</p>
      </div>
    </footer>
  );
}
