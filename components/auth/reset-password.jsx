"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/ui/modal";
import { apiRequest } from "@/lib/api";
export default function ResetPassword({ onClose }) {
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    setError("");
    try {
      await apiRequest(
        step === 1 ? "/user/forgetpassword" : "/user/updatepassword",
        { method: "POST", authenticated: false, body },
      );
      if (step === 1) {
        setStep(2);
        toast.success("Check your email for your reset token.");
      } else {
        toast.success("Password updated. You can now sign in.");
        onClose();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={step === 1 ? "Let’s reset your password" : "Choose a new password"}
      onClose={onClose}
      busy={busy}
    >
      <p className="muted">
        {step === 1
          ? "We’ll send password reset instructions to your email."
          : "Paste the token from your email below."}
      </p>
      <form key={step} onSubmit={submit} className="form-stack">
        {step === 1 ? (
          <label>
            Email address
            <input name="email" type="email" autoComplete="email" required />
          </label>
        ) : (
          <>
            <label>
              Reset token
              <input name="token" required autoComplete="off" />
            </label>
            <label>
              New password
              <input
                name="newPassword"
                type="password"
                minLength={8}
                required
                autoComplete="new-password"
              />
            </label>
          </>
        )}
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <button className="btn btn-primary" disabled={busy}>
          {busy
            ? "Please wait…"
            : step === 1
              ? "Send reset instructions"
              : "Update password"}
        </button>
        {step === 1 && (
          <button
            type="button"
            className="text-link"
            onClick={() => setStep(2)}
          >
            I already have a reset token
          </button>
        )}
      </form>
    </Modal>
  );
}
