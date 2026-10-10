import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { i as signOut, t as authClient } from "./client-BmV_dmCM.mjs";
import { t as authMiddleware } from "./middleware-C78tn_v0.mjs";
import { t as isOwnerEmail } from "./owner-VHsZlDO5.mjs";
import { t as formatBahtAmount } from "./slip-amount-DnHvMVXQ.mjs";
import { o as hasGateSessionMarker } from "./server-SQ3bWDH2.mjs";
import { a as usePageTitle, i as useLang, n as SEASON_END, r as countdownLabel } from "./router-Cl8B56W4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-page-jwH4mGfv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var ADS = [{
	src: "/scene/event-poster.jpg",
	alt: "ลกเอี๋ยง V2",
	href: "https://web.facebook.com/events/1072146978772337?post_id=1072147115438990&acontext=%7B%22event_action_history%22%3A[%7B%22surface%22%3A%22home%22%7D%2C%7B%22mechanism%22%3A%22attachment_media%22%2C%22surface%22%3A%22newsfeed%22%7D]%2C%22ref_notif_type%22%3Anull%7D&locale=th_TH"
}, {
	src: "/scene/ad-group.jpg",
	alt: "RTS Real-Time Strategy",
	href: "https://web.facebook.com/groups/1978623063057536?locale=th_TH"
}];
function AdPlaque() {
	const { tx: t } = useLang();
	const slides = [...ADS, ADS[0]];
	const [index, setIndex] = (0, import_react.useState)(0);
	const [animate, setAnimate] = (0, import_react.useState)(true);
	const page = index % ADS.length;
	(0, import_react.useEffect)(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const timer = window.setTimeout(() => {
			setAnimate(true);
			setIndex((current) => current + 1);
		}, 4800);
		return () => window.clearTimeout(timer);
	}, [index]);
	(0, import_react.useEffect)(() => {
		if (index < ADS.length) return;
		const timer = window.setTimeout(() => {
			setAnimate(false);
			setIndex(0);
		}, 560);
		return () => window.clearTimeout(timer);
	}, [index]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ad-plaque",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ad-kicker",
				children: t("ข่าวสาร Facebook", "Facebook news")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ad-frame",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ad-viewport",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: animate ? "ad-track" : "ad-track is-instant",
						style: { transform: `translateX(-${index * 100}%)` },
						children: slides.map((ad, slide) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "ad-slide",
							href: ad.href,
							target: "_blank",
							rel: "noopener noreferrer",
							tabIndex: slide === index ? 0 : -1,
							"aria-hidden": slide === index ? void 0 : true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: ad.src,
								alt: ad.alt === "ลกเอี๋ยง V2" ? t("ลกเอี๋ยง V2", "Lok Aiang V2") : ad.alt
							})
						}, `${ad.href}-${slide}`))
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ad-dots",
				children: ADS.map((ad, dot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: dot === page ? "ad-dot is-on" : "ad-dot",
					type: "button",
					"aria-label": t(`ข่าวสารหน้าที่ ${dot + 1}`, `News page ${dot + 1}`),
					"aria-current": dot === page ? "true" : void 0,
					onClick: () => {
						setAnimate(true);
						setIndex(dot);
					}
				}, ad.href))
			})
		]
	});
}
function BattleScene() {
	const { tx: t } = useLang();
	const stageRef = (0, import_react.useRef)(null);
	const { user } = useCurrentUserState();
	const owner = isOwnerEmail(user?.primaryEmail);
	(0, import_react.useEffect)(() => {
		const root = stageRef.current;
		if (!root) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		let tx = 0;
		let ty = 0;
		let cx = 0;
		let cy = 0;
		let raf = 0;
		const onMove = (event) => {
			tx = event.clientX / window.innerWidth - .5;
			ty = event.clientY / window.innerHeight - .5;
		};
		const loop = () => {
			cx += (tx - cx) * .06;
			cy += (ty - cy) * .06;
			root.style.setProperty("--px", cx.toFixed(4));
			root.style.setProperty("--py", cy.toFixed(4));
			raf = requestAnimationFrame(loop);
		};
		window.addEventListener("pointermove", onMove, { passive: true });
		raf = requestAnimationFrame(loop);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("pointermove", onMove);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "สนามรบ",
		className: "stage",
		ref: stageRef,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "parallax-bg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-clip",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						className: "bg-plate",
						src: "/scene/battlefield.jpg",
						alt: ""
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "scrim" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "godrays" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fire-glow" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "vignette" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeasonMark, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "knight-parallax",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: "knight",
					src: "/scene/zhouyu.webp?v=4",
					alt: t("จิวยี่ยืนเฝ้าสมรภูมิ", "Zhou Yu standing watch over the battlefield")
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grain" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmberField, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdPlaque, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hud",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "actions",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "cta-row",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "cta-frame cta-frame-gold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									className: "cta cta-gold",
									to: "/s1",
									children: t("สรุป S1", "S1 recap")
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "cta-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "cta-frame",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									className: "cta",
									to: "/register",
									children: t("ลงทะเบียน S2", "Register S2")
								})
							}), owner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								className: "detail-btn",
								to: "/registrations",
								children: t("รายละเอียด", "Details")
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "fine",
							children: t("สงครามเริ่มต้นแล้ว อนาคตอาณาจักร อยู่ในมือคุณ!", "The war has begun. The realm's future is in your hands!")
						})
					]
				})
			})
		]
	});
}
function SeasonMark() {
	const { lang } = useLang();
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	(0, import_react.useEffect)(() => {
		const timer = window.setInterval(() => setNow(Date.now()), 1e3);
		return () => window.clearInterval(timer);
	}, []);
	const left = Math.max(0, SEASON_END - now);
	const days = Math.floor(left / 864e5);
	const hours = Math.floor(left % 864e5 / 36e5);
	const minutes = Math.floor(left % 36e5 / 6e4);
	const seconds = Math.floor(left % 6e4 / 1e3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "season-mark",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mark-title",
				children: lang === "en" ? "SEASON RECAP" : "สรุปซีซั่น"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mark-count",
				suppressHydrationWarning: true,
				children: countdownLabel(lang, days, hours, minutes, seconds, left === 0)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mark-code",
				children: "S1"
			})
		]
	});
}
function EmberField() {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		let width = 0;
		let height = 0;
		let raf = 0;
		const motes = [];
		const sparks = [];
		const resize = () => {
			width = canvas.clientWidth;
			height = canvas.clientHeight;
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.max(1, Math.floor(width * dpr));
			canvas.height = Math.max(1, Math.floor(height * dpr));
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		const seedMotes = () => {
			motes.length = 0;
			const count = width < 700 ? 18 : 32;
			for (let i = 0; i < count; i += 1) motes.push({
				x: Math.random() * width,
				y: Math.random() * height,
				r: .8 + Math.random() * 2.1,
				phase: Math.random() * Math.PI * 2,
				speed: .35 + Math.random() * .55,
				sway: 10 + Math.random() * 22,
				lift: 8 + Math.random() * 16,
				hue: 24 + Math.random() * 28,
				alpha: .25 + Math.random() * .45
			});
		};
		const spawnSpark = (initial = false) => {
			const roll = Math.random();
			const kind = roll > .86 ? "streak" : roll > .62 ? "ash" : "ember";
			const fromRight = Math.random() > .35;
			sparks.push({
				x: fromRight ? width * (.35 + Math.random() * .65) : Math.random() * width,
				y: initial ? Math.random() * height : height + 6,
				vx: (Math.random() - .45) * (kind === "streak" ? 50 : 18),
				vy: kind === "streak" ? -(90 + Math.random() * 80) : kind === "ash" ? -(14 + Math.random() * 16) : -(28 + Math.random() * 46),
				life: kind === "streak" ? .45 + Math.random() * .4 : 3.2 + Math.random() * 3.4,
				max: 0,
				w: kind === "ash" ? 1.6 + Math.random() * 2.2 : .7 + Math.random() * 1.5,
				kind
			});
			const spark = sparks[sparks.length - 1];
			spark.max = spark.life;
			if (initial) spark.life = Math.random() * spark.max;
		};
		resize();
		seedMotes();
		const seedCount = width < 700 ? 28 : 54;
		for (let i = 0; i < seedCount; i += 1) spawnSpark(true);
		const observer = new ResizeObserver(() => {
			resize();
			seedMotes();
		});
		observer.observe(canvas);
		let last = performance.now();
		const tick = (now) => {
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			const time = now / 1e3;
			ctx.clearRect(0, 0, width, height);
			for (const mote of motes) {
				const x = mote.x + Math.sin(time * mote.speed + mote.phase) * mote.sway;
				const y = mote.y + Math.cos(time * mote.speed * .8 + mote.phase) * mote.lift;
				ctx.beginPath();
				ctx.fillStyle = `hsla(${mote.hue}, 90%, 68%, ${mote.alpha})`;
				ctx.arc(x, y, mote.r, 0, Math.PI * 2);
				ctx.fill();
			}
			const cap = width < 700 ? 40 : 70;
			if (sparks.length < cap && Math.random() < .7) spawnSpark(false);
			for (let i = sparks.length - 1; i >= 0; i -= 1) {
				const spark = sparks[i];
				spark.life -= dt;
				if (spark.life <= 0) {
					sparks.splice(i, 1);
					continue;
				}
				spark.x += spark.vx * dt;
				spark.y += spark.vy * dt;
				spark.vx *= .99;
				const fade = Math.max(0, spark.life / spark.max);
				if (spark.kind === "streak") {
					ctx.strokeStyle = `hsla(32, 100%, 72%, ${fade})`;
					ctx.lineWidth = spark.w;
					ctx.beginPath();
					ctx.moveTo(spark.x, spark.y);
					ctx.lineTo(spark.x - spark.vx * .08, spark.y - spark.vy * .08);
					ctx.stroke();
				} else {
					const light = spark.kind === "ash" ? 78 : 62;
					const alpha = fade * (spark.kind === "ash" ? .35 : .85);
					ctx.beginPath();
					ctx.fillStyle = `hsla(${spark.kind === "ash" ? 28 : 22}, 95%, ${light}%, ${alpha})`;
					ctx.arc(spark.x, spark.y, spark.w, 0, Math.PI * 2);
					ctx.fill();
				}
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => {
			cancelAnimationFrame(raf);
			observer.disconnect();
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		className: "embers",
		"aria-hidden": "true"
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function cleanName(value) {
	const name = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
	if (name.length < 1 || name.length > 48) return "";
	return name;
}
function cleanProfile(data) {
	if (!data || typeof data !== "object") return null;
	const row = data;
	const name = cleanName(row.name);
	if (!name) return null;
	if (row.image == null || row.image === "") return {
		name,
		image: null
	};
	if (typeof row.image !== "string" || !row.image.startsWith("data:image/jpeg;base64,")) return null;
	return {
		name,
		image: row.image
	};
}
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9127db612637fd95c76b6b1a0d95e5c0dd7fcd6f98feeb020f98278811c51c63"));
var saveMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).inputValidator((data) => cleanProfile(data) ?? {
	name: "",
	image: null
}).handler(createSsrRpc("39418c55286ff0aeac7d639c6187fd85d88510a23d881248b6bdd21ce02ee68a"));
function ProfileDrawer({ open, name, email, photo, onClose, onSaved }) {
	const { tx } = useLang();
	const fileRef = (0, import_react.useRef)(null);
	const [draftName, setDraftName] = (0, import_react.useState)(name);
	const [draftPhoto, setDraftPhoto] = (0, import_react.useState)(photo);
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const wasOpen = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (open && !wasOpen.current) {
			setDraftName(name);
			setDraftPhoto(photo);
			setNote("");
		}
		wasOpen.current = open;
	}, [
		open,
		name,
		photo
	]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (event) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);
	if (!open) return null;
	async function onPick(file) {
		if (!file) return;
		setNote("");
		try {
			setDraftPhoto(await portraitDataUrl(file));
		} catch {
			setNote(tx("ใช้รูป jpg หรือ png", "Use a jpg or png photo"));
		}
	}
	async function onSubmit(event) {
		event.preventDefault();
		const nextName = draftName.trim().replace(/\s+/g, " ");
		if (nextName.length < 1 || nextName.length > 48) {
			setNote(tx("ชื่อต้องมี 1–48 ตัวอักษร", "Use 1–48 characters"));
			return;
		}
		setBusy(true);
		setNote("");
		try {
			const image = draftPhoto?.startsWith("data:image/jpeg;base64,") ? draftPhoto : null;
			if ((await authClient.updateUser({ name: nextName })).error) {
				setNote(tx("เปลี่ยนชื่อไม่สำเร็จ ลองอีกครั้ง", "Could not change the name. Try again"));
				return;
			}
			if (!(await saveMyProfile({ data: {
				name: nextName,
				image
			} })).ok) {
				setNote(tx("บันทึกไม่สำเร็จ ลองอีกครั้ง", "Could not save. Try again"));
				return;
			}
			onSaved({
				name: nextName,
				photo: image ?? photo
			});
			window.dispatchEvent(new Event("coffee-updated"));
			setNote(tx("บันทึกแล้ว", "Saved"));
		} catch {
			setNote(tx("บันทึกไม่สำเร็จ ลองอีกครั้ง", "Could not save. Try again"));
		} finally {
			setBusy(false);
		}
	}
	const initial = (draftName || name || "?").charAt(0).toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "profile-drawer",
		role: "presentation",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "profile-backdrop",
			type: "button",
			"aria-label": tx("ปิด", "Close"),
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "profile-sheet",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "profile-title",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "profile-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "profile-title",
					children: tx("โปรไฟล์", "Profile")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "profile-close",
					type: "button",
					onClick: onClose,
					children: tx("ปิด", "Close")
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "profile-form",
				onSubmit: (event) => void onSubmit(event),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "profile-photo-btn",
						type: "button",
						onClick: () => fileRef.current?.click(),
						children: draftPhoto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							className: "profile-photo",
							src: draftPhoto,
							alt: ""
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "profile-photo profile-fallback",
							children: initial
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: "image/*",
						hidden: true,
						onChange: (event) => {
							const file = event.target.files?.[0];
							event.target.value = "";
							onPick(file);
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "profile-change",
						type: "button",
						onClick: () => fileRef.current?.click(),
						children: tx("เปลี่ยนรูป", "Change photo")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [tx("ชื่อ", "Name"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: draftName,
						maxLength: 48,
						autoComplete: "nickname",
						onChange: (event) => setDraftName(event.target.value)
					})] }),
					email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "profile-email",
						children: email
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "profile-hint",
						children: tx("ชื่อนี้แสดงบนบอร์ดค่ากาแฟ", "This name shows on the coffee board")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "profile-save",
						type: "submit",
						disabled: busy,
						children: busy ? tx("กำลังบันทึก", "Saving") : tx("บันทึก", "Save")
					}),
					note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "profile-note",
						children: note
					}) : null
				]
			})]
		})]
	});
}
async function portraitDataUrl(file) {
	const bitmap = await createImageBitmap(file);
	const longest = Math.max(bitmap.width, bitmap.height);
	const scale = Math.min(1, 256 / longest);
	const width = Math.max(1, Math.round(bitmap.width * scale));
	const height = Math.max(1, Math.round(bitmap.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const context = canvas.getContext("2d");
	if (!context) throw new Error("canvas");
	context.drawImage(bitmap, 0, 0, width, height);
	bitmap.close();
	const blob = await new Promise((resolve, reject) => {
		canvas.toBlob((value) => value ? resolve(value) : reject(/* @__PURE__ */ new Error("blob")), "image/jpeg", .82);
	});
	const bytes = new Uint8Array(await blob.arrayBuffer());
	if (bytes.length > 12e4) throw new Error("large");
	return `data:image/jpeg;base64,${bytesToBase64$1(bytes)}`;
}
function bytesToBase64$1(bytes) {
	let text = "";
	const chunk = 8192;
	for (let index = 0; index < bytes.length; index += chunk) text += String.fromCharCode(...bytes.subarray(index, index + chunk));
	return btoa(text);
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
function sharpAvatar(url) {
	return url.replace(/=s\d+(-[a-z])?(?=$|[?#])/i, "=s256-c");
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const { tx } = useLang();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const [profileOpen, setProfileOpen] = (0, import_react.useState)(false);
	const [customImage, setCustomImage] = (0, import_react.useState)(null);
	const [customName, setCustomName] = (0, import_react.useState)(null);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	const userId = user?.id;
	const devFallback = user?.isDevFallback;
	(0, import_react.useEffect)(() => {
		if (!userId || devFallback) return;
		let cancel = false;
		getMyProfile().then((profile) => {
			if (!cancel && profile.image) setCustomImage(profile.image);
		}).catch(() => void 0);
		return () => {
			cancel = true;
		};
	}, [userId, devFallback]);
	if (!user) return null;
	const label = customName ?? user.displayName ?? user.primaryEmail ?? "Account";
	const sessionPhoto = user.profileImageUrl ? sharpAvatar(user.profileImageUrl) : null;
	const photo = customImage ?? sessionPhoto;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "account-chip",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "account-photo-btn",
				type: "button",
				"aria-label": tx("โปรไฟล์", "Profile"),
				"aria-expanded": profileOpen,
				onClick: () => setProfileOpen(true),
				children: photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: "account-photo",
					src: photo,
					alt: "",
					referrerPolicy: "no-referrer"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "account-photo account-fallback",
					"aria-hidden": "true",
					children: label.charAt(0).toUpperCase()
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "account-name",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "account-out",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				children: signingOut ? tx("กำลังออก…", "Signing out…") : tx("ออก", "Sign out")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileDrawer, {
				open: profileOpen,
				name: label,
				email: user.primaryEmail ?? "",
				photo,
				onClose: () => setProfileOpen(false),
				onSaved: ({ name, photo: nextPhoto }) => {
					setCustomName(name);
					if (nextPhoto) setCustomImage(nextPhoto);
				}
			})
		]
	});
}
function clean(data) {
	if (!data || typeof data !== "object") return null;
	const row = data;
	const imageHash = typeof row.imageHash === "string" ? row.imageHash.trim().toLowerCase() : "";
	const image = typeof row.image === "string" ? row.image.replace(/\s/g, "") : "";
	if (!/^[a-f0-9]{64}$/.test(imageHash)) return null;
	if (image.length < 100 || image.length > 16e5 || !/^[A-Za-z0-9+/]+={0,2}$/.test(image)) return null;
	return {
		imageHash,
		image
	};
}
var listCoffee = createServerFn({ method: "GET" }).handler(createSsrRpc("8a874b03f5b854b22afc1e5c6cfb593a614267bc413ec1750180aabe5e0bc96d"));
var listCoffeeAccounts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("a0447c38d8569780af6c7e6ddc17ac7f0c0cd4c457258dcc0597ba526029a8d2"));
var submitCoffee = createServerFn({ method: "POST" }).middleware([authMiddleware]).inputValidator((data) => clean(data) ?? {
	imageHash: "",
	image: ""
}).handler(createSsrRpc("b4e9a7960fe4bd3b7585c85df86c39d000404f1c7094f0d44020e16b32c361ff"));
function SceneBackdrop() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "scene-bg",
			"aria-hidden": "true"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			className: "scene-knight",
			src: "/scene/zhouyu.webp?v=4",
			alt: ""
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "scroll-fade",
			"aria-hidden": "true"
		})
	] });
}
function SiteHeader() {
	const { tx } = useLang();
	const [payOpen, setPayOpen] = (0, import_react.useState)(false);
	const [thanks, setThanks] = (0, import_react.useState)(false);
	const [thanksAmount, setThanksAmount] = (0, import_react.useState)(null);
	const [ranks, setRanks] = (0, import_react.useState)([]);
	const reloadCoffee = (0, import_react.useCallback)(() => {
		listCoffee().then(setRanks).catch(() => setRanks([]));
	}, []);
	(0, import_react.useEffect)(() => {
		reloadCoffee();
		const onUpdate = () => reloadCoffee();
		window.addEventListener("coffee-updated", onUpdate);
		return () => window.removeEventListener("coffee-updated", onUpdate);
	}, [reloadCoffee]);
	(0, import_react.useEffect)(() => {
		if (!thanks) return;
		const timer = window.setTimeout(() => setThanks(false), 2200);
		return () => window.clearTimeout(timer);
	}, [thanks]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "site-nav",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "nav-brand",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "nav-logo-link",
					type: "button",
					"aria-label": tx("กลับหน้าหลัก", "Back to home"),
					onClick: () => {
						if (window.location.pathname === "/") window.location.reload();
						else window.location.assign("/");
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						className: "nav-logo",
						src: "/scene/emblem.png",
						alt: ""
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "nav-name",
					children: "RTS : REAL-TIME STRATEGY COMMUNITY (TH)"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "nav-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuideMenu, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanMenu, { onOpen: () => setPayOpen(true) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "nav-tools",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangSwitch, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						className: "facebook-btn",
						href: "https://web.facebook.com/profile.php?id=61595042515587&locale=th_TH",
						target: "_blank",
						rel: "noopener noreferrer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							viewBox: "0 0 24 24",
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								fill: "currentColor",
								d: "M9.2 21.5h4v-8.01h3.6l.4-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.4 3.98h2.4v8.01Z"
							})
						}), "FACEBOOK"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						className: "discord-btn",
						href: "https://discord.gg/rtsslgth",
						target: "_blank",
						rel: "noopener noreferrer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							viewBox: "0 0 127.14 96.36",
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								fill: "currentColor",
								d: "M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.25 8.09C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.16ZM42.45 65.69C36.18 65.69 31 60 31 53s5-12.74 11.43-12.74S54 46 53.89 53 48.84 65.69 42.45 65.69Zm42.24 0C78.41 65.69 73.25 60 73.25 53s5-12.74 11.44-12.74S96.23 46 96.12 53 91.08 65.69 84.69 65.69Z"
							})
						}), "DISCORD"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, {})
				]
			}),
			payOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayModal, {
				onClose: () => setPayOpen(false),
				onSent: (amount) => {
					reloadCoffee();
					setPayOpen(false);
					setThanksAmount(amount);
					setThanks(true);
				}
			}) : null,
			thanks ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "thanks-mark",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tx("ขอบคุณ", "Thank you") }), thanksAmount != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "thanks-amount",
					children: tx(`${formatBahtAmount(thanksAmount)} บาท`, `${formatBahtAmount(thanksAmount)} THB`)
				}) : null]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoffeeBoard, { ranks })
		]
	});
}
function CoffeeBoard({ ranks }) {
	const { tx } = useLang();
	const slots = Array.from({ length: 5 }, (_, index) => ranks[index] ?? null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "coffee-board",
		"aria-label": tx("ค่ากาแฟ", "Coffee"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: tx("ค่ากาแฟ", "Coffee") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", { children: slots.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: index === 0 ? "is-top" : void 0,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "coffee-no",
				children: index + 1
			}), row ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "coffee-who",
				children: row.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "coffee-pay",
				children: tx(`ค่ากาแฟ ${formatBahtAmount(row.amount)} บาท`, `${formatBahtAmount(row.amount)} THB`)
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "-" })]
		}, index)) })]
	});
}
function PayModal({ onClose, onSent }) {
	const { tx } = useLang();
	const { user } = useCurrentUserState();
	const [file, setFile] = (0, import_react.useState)(null);
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const sending = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	async function sendSlip(nextFile) {
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
			const result = await submitCoffee({ data: await slipPayload(chosen) });
			if (!result.ok) {
				setNote(result.error === "unread" ? tx("อ่านจำนวนเงินจากสลิปไม่ได้ ถ่ายให้เห็นยอดชัดๆ", "Could not read the amount. Photograph the total clearly") : result.error === "duplicate" ? tx("ส่งรูปนี้ไปแล้ว ไม่สามารถส่งซ้ำได้", "This image was already sent") : tx("ส่งไม่สำเร็จ ลองเลือกรูปอีกครั้ง", "Could not send. Choose the image again"));
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pay-modal",
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "pay-title",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "pay-backdrop",
			type: "button",
			"aria-label": tx("ปิด", "Close"),
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pay-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "pay-close",
					type: "button",
					onClick: onClose,
					children: tx("ปิด", "Close")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "pay-title",
					children: tx("แสกนแล้วรวย", "Scan and win")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "pay-lead",
					children: tx("ชิตังเมโป้งรวย เฮง เฮง เฮง", "Scan, pay, and prosper")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: "pay-qr",
					src: "/scene/promptpay.png?v=2",
					alt: tx("คิวอาร์โค้ดพร้อมเพย์", "PromptPay QR code")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "pay-steps",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: tx("เปิดแอปธนาคาร", "Open your banking app") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: tx("กดสแกน QR Code", "Tap Scan QR Code") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: tx("สแกนรูปนี้ แล้วตรวจยอดก่อนยืนยัน", "Scan this image and check the amount before confirming") })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "pay-form",
					onSubmit: (event) => {
						event.preventDefault();
						sendSlip();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "pay-file",
							children: [tx("แนบรูปสลิป", "Attach slip"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "image/*",
								onChange: (event) => {
									const next = event.target.files?.[0] ?? null;
									setFile(next);
									if (next) sendSlip(next);
								}
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "pay-hint",
							children: tx("เลือกรูปสลิปแล้ว ระบบอ่านยอดให้อัตโนมัติ", "Choose a slip and the amount is read automatically")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "pay-send",
							type: "submit",
							disabled: busy,
							children: busy ? tx("กำลังอ่านยอด", "Reading") : tx("ส่ง", "Send")
						}),
						note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "pay-note",
							children: note
						}) : null
					]
				})
			]
		})]
	});
}
async function slipPayload(file) {
	const blob = await compressSlip(file);
	const bytes = new Uint8Array(await blob.arrayBuffer());
	if (bytes.length > 11e5) throw new Error("large");
	return {
		imageHash: await hashBytes(bytes),
		image: bytesToBase64(bytes)
	};
}
function bytesToBase64(bytes) {
	let text = "";
	for (let index = 0; index < bytes.length; index += 8192) text += String.fromCharCode(...bytes.subarray(index, index + 8192));
	return btoa(text);
}
async function compressSlip(file) {
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
	let quality = .82;
	let blob = await canvasToBlob(canvas, quality);
	while (blob.size > 9e5 && quality > .52) {
		quality -= .1;
		blob = await canvasToBlob(canvas, quality);
	}
	return blob;
}
function canvasToBlob(canvas, quality) {
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => blob ? resolve(blob) : reject(/* @__PURE__ */ new Error("blob")), "image/jpeg", quality);
	});
}
async function hashBytes(bytes) {
	const digest = await crypto.subtle.digest("SHA-256", bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
	return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
function ScanMenu({ onOpen }) {
	const { tx } = useLang();
	const { user } = useCurrentUserState();
	const owner = isOwnerEmail(user?.primaryEmail);
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: open ? "scan-menu is-open" : "scan-menu",
		onMouseEnter: () => {
			if (owner) setOpen(true);
		},
		onMouseLeave: () => setOpen(false),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "scan-btn",
			type: "button",
			"aria-expanded": open,
			onClick: () => {
				if (owner && !open) {
					setOpen(true);
					return;
				}
				onOpen();
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tx("แสกนแล้ว", "SCAN") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "scan-rich",
				children: tx("รวย", "WIN")
			})]
		}), owner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "guide-drop scan-drop",
			role: "menu",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/coffee",
				role: "menuitem",
				children: tx("รายละเอียดค่ากาแฟ", "Coffee details")
			})
		}) : null]
	});
}
function GuideMenu() {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: open ? "guide-menu is-open" : "guide-menu",
		onMouseEnter: () => setOpen(true),
		onMouseLeave: () => setOpen(false),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "guide-btn",
			type: "button",
			"aria-expanded": open,
			onClick: () => setOpen((value) => !value),
			children: "GUIDE"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "guide-drop",
			role: "menu",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/guide/index.html",
				role: "menuitem",
				children: "Conquest of Nine Kingdoms"
			})
		})]
	});
}
function AuthSlot() {
	const { tx } = useLang();
	const { user } = useCurrentUserState();
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "auth-user",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		className: "signin-btn",
		to: "/login",
		children: tx("ลงชื่อ", "Sign in")
	});
}
function LangSwitch() {
	const { lang, setLang, tx } = useLang();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lang-switch",
		role: "group",
		"aria-label": tx("เลือกภาษา", "Choose language"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: lang === "th" ? "is-on" : void 0,
				onClick: () => setLang("th"),
				children: "TH"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				children: "/"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: lang === "en" ? "is-on" : void 0,
				onClick: () => setLang("en"),
				children: "ENG"
			})
		]
	});
}
function SitePage() {
	usePageTitle("สมรภูมิ RTS", "RTS Battlefield");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BattleScene, {}) })] });
}
//#endregion
export { listCoffeeAccounts as a, createSsrRpc as i, SiteHeader as n, useCurrentUserState as o, SitePage as r, SceneBackdrop as t };
