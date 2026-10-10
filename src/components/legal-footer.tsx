import { Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";

export function LegalFooter() {
  const { tx } = useLang();
  return (
    <nav className="legal-foot" aria-label={tx("เอกสารของชุมชน", "Community documents")}>
      <Link to="/privacy">{tx("นโยบายความเป็นส่วนตัว", "Privacy policy")}</Link>
      <span aria-hidden="true"> · </span>
      <Link to="/terms">{tx("ข้อกำหนดสมาชิก", "Member terms")}</Link>
    </nav>
  );
}