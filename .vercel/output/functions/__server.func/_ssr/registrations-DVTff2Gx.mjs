import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as isOwnerEmail } from "./owner-VHsZlDO5.mjs";
import { a as usePageTitle, i as useLang } from "./router-Cl8B56W4.mjs";
import { n as SiteHeader, o as useCurrentUserState } from "./site-page-jwH4mGfv.mjs";
import { t as listRegistrations } from "./registrations-gTxoIMN2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/registrations-DVTff2Gx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PAGE_SIZE = 20;
function RegistrationsPage() {
	const { tx } = useLang();
	usePageTitle("รายละเอียดผู้ลงทะเบียน · สมรภูมิ RTS", "Registration details · RTS Battlefield");
	const { user, isPending } = useCurrentUserState();
	const owner = isOwnerEmail(user?.primaryEmail);
	const [rows, setRows] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(0);
	const [sessionSlow, setSessionSlow] = (0, import_react.useState)(false);
	const columns = [
		tx("ลำดับ", "No."),
		tx("ชื่อตัวละคร", "Character"),
		tx("ชื่อดิสคอร์ด", "Discord"),
		tx("เลข UID ในเกมส์", "In-game UID"),
		tx("พันธมิตร", "Alliance"),
		tx("เซิร์ฟเวอร์", "Server")
	];
	(0, import_react.useEffect)(() => {
		if (!isPending) {
			setSessionSlow(false);
			return;
		}
		const timer = window.setTimeout(() => setSessionSlow(true), 4e3);
		return () => window.clearTimeout(timer);
	}, [isPending]);
	(0, import_react.useEffect)(() => {
		if (!owner) return;
		let stop = false;
		const timer = window.setTimeout(() => {
			if (!stop) setError("timeout");
		}, 8e3);
		listRegistrations().then((data) => {
			if (!stop) {
				setError("");
				setRows(data);
			}
		}).catch(() => {
			if (!stop) setError("fail");
		}).finally(() => window.clearTimeout(timer));
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
	const errorText = error === "timeout" ? tx("โหลดรายชื่อไม่สำเร็จ ลองรีเฟรชหน้านี้", "Could not load the list. Refresh this page") : error === "fail" ? tx("ยังเปิดรายชื่อไม่ได้", "The list is not available yet") : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "register-page",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "register-card roster-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "frame-back",
					to: "/",
					children: tx("กลับ", "Back")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "roster-head",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: tx("รายละเอียดผู้ลงทะเบียน", "Registration details") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "roster-count",
						children: owner && rows ? tx(`ทั้งหมด ${total} คน`, `${total} people`) : owner ? tx("กำลังโหลดรายชื่อ", "Loading the list") : tx("รอข้อมูล", "Waiting for data")
					})]
				}),
				(!isPending || sessionSlow) && !owner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "roster-note",
					children: user ? tx("หน้านี้เปิดให้เจ้าของเว็บที่ลงชื่อด้วยอีเมลที่กำหนดเท่านั้น", "This page is only for site owners signed in with an approved email") : tx("กรุณาลงชื่อด้วยบัญชีเจ้าของเว็บก่อน แล้วเปิดหน้านี้อีกครั้ง", "Sign in with an owner account, then open this page again")
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "roster-wrap",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "roster",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: columns.map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: column }, column)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: errorText ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "roster-empty",
							colSpan: columns.length,
							children: errorText
						}) }) : !rows ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "roster-empty",
							colSpan: columns.length,
							children: tx("กำลังโหลดรายชื่อ", "Loading the list")
						}) }) : visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "roster-empty",
							colSpan: columns.length,
							children: tx("ยังไม่มีคนลงทะเบียน", "Nobody has registered yet")
						}) }) : visible.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "roster-no",
								children: start + index + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: row.character }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: row.discord }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: row.uid }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: row.alliance }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: row.server })
						] }, row.uid)) })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "roster-pager",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: safePage === 0,
							onClick: () => setPage(safePage - 1),
							children: tx("ก่อนหน้า", "Previous")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tx(`หน้า ${safePage + 1} / ${pages}`, `Page ${safePage + 1} / ${pages}`) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: safePage >= pages - 1,
							onClick: () => setPage(safePage + 1),
							children: tx("ถัดไป", "Next")
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "roster-back",
					to: "/",
					children: tx("กลับหน้าแรก", "Back to home")
				})
			]
		})
	})] });
}
//#endregion
export { RegistrationsPage as component };
