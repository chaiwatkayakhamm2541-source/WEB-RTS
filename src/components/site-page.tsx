import { Link, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { BattleScene } from "@/components/battle-scene";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listCoffee, submitCoffee, type CoffeeRank } from "@/lib/coffee";
import { useLang, usePageTitle } from "@/lib/i18n";
import { isOwnerEmail } from "@/lib/owner";
import { formatBahtAmount } from "@/lib/slip-amount";

export function SceneBackdrop() {
  return (
    <>
      <div className="scene-bg" aria-hidden="true" />
      <img className="scene-knight" src="/scene/zhouyu.webp?v=4" alt="" />
      <div className="scroll-fade" aria-hidden="true" />
    </>
  );
}

export function SiteHeader() {
  const { tx } = useLang();
  const home = useRouterState({ select: (state) => state.location.pathname === "/" });
  const [payOpen, setPayOpen] = useState(false);
  const [thanks, setThanks] = useState(false);
  const [thanksAmount, setThanksAmount] = useState<number | null>(null);
  const [ranks, setRanks] = useState<CoffeeRank[]>([]);
  const reloadCoffee = useCallback(() => {
    listCoffee()
      .then(setRanks)
      .catch(() => setRanks([]));
  }, []);

  useEffect(() => {
    reloadCoffee();
    const onUpdate = () => reloadCoffee();
    window.addEventListener("coffee-updated", onUpdate);
    return () => window.removeEventListener("coffee-updated", onUpdate);
  }, [reloadCoffee]);

  useEffect(() => {
    if (!thanks) return;
    const timer = window.setTimeout(() => setThanks(false), 2200);
    return () => window.clearTimeout(timer);
  }, [thanks]);

  return (
    <header className="site-nav">
      <div className="nav-brand">
        <button
          className="nav-logo-link"
          type="button"
          aria-label={tx("กลับหน้าหลัก", "Back to home")}
          onClick={() => {
            if (window.location.pathname === "/") window.location.reload();
            else window.location.assign("/");
          }}
        >
          <img className="nav-logo" src="/scene/emblem.png" alt="" />
        </button>
        <p className="nav-name">RTS : REAL-TIME STRATEGY COMMUNITY (TH)</p>
      </div>
      <div className="nav-center">
        <GuideMenu />
        <ScanMenu onOpen={() => setPayOpen(true)} />
      </div>
      <div className="nav-tools">
        <LangSwitch />
        <a
          className="facebook-btn"
          href="https://web.facebook.com/profile.php?id=61595042515587&locale=th_TH"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M9.2 21.5h4v-8.01h3.6l.4-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.4 3.98h2.4v8.01Z"
            />
          </svg>
          FACEBOOK
        </a>
        <a className="discord-btn" href="https://discord.gg/rtsslgth" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 127.14 96.36" aria-hidden="true">
          <path
            fill="currentColor"
            d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.25 8.09C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.16ZM42.45 65.69C36.18 65.69 31 60 31 53s5-12.74 11.43-12.74S54 46 53.89 53 48.84 65.69 42.45 65.69Zm42.24 0C78.41 65.69 73.25 60 73.25 53s5-12.74 11.44-12.74S96.23 46 96.12 53 91.08 65.69 84.69 65.69Z"
          />
        </svg>
        DISCORD
        </a>
        <AuthSlot />
      </div>
      {payOpen ? (
        <PayModal
          onClose={() => setPayOpen(false)}
          onSent={(amount) => {
            reloadCoffee();
            setPayOpen(false);
            setThanksAmount(amount);
            setThanks(true);
          }}
        />
      ) : null}
      {thanks ? (
        <p className="thanks-mark">
          <span>{tx("ขอบคุณ", "Thank you")}</span>
          {thanksAmount != null ? (
            <span className="thanks-amount">
              {tx(`${formatBahtAmount(thanksAmount)} บาท`, `${formatBahtAmount(thanksAmount)} THB`)}
            </span>
          ) : null}
        </p>
      ) : null}
      <CoffeeBoard ranks={ranks} />
      {home ? (
        <span className="s2-announce-wrap">
          <i className="cn-c tl" aria-hidden="true" />
          <i className="cn-c tr" aria-hidden="true" />
          <i className="cn-c bl" aria-hidden="true" />
          <i className="cn-c br" aria-hidden="true" />
          <Link className="s2-announce" to="/s2-names">
            {tx("ประกาศรายชื่อ S2", "S2 roster")}
          </Link>
        </span>
      ) : null}
    </header>
  );
}

