import SiteHeader from "@/components/public/site-header";
import SiteFooter from "@/components/public/site-footer";
export default function PublicLayout({ children }) {
  return (
    <>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </>
  );
}
