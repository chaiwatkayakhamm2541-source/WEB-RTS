import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SceneBackdrop, SiteHeader } from "@/components/site-page";
import { SEASON_END, countdownLabel, useLang, usePageTitle } from "@/lib/i18n";

export const Route = createFileRoute("/s1")({
  component: SeasonSummaryPage,
  head: () => ({
    meta: [{ title: "สรุป S1 · สมรภูมิ RTS" }],
  }),
});

const steps = [
  {
    th: "1. ปกป้องสมาชิกพันธมิตร",
    en: "1. Protect alliance members",
    points: [
      ["หัวหน้าพันธมิตรไล่สมาชิกออกไม่ได้", "Alliance leaders cannot kick members"],
      ["สมาชิกออกจากพันธมิตร หรือเข้าพันธมิตรใหม่ได้ตามปกติ", "Members can leave or join another alliance as usual"],
      ["พอช่วงนี้จบ จะเข้าช่วงรอสรุปผล ก่อนปิดซีซั่นจริง", "When this phase ends, a results-wait phase begins before the season actually closes"],
    ],
  },
  {
    th: "2. รอสรุปผล",
    en: "2. Wait for results",
    points: [
      ["เปิดดูตัวอย่างรางวัลที่พันธมิตรได้ในตอนนี้ได้", "You can preview the rewards your alliance currently has"],
      ["พอช่วงรอจบ ระบบสรุปผลซีซั่นทันที", "When the wait ends, the season is settled immediately"],
    ],
  },
  {
    th: "3. ดูผลซีซั่น",
    en: "3. View season results",
    points: [["รายละเอียดอยู่ที่หน้า สถานการณ์โลก แล้วเลือก สรุปผลซีซั่น", "Open World Situation, then choose Season results"]],
  },
  {
    th: "4. จัดทีมรบ",
    en: "4. Form a battle team",
    points: [
      ["เซิร์ฟที่สรุปพร้อมกันจะถูกแบ่งเป็นหลายเขตรบ ตามลำดับที่เปิดเซิร์ฟ", "Servers that settle together are split into several war zones by launch order"],
      ["สร้างทีมหรือเข้าทีมได้อิสระ คนในทีมเดียวกันจะไปเซิร์ฟเดียวกันในซีซั่นใหม่", "Create or join a team freely. People on the same team go to the same server next season"],
      ["จัดทีมข้ามเขตได้ โดยค้นทั้งเขต หรือใส่ไอดีตัวละครของหัวหน้าทีม", "You can form a team across zones by searching the zone or entering the team leader's character ID"],
      ["สมาชิกข้ามเขตได้ไม่เกิน 30 คน และต้องเป็นเขตรบซีซั่นเดียวกันที่สรุปพร้อมกัน", "Cross-zone members cannot exceed 30, and they must share the same season war zone that settled together"],
      ["สร้างทีมใช้ 200 ทอง ถ้าผู้สร้างเป็นหัวหน้าพันธมิตร ดึงสมาชิกที่ยังไม่มีทีมเข้าได้เลย", "Creating a team costs 200 gold. An alliance leader can pull in members who do not have a team yet"],
      ["หนึ่งทีมมีได้ไม่เกิน 150 คน", "A team can have at most 150 people"],
      ["ช่วงนี้มีแชตข้ามเซิร์ฟเปิดให้ใช้", "Cross-server chat is available during this phase"],
    ],
  },
  {
    th: "5. เลือกบทละคร",
    en: "5. Choose a scenario",
    points: [
      ["พอเข้าซีซั่นบังคับ เลือกบทละครของซีซั่นใหม่ได้อิสระ", "Once the forced season starts, you may freely choose a scenario for the new season"],
      ["สมัครคนเดียว หรือสมัครทั้งทีม เปิดพร้อมกัน", "Solo signup and team signup open at the same time"],
      ["สมัครคนเดียว: เลือกบทแล้วถือว่าสำเร็จทันที แล้วรอจับคู่ ถ้าไปเข้าหรือสร้างทีมก่อนสำเร็จ การสมัครคนเดียวจะไม่นับ", "Solo: choosing a scenario succeeds immediately, then you wait for matching. If you join or create a team before that succeeds, the solo signup does not count"],
      ["สมัครทั้งทีม: ต้องมีทีมก่อน แล้วเลือกบทตามทีม พอยืนยันคือสมัครสำเร็จ", "Team: you must have a team first, then choose the team's scenario. Confirming means the signup succeeded"],
      ["คนที่สมัครคนเดียวถอนบทได้ตลอด ไม่มีกำหนดเวลา", "Solo applicants can withdraw a scenario at any time, with no deadline"],
      ["คนที่สมัครทั้งทีม ให้หัวหน้าทีมเป็นคนถอน ทุกครั้งที่ถอน คูลดาวน์ลดลง 6 ชั่วโมง", "For team signups, only the team leader can withdraw. Each withdrawal shortens the cooldown by 6 hours"],
      ["บทจะถูกล็อก 6 ชั่วโมงก่อนหมดเวลารับทีม หลังจากนั้นถอนไม่ได้อีก", "Scenarios lock 6 hours before team registration ends. After that, withdrawal is no longer possible"],
      ["พอหมดเวลารับทีม ระบบนับคนที่สมัครแต่ละบท บทที่คนไม่ถึงเกณฑ์จะไม่เปิด", "When team registration ends, the system counts applicants for each scenario. Scenarios below the threshold do not open"],
      ["พอยืนยันบทที่เปิดแล้ว คนที่ยังไม่สมัครจะถูกสุ่มเข้าบทที่เปิดให้เล่น", "After the open scenarios are confirmed, people who have not signed up are randomly placed into an open scenario"],
      ["ผลการจับคู่บทจะประกาศในช่วงประกาศผลจับคู่", "Scenario matching results are announced during the match-result period"],
    ],
  },
  {
    th: "6. จับคู่ แล้วเปิดซีซั่นใหม่",
    en: "6. Match, then open the new season",
    points: [
      ["ทุกทีมและผู้เล่นคนเดียวถูกส่งเข้าจับคู่อัตโนมัติ", "Every team and solo player is sent into matching automatically"],
      ["ระบบจัดคนลงเซิร์ฟใหม่ตามพลังรบรวมของแต่ละทีม", "The system places people on new servers according to each team's combined power"],
      ["ช่วงจับคู่ สร้างทีม เข้าทีม หรือออกจากทีมไม่ได้ และหัวหน้าไล่สมาชิกออกไม่ได้", "During matching you cannot create, join, or leave a team, and leaders cannot kick members"],
      ["ประกาศผลในวันก่อนเปิดซีซั่นใหม่", "Results are announced the day before the new season opens"],
      ["ดูผลจับคู่และข้อมูลซีซั่นใหม่ได้หลัง 16:00 น. ของวันประกาศ", "Match results and new-season information are available after 16:00 on announcement day"],
      ["หัวหน้าทีมเลือกตั้งรัฐหลักในซีซั่นใหม่ล่วงหน้าได้ เมื่อสมาชิกเกิดในซีซั่นใหม่ จะมีคำอธิบายกฎการเกิดบนหน้าจอ", "Team leaders can choose a main state for the new season in advance. When members spawn, the spawn rules appear on screen"],
      ["เซิร์ฟปิดปรับปรุง 22:00 น. ของวันประกาศ และเปิดซีซั่นใหม่ 10:00 น. ของวันถัดไป", "The server closes for maintenance at 22:00 on announcement day and the new season opens at 10:00 the next day"],
    ],
  },
] as const;

