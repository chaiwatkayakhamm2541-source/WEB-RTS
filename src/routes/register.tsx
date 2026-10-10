import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { SiteHeader, SceneBackdrop } from "@/components/site-page";
import { useLang, usePageTitle } from "@/lib/i18n";
import { submitRegistration } from "@/lib/registrations";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  head: () => ({
    meta: [{ title: "ลงทะเบียน S2 · สมรภูมิ RTS" }],
  }),
});

const alliances = ["IMT", "FOX", "UNS"] as const;
const servers = Array.from({ length: 15 }, (_, index) => `S1-${String(index + 1).padStart(3, "0")}`);

type FormState = {
  character: string;
  discord: string;
  uid: string;
  alliance: string;
  server: string;
};

const emptyForm: FormState = { character: "", discord: "", uid: "", alliance: "", server: "" };

const fields = [
  { key: "character", th: "ชื่อตัวละคร", en: "Character name", kind: "text" },
  { key: "discord", th: "ชื่อดิสคอร์ด", en: "Discord name", kind: "text" },
  { key: "uid", th: "เลข UID ในเกมส์", en: "In-game UID", kind: "text" },
  { key: "alliance", th: "เข้าร่วมพันธมิตร", en: "Join an alliance", kind: "alliance" },
  { key: "server", th: "เลือกเซิร์ฟเวอร์", en: "Choose a server", kind: "server" },
] as const;

const STORAGE_KEY = "rts-s2-v1";

function checked(value: FormState): FormState | null {
  const next: FormState = {
    character: value.character.trim(),
    discord: value.discord.trim(),
    uid: value.uid.trim(),
    alliance: value.alliance.trim(),
    server: value.server.trim(),
  };
  const allianceOk = (alliances as readonly string[]).includes(next.alliance);
  const serverOk = servers.includes(next.server);
  if (!next.character || !next.discord || !/^\d+$/.test(next.uid) || !allianceOk || !serverOk) return null;
  return next;
}

function problems(value: FormState) {
  const next: FormState = {
    character: value.character.trim(),
    discord: value.discord.trim(),
    uid: value.uid.trim(),
    alliance: value.alliance.trim(),
    server: value.server.trim(),
  };
  const keys: string[] = [];
  if (!next.character) keys.push("character");
  if (!next.discord) keys.push("discord");
  if (!next.uid) keys.push("uid");
  else if (!/^\d+$/.test(next.uid)) keys.push("uid");
  if (!next.alliance) keys.push("alliance");
  else if (!(alliances as readonly string[]).includes(next.alliance)) keys.push("alliance");
  if (!next.server) keys.push("server");
  else if (!servers.includes(next.server)) keys.push("server");
  if (keys.length === 0) return null;
  const missing = !next.character || !next.discord || !next.uid || !next.alliance || !next.server;
  const message = missing ? "incomplete" : keys.includes("uid") ? "uid" : "choice";
  return { keys, message };
}
function readSaved(): FormState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<FormState>;
    return checked({
      character: typeof data.character === "string" ? data.character : "",
      discord: typeof data.discord === "string" ? data.discord : "",
      uid: typeof data.uid === "string" ? data.uid : "",
      alliance: typeof data.alliance === "string" ? data.alliance : "",
      server: typeof data.server === "string" ? data.server : "",
    });
  } catch {
    return null;
  }
}

