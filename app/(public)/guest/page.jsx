"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, Trash2, ArrowRight, Download, Target } from "lucide-react";
import { toast } from "react-toastify";
import PageHeading from "@/components/ui/page-heading";
import { apiRequest } from "@/lib/api";
import { money, exportExpenses } from "@/lib/format";
export default function GuestPage() {
  const [goal, setGoal] = useState("30000");
  const [categories, setCategories] = useState([
    { id: 0, name: "Groceries", price: "5000" },
    { id: 1, name: "Transport", price: "2000" },
  ]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(null);
  const [exporting, setExporting] = useState(false);
  const total = categories.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0,
  );
  function update(id, key, value) {
    setSubmitted(null);
    setCategories((items) =>
      items.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    );
  }
  async function submit(event) {
    event.preventDefault();
    setError("");
    setSubmitted(null);
    const names = categories.map((item) => item.name.trim().toLowerCase());
    if (names.some((name) => !name) || new Set(names).size !== names.length) {
      setError("Give every category a unique name.");
      return;
    }
    if (
      !Number.isFinite(Number(goal)) ||
      Number(goal) <= 0 ||
      categories.some(
        (item) =>
          !Number.isFinite(Number(item.price)) || Number(item.price) <= 0,
      )
    ) {
      setError("Enter a positive budget and amount for each category.");
      return;
    }
    setBusy(true);
    try {
      await apiRequest("/auth/joinasguest", {
        method: "POST",
        authenticated: false,
      });
      const body = {
        total_expense_goal: Number(goal),
        categories: categories.map(({ name, price }) => ({
          name: name.trim(),
          price: Number(price),
        })),
      };
      await apiRequest("/guest/budget", {
        method: "POST",
        body,
        authenticated: false,
      });
      setSubmitted(
        Object.fromEntries(
          body.categories.map((item) => [item.name, item.price]),
        ),
      );
      toast.success("Your guest budget is ready.");
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }
  async function download() {
    setExporting(true);
    try {
      await exportExpenses(submitted, "Budget_Report.xlsx");
    } catch {
      toast.error("Unable to export. Please try again.");
    } finally {
      setExporting(false);
    }
  }
  return (
    <div className="site-container guest-page">
      <PageHeading
        eyebrow="A LITTLE PRACTICE. A FRESH PERSPECTIVE."
        title="Try a plan on for size."
        description="Explore the budget planner without creating an account. These starter amounts are yours to change."
      />
      <div className="guest-grid">
        <section className="panel">
          <div className="section-heading">
            <h2>Your budget planner</h2>
            <span className="badge">Guest mode</span>
          </div>
          <form className="form-stack" onSubmit={submit}>
            <fieldset disabled={busy} className="form-stack guest-fields">
              <label>
                Total budget goal (BDT)
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={goal}
                  onChange={(event) => {
                    setGoal(event.target.value);
                    setSubmitted(null);
                  }}
                />
              </label>
              <div className="section-heading">
                <h3>Expense categories</h3>
                <span className="muted">{categories.length} categories</span>
              </div>
              {categories.map((item, index) => (
                <div className="guest-category" key={item.id}>
                  <label>
                    Category {index + 1}
                    <input
                      required
                      maxLength={80}
                      value={item.name}
                      onChange={(event) =>
                        update(item.id, "name", event.target.value)
                      }
                      placeholder="e.g. Groceries"
                    />
                  </label>
                  <label>
                    Amount (BDT)
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                      value={item.price}
                      onChange={(event) =>
                        update(item.id, "price", event.target.value)
                      }
                    />
                  </label>
                  <button
                    disabled={categories.length === 1 || busy}
                    type="button"
                    className="icon-button danger-icon"
                    aria-label={`Remove category ${index + 1}`}
                    onClick={() => {
                      setCategories((items) =>
                        items.filter((row) => row.id !== item.id),
                      );
                      setSubmitted(null);
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setCategories((items) => [
                    ...items,
                    { id: Date.now(), name: "", price: "" },
                  ]);
                  setSubmitted(null);
                }}
              >
                <Plus size={17} />
                Add a category
              </button>
            </fieldset>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button disabled={busy} className="btn btn-primary">
              {busy ? "Creating your budget…" : "Create guest budget"}
              <ArrowRight size={17} />
            </button>
            {submitted && (
              <div className="success-banner" role="status">
                <p>Your budget is ready. Download a copy to keep it.</p>
                <button
                  type="button"
                  disabled={exporting}
                  className="btn btn-secondary"
                  onClick={download}
                >
                  <Download size={17} />
                  {exporting ? "Exporting…" : "Download Excel"}
                </button>
              </div>
            )}
          </form>
        </section>
        <aside>
          <section className="budget-insight">
            <span className="icon-tile">
              <Target size={24} />
            </span>
            <p className="eyebrow">YOUR PLAN AT A GLANCE</p>
            <h2>{money(Number(goal) - total)}</h2>
            <p>
              {total > Number(goal)
                ? "Over your planned budget. Try adjusting your categories."
                : "Left in your planned budget."}
            </p>
            <div className="progress-track">
              <span
                style={{
                  width:
                    Math.min(
                      100,
                      Number(goal) > 0 ? (total / Number(goal)) * 100 : 0,
                    ) + "%",
                }}
              />
            </div>
            <div className="section-heading">
              <span>Total planned</span>
              <strong>{money(total)}</strong>
            </div>
          </section>
          <div className="guest-callout">
            <h3>Like having a little clarity?</h3>
            <p className="muted">
              Create an account to manage your expenses and return to your
              budget anytime. Guest plans aren’t added to your account.
            </p>
            <Link className="text-link" href="/sign-up">
              Make yourself at home <ArrowRight size={16} />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
