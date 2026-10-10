import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/site-page";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useLang, usePageTitle } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [{ title: "ลงชื่อ · สมรภูมิ RTS" }],
  }),
});

const google = GROK_PROVIDERS.find((provider) => provider.idp === "google");

function errorCode(message: string) {
  if (/invalid email or password/i.test(message)) return "creds";
  if (/already exists|already in use/i.test(message)) return "exists";
  if (/password/i.test(message)) return "password";
  if (/invalid email/i.test(message)) return "email";
  if (/invalid origin/i.test(message)) return "origin";
  return "fail";
}

function LoginPage() {
  const { tx } = useLang();
  usePageTitle("ลงชื่อ · สมรภูมิ RTS", "Sign in · RTS Battlefield");
  const navigate = useNavigate();
  const [step, setStep] = useState<"choose" | "email">("choose");
  const [mode, setMode] = useState<"in" | "up">("up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const errorText =
    error === "creds"
      ? tx("อีเมลหรือรหัสผ่านไม่ถูกต้อง", "Email or password is incorrect")
      : error === "exists"
        ? tx("อีเมลนี้ถูกใช้แล้ว", "This email is already in use")
        : error === "password"
          ? tx("รหัสผ่านต้องมีอย่างน้อย 8 ตัว", "Password must be at least 8 characters")
          : error === "email"
            ? tx("รูปแบบอีเมลไม่ถูกต้อง", "Email format is invalid")
            : error === "origin"
              ? tx("ไม่สามารถลงชื่อจากที่นี่ได้", "You cannot sign in from here")
              : error === "name"
                ? tx("กรุณากรอกชื่อ", "Please enter your name")
                : error === "need-email"
                  ? tx("กรุณากรอกอีเมล", "Please enter your email")
                  : error === "popup"
              ? tx("เบราว์เซอร์บล็อกหน้าต่างลงชื่อ อนุญาตป๊อปอัปแล้วลองอีกครั้ง", "The browser blocked the sign-in window. Allow pop-ups and try again")
              : error === "cancel"
                ? tx("ลงชื่อไม่สำเร็จ ลองอีกครั้ง", "Sign-in did not finish. Try again")
                : error === "fail"
                    ? tx("ลงชื่อไม่สำเร็จ ลองอีกครั้ง", "Sign-in failed. Try again")
                    : "";

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!authEnabled) return;
    setError("");
    if (!email.trim() || password.length < 8 || (mode === "up" && !name.trim())) {
      setError(mode === "up" && !name.trim() ? "name" : password.length < 8 ? "password" : "need-email");
      return;
    }
    setPending(true);
    const result =
      mode === "up"
        ? await authClient.signUp.email({ name: name.trim(), email: email.trim(), password, callbackURL: "/" })
        : await authClient.signIn.email({ email: email.trim(), password, callbackURL: "/" });
    setPending(false);
    if (result.error) {
      setError(errorCode(result.error.message ?? ""));
      return;
    }
    await navigate({ to: "/" });
  }

  return (
    <>
      <SiteHeader />
      <main className="register-page login-page">
        <div className="register-card login-card">
          <h1>{tx("ลงทะเบียน", "Register")}</h1>
          {step === "choose" ? (
            <div className="login-choices">
              {authEnabled && google ? (
                <button
                  className="google-btn"
                  type="button"
                  onClick={() => {
                    setError("");
                    void signIn(google.providerId, { callbackURL: "/" }).catch((caught: unknown) => {
                      const message = caught instanceof Error ? caught.message : "";
                      if (/pop-up blocked/i.test(message)) setError("popup");
                      else setError("cancel");
                    });
                  }}
                >
                  {tx("ลงทะเบียนด้วย Google", "Register with Google")}
                </button>
              ) : (
                <p className="fine">{tx("ระบบลงชื่อยังไม่เปิด", "Sign-in is not available yet")}</p>
              )}
              <button className="email-choice" type="button" onClick={() => setStep("email")}>
                {tx("ลงทะเบียนด้วยอีเมล", "Register with email")}
              </button>
            </div>
          ) : (
            <>
              <h2>{mode === "up" ? tx("ลงทะเบียนด้วยอีเมล", "Register with email") : tx("เข้าสู่ระบบด้วยอีเมล", "Sign in with email")}</h2>
              <form className="join-form" onSubmit={onSubmit}>
                {mode === "up" ? (
                  <label>
                    {tx("ชื่อ", "Name")}
                    <input value={name} autoComplete="name" onChange={(event) => setName(event.target.value)} />
                  </label>
                ) : null}
                <label>
                  {tx("อีเมล", "Email")}
                  <input type="email" value={email} autoComplete="email" onChange={(event) => setEmail(event.target.value)} />
                </label>
                <label>
                  {tx("รหัสผ่าน", "Password")}
                  <input
                    type="password"
                    value={password}
                    autoComplete={mode === "up" ? "new-password" : "current-password"}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </label>
                {errorText ? (
                  <p className="join-error" role="alert">
                    {errorText}
                  </p>
                ) : null}
                <button className="join-submit login-submit" type="submit" disabled={pending || !authEnabled}>
                  {pending ? tx("กำลังดำเนินการ…", "Working…") : mode === "up" ? tx("ลงทะเบียน", "Register") : tx("เข้าสู่ระบบ", "Sign in")}
                </button>
              </form>
              <button
                className="login-switch"
                type="button"
                onClick={() => {
                  setMode(mode === "up" ? "in" : "up");
                  setError("");
                }}
              >
                {mode === "up" ? tx("มีบัญชีแล้ว? เข้าสู่ระบบ", "Already have an account? Sign in") : tx("ยังไม่มีบัญชี? ลงทะเบียน", "No account yet? Register")}
              </button>
              <button className="login-switch" type="button" onClick={() => setStep("choose")}>
                {tx("กลับไปเลือกวิธีลงชื่อ", "Back to sign-in options")}
              </button>
            </>
          )}
        </div>
      </main>
    </>
  );
}
