import DashboardShell from "@/components/dashboard/dashboard-shell";
export const metadata = { title: "Your dashboard" };
export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}
