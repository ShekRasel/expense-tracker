"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  MessageSquare,
  LogOut,
  ArrowUpRight,
  Bell,
  ChevronRight,
} from "lucide-react";
import Brand from "@/components/brand";
import { apiRequest } from "@/lib/api";
import { LoadingState } from "@/components/ui/states";
const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);
const navigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/expenses", label: "Expenses", icon: ArrowLeftRight },
  { href: "/dashboard/budgets", label: "Budgets", icon: Wallet },
  { href: "/dashboard/feedback", label: "Feedback", icon: MessageSquare },
];
export default function DashboardShell({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);
  const [notice, setNotice] = useState("");
  const [noticeError, setNoticeError] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const path = usePathname();
  const router = useRouter();
  useEffect(() => {
    const logout = () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userName");
      setReady(false);
      router.replace("/sign-in");
    };
    const token = localStorage.getItem("authToken");
    try {
      if (!token) {
        logout();
        return;
      }
      const decoded = jwtDecode(token);
      if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
        logout();
        return;
      }
    } catch {
      logout();
      return;
    }
    setReady(true);
    window.addEventListener("session-expired", logout);
    const controller = new AbortController();
    apiRequest("/user/profile", { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setUser(data);
      })
      .catch(() => {});
    apiRequest("/maintenance/alert", { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted)
          setNotice(typeof data?.message === "string" ? data.message : "");
      })
      .catch(() => {
        if (!controller.signal.aborted) setNoticeError(true);
      });
    return () => {
      controller.abort();
      window.removeEventListener("session-expired", logout);
    };
  }, [router]);
  function signOut() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    router.replace("/sign-in");
  }
  const current =
    navigation.find((item) => item.href === path)?.label || "Dashboard";
  if (!ready)
    return (
      <main id="main-content">
        <LoadingState />
      </main>
    );
  return (
    <UserContext.Provider value={user}>
      <div className="dashboard-shell">
        <aside className="sidebar">
          <Brand href="/dashboard" />
          <p className="nav-label">YOUR WORKSPACE</p>
          <nav aria-label="Dashboard navigation">
            {navigation.map(({ href, label, icon: Icon }) => (
              <Link
                href={href}
                key={href}
                className={
                  path === href ? "sidebar-link active" : "sidebar-link"
                }
                aria-current={path === href ? "page" : undefined}
              >
                <Icon size={20} />
                <span>{label}</span>
                {path === href && <span className="active-dot" />}
              </Link>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="sidebar-tip">
              <span>ONE SMALL STEP</span>
              <h3>
                Make every taka
                <br />
                count.
              </h3>
              <p>
                A quick check-in today.
                <br />A clearer picture tomorrow.
              </p>
              <Link href="/dashboard/budgets">
                Review your budget <ArrowUpRight size={16} />
              </Link>
            </div>
            <Link href="/" className="sidebar-link">
              <ArrowUpRight size={19} />
              <span>Visit website</span>
            </Link>
            <button onClick={signOut} className="sidebar-link">
              <LogOut size={19} />
              <span>Sign out</span>
            </button>
          </div>
        </aside>
        <div className="dashboard-body">
          <header className="dashboard-header">
            <div className="breadcrumb">
              <span>Workspace</span>
              <ChevronRight size={14} />
              <strong>{current}</strong>
            </div>
            <div className="header-actions">
              <span className="currency-label">
                BDT <span>৳</span>
              </span>
              <div className="notification-wrap">
                <button
                  aria-label="Notifications"
                  aria-expanded={notifications}
                  className="icon-button notification-button"
                  onClick={() => setNotifications(!notifications)}
                >
                  <Bell size={20} />
                  {notice && <i />}
                </button>
                {notifications && (
                  <div className="notification-panel">
                    <h3>Notifications</h3>
                    <p>
                      {notice ||
                        (noticeError
                          ? "Notifications are temporarily unavailable."
                          : "You’re all caught up. No new notices.")}
                    </p>
                  </div>
                )}
              </div>
              <div className="profile">
                <span className="avatar">
                  {(user?.fullname || "You").slice(0, 1).toUpperCase()}
                </span>
                <span>
                  <strong>{user?.fullname || "Your workspace"}</strong>
                  <small>Personal account</small>
                </span>
              </div>
              <button
                onClick={signOut}
                className="icon-button mobile-signout"
                aria-label="Sign out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </header>
          <main id="main-content" className="dashboard-main">
            {children}
            <footer className="dashboard-footer">
              <span>A little progress, every day.</span>
              <span>Made for your peace of mind.</span>
            </footer>
          </main>
        </div>
        <nav
          className="mobile-bottom-nav"
          aria-label="Mobile dashboard navigation"
        >
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={path === href ? "active" : ""}
              aria-current={path === href ? "page" : undefined}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </UserContext.Provider>
  );
}
