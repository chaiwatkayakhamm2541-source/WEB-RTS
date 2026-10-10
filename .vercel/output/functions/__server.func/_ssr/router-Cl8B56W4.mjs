import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, _ as createFileRoute, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, v as createRootRoute, x as useRouter, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as __exportAll } from "./ssr.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { n as SESSION_TOKEN_COOKIE, r as auth } from "./server-SQ3bWDH2.mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Cl8B56W4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
var KEY = "rts-lang";
var LangContext = (0, import_react.createContext)(null);
function LanguageProvider({ children }) {
	const [lang, setLangState] = (0, import_react.useState)("th");
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const saved = localStorage.getItem(KEY);
		if (saved === "en" || saved === "th") setLangState(saved);
		setReady(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		document.documentElement.lang = lang === "en" ? "en" : "th";
		localStorage.setItem(KEY, lang);
		const meta = document.querySelector("meta[name=\"description\"]");
		if (meta) meta.setAttribute("content", lang === "en" ? "RTS Battlefield — plan, rally, expand your realm, and plant your banner." : "เว็บสมรภูมิ RTS — วางแผน รวมพลัง ขยายอาณาจักร และปักธงเข้าสมรภูมิ");
	}, [lang, ready]);
	const value = {
		lang,
		setLang: setLangState,
		tx: (th, en) => lang === "en" ? en : th
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangContext.Provider, {
		value,
		children
	});
}
function useLang() {
	const value = (0, import_react.useContext)(LangContext);
	if (!value) throw new Error("useLang must be used inside LanguageProvider");
	return value;
}
function usePageTitle(th, en) {
	const { lang } = useLang();
	(0, import_react.useEffect)(() => {
		document.title = lang === "en" ? en : th;
	}, [
		lang,
		th,
		en
	]);
}
var SEASON_END = Date.parse("2026-10-13T11:00:00+07:00");
function countdownLabel(lang, days, hours, minutes, seconds, done) {
	if (done) return lang === "en" ? "Season 1 has ended" : "ซีซั่น 1 จบแล้ว";
	if (lang === "en") return `${days}d ${hours}h ${minutes}m ${seconds}s left`;
	return `เหลืออีก ${days} วัน ${hours} ชม. ${minutes} นาที ${seconds} วินาที`;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function LegalFooter() {
	const { tx } = useLang();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: "legal-foot",
		"aria-label": tx("เอกสารของชุมชน", "Community documents"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/privacy",
				children: tx("นโยบายความเป็นส่วนตัว", "Privacy policy")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				children: " · "
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/terms",
				children: tx("ข้อกำหนดสมาชิก", "Member terms")
			})
		]
	});
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-DZ4sf5QT.css";
var APP_NAME = "สมรภูมิ RTS";
var Route$11 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "เว็บสมรภูมิ RTS — วางแผน รวมพลัง ขยายอาณาจักร และปักธงเข้าสมรภูมิ"
			},
			{
				name: "theme-color",
				content: "#070605"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&family=Cinzel:wght@700;900&family=Figtree:wght@700;800&family=Noto+Sans+Thai:wght@400;500;600;900&family=Noto+Serif+Thai:wght@600;700&family=Russo+One&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "th",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LanguageProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegalFooter, {})] }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$8 = () => import("./routes-CJCEFTqt.mjs");
