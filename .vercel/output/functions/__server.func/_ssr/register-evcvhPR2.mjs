import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as usePageTitle, i as useLang } from "./router-Cl8B56W4.mjs";
import { n as SiteHeader, t as SceneBackdrop } from "./site-page-jwH4mGfv.mjs";
import { n as submitRegistration } from "./registrations-gTxoIMN2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-evcvhPR2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var alliances = [
	"IMT",
	"FOX",
	"UNS"
];
var servers = Array.from({ length: 15 }, (_, index) => `S1-${String(index + 1).padStart(3, "0")}`);
var emptyForm = {
	character: "",
	discord: "",
	uid: "",
	alliance: "",
	server: ""
};
var fields = [
	{
		key: "character",
		th: "ชื่อตัวละคร",
		en: "Character name",
		kind: "text"
	},
	{
		key: "discord",
		th: "ชื่อดิสคอร์ด",
		en: "Discord name",
		kind: "text"
	},
	{
		key: "uid",
		th: "เลข UID ในเกมส์",
		en: "In-game UID",
		kind: "text"
	},
	{
		key: "alliance",
		th: "เข้าร่วมพันธมิตร",
		en: "Join an alliance",
		kind: "alliance"
	},
	{
		key: "server",
		th: "เลือกเซิร์ฟเวอร์",
		en: "Choose a server",
		kind: "server"
	}
];
var STORAGE_KEY = "rts-s2-v1";
function checked(value) {
	const next = {
		character: value.character.trim(),
		discord: value.discord.trim(),
		uid: value.uid.trim(),
		alliance: value.alliance.trim(),
		server: value.server.trim()
	};
	const allianceOk = alliances.includes(next.alliance);
	const serverOk = servers.includes(next.server);
	if (!next.character || !next.discord || !/^\d+$/.test(next.uid) || !allianceOk || !serverOk) return null;
	return next;
}
function problems(value) {
	const next = {
		character: value.character.trim(),
		discord: value.discord.trim(),
		uid: value.uid.trim(),
		alliance: value.alliance.trim(),
		server: value.server.trim()
	};
	const keys = [];
	if (!next.character) keys.push("character");
	if (!next.discord) keys.push("discord");
	if (!next.uid) keys.push("uid");
	else if (!/^\d+$/.test(next.uid)) keys.push("uid");
	if (!next.alliance) keys.push("alliance");
	else if (!alliances.includes(next.alliance)) keys.push("alliance");
	if (!next.server) keys.push("server");
	else if (!servers.includes(next.server)) keys.push("server");
	if (keys.length === 0) return null;
	return {
		keys,
		message: !next.character || !next.discord || !next.uid || !next.alliance || !next.server ? "incomplete" : keys.includes("uid") ? "uid" : "choice"
	};
}
function readSaved() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const data = JSON.parse(raw);
		return checked({
			character: typeof data.character === "string" ? data.character : "",
			discord: typeof data.discord === "string" ? data.discord : "",
			uid: typeof data.uid === "string" ? data.uid : "",
			alliance: typeof data.alliance === "string" ? data.alliance : "",
			server: typeof data.server === "string" ? data.server : ""
		});
	} catch {
		return null;
	}
}
function RegisterPage() {
	const { tx } = useLang();
	usePageTitle("ลงทะเบียน S2 · สมรภูมิ RTS", "Register S2 · RTS Battlefield");
	const [form, setForm] = (0, import_react.useState)(emptyForm);
	const [invalid, setInvalid] = (0, import_react.useState)([]);
	const [warning, setWarning] = (0, import_react.useState)("");
	const [done, setDone] = (0, import_react.useState)(false);
	const [attempt, setAttempt] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const saved = readSaved();
		if (!saved) return;
		setForm(saved);
		setDone(true);
	}, []);
	function update(key, value) {
		setForm((current) => ({
			...current,
			[key]: value
		}));
		setInvalid((current) => current.filter((item) => item !== key));
	}
	function reset() {
		setForm(emptyForm);
		setInvalid([]);
		setWarning("");
		setDone(false);
		localStorage.removeItem(STORAGE_KEY);
	}
	async function submit(event) {
		event.preventDefault();
		const found = problems(form);
		if (found) {
			setDone(false);
			setWarning(found.message);
			setInvalid(found.keys);
			setAttempt((value) => value + 1);
			const target = document.getElementById(`field-${found.keys[0]}`);
			target?.scrollIntoView({
				behavior: "smooth",
				block: "center"
			});
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
	const warningText = warning === "incomplete" ? tx("กรุณากรอกข้อมูลให้ครบถ้วน", "Please complete every field") : warning === "uid" ? tx("เลข UID ต้องเป็นตัวเลขเท่านั้น", "UID must be numbers only") : warning === "choice" ? tx("กรุณาเลือกจากรายการที่กำหนด", "Please choose from the list") : warning === "save" ? tx("บันทึกไม่สำเร็จ ลองอีกครั้ง", "Could not save. Try again") : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "register-page scene-page",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SceneBackdrop, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "register-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "frame-back",
					to: "/",
					children: tx("กลับ", "Back")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: tx("ลงทะเบียน S2", "Register S2") }),
				done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "register-done",
					id: "register-summary",
					role: "status",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "register-success",
							children: tx("ลงทะเบียนสำเร็จ", "Registration complete")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "lede",
							children: tx("สรุปข้อมูลที่ตรวจแล้ว", "Checked summary")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "register-summary",
							children: fields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: tx(field.th, field.en) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: form[field.key] })] }, field.key))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "check-list",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: tx("ชื่อตัวละครและชื่อดิสคอร์ดไม่ว่าง", "Character name and Discord name are filled in") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: tx("เลข UID เป็นตัวเลขเท่านั้น", "UID contains numbers only") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: tx("พันธมิตรเป็น IMT, FOX หรือ UNS", "Alliance is IMT, FOX, or UNS") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: tx("เซิร์ฟเวอร์อยู่ระหว่าง S1-001 ถึง S1-015", "Server is between S1-001 and S1-015") })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "join-cancel register-again",
							type: "button",
							onClick: reset,
							children: tx("ลงทะเบียนใหม่", "Register again")
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "join-form",
					onSubmit: submit,
					noValidate: true,
					children: [
						fields.map((field) => {
							const bad = invalid.includes(field.key);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								id: `field-${field.key}`,
								className: bad ? "field-bad" : void 0,
								children: [tx(field.th, field.en), field.kind === "text" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									inputMode: field.key === "uid" ? "numeric" : void 0,
									value: form[field.key],
									maxLength: 40,
									onChange: (event) => update(field.key, event.target.value)
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: form[field.key],
									onChange: (event) => update(field.key, event.target.value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: field.kind === "alliance" ? tx("เลื่อนเลือกพันธมิตร", "Scroll to choose an alliance") : tx("เลื่อนเลือกเซิร์ฟเวอร์", "Scroll to choose a server")
									}), (field.kind === "alliance" ? alliances : servers).map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: option,
										children: option
									}, option))]
								})]
							}, `${field.key}-${bad ? attempt : "ok"}`);
						}),
						warning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "join-error",
							role: "alert",
							children: warningText
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "join-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "join-submit",
								type: "submit",
								children: tx("ตกลง", "Confirm")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "join-cancel",
								type: "button",
								onClick: reset,
								children: tx("ยกเลิก", "Cancel")
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "register-back",
					to: "/",
					children: tx("กลับสู่สมรภูมิ", "Back to the battlefield")
				})
			]
		})]
	})] });
}
//#endregion
export { RegisterPage as component };
