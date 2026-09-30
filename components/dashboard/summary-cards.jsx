import { Wallet, ArrowUpRight, Target, Layers } from "lucide-react";
import { money } from "@/lib/format";
export default function SummaryCards({ report }) {
  const remaining = report.goal - report.total;
  const cards = [
    {
      label: "Total spending",
      value: money(report.total),
      hint: "Across all your categories",
      icon: ArrowUpRight,
    },
    {
      label: "Budget goal",
      value: money(report.goal),
      hint: report.goal
        ? "Your planned spending limit"
        : "Set a goal to get started",
      icon: Target,
    },
    {
      label: "Remaining budget",
      value: report.goal ? money(remaining) : "Not set",
      hint: report.goal
        ? remaining < 0
          ? "Time to revisit your plan"
          : "Room for what matters"
        : "Give your money a direction",
      icon: Wallet,
    },
    {
      label: "Categories",
      value: String(Object.keys(report.data).length).padStart(2, "0"),
      hint: "Every expense has a place",
      icon: Layers,
    },
  ];
  return (
    <div className="stats-grid">
      {cards.map(({ label, value, hint, icon: Icon }, index) => (
        <article
          className={index === 2 ? "stat-card featured" : "stat-card"}
          key={label}
        >
          <div className="section-heading">
            <span>{label}</span>
            <Icon size={19} />
          </div>
          <strong className={index === 2 && remaining < 0 ? "negative" : ""}>
            {value}
          </strong>
          <p>{hint}</p>
        </article>
      ))}
    </div>
  );
}
