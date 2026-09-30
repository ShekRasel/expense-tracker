"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/ui/modal";
import { expenseApi } from "@/lib/api";
export default function ExpenseDialog({
  mode = "add",
  category = "",
  amount = "",
  onClose,
  onSaved,
  existing = [],
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const titles = {
    add: "Add an expense",
    rename: "Rename category",
    amount: "Update amount",
    delete: "Delete this category?",
  };
  async function submit(event) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const name = String(fields.get("category") || "").trim();
    const value = Number(fields.get("amount"));
    setError("");
    if (
      (mode === "add" || mode === "rename") &&
      (!name ||
        (name !== category &&
          existing.some((item) => item.toLowerCase() === name.toLowerCase())))
    ) {
      setError("Enter a unique, non-empty category name.");
      return;
    }
    if (
      (mode === "add" || mode === "amount") &&
      (!Number.isFinite(value) || value <= 0)
    ) {
      setError("Enter an amount greater than zero.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "add") await expenseApi.add(name, value);
      if (mode === "rename") await expenseApi.rename(category, name);
      if (mode === "amount") await expenseApi.updateAmount(category, value);
      if (mode === "delete") await expenseApi.remove(category);
      toast.success(
        mode === "delete"
          ? "Category deleted."
          : "Your expense has been saved.",
      );
      onSaved();
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title={titles[mode]} onClose={onClose} busy={busy}>
      <form className="form-stack" onSubmit={submit}>
        {mode === "delete" ? (
          <p className="muted">
            This removes <strong>{category}</strong> and its amount from your
            report. This action cannot be undone.
          </p>
        ) : (
          <>
            <p className="muted">
              A little detail now makes your next check-in easier.
            </p>
            {(mode === "add" || mode === "rename") && (
              <label>
                Category name
                <input
                  autoFocus
                  required
                  name="category"
                  maxLength={80}
                  defaultValue={category}
                  placeholder="e.g. Groceries"
                />
              </label>
            )}
            {mode === "amount" && <p className="badge">{category}</p>}
            {(mode === "add" || mode === "amount") && (
              <label>
                Amount (BDT)
                <input
                  required
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  defaultValue={amount}
                  placeholder="0.00"
                  inputMode="decimal"
                />
              </label>
            )}
          </>
        )}
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={busy}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            disabled={busy}
            className={mode === "delete" ? "btn btn-danger" : "btn btn-primary"}
          >
            {busy
              ? "Saving…"
              : mode === "delete"
                ? "Delete category"
                : "Save expense"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
