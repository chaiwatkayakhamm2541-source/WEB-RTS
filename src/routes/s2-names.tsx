import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SceneBackdrop, SiteHeader } from "@/components/site-page";
import { useLang, usePageTitle } from "@/lib/i18n";
import { s2Roster, type S2RosterRow } from "@/lib/s2-roster";

export const Route = createFileRoute("/s2-names")({
  component: S2NamesPage,
  head: () => ({
    meta: [{ title: "ประกาศรายชื่อ S2 · สมรภูมิ RTS" }],
  }),
});

const PAGE_SIZE = 20;

const ALLIANCE_LABEL: Record<string, { th: string; en: string }> = {
  IMT: { th: "IMT (ปลายุทธ์)", en: "IMT" },
  FOX: { th: "FOX (ธนงทวย)", en: "FOX" },
  UNS: { th: "UNS (Mikael)", en: "UNS" },
};

function allianceKey(name: string) {
  if (name.includes("IMT")) return "IMT";
  if (name.includes("FOX")) return "FOX";
  if (name.includes("UNS")) return "UNS";
  return name;
}

function roleText(raw: string, english: boolean) {
  const level = raw.match(/Level\s+(\d+)/i);
  if (level) return english ? `Level ${level[1]}` : `ระดับ ${level[1]}`;
  if (/ignoring|ไม่สนใจ/i.test(raw)) return english ? "Pass" : "ไม่สนใจ";
  return raw;
}

function S2NamesPage() {
  const { tx, lang } = useLang();
  usePageTitle("ประกาศรายชื่อ S2 · สมรภูมิ RTS", "S2 roster · RTS Battlefield");
  const [page, setPage] = useState(0);
  const english = lang === "en";
  const columns = [
    tx("ลำดับ", "No."),
    tx("ชื่อในเกมส์", "In-game name"),
    tx("ดิสคอร์ด", "Discord"),
    tx("พันธมิตร", "Alliance"),
    tx("ผู้นำ", "Leader"),
    tx("รองผู้นำ", "Deputy"),
    tx("แม่ทัพ", "Commander"),
    tx("ประชาสัมพันธ์", "PR"),
  ];

  const totals = useMemo(() => {
    const counts = new Map<string, number>();
    for (const row of s2Roster) {
      const key = allianceKey(row.alliance);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, []);

  const total = s2Roster.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, pages - 1);
  const start = safePage * PAGE_SIZE;
  const visible = s2Roster.slice(start, start + PAGE_SIZE);

  return (
    <>
      <SiteHeader />
      <main className="register-page scene-page">
        <SceneBackdrop />
        <div className="register-card roster-card announce-card">
          <Link className="frame-back" to="/">
            {tx("กลับ", "Back")}
          </Link>
          <div className="roster-head">
            <h1>{tx("ประกาศรายชื่อ S2", "S2 roster")}</h1>
            <p className="roster-count">{tx(`ทั้งหมด ${total} คน`, `${total} people`)}</p>
          </div>
          <div className="announce-allies">
            {totals.map(([key, count]) => {
              const label = ALLIANCE_LABEL[key];
              return (
                <span key={key}>
                  {label ? tx(label.th, label.en) : key} {count}
                </span>
              );
            })}
          </div>
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
                {visible.map((row) => (
                  <RosterRow key={row.no} row={row} english={english} />
                ))}
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
          <Link className="roster-back" to="/">
            {tx("กลับหน้าแรก", "Back to home")}
          </Link>
        </div>
      </main>
    </>
  );
}

function allianceLabel(name: string, english: boolean) {
  const key = allianceKey(name);
  const label = ALLIANCE_LABEL[key];
  if (!label) return name;
  return english ? label.en : label.th;
}

function RosterRow({ row, english }: { row: S2RosterRow; english: boolean }) {
  return (
    <tr>
      <td className="roster-no">{row.no}</td>
      <td>{row.name}</td>
      <td>{row.discord}</td>
      <td>{allianceLabel(row.alliance, english)}</td>
      <td>{roleText(row.leader, english)}</td>
      <td>{roleText(row.deputy, english)}</td>
      <td>{roleText(row.commander, english)}</td>
      <td>{roleText(row.pr, english)}</td>
    </tr>
  );
}
