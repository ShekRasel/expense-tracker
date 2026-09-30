"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  ArrowUpRight,
  ArrowRight,
  Leaf,
  CalendarDays,
} from "lucide-react";
import PageHeading from "@/components/ui/page-heading";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useExpenseReport } from "@/hooks/use-expense-report";
import { useUser } from "@/components/dashboard/dashboard-shell";
import SummaryCards from "@/components/dashboard/summary-cards";
import SpendingChart from "@/components/dashboard/spending-chart";
import ExpenseDialog from "@/components/dashboard/expense-dialog";
import { money, palette } from "@/lib/format";
export default function DashboardPage() {
  const { report, loading, error, refresh } = useExpenseReport();
  const [adding, setAdding] = useState(false);
  const user = useUser();
  const entries = Object.entries(report?.data || {}).sort(
    (a, b) => b[1] - a[1],
  );
  const percentage = report?.goal
    ? Math.round((report.total / report.goal) * 100)
    : 0;
  return (
    <>
      <PageHeading
        eyebrow="YOUR MONEY, AT A GLANCE"
        title={
          user?.fullname
            ? `Welcome back, ${user.fullname.split(" ")[0]}.`
            : "A little clarity for your day."
        }
        description="Here’s where you stand. Let’s make room for what matters."
      >
        <button className="btn btn-primary" onClick={() => setAdding(true)}>
          <Plus size={18} /> Add expense
        </button>
      </PageHeading>
      <div className="overview-label">
        <span>
          <span className="status-dot" /> Your financial overview
        </span>
        <span>
          <CalendarDays size={15} /> All-time summary
        </span>
      </div>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        report && (
          <>
            <SummaryCards report={report} />
            <div className="chart-grid">
              <section className="panel">
                <div className="section-heading">
                  <div>
                    <h2>Where your money goes</h2>
                    <p className="muted">A clearer picture of your spending.</p>
                  </div>
                  <span className="badge">By category</span>
                </div>
                {entries.length ? (
                  <SpendingChart data={report.data} />
                ) : (
                  <EmptyState>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setAdding(true)}
                    >
                      Add your first expense <Plus size={16} />
                    </button>
                  </EmptyState>
                )}
              </section>
              <section className="panel">
                <div className="section-heading">
                  <div>
                    <h2>Spending breakdown</h2>
                    <p className="muted">The little things add up.</p>
                  </div>
                </div>
                {entries.length ? (
                  <SpendingChart data={report.data} doughnut />
                ) : (
                  <EmptyState
                    title="Your picture starts here"
                    description="Your categories will appear as you add expenses."
                  />
                )}
              </section>
            </div>
            <div className="overview-bottom">
              <section className="panel">
                <div className="section-heading">
                  <div>
                    <h2>Your expense categories</h2>
                    <p className="muted">
                      Your biggest spending areas, at a glance.
                    </p>
                  </div>
                  <Link href="/dashboard/expenses" className="text-link">
                    View all <ArrowUpRight size={17} />
                  </Link>
                </div>
                {entries.length ? (
                  <div className="category-list">
                    {entries.slice(0, 5).map(([name, amount], index) => (
                      <div className="category-row" key={name}>
                        <span
                          className="category-initial"
                          style={{ color: palette[index % palette.length] }}
                        >
                          {name.slice(0, 1).toUpperCase()}
                        </span>
                        <div>
                          <strong>{name}</strong>
                          <span>Expense category</span>
                        </div>
                        <b>{money(amount)}</b>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="Every expense has a place"
                    description="Organize your spending into categories that work for you."
                  />
                )}
              </section>
              <section className="budget-insight">
                <span className="icon-tile">
                  <Leaf size={23} />
                </span>
                <p className="eyebrow">A MOMENT FOR YOUR GOALS</p>
                <h2>
                  {!report.goal
                    ? "A plan is a great place to start."
                    : percentage > 100
                      ? "A little reset can go a long way."
                      : "You’re making room for more."}
                </h2>
                <p>
                  {report.goal
                    ? `You’ve used ${percentage}% of your budget. Keep an eye on the everyday things and stay intentional.`
                    : "Set your spending goal and give every taka a little direction."}
                </p>
                {report.goal > 0 && (
                  <>
                    <div className="progress-track">
                      <span
                        style={{ width: Math.min(100, percentage) + "%" }}
                      />
                    </div>
                    <div className="budget-progress-label">
                      <span>{money(report.total)} spent</span>
                      <span>{money(report.goal)}</span>
                    </div>
                  </>
                )}
                <Link href="/dashboard/budgets" className="text-link">
                  Check in on your budget <ArrowRight size={17} />
                </Link>
              </section>
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
    </>
  );
}
