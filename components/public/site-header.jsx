"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import Brand from "@/components/brand";
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Brand />
        <button
          className="icon-button mobile-menu"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="public-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="public-navigation"
          aria-label="Main navigation"
          className={open ? "public-nav open" : "public-nav"}
          onClick={() => setOpen(false)}
        >
          <Link href="/#features">Features</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/guest">Try the planner</Link>
          <span className="nav-divider" />
          <Link href="/sign-in">Sign in</Link>
          <Link href="/sign-up" className="btn btn-primary">
            Get started <ArrowUpRight size={16} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
