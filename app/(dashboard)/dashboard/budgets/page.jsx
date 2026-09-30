"use client";
import { useState } from "react";
import { Plus, Target, ArrowUpRight } from "lucide-react";
import { toast } from "react-toastify";
import PageHeading from "@/components/ui/page-heading";
import Modal from "@/components/ui/modal";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useExpenseReport } from "@/hooks/use-expense-report";
import ExpenseDialog from "@/components/dashboard/expense-dialog";
import { expenseApi } from "@/lib/api";
import { money, palette } from "@/lib/format";
export default function BudgetsPage() {
  const { report, loading, error, refresh } = useExpenseReport();
  const [adding, setAdding] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState("");
  const percent = report?.goal
    ? Math.round((report.total / report.goal) * 100)
    : 0;
  async function saveGoal(event) {
    event.preventDefault();
    const amount = Number(new FormData(event.currentTarget).get("goal"));
    if (!Number.isFinite(amount) || amount <= 0) {
      setSaveError("Enter a goal greater than zero.");
      return;
    }
    setBusy(true);
    setSaveError("");
    try {
      await expenseApi.setGoal(amount, report.data);
      toast.success("Your budget goal is saved.");
      setGoalOpen(false);
      refresh();
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeading
        eyebrow="GIVE YOUR MONEY DIRECTION"
        title="A plan for what matters."
        description="Set your spending goal. Make space for the life you want."
      >
        <button
          disabled={!report || loading || !!error}
          className="btn btn-primary"
          onClick={() => {
            setSaveError("");
            setGoalOpen(true);
          }}
        >
          <Target size={17} />
          {report?.goal ? "Edit budget goal" : "Set budget goal"}
        </button>
      </PageHeading>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        report && (
          <>
            <section className="budget-hero">
              <div>
                <span className="pill">YOUR SPENDING PLAN</span>
                <h2>{money(report.goal)}</h2>
                <p>
                  {report.goal
                    ? "Your total budget goal"
                    : "Your next step: set a budget goal"}
                </p>
              </div>
              <div className="budget-hero-progress">
                <div className="section-heading">
                  <strong>{percent}% used</strong>
                  <span>
                    {report.goal && report.total > report.goal
                      ? "Over budget"
                      : report.goal
                        ? "Within budget"
                        : "No goal yet"}
                  </span>
                </div>
                <div className="progress-track">
                  <span style={{ width: Math.min(100, percent) + "%" }} />
                </div>
                <div className="section-heading">
                  <span>{money(report.total)} spent</span>
                  <span>
                    {report.goal
                      ? money(report.goal - report.total) + " remaining"
                      : "Set a goal to track progress"}
                  </span>
                </div>
              </div>
            </section>
            <div className="section-heading section-spacer">
              <div>
                <h2>Your spending categories</h2>
                <p className="muted">
                  See how each category fits into your overall plan.
                </p>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => setAdding(true)}
              >
                <Plus size={17} />
                Add category
              </button>
            </div>
            {Object.keys(report.data).length ? (
              <div className="budget-grid">
                {Object.entries(report.data).map(([name, amount], index) => (
                  <article className="panel budget-card" key={name}>
                    <div className="section-heading">
                      <span
                        className="category-initial"
                        style={{ color: palette[index % palette.length] }}
                      >
                        {name.slice(0, 1).toUpperCase()}
                      </span>
                      <ArrowUpRight size={19} className="muted" />
                    </div>
                    <h3>{name}</h3>
                    <strong>{money(amount)}</strong>
                    <p className="muted">Recorded spending</p>
                    <div className="progress-track">
                      <span
                        style={{
                          width:
                            Math.min(
                              100,
                              report.goal ? (amount / report.goal) * 100 : 0,
                            ) + "%",
                          background: palette[index % palette.length],
                        }}
                      />
                    </div>
                    <small>
                      {report.goal
                        ? Math.round((amount / report.goal) * 100) +
                          "% of your total budget"
                        : "Set a budget to see your share"}
                    </small>
                  </article>
                ))}
              </div>
            ) : (
              <section className="panel">
                <EmptyState>
                  <button
                    className="btn btn-primary"
                    onClick={() => setAdding(true)}
                  >
                    Add a category
                  </button>
                </EmptyState>
              </section>
            )}
            <div className="tip-banner">
              <Target size={23} />
              <div>
                <strong>A budget is a guide, not a perfect score.</strong>
                <p>
                  Check in regularly and adjust your goal as your needs change.
                </p>
              </div>
            </div>
          </>
        )
      )}
      {adding && (
        <ExpenseDialog
          existing={Object.keys(report?.data || {})}
          onClose={() => setAdding(false)}
          onSaved={refresh}
        />
      )}
      {goalOpen && (
        <Modal
          title="Give your budget a goal"
          onClose={() => setGoalOpen(false)}
          busy={busy}
        >
          <form onSubmit={saveGoal} className="form-stack">
            <p className="muted">
              Choose a total spending limit across all your categories.
            </p>
            <label>
              Budget goal (BDT)
              <input
                autoFocus
                name="goal"
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                required
                defaultValue={report?.goal || ""}
                placeholder="e.g. 30000"
              />
            </label>
            {saveError && (
              <p className="form-error" role="alert">
                {saveError}
              </p>
            )}
            <button className="btn btn-primary" disabled={busy}>
              {busy ? "Saving…" : "Save budget goal"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
