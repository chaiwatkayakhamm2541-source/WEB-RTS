import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-BmV_dmCM.mjs";
import { t as GROK_PROVIDERS } from "./server-SQ3bWDH2.mjs";
import { a as usePageTitle, i as useLang } from "./router-Cl8B56W4.mjs";
import { n as SiteHeader } from "./site-page-jwH4mGfv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BtqrLc7_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var google = GROK_PROVIDERS.find((provider) => provider.idp === "google");
function errorCode(message) {
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
	const [step, setStep] = (0, import_react.useState)("choose");
	const [mode, setMode] = (0, import_react.useState)("up");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const errorText = error === "creds" ? tx("อีเมลหรือรหัสผ่านไม่ถูกต้อง", "Email or password is incorrect") : error === "exists" ? tx("อีเมลนี้ถูกใช้แล้ว", "This email is already in use") : error === "password" ? tx("รหัสผ่านต้องมีอย่างน้อย 8 ตัว", "Password must be at least 8 characters") : error === "email" ? tx("รูปแบบอีเมลไม่ถูกต้อง", "Email format is invalid") : error === "origin" ? tx("ไม่สามารถลงชื่อจากที่นี่ได้", "You cannot sign in from here") : error === "name" ? tx("กรุณากรอกชื่อ", "Please enter your name") : error === "need-email" ? tx("กรุณากรอกอีเมล", "Please enter your email") : error === "popup" ? tx("เบราว์เซอร์บล็อกหน้าต่างลงชื่อ อนุญาตป๊อปอัปแล้วลองอีกครั้ง", "The browser blocked the sign-in window. Allow pop-ups and try again") : error === "cancel" ? tx("ลงชื่อไม่สำเร็จ ลองอีกครั้ง", "Sign-in did not finish. Try again") : error === "fail" ? tx("ลงชื่อไม่สำเร็จ ลองอีกครั้ง", "Sign-in failed. Try again") : "";
	async function onSubmit(event) {
		event.preventDefault();
		setError("");
		if (!email.trim() || password.length < 8 || mode === "up" && !name.trim()) {
			setError(mode === "up" && !name.trim() ? "name" : password.length < 8 ? "password" : "need-email");
			return;
		}
		setPending(true);
		const result = mode === "up" ? await authClient.signUp.email({
			name: name.trim(),
			email: email.trim(),
			password,
			callbackURL: "/"
		}) : await authClient.signIn.email({
			email: email.trim(),
			password,
			callbackURL: "/"
		});
		setPending(false);
		if (result.error) {
			setError(errorCode(result.error.message ?? ""));
			return;
		}
		await navigate({ to: "/" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "register-page login-page",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "register-card login-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: tx("ลงทะเบียน", "Register") }), step === "choose" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "login-choices",
				children: [google ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "google-btn",
					type: "button",
					onClick: () => {
						setError("");
						signIn(google.providerId, { callbackURL: "/" }).catch((caught) => {
							const message = caught instanceof Error ? caught.message : "";
							if (/pop-up blocked/i.test(message)) setError("popup");
							else setError("cancel");
						});
					},
					children: tx("ลงทะเบียนด้วย Google", "Register with Google")
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "fine",
					children: tx("ระบบลงชื่อยังไม่เปิด", "Sign-in is not available yet")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "email-choice",
					type: "button",
					onClick: () => setStep("email"),
					children: tx("ลงทะเบียนด้วยอีเมล", "Register with email")
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: mode === "up" ? tx("ลงทะเบียนด้วยอีเมล", "Register with email") : tx("เข้าสู่ระบบด้วยอีเมล", "Sign in with email") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "join-form",
					onSubmit,
					children: [
						mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [tx("ชื่อ", "Name"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							autoComplete: "name",
							onChange: (event) => setName(event.target.value)
						})] }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [tx("อีเมล", "Email"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							value: email,
							autoComplete: "email",
							onChange: (event) => setEmail(event.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [tx("รหัสผ่าน", "Password"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							value: password,
							autoComplete: mode === "up" ? "new-password" : "current-password",
							onChange: (event) => setPassword(event.target.value)
						})] }),
						errorText ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "join-error",
							role: "alert",
							children: errorText
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "join-submit login-submit",
							type: "submit",
							disabled: pending || false,
							children: pending ? tx("กำลังดำเนินการ…", "Working…") : mode === "up" ? tx("ลงทะเบียน", "Register") : tx("เข้าสู่ระบบ", "Sign in")
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "login-switch",
					type: "button",
					onClick: () => {
						setMode(mode === "up" ? "in" : "up");
						setError("");
					},
					children: mode === "up" ? tx("มีบัญชีแล้ว? เข้าสู่ระบบ", "Already have an account? Sign in") : tx("ยังไม่มีบัญชี? ลงทะเบียน", "No account yet? Register")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "login-switch",
					type: "button",
					onClick: () => setStep("choose"),
					children: tx("กลับไปเลือกวิธีลงชื่อ", "Back to sign-in options")
				})
			] })]
		})
	})] });
}
//#endregion
export { LoginPage as component };
