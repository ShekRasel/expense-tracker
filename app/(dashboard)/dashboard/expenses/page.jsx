"use client";
import { useState } from "react";
import {
  Plus,
  Download,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  Banknote,
} from "lucide-react";
import { toast } from "react-toastify";
import PageHeading from "@/components/ui/page-heading";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { useExpenseReport } from "@/hooks/use-expense-report";
import ExpenseDialog from "@/components/dashboard/expense-dialog";
import { money, exportExpenses } from "@/lib/format";
export default function ExpensesPage() {
  const { report, loading, error, refresh } = useExpenseReport();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [dialog, setDialog] = useState(null);
  const [exporting, setExporting] = useState(false);
  const entries = Object.entries(report?.data || {})
    .filter(([name]) => name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sort === "amount" ? b[1] - a[1] : a[0].localeCompare(b[0]),
    );
  async function download() {
    setExporting(true);
    try {
      await exportExpenses(report.data);
    } catch {
      toast.error("We couldn’t export your report. Please try again.");
    } finally {
      setExporting(false);
    }
  }
  return (
    <>
      <PageHeading
        eyebrow="THE EVERYDAY DETAILS"
        title="Your expenses."
        description="A place for every expense. A clearer picture of your habits."
      >
        <button
          className="btn btn-secondary"
          disabled={
            !report ||
            !Object.keys(report.data).length ||
            exporting ||
            loading ||
            !!error
          }
          onClick={download}
        >
          <Download size={17} />
          {exporting ? "Exporting…" : "Export Excel"}
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setDialog({ mode: "add" })}
        >
          <Plus size={18} />
          Add expense
        </button>
      </PageHeading>
      <section className="panel">
        <div className="expense-summary">
          <div>
            <p className="muted">Total recorded spending</p>
            <h2>{loading || error ? "—" : money(report?.total)}</h2>
          </div>
          <span className="badge">
            {Object.keys(report?.data || {}).length} categories · BDT
          </span>
        </div>
        <div className="table-toolbar">
          <label className="search-field">
            <Search size={18} />
            <input
              aria-label="Search categories"
              placeholder="Search your categories…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <div className="actions">
            <select
              aria-label="Sort expenses"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="name">Name: A to Z</option>
              <option value="amount">Highest amount</option>
            </select>
            <button
              className="icon-button"
              aria-label="Refresh expenses"
              disabled={loading}
              onClick={refresh}
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : !entries.length ? (
          <EmptyState
            title={search ? "No matching categories" : undefined}
            description={
              search
                ? "Try a different search or clear the search field."
                : undefined
            }
          >
            {search ? (
              <button
                className="btn btn-secondary"
                onClick={() => setSearch("")}
              >
                Clear search
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setDialog({ mode: "add" })}
              >
                Add your first expense
              </button>
            )}
          </EmptyState>
        ) : (
          <div className="table-scroll">
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Share of spending</th>
                  <th className="amount-cell">Amount</th>
                  <th className="amount-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(([category, amount], index) => (
                  <tr key={category}>
                    <td>
                      <div className="table-category">
                        <span
                          aria-hidden="true"
                          className={"category-initial tone-" + (index % 3)}
                        >
                          {category.slice(0, 1).toUpperCase()}
                        </span>
                        <strong>{category}</strong>
                      </div>
                    </td>
                    <td>
                      <div className="table-share">
                        <div className="progress-track">
                          <span
                            style={{
                              width:
                                (report.total
                                  ? (amount / report.total) * 100
                                  : 0) + "%",
                            }}
                          />
                        </div>
                        <span>
                          {report.total
                            ? Math.round((amount / report.total) * 100)
                            : 0}
                          %
                        </span>
                      </div>
                    </td>
                    <td className="amount-cell">
                      <strong>{money(amount)}</strong>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="icon-button"
                          aria-label={`Rename ${category}`}
                          title="Rename category"
                          onClick={() =>
                            setDialog({ mode: "rename", category, amount })
                          }
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="icon-button"
                          aria-label={`Update ${category} amount`}
                          title="Update amount"
                          onClick={() =>
                            setDialog({ mode: "amount", category, amount })
                          }
                        >
                          <Banknote size={17} />
                        </button>
                        <button
                          className="icon-button danger-icon"
                          aria-label={`Delete ${category}`}
                          title="Delete category"
                          onClick={() =>
                            setDialog({ mode: "delete", category, amount })
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="table-footer">
              Showing {entries.length} of {Object.keys(report.data).length}{" "}
              categories
            </div>
          </div>
        )}
      </section>
      <p className="page-note">
        Amounts represent the recorded total for each category.
      </p>
      {dialog && (
        <ExpenseDialog
          {...dialog}
          existing={Object.keys(report?.data || {})}
          onClose={() => setDialog(null)}
          onSaved={refresh}
        />
      )}
    </>
  );
}
