import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SceneBackdrop } from "@/components/site-page";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listCoffeeAccounts, type CoffeeAccount } from "@/lib/coffee";
import { useLang, usePageTitle } from "@/lib/i18n";
import { isOwnerEmail } from "@/lib/owner";
import { formatBahtAmount } from "@/lib/slip-amount";

export const Route = createFileRoute("/coffee")({
  component: CoffeeAccountsPage,
  head: () => ({
    meta: [{ title: "รายละเอียดค่ากาแฟ · สมรภูมิ RTS" }],
  }),
});

const PAGE_SIZE = 20;

function CoffeeAccountsPage() {
  const { tx } = useLang();
  usePageTitle("รายละเอียดค่ากาแฟ · สมรภูมิ RTS", "Coffee details · RTS Battlefield");
  const { user, isPending } = useCurrentUserState();
  const owner = isOwnerEmail(user?.primaryEmail);
  const [rows, setRows] = useState<CoffeeAccount[] | null>(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [sessionSlow, setSessionSlow] = useState(false);
  const columns = [
    tx("ลำดับ", "No."),
    tx("ชื่อบัญชี", "Account"),
    tx("อีเมล", "Email"),
    tx("จำนวนครั้ง", "Rounds"),
    tx("ยอดรวม (บาท)", "Total (THB)"),
  ];

  useEffect(() => {
    if (!isPending) {
      setSessionSlow(false);
      return;
    }
    const timer = window.setTimeout(() => setSessionSlow(true), 4000);
    return () => window.clearTimeout(timer);
  }, [isPending]);

  useEffect(() => {
    if (!owner) return;
    let stop = false;
    const timer = window.setTimeout(() => {
      if (!stop) setError("timeout");
    }, 8000);
    listCoffeeAccounts()
      .then((data) => {
        if (!stop) {
          setError("");
          setRows(data);
        }
      })
      .catch(() => {
        if (!stop) setError("fail");
      })
      .finally(() => window.clearTimeout(timer));
    return () => {
      stop = true;
      window.clearTimeout(timer);
    };
  }, [owner]);

  const total = rows?.length ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, pages - 1);
  const start = safePage * PAGE_SIZE;
  const visible = rows?.slice(start, start + PAGE_SIZE) ?? [];
  const errorText =
    error === "timeout"
      ? tx("โหลดรายละเอียดไม่สำเร็จ ลองรีเฟรชหน้านี้", "Could not load details. Refresh this page")
      : error === "fail"
        ? tx("ยังเปิดรายละเอียดไม่ได้", "Details are not available yet")
        : "";

  return (
    <>
      <SiteHeader />
      <main className="register-page scene-page">
        <SceneBackdrop />
        <div className="register-card roster-card">
          <Link className="frame-back" to="/">
            {tx("กลับ", "Back")}
          </Link>
          <div className="roster-head">
            <h1>{tx("รายละเอียดค่ากาแฟ", "Coffee details")}</h1>
            <p className="roster-count">
              {owner && rows
                ? tx(`ทั้งหมด ${total} บัญชี`, `${total} accounts`)
                : owner
                  ? tx("กำลังโหลดรายละเอียด", "Loading details")
                  : tx("รอข้อมูล", "Waiting for data")}
            </p>
          </div>

          {(!isPending || sessionSlow) && !owner ? (
            <p className="roster-note">
              {user
                ? tx("หน้านี้เปิดให้เจ้าของเว็บที่ลงชื่อด้วยอีเมลที่กำหนดเท่านั้น", "This page is only for site owners signed in with an approved email")
                : tx("กรุณาลงชื่อด้วยบัญชีเจ้าของเว็บก่อน แล้วเปิดหน้านี้อีกครั้ง", "Sign in with an owner account, then open this page again")}
            </p>
          ) : (
            <>
              <div className="roster-wrap">
                <table className="roster">
                  <thead>
                    <tr>
                      {columns.map((column) => (
                        <th key={column}>{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {errorText ? (
                      <tr>
                        <td className="roster-empty" colSpan={columns.length}>
                          {errorText}
                        </td>
                      </tr>
                    ) : !rows ? (
                      <tr>
                        <td className="roster-empty" colSpan={columns.length}>
                          {tx("กำลังโหลดรายละเอียด", "Loading details")}
                        </td>
                      </tr>
                    ) : visible.length === 0 ? (
                      <tr>
                        <td className="roster-empty" colSpan={columns.length}>
                          {tx("ยังไม่มีคนโอนค่ากาแฟ", "No coffee tips yet")}
                        </td>
                      </tr>
                    ) : (
                      visible.map((row, index) => (
                        <tr key={row.key || `${row.email}-${row.name}-${index}`}>
                          <td className="roster-no">{start + index + 1}</td>
                          <td>{row.name}</td>
                          <td>{row.email || "—"}</td>
                          <td>{row.rounds}</td>
                          <td>{formatBahtAmount(row.total)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="roster-pager">
                <button type="button" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>
                  {tx("ก่อนหน้า", "Previous")}
                </button>
                <span>{tx(`หน้า ${safePage + 1} / ${pages}`, `Page ${safePage + 1} / ${pages}`)}</span>
                <button type="button" disabled={safePage >= pages - 1} onClick={() => setPage(safePage + 1)}>
                  {tx("ถัดไป", "Next")}
                </button>
              </div>
            </>
          )}

          <Link className="roster-back" to="/">
            {tx("กลับหน้าแรก", "Back to home")}
          </Link>
        </div>
      </main>
    </>
  );
}
