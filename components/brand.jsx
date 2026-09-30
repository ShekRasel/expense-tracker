import Link from "next/link";
import { ChartNoAxesCombined } from "lucide-react";
export default function Brand({ href = "/" }) {
  return (
    <Link href={href} className="brand" aria-label="Expense home">
      <span className="brand-mark">
        <ChartNoAxesCombined size={23} strokeWidth={2.4} />
      </span>
      expense<span className="brand-dot">.</span>
    </Link>
  );
}