function RegisterPage() {
  const { tx } = useLang();
  usePageTitle("ลงทะเบียน S2 · สมรภูมิ RTS", "Register S2 · RTS Battlefield");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [invalid, setInvalid] = useState<string[]>([]);
  const [warning, setWarning] = useState("");
  const [done, setDone] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const saved = readSaved();
    if (!saved) return;
    setForm(saved);
    setDone(true);
  }, []);

  function update(key: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setInvalid((current) => current.filter((item) => item !== key));
  }

  function reset() {
    setForm(emptyForm);
    setInvalid([]);
    setWarning("");
    setDone(false);
    localStorage.removeItem(STORAGE_KEY);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const found = problems(form);
    if (found) {
      setDone(false);
      setWarning(found.message);
      setInvalid(found.keys);
      setAttempt((value) => value + 1);
      const target = document.getElementById(`field-${found.keys[0]}`);
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
      const control = target?.querySelector("input, select");
      if (control instanceof HTMLElement) control.focus();
      return;
    }
    const next = checked(form);
    if (!next) return;
    try {
      await submitRegistration({ data: next });
    } catch {
      setWarning("save");
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setForm(next);
    setWarning("");
    setInvalid([]);
    setDone(true);
  }

  const warningText =
    warning === "incomplete"
      ? tx("กรุณากรอกข้อมูลให้ครบถ้วน", "Please complete every field")
      : warning === "uid"
        ? tx("เลข UID ต้องเป็นตัวเลขเท่านั้น", "UID must be numbers only")
        : warning === "choice"
          ? tx("กรุณาเลือกจากรายการที่กำหนด", "Please choose from the list")
          : warning === "save"
            ? tx("บันทึกไม่สำเร็จ ลองอีกครั้ง", "Could not save. Try again")
            : "";

  return (
    <>
      <SiteHeader />
      <main className="register-page scene-page">
        <SceneBackdrop />
        <div className="register-card">
          <Link className="frame-back" to="/">
            {tx("กลับ", "Back")}
          </Link>
          <h1>{tx("ลงทะเบียน S2", "Register S2")}</h1>
          {done ? (
            <div className="register-done" id="register-summary" role="status">
              <p className="register-success">{tx("ลงทะเบียนสำเร็จ", "Registration complete")}</p>
              <p className="lede">{tx("สรุปข้อมูลที่ตรวจแล้ว", "Checked summary")}</p>
              <dl className="register-summary">
                {fields.map((field) => (
                  <div key={field.key}>
                    <dt>{tx(field.th, field.en)}</dt>
                    <dd>{form[field.key]}</dd>
                  </div>
                ))}
              </dl>
              <ul className="check-list">
                <li>{tx("ชื่อตัวละครและชื่อดิสคอร์ดไม่ว่าง", "Character name and Discord name are filled in")}</li>
                <li>{tx("เลข UID เป็นตัวเลขเท่านั้น", "UID contains numbers only")}</li>
                <li>{tx("พันธมิตรเป็น IMT, FOX หรือ UNS", "Alliance is IMT, FOX, or UNS")}</li>
                <li>{tx("เซิร์ฟเวอร์อยู่ระหว่าง S1-001 ถึง S1-015", "Server is between S1-001 and S1-015")}</li>
              </ul>
              <button className="join-cancel register-again" type="button" onClick={reset}>
                {tx("ลงทะเบียนใหม่", "Register again")}
              </button>
            </div>
          ) : (
            <form className="join-form" onSubmit={submit} noValidate>
              {fields.map((field) => {
                const bad = invalid.includes(field.key);
                return (
                  <label
                    key={`${field.key}-${bad ? attempt : "ok"}`}
                    id={`field-${field.key}`}
                    className={bad ? "field-bad" : undefined}
                  >
                    {tx(field.th, field.en)}
                    {field.kind === "text" ? (
                      <input
                        inputMode={field.key === "uid" ? "numeric" : undefined}
                        value={form[field.key]}
                        maxLength={40}
                        onChange={(event) => update(field.key, event.target.value)}
                      />
                    ) : (
                      <select value={form[field.key]} onChange={(event) => update(field.key, event.target.value)}>
                        <option value="">{field.kind === "alliance" ? tx("เลื่อนเลือกพันธมิตร", "Scroll to choose an alliance") : tx("เลื่อนเลือกเซิร์ฟเวอร์", "Scroll to choose a server")}</option>
                        {(field.kind === "alliance" ? alliances : servers).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  </label>
                );
              })}
              {warning ? (
                <p className="join-error" role="alert">
                  {warningText}
                </p>
              ) : null}
              <div className="join-actions">
                <button className="join-submit" type="submit">
                  {tx("ตกลง", "Confirm")}
                </button>
                <button className="join-cancel" type="button" onClick={reset}>
                  {tx("ยกเลิก", "Cancel")}
                </button>
              </div>
            </form>
          )}
          <Link className="register-back" to="/">
            {tx("กลับสู่สมรภูมิ", "Back to the battlefield")}
          </Link>
        </div>
      </main>
    </>
  );
}
