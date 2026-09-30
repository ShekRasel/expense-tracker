"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  ChartNoAxesCombined,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import { apiRequest } from "@/lib/api";
import ResetPassword from "./reset-password";
export const passwordPattern =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
export default function AuthForm({ register = false }) {
  const [visible, setVisible] = useState(false);
  const [reset, setReset] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  async function submit(event) {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(event.currentTarget));
    setError("");
    if (register && !passwordPattern.test(body.password)) {
      setError(
        "Use at least 8 characters with uppercase, lowercase, a number, and a symbol (#?!@$%^&*-).",
      );
      return;
    }
    setBusy(true);
    try {
      const result = await apiRequest(
        register ? "/users/auth/user/register" : "/users/auth/userlogin",
        { method: "POST", body, authenticated: false },
      );
      if (result?.access_token) {
        localStorage.setItem("authToken", result.access_token);
        localStorage.removeItem("userName");
        router.replace("/dashboard");
      } else if (register) {
        toast.success("Account created. Sign in to get started.");
        router.replace("/sign-in");
      } else {
        throw new Error("No sign-in token was returned. Please try again.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-card">
      <aside className="auth-story">
        <span className="pill">YOUR NEXT CHAPTER</span>
        <h2>
          A little clarity.
          <br />A lot more
          <br />
          <em>possibility.</em>
        </h2>
        <p>
          Build a calmer relationship with your money, one small step at a time.
        </p>
        <div className="auth-illustration">
          <ChartNoAxesCombined size={52} strokeWidth={1.3} />
          <div>
            <span>YOUR FINANCIAL WELLBEING</span>
            <strong>Looking brighter.</strong>
          </div>
          <div className="auth-bars">
            {[32, 48, 40, 62, 57, 80, 95].map((height, index) => (
              <i key={index} style={{ height }} />
            ))}
          </div>
        </div>
        <span className="auth-promise">
          <Check size={16} /> Your goals. Your pace. Your future.
        </span>
      </aside>
      <div className="auth-form">
        <p className="eyebrow">
          {register ? "LET’S GET STARTED" : "GOOD TO SEE YOU AGAIN"}
        </p>
        <h1>{register ? "Make yourself at home." : "Welcome back."}</h1>
        <p className="muted">
          {register
            ? "A fresh start for you and your finances."
            : "Your money story continues here."}
        </p>
        <form onSubmit={submit} className="form-stack">
          {register && (
            <>
              <label>
                Full name
                <input
                  required
                  name="fullname"
                  autoComplete="name"
                  placeholder="Your full name"
                  maxLength={100}
                />
              </label>
              <label>
                Username
                <input
                  required
                  name="username"
                  autoComplete="username"
                  placeholder="Choose a username"
                  maxLength={60}
                />
              </label>
            </>
          )}
          <label>
            Email address
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <div className="password-field">
              <input
                required
                name="password"
                type={visible ? "text" : "password"}
                autoComplete={register ? "new-password" : "current-password"}
                placeholder={
                  register ? "Create a strong password" : "Enter your password"
                }
              />
              <button
                type="button"
                className="icon-button"
                aria-label={visible ? "Hide password" : "Show password"}
                onClick={() => setVisible(!visible)}
              >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
          {register ? (
            <p className="field-hint">
              8+ characters, uppercase, lowercase, number, and a symbol
              (#?!@$%^&amp;*-).
            </p>
          ) : (
            <button
              type="button"
              className="text-link forgot-link"
              onClick={() => setReset(true)}
            >
              Forgot password?
            </button>
          )}
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          <button disabled={busy} className="btn btn-primary btn-full">
            {busy ? "Please wait…" : register ? "Create account" : "Sign in"}
            {!busy && <ArrowRight size={17} />}
          </button>
        </form>
        <p className="auth-switch">
          {register ? "Already have an account?" : "New around here?"}{" "}
          <Link href={register ? "/sign-in" : "/sign-up"}>
            {register ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </div>
      {reset && <ResetPassword onClose={() => setReset(false)} />}
    </div>
  );
}
