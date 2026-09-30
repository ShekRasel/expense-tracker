"use client";
import { useState } from "react";
import { MessageSquare, Send, CheckCircle2, Heart } from "lucide-react";
import PageHeading from "@/components/ui/page-heading";
import { apiRequest } from "@/lib/api";
export default function FeedbackPage() {
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (!feedback.trim()) {
      setError("Please write a little feedback first.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await apiRequest("/feedback/addFeedback", {
        method: "POST",
        body: { feedback: feedback.trim() },
      });
      setSent(true);
      setFeedback("");
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeading
        eyebrow="BETTER, TOGETHER"
        title="We’re listening."
        description="Your perspective helps make Expense a little better for everyone."
      />
      <div className="feedback-grid">
        <section className="panel feedback-panel">
          {sent ? (
            <div className="state">
              <CheckCircle2 size={42} className="green" />
              <h2>Thanks for sharing.</h2>
              <p>
                Your feedback has been sent. We appreciate you taking the time.
              </p>
              <button
                className="btn btn-secondary"
                onClick={() => setSent(false)}
              >
                Share more feedback
              </button>
            </div>
          ) : (
            <>
              <span className="icon-tile">
                <MessageSquare size={25} />
              </span>
              <h2>What’s on your mind?</h2>
              <p className="muted">
                An idea, a small frustration, or something you love. We’d like
                to hear it.
              </p>
              <form onSubmit={submit} className="form-stack">
                <label>
                  Your feedback
                  <textarea
                    rows={7}
                    required
                    maxLength={2000}
                    placeholder="I think it would be helpful if…"
                    value={feedback}
                    onChange={(event) => setFeedback(event.target.value)}
                  />
                </label>
                <div className="field-hint">
                  {feedback.length} / 2,000 characters
                </div>
                {error && (
                  <p role="alert" className="form-error">
                    {error}
                  </p>
                )}
                <button className="btn btn-primary" disabled={busy}>
                  {busy ? "Sending…" : "Send feedback"}
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </section>
        <aside className="feedback-note">
          <Heart size={28} />
          <h2>
            Good things grow
            <br />
            with a little care.
          </h2>
          <p>
            Tell us what’s working, what could be clearer, and what would make
            managing your money easier.
          </p>
          <p>
            For your privacy, please leave out passwords, account numbers, and
            other sensitive details.
          </p>
        </aside>
      </div>
    </>
  );
}
