import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-page";
import { useLang, usePageTitle } from "@/lib/i18n";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [{ title: "ข้อกำหนดสมาชิก · สมรภูมิ RTS" }],
  }),
});

function TermsPage() {
  const { tx } = useLang();
  usePageTitle("ข้อกำหนดสมาชิก · สมรภูมิ RTS", "Member terms · RTS Battlefield");
  return (
    <>
      <SiteHeader />
      <main className="legal-page">
        <article className="legal-card">
          <h1>{tx("ข้อกำหนดสมาชิก", "Member terms")}</h1>
          <p className="legal-date">
            {tx("กติกาของเว็บชุมชนสมรภูมิ RTS · 9 ตุลาคม 2569", "Rules for the RTS Battlefield community site · 9 October 2026")}
          </p>
          <p>
            {tx(
              "กดลงทะเบียนหรือลงชื่อบนเว็บนี้ แปลว่าคุณอ่านกติกาชุดนี้แล้ว การเล่นในตัวเกมยังเป็นไปตามกติกาของผู้ให้บริการเกม ซึ่งเป็นคนละฉบับกับหน้านี้ ข้อความเขียนใหม่สำหรับชุมชนนี้โดยเฉพาะ",
              "Registering or signing in on this site means you have read these rules. Play inside the game still follows the game publisher's rules, which are separate from this page. This text was written for this community.",
            )}
          </p>

          <h2>{tx("การเข้ามาอยู่ในชุมชน", "Joining the community")}</h2>
          <ul>
            <li>{tx("ใส่ชื่อตัวละคร ชื่อดิสคอร์ด เลข UID พันธมิตร และเซิร์ฟเวอร์ที่เป็นของคุณจริง", "Enter your own character name, Discord name, UID, alliance, and server")}</li>
            <li>{tx("อย่าใช้ชื่อหรือเลขของคนอื่นเพื่อแอบเข้าซีซัน", "Do not use someone else's name or number to sneak into a season")}</li>
            <li>{tx("ชุมชนใช้ข้อมูลที่คุณกรอกเพื่อจัดคนในซีซันนั้น ไม่ใช่เพื่อเปิดร้านหรือรับเงิน", "The community uses what you enter to place people in that season, not to run a shop or take payments")}</li>
          </ul>

          <h2>{tx("บัญชีบนเว็บนี้", "Accounts on this site")}</h2>
          <ul>
            <li>{tx("บัญชีเป็นของคุณคนเดียว อย่าบอกโค้ดหรือรหัสผ่านให้คนอื่นเข้าแทน", "The account is yours alone. Do not share codes or passwords")}</li>
            <li>{tx("ชื่อที่แสดงควรเป็นชื่อที่คุณใช้ในชุมชน ไม่ใช่ชื่อที่ไปแอบอ้างผู้ดูแล", "The display name should be the one you use in the community, not a name that impersonates a moderator")}</li>
            <li>{tx("ถ้าฤดูกาลจบ ชุมชนอาจปิดรับสมัครหรือเปลี่ยนช่องที่ต้องกรอก โดยไม่ต้องเปิดซีซันเก่าค้างไว้", "When a season ends, the community may close registration or change the required fields without keeping the old season open")}</li>
          </ul>

          <h2>{tx("สิ่งที่ห้ามทำบนเว็บนี้", "What is not allowed here")}</h2>
          <ul>
            <li>{tx("คุกคาม หลอกลวง หรือเผยแพร่เรื่องส่วนตัวของผู้อื่น", "Harassment, scams, or publishing someone else's private information")}</li>
            <li>{tx("ชวนให้คนส่งของในเกม รหัสผ่าน หรือรหัสเข้าบัญชี", "Asking people to send in-game items, passwords, or account codes")}</li>
            <li>{tx("ยัดข้อความหรือสคริปต์ที่ทำให้หน้าเว็บคนอื่นพัง", "Injecting text or scripts that break the site for other people")}</li>
          </ul>

          <h2>{tx("ของในเกม", "In-game items")}</h2>
          <p>
            {tx(
              "เว็บนี้ไม่มีร้านค้า ไม่ขายไอเทม และไม่เปลี่ยนของในเกมเป็นเงิน สกุลเงินในเกม ไอเทม และบัญชีเกม อยู่กับผู้ให้บริการเกม ชุมชนทำได้แค่รับรายชื่อคนที่มาสมัครซีซัน",
              "This site has no shop, does not sell items, and does not turn in-game goods into money. In-game currency, items, and game accounts stay with the game publisher. The community only collects the names of people who sign up for a season.",
            )}
          </p>

          <h2>{tx("เมื่อเว็บขัดข้องหรือกติกาถูกปรับ", "When the site fails or the rules change")}</h2>
          <ul>
            <li>{tx("หน้าเว็บอาจปิดปรับปรุงชั่วคราว โดยไม่ได้แจ้งล่วงหน้าทุกครั้ง", "The site may close briefly for maintenance without notice every time")}</li>
            <li>{tx("ถ้าข้อมูลที่กรอกไม่ตรงกติกา ชุมชนสามารถไม่นำรายชื่อนั้นเข้าซีซัน", "If the details do not follow the rules, the community can leave that name out of the season")}</li>
            <li>{tx("กติกาฉบับที่เห็นบนหน้านี้คือฉบับล่าสุด", "The rules on this page are the current version")}</li>
          </ul>

          <h2>{tx("พื้นที่อื่นที่ลิงก์ออกไป", "Places this site links to")}</h2>
          <p>
            {tx(
              "ดิสคอร์ดและเฟซบุ๊กมีกติกาของเขาเอง สิ่งที่คุณโพสต์ที่นั่นไม่ได้อยู่ใต้หน้านี้ ถ้าจะคุยเรื่องสมาชิกของเว็บนี้ ให้ทักที่",
              "Discord and Facebook have their own rules. What you post there is not covered by this page. To talk about membership on this site, message",
            )}{" "}
            <a href="https://discord.gg/rtsslgth" target="_blank" rel="noreferrer">
              {tx("ดิสคอร์ดของชุมชน", "the community Discord")}
            </a>
          </p>
        </article>
      </main>
    </>
  );
}