function SeasonSummaryPage() {
  const { tx, lang } = useLang();
  usePageTitle("สรุป S1 · สมรภูมิ RTS", "S1 recap · RTS Battlefield");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const left = Math.max(0, SEASON_END - now);
  const days = Math.floor(left / 86_400_000);
  const hours = Math.floor((left % 86_400_000) / 3_600_000);
  const minutes = Math.floor((left % 3_600_000) / 60_000);
  const seconds = Math.floor((left % 60_000) / 1000);

  return (
    <>
      <SiteHeader />
      <main className="register-page scene-page">
        <SceneBackdrop />
        <article className="register-card s1-card">
          <Link className="frame-back" to="/">
            {tx("กลับ", "Back")}
          </Link>
          <p className="s1-kicker">{tx("ซีซั่น 1", "Season 1")}</p>
          <h1>{left === 0 ? tx("สรุปซีซั่น", "Season recap") : tx("สรุปก่อนจบซีซั่น", "Recap before the season ends")}</h1>
          <p className="s1-count" aria-live="polite" suppressHydrationWarning>
            {countdownLabel(lang, days, hours, minutes, seconds, left === 0)}
          </p>
          <p className="lede">
            {tx(
              "จบวันที่ 13 ตุลาคม 2026 เวลา 11:00 น. ตามเวลาประเทศไทย หลังจากนั้นระบบเดินตาม 6 ขั้นนี้",
              "Ends 13 October 2026 at 11:00 Thailand time. After that, the game follows these 6 steps.",
            )}
          </p>
          {steps.map((step) => (
            <section className="s1-block" key={step.th}>
              <h2>{tx(step.th, step.en)}</h2>
              <ul>
                {step.points.map(([th, en]) => (
                  <li key={th}>{tx(th, en)}</li>
                ))}
              </ul>
            </section>
          ))}
          <Link className="register-back" to="/">
            {tx("กลับสู่สมรภูมิ", "Back to the battlefield")}
          </Link>
        </article>
      </main>
    </>
  );
}