function CoffeeBoard({ ranks }: { ranks: CoffeeRank[] }) {
  const { tx } = useLang();
  const slots = Array.from({ length: 5 }, (_, index) => ranks[index] ?? null);
  return (
    <aside className="coffee-board" aria-label={tx("ค่ากาแฟ", "Coffee")}>
      <h2>{tx("ค่ากาแฟ", "Coffee")}</h2>
      <ol>
        {slots.map((row, index) => (
          <li key={index} className={index === 0 ? "is-top" : undefined}>
            <span className="coffee-no">{index + 1}</span>
            {row ? (
              <>
                <span className="coffee-who">{row.name}</span>
                <span className="coffee-pay">
                  {tx(`ค่ากาแฟ ${formatBahtAmount(row.amount)} บาท`, `${formatBahtAmount(row.amount)} THB`)}
                </span>
              </>
            ) : (
              <span>-</span>
            )}
          </li>
        ))}
      </ol>
    </aside>
  );
}

function PayModal({ onClose, onSent }: { onClose: () => void; onSent: (amount: number) => void }) {
  const { tx } = useLang();
  const { user } = useCurrentUserState();
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const sending = useRef(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function sendSlip(nextFile?: File) {
    const chosen = nextFile ?? file;
    if (sending.current) return;
    if (!user) {
      window.location.assign("/login");
      return;
    }
    if (!chosen) {
      setNote(tx("กรุณาแนบรูป", "Please attach an image"));
      return;
    }
    sending.current = true;
    setBusy(true);
    setNote(tx("กำลังอ่านยอดจากสลิป", "Reading the amount"));
    try {
      const payload = await slipPayload(chosen);
      const result = await submitCoffee({ data: payload });
      if (!result.ok) {
        setNote(
          result.error === "unread"
            ? tx("อ่านจำนวนเงินจากสลิปไม่ได้ ถ่ายให้เห็นยอดชัดๆ", "Could not read the amount. Photograph the total clearly")
            : result.error === "duplicate"
              ? tx("ส่งรูปนี้ไปแล้ว ไม่สามารถส่งซ้ำได้", "This image was already sent")
              : tx("ส่งไม่สำเร็จ ลองเลือกรูปอีกครั้ง", "Could not send. Choose the image again"),
        );
        return;
      }
      onSent(result.amount);
      return;
    } catch {
      setNote(tx("ส่งไม่สำเร็จ ลองใหม่อีกครั้ง", "Could not send. Try again"));
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }

  return (
    <div className="pay-modal" role="dialog" aria-modal="true" aria-labelledby="pay-title">
      <button className="pay-backdrop" type="button" aria-label={tx("ปิด", "Close")} onClick={onClose} />
      <div className="pay-card">
        <button className="pay-close" type="button" onClick={onClose}>
          {tx("ปิด", "Close")}
        </button>
        <h2 id="pay-title">{tx("แสกนแล้วรวย", "Scan and win")}</h2>
        <p className="pay-lead">{tx("ชิตังเมโป้งรวย เฮง เฮง เฮง", "Scan, pay, and prosper")}</p>
        <img className="pay-qr" src="/scene/promptpay.png?v=2" alt={tx("คิวอาร์โค้ดพร้อมเพย์", "PromptPay QR code")} />
        <ol className="pay-steps">
          <li>{tx("เปิดแอปธนาคาร", "Open your banking app")}</li>
          <li>{tx("กดสแกน QR Code", "Tap Scan QR Code")}</li>
          <li>{tx("สแกนรูปนี้ แล้วตรวจยอดก่อนยืนยัน", "Scan this image and check the amount before confirming")}</li>
        </ol>
        <form
          className="pay-form"
          onSubmit={(event) => {
            event.preventDefault();
            void sendSlip();
          }}
        >
          <label className="pay-file">
            {tx("แนบรูปสลิป", "Attach slip")}
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const next = event.target.files?.[0] ?? null;
                setFile(next);
                if (next) void sendSlip(next);
              }}
            />
          </label>
          <p className="pay-hint">{tx("เลือกรูปสลิปแล้ว ระบบอ่านยอดให้อัตโนมัติ", "Choose a slip and the amount is read automatically")}</p>
          <button className="pay-send" type="submit" disabled={busy}>
            {busy ? tx("กำลังอ่านยอด", "Reading") : tx("ส่ง", "Send")}
          </button>
          {note ? <p className="pay-note">{note}</p> : null}
        </form>
      </div>
    </div>
  );
}

