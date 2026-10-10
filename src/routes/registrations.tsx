import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-page";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useLang, usePageTitle } from "@/lib/i18n";
import { isOwnerEmail } from "@/lib/owner";
import { listRegistrations, type Registration } from "@/lib/registrations";

export const Route = createFileRoute("/registrations")({
  component: RegistrationsPage,
  head: () => ({
    meta: [{ title: "รายละเอียดผู้ลงทะเบียน · สมรภูมิ RTS" }],
  }),
});

const PAGE_SIZE = 20;

function RegistrationsPage() {
  const { tx } = useLang();
  usePageTitle("รายละเอียดผู้ลงทะเบียน · สมรภูมิ RTS", "Registration details · RTS Battlefield");
  const { user, isPending } = useCurrentUserState();
  const owner = isOwnerEmail(user?.primaryEmail);
  const [rows, setRows] = useState<Registration[] | null>(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [sessionSlow, setSessionSlow] = useState(false);
  const columns = [
    tx("ลำดับ", "No."),
    tx("ชื่อตัวละคร", "Character"),
    tx("ชื่อดิสคอร์ด", "Discord"),
    tx("เลข UID ในเกมส์", "In-game UID"),
    tx("พันธมิตร", "Alliance"),
    tx("เซิร์ฟเวอร์", "Server"),
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
    listRegistrations()
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
      ? tx("โหลดรายชื่อไม่สำเร็จ ลองรีเฟรชหน้านี้", "Could not load the list. Refresh this page")
      : error === "fail"
        ? tx("ยังเปิดรายชื่อไม่ได้", "The list is not available yet")
        : "";

  return (
    <>
      <SiteHeader />
      <main className="register-page">
        <div className="register-card roster-card">
          <Link className="frame-back" to="/">
            {tx("กลับ", "Back")}
          </Link>
          <div className="roster-head">
            <h1>{tx("รายละเอียดผู้ลงทะเบียน", "Registration details")}</h1>
            <p className="roster-count">
              {owner && rows
                ? tx(`ทั้งหมด ${total} คน`, `${total} people`)
                : owner
                  ? tx("กำลังโหลดรายชื่อ", "Loading the list")
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
                          {tx("กำลังโหลดรายชื่อ", "Loading the list")}
                        </td>
                      </tr>
                    ) : visible.length === 0 ? (
                      <tr>
                        <td className="roster-empty" colSpan={columns.length}>
                          {tx("ยังไม่มีคนลงทะเบียน", "Nobody has registered yet")}
                        </td>
                      </tr>
                    ) : (
                      visible.map((row, index) => (
                        <tr key={row.uid}>
                          <td className="roster-no">{start + index + 1}</td>
                          <td>{row.character}</td>
                          <td>{row.discord}</td>
                          <td>{row.uid}</td>
                          <td>{row.alliance}</td>
                          <td>{row.server}</td>
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
