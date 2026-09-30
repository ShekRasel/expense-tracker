import "./globals.css";
import "@/styles/public.css";
import "@/styles/auth.css";
import "@/styles/dashboard.css";
import "@/styles/responsive.css";
import "react-toastify/dist/ReactToastify.css";
import Providers from "@/components/providers";
export const metadata = {
  title: {
    default: "Expense — A little clarity. A lot more control.",
    template: "%s | Expense",
  },
  description:
    "Make room for what matters. Track expenses, plan your budget, and understand your spending in one simple place.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
