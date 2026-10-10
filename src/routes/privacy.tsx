import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-page";
import { useLang, usePageTitle } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [{ title: "นโยบายความเป็นส่วนตัว · สมรภูมิ RTS" }],
  }),
});

function PrivacyPage() {
  const { tx } = useLang();
  usePageTitle("นโยบายความเป็นส่วนตัว · สมรภูมิ RTS", "Privacy policy · RTS Battlefield");
  return (
    <>
      <SiteHeader />
      <main className="legal-page">
        <article className="legal-card">
          <h1>{tx("นโยบายความเป็นส่วนตัว", "Privacy policy")}</h1>
          <p className="legal-date">
            {tx("ใช้กับเว็บชุมชนสมรภูมิ RTS · 9 ตุลาคม 2569", "For the RTS Battlefield community site · 9 October 2026")}
          </p>
          <p>
            {tx(
              "หน้านี้บอกเป็นภาษาง่าย ๆ ว่าเว็บชุมชนนี้เก็บอะไรไว้บ้าง และเอาไปทำอะไร ข้อความนี้เขียนขึ้นสำหรับเว็บนี้โดยเฉพาะ ไม่ได้ยกเอาสัญญาของผู้อื่นมาใช้ และไม่ได้แทนที่นโยบายของผู้พัฒนาเกม",
              "This page says, in plain language, what this community site keeps and what it is used for. It was written for this site. It does not copy someone else's contract and it does not replace the game developer's policy.",
            )}
          </p>

          <h2>{tx("เว็บนี้คืออะไร", "What this site is")}</h2>
          <p>
            {tx(
              "สมรภูมิ RTS เป็นหน้าของชุมชน สำหรับลงทะเบียนซีซัน ลงชื่อเข้าใช้ และทางไปยังดิสคอร์ดกับเฟซบุ๊กของชุมชน ไม่ใช่ร้านค้าของเกม และไม่ได้รับเงินแทนผู้พัฒนา",
              "RTS Battlefield is a community page for season registration, sign-in, and links to the community Discord and Facebook. It is not the game's shop and it does not take payments for the developer.",
            )}
          </p>

          <h2>{tx("ข้อมูลที่เกี่ยวกับคุณ", "Information about you")}</h2>
          <ul>
            <li>{tx("ตอนลงทะเบียนซีซัน: ชื่อตัวละคร ชื่อดิสคอร์ด เลข UID ในเกม พันธมิตร และเซิร์ฟเวอร์", "Season registration: character name, Discord name, in-game UID, alliance, and server")}</li>
            <li>{tx("ตอนลงชื่อ: ชื่อกับอีเมลจาก Google หรืออีเมลที่คุณพิมพ์เอง และรหัสผ่านสำหรับบัญชีนี้", "Sign-in: the name and email from Google, or the email you type, plus the password for this account")}</li>
            <li>{tx("สถานะว่าคุณลงชื่อค้างอยู่หรือไม่ เพื่อไม่ต้องกรอกใหม่ทุกครั้งที่เปิดหน้า", "Whether you are still signed in, so you do not have to fill it in every time you open a page")}</li>
          </ul>
          <p>
            {tx(
              "รายการลงทะเบียนซีซันถูกเก็บไว้ในเบราว์เซอร์ของเครื่องคุณ เพื่อให้กลับมาแล้วยังเห็นสรุปที่กรอกไว้ รหัสผ่านใช้แค่ยืนยันตัวตน และจะไม่ถูกนำไปโชว์บนหน้าเว็บ",
              "The season registration is stored in your browser so the summary is still there when you come back. The password is only used to confirm who you are and is not shown on the site.",
            )}
          </p>

          <h2>{tx("ใช้ข้อมูลเพื่ออะไร", "What the information is for")}</h2>
          <ul>
            <li>{tx("จัดรายชื่อคนที่สมัครซีซันของชุมชน", "To keep the list of people who signed up for a community season")}</li>
            <li>{tx("ให้คุณเข้าหน้าเดิมได้โดยไม่ต้องลงชื่อซ้ำ", "So you can return to the same pages without signing in again")}</li>
            <li>{tx("ตอบเมื่อคุณทักมาเรื่องบัญชีของหน้านี้", "To reply when you ask about an account on this site")}</li>
          </ul>
          <p>
            {tx(
              "ชุมชนไม่นำรายชื่อไปขาย และไม่เปิดให้คนนอกมาดาวน์โหลดทั้งก้อน เว้นแต่กฎหมายสั่งให้ส่ง หรือคุณขอเอง",
              "The community does not sell the list and does not let outsiders download it in bulk, unless the law requires it or you ask for it yourself.",
            )}
          </p>

          <h2>{tx("เมื่อคุณกดออกไปบริการอื่น", "When you leave for another service")}</h2>
          <p>
            {tx(
              "ปุ่มดิสคอร์ดและเฟซบุ๊กพาคุณออกจากเว็บนี้ สิ่งที่คุณพิมพ์ที่นั่นอยู่กับบริการนั้น ถ้าเลือกเข้าด้วย Google ทาง Google จะส่งชื่อและอีเมลกลับมาเฉพาะเท่าที่คุณกดอนุญาต",
              "The Discord and Facebook buttons take you off this site. What you type there stays with that service. If you sign in with Google, Google sends back only the name and email you allow.",
            )}
          </p>

          <h2>{tx("คุณทำอะไรกับข้อมูลได้", "What you can do with your information")}</h2>
          <ul>
            <li>{tx("ล้างรายการลงทะเบียนซีซันได้จากการลบข้อมูลเว็บไซต์ในเบราว์เซอร์ของเครื่องคุณ", "Clear the season registration by deleting this site's data in your browser")}</li>
            <li>{tx("อยากให้ลบบัญชีที่ลงชื่อไว้ ทักที่ดิสคอร์ดของชุมชน แล้วบอกอีเมลที่ใช้สมัคร", "To delete a signed-in account, message the community Discord and give the email you used")}</li>
            <li>{tx("คนที่ยังไม่มีบัญชีเกมของตนเอง ไม่ควรกรอกชื่อหรือเลข UID ของคนอื่น", "If you do not have your own game account, do not enter someone else's name or UID")}</li>
          </ul>

          <h2>{tx("การเก็บให้รอด", "Keeping it safe")}</h2>
          <p>
            {tx(
              "หน้าลงชื่อใช้ช่องทางที่ยืนยันตัวตนได้ ไม่มีระบบไหนการันตีว่าจะไม่มีวันรั่ว ถ้าสงสัยว่ามีคนอื่นเข้ารหัสของคุณ ให้เปลี่ยนรหัสแล้วบอกผู้ดูแลในดิสคอร์ด",
              "The sign-in page uses a channel that can confirm who you are. No system can promise it will never leak. If you think someone else has your password, change it and tell a moderator on Discord.",
            )}
          </p>

          <h2>{tx("ถ้าหน้านี้เปลี่ยน", "If this page changes")}</h2>
          <p>{tx("ข้อความล่าสุดบนหน้านี้คือฉบับที่ใช้ วันที่ด้านบนจะถูกปรับเมื่อมีการแก้", "The latest text on this page is the version in use. The date above changes when it is edited.")}</p>

          <h2>{tx("ติดต่อ", "Contact")}</h2>
          <p>
            {tx("ถามเรื่องข้อมูลส่วนตัวได้ที่", "Questions about personal information go to")}{" "}
            <a href="https://discord.gg/rtsslgth" target="_blank" rel="noreferrer">
              {tx("ดิสคอร์ดของชุมชน", "the community Discord")}
            </a>
          </p>
        </article>
      </main>
    </>
  );
}