async function slipPayload(file: File) {
  const blob = await compressSlip(file);
  const bytes = new Uint8Array(await blob.arrayBuffer());
  if (bytes.length > 1_100_000) throw new Error("large");
  return { imageHash: await hashBytes(bytes), image: bytesToBase64(bytes) };
}

function bytesToBase64(bytes: Uint8Array) {
  let text = "";
  for (let index = 0; index < bytes.length; index += 8192) {
    text += String.fromCharCode(...bytes.subarray(index, index + 8192));
  }
  return btoa(text);
}

async function compressSlip(file: File) {
  const bitmap = await createImageBitmap(file);
  const longest = Math.max(bitmap.width, bitmap.height);
  const scale = Math.min(1, 1600 / longest);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas");
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  let quality = 0.82;
  let blob = await canvasToBlob(canvas, quality);
  while (blob.size > 900_000 && quality > 0.52) {
    quality -= 0.1;
    blob = await canvasToBlob(canvas, quality);
  }
  return blob;
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("blob"))), "image/jpeg", quality);
  });
}

async function hashBytes(bytes: Uint8Array) {
  const digest = await crypto.subtle.digest("SHA-256", bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function ScanMenu({ onOpen }: { onOpen: () => void }) {
  const { tx } = useLang();
  const { user } = useCurrentUserState();
  const owner = isOwnerEmail(user?.primaryEmail);
  const [open, setOpen] = useState(false);
  return (
    <div
      className={open ? "scan-menu is-open" : "scan-menu"}
      onMouseEnter={() => {
        if (owner) setOpen(true);
      }}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="scan-btn"
        type="button"
        aria-expanded={open}
        onClick={() => {
          if (owner && !open) {
            setOpen(true);
            return;
          }
          onOpen();
        }}
      >
        <span>{tx("แสกนแล้ว", "SCAN")}</span>
        <span className="scan-rich">{tx("รวย", "WIN")}</span>
      </button>
      {owner ? (
        <div className="guide-drop scan-drop" role="menu">
          <Link to="/coffee" role="menuitem">
            {tx("รายละเอียดค่ากาแฟ", "Coffee details")}
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function GuideMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={open ? "guide-menu is-open" : "guide-menu"}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="guide-btn" type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        GUIDE
      </button>
      <div className="guide-drop" role="menu">
        <a href="/guide/index.html" role="menuitem">
          Conquest of Nine Kingdoms
        </a>
      </div>
    </div>
  );
}

function AuthSlot() {
  const { tx } = useLang();
  const { user } = useCurrentUserState();
  if (user) {
    return (
      <div className="auth-user">
        <UserButton />
      </div>
    );
  }
  return (
    <Link className="signin-btn" to="/login">
      {tx("ลงชื่อ", "Sign in")}
    </Link>
  );
}

function LangSwitch() {
  const { lang, setLang, tx } = useLang();
  return (
    <div className="lang-switch" role="group" aria-label={tx("เลือกภาษา", "Choose language")}>
      <button type="button" className={lang === "th" ? "is-on" : undefined} onClick={() => setLang("th")}>
        TH
      </button>
      <span aria-hidden="true">/</span>
      <button type="button" className={lang === "en" ? "is-on" : undefined} onClick={() => setLang("en")}>
        ENG
      </button>
    </div>
  );
}

export function SitePage() {
  usePageTitle("สมรภูมิ RTS", "RTS Battlefield");
  return (
    <>
      <SiteHeader />
      <main>
        <BattleScene />
      </main>
    </>
  );
}
