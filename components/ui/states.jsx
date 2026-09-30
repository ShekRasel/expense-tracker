import { CircleAlert, Loader2, Wallet } from "lucide-react";
export function LoadingState() {
  return (
    <div className="state" role="status">
      <Loader2 className="spin" size={25} />
      <p>Getting your finances ready…</p>
    </div>
  );
}
export function ErrorState({ message, onRetry }) {
  return (
    <div className="state error-state" role="alert">
      <CircleAlert size={28} />
      <h3>We couldn’t load your data</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
export function EmptyState({
  title = "A fresh start for your finances",
  description = "Add your first expense to see your spending come to life.",
  children,
}) {
  return (
    <div className="state">
      <span className="icon-tile">
        <Wallet size={25} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}