var Route$10 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./coffee-dSIYajmZ.mjs");
var Route$9 = createFileRoute("/coffee")({
	component: lazyRouteComponent($$splitComponentImporter$7, "component"),
	head: () => ({ meta: [{ title: "รายละเอียดค่ากาแฟ · สมรภูมิ RTS" }] })
});
var $$splitComponentImporter$6 = () => import("./guide-DqpqEcc_.mjs");
var Route$8 = createFileRoute("/guide")({
	component: lazyRouteComponent($$splitComponentImporter$6, "component"),
	head: () => ({ meta: [{ title: "Conquest of Nine Kingdoms · สมรภูมิ RTS" }] })
});
var $$splitComponentImporter$5 = () => import("./login-BtqrLc7_.mjs");
var Route$7 = createFileRoute("/login")({
	component: lazyRouteComponent($$splitComponentImporter$5, "component"),
	head: () => ({ meta: [{ title: "ลงชื่อ · สมรภูมิ RTS" }] })
});
var $$splitComponentImporter$4 = () => import("./privacy-D49Q2ae_.mjs");
var Route$6 = createFileRoute("/privacy")({
	component: lazyRouteComponent($$splitComponentImporter$4, "component"),
	head: () => ({ meta: [{ title: "นโยบายความเป็นส่วนตัว · สมรภูมิ RTS" }] })
});
var $$splitComponentImporter$3 = () => import("./register-evcvhPR2.mjs");
var Route$5 = createFileRoute("/register")({
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	head: () => ({ meta: [{ title: "ลงทะเบียน S2 · สมรภูมิ RTS" }] })
});
var $$splitComponentImporter$2 = () => import("./registrations-DVTff2Gx.mjs");
var Route$4 = createFileRoute("/registrations")({
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	head: () => ({ meta: [{ title: "รายละเอียดผู้ลงทะเบียน · สมรภูมิ RTS" }] })
});
var $$splitComponentImporter$1 = () => import("./s1-DG9W1bdK.mjs");
var Route$3 = createFileRoute("/s1")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	head: () => ({ meta: [{ title: "สรุป S1 · สมรภูมิ RTS" }] })
});
var $$splitComponentImporter = () => import("./terms-hjxRf57_.mjs");
var Route$2 = createFileRoute("/terms")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [{ title: "ข้อกำหนดสมาชิก · สมรภูมิ RTS" }] })
});
/**
* Live-preview sign-in popup — server-only (NEVER import from the client).
*
* The sandbox preview runs the app in a partitioned iframe, so OAuth must happen
* in a top-level popup (first-party cookies). This handler is the ENTIRE popup
* document — no React shell:
*
*   Phase 1 (`?providerId=…`): start OAuth server-side and 302 straight to the
*     broker / upstream login page. The popup never paints the app.
*   Phase 2 (`?done=1`): after the broker round-trip, emit a tiny HTML page that
*     posts the session token to the opener and closes. No SPA hydrate, no
*     server-fn round-trip.
*
* Wired automatically by the Vite `authPopupPlugin` in `vite.config.ts` during
* `npm run dev` (live preview). Do NOT create `src/routes/auth/popup.tsx` — a
* React route here paints the full app shell in the popup. The opener lives in
* `client.ts` (`signIn` → `openSignInPopup`).
*/
/**
* Handle `GET /auth/popup`. Invoked by the Vite `authPopupPlugin` (dev / live
* preview). Do not re-export this from a React route file.
*/
async function handleAuthPopupRequest(request) {
	const url = new URL(request.url);
	if (url.searchParams.get("done") === "1") {
		const errored = url.searchParams.has("error");
		const message = {
			source: "grok-auth-popup",
			token: errored ? null : readCookie(request, SESSION_TOKEN_COOKIE),
			...errored ? { error: url.searchParams.get("error") ?? "sign_in_failed" } : {}
		};
		return new Response(completionHtml(message), {
			status: 200,
			headers: {
				"content-type": "text/html; charset=utf-8",
				"cache-control": "no-store"
			}
		});
	}
	const providerId = url.searchParams.get("providerId")?.trim();
	if (!providerId) return new Response("Missing providerId", {
		status: 400,
		headers: { "content-type": "text/plain; charset=utf-8" }
	});
	const back = `${url.origin}/auth/popup?done=1`;
	try {
		const apiRes = await auth.api.signInWithOAuth2({
			body: {
				providerId,
				callbackURL: back,
				errorCallbackURL: `${back}&error=1`
			},
			headers: request.headers,
			asResponse: true
		});
		if (!apiRes.ok) return completionResponse({
			source: "grok-auth-popup",
			token: null,
			error: await apiRes.text().catch(() => "") || `oauth_init_failed_${apiRes.status}`
		});
		const location = (await apiRes.json().catch(() => null))?.url;
		if (!location) return completionResponse({
			source: "grok-auth-popup",
			token: null,
			error: "oauth_init_missing_url"
		});
		const headers = new Headers({
			location,
			"cache-control": "no-store"
		});
		for (const cookie of apiRes.headers.getSetCookie()) headers.append("set-cookie", cookie);
		return new Response(null, {
			status: 302,
			headers
		});
	} catch (err) {
		return completionResponse({
			source: "grok-auth-popup",
			token: null,
			error: err instanceof Error ? err.message : "oauth_init_threw"
		});
	}
}
function completionResponse(message) {
	return new Response(completionHtml(message), {
		status: 200,
		headers: {
			"content-type": "text/html; charset=utf-8",
			"cache-control": "no-store"
		}
	});
}
/** Minimal HTML: postMessage the token to the opener and close. No React. */
function completionHtml(message) {
	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Signing in…</title>
<style>
  html,body{margin:0;min-height:100%;background:#0b0b0c;color:#a1a1aa;
    font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
  main{min-height:100vh;display:grid;place-items:center;padding:1.5rem;text-align:center}
</style>
</head>
<body>
<main><p>Signing you in…</p></main>
<script type="application/json" id="grok-auth-popup-msg">${JSON.stringify(message).replace(/</g, "\\u003c")}<\/script>
<script>
(function () {
  var el = document.getElementById("grok-auth-popup-msg");
  var msg = { source: "grok-auth-popup", token: null };
  try { if (el && el.textContent) msg = JSON.parse(el.textContent); } catch (e) {}
  try {
    if (window.opener) {
      window.opener.postMessage(msg, window.location.origin);
      window.close();
      return;
    }
  } catch (e) {}
  if (msg.error) {
    var note = document.querySelector("main p");
    if (note) note.textContent = "Sign-in failed. Go back and try again.";
    return;
  }
  window.location.replace("/");
})();
<\/script>
</body>
</html>`;
}
/** Read a single cookie value from the request (handles `=` inside values). */
function readCookie(request, name) {
	const header = request.headers.get("cookie");
	if (!header) return null;
	for (const part of header.split(";")) {
		const trimmed = part.trim();
		if (!trimmed) continue;
		const eq = trimmed.indexOf("=");
		if (eq <= 0) continue;
		if (trimmed.slice(0, eq) !== name) continue;
		const raw = trimmed.slice(eq + 1);
		try {
			return decodeURIComponent(raw);
		} catch {
			return raw;
		}
	}
	return null;
}
var Route$1 = createFileRoute("/auth/popup")({ server: { handlers: { GET: ({ request }) => handleAuthPopupRequest(request) } } });
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var rootRouteChildren = {
	IndexRoute: Route$10.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$11
	}),
	CoffeeRoute: Route$9.update({
		id: "/coffee",
		path: "/coffee",
		getParentRoute: () => Route$11
	}),
	GuideRoute: Route$8.update({
		id: "/guide",
		path: "/guide",
		getParentRoute: () => Route$11
	}),
	LoginRoute: Route$7.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$11
	}),
	PrivacyRoute: Route$6.update({
		id: "/privacy",
		path: "/privacy",
		getParentRoute: () => Route$11
	}),
	RegisterRoute: Route$5.update({
		id: "/register",
		path: "/register",
		getParentRoute: () => Route$11
	}),
	RegistrationsRoute: Route$4.update({
		id: "/registrations",
		path: "/registrations",
		getParentRoute: () => Route$11
	}),
	S1Route: Route$3.update({
		id: "/s1",
		path: "/s1",
		getParentRoute: () => Route$11
	}),
	TermsRoute: Route$2.update({
		id: "/terms",
		path: "/terms",
		getParentRoute: () => Route$11
	}),
	AuthPopupRoute: Route$1.update({
		id: "/auth/popup",
		path: "/auth/popup",
		getParentRoute: () => Route$11
	}),
	ApiAuthSplatRoute: Route.update({
		id: "/api/auth/$",
		path: "/api/auth/$",
		getParentRoute: () => Route$11
	})
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { usePageTitle as a, useLang as i, SEASON_END as n, countdownLabel as r, router_exports as t };
