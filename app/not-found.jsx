import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" className="state full-state">
      <p className="eyebrow">404 · Page not found</p>
      <h1>Let’s get you back on track.</h1>
      <p>This page doesn’t exist or has moved.</p>
      <Link className="btn btn-primary" href="/">
        Back to home
      </Link>
    </main>
  );
}
