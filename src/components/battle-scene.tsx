import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SEASON_END, countdownLabel, useLang } from "@/lib/i18n";
import { isOwnerEmail } from "@/lib/owner";

export const banners = [
  { src: "/discord-banner.jpg", name: "discord-banner-960x540.jpg", title: "แบนเนอร์ Discord", size: "960×540" },
  { src: "/og.jpg", name: "preview-1200x630.jpg", title: "รูปพรีวิว", size: "1200×630" },
  { src: "/x-banner.jpg", name: "x-banner-1200x264.jpg", title: "แบนเนอร์ X", size: "1200×264" },
] as const;

export const STORAGE_KEY = "rts-enlist-v1";

export type Enlist = { name: string; realm: string };

export function readEnlist(): Enlist | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<Enlist>;
    if (typeof data.name === "string" && typeof data.realm === "string" && data.name && data.realm) {
      return { name: data.name, realm: data.realm };
    }
  } catch {
    return null;
  }
  return null;
}

export async function saveBanner(src: string, filename: string) {
  const response = await fetch(src);
  if (!response.ok) throw new Error("missing");
  const blob = await response.blob();
  const file = new File([blob], filename, { type: "image/jpeg" });
  const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: filename });
    return "เปิดแผงแชร์แล้ว เลือกเก็บลงรูปภาพ";
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  return "ถ้าไฟล์ไม่เข้าคลังรูป ให้กดค้างที่รูปแล้วเลือกบันทึกรูป";
}

const ADS = [
  {
    src: "/scene/event-poster.jpg",
    alt: "ลกเอี๋ยง V2",
    href: "https://web.facebook.com/events/1072146978772337?post_id=1072147115438990&acontext=%7B%22event_action_history%22%3A[%7B%22surface%22%3A%22home%22%7D%2C%7B%22mechanism%22%3A%22attachment_media%22%2C%22surface%22%3A%22newsfeed%22%7D]%2C%22ref_notif_type%22%3Anull%7D&locale=th_TH",
  },
  {
    src: "/scene/ad-group.jpg",
    alt: "RTS Real-Time Strategy",
    href: "https://web.facebook.com/groups/1978623063057536?locale=th_TH",
  },
] as const;

function AdPlaque() {
  const { tx: t } = useLang();
  const slides = [...ADS, ADS[0]];
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const page = index % ADS.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => {
      setAnimate(true);
      setIndex((current) => current + 1);
    }, 4800);
    return () => window.clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (index < ADS.length) return;
    const timer = window.setTimeout(() => {
      setAnimate(false);
      setIndex(0);
    }, 560);
    return () => window.clearTimeout(timer);
  }, [index]);

  return (
    <div className="ad-plaque">
      <span className="ad-kicker">{t("ข่าวสาร Facebook", "Facebook news")}</span>
      <div className="ad-frame">
        <div className="ad-viewport">
          <div
            className={animate ? "ad-track" : "ad-track is-instant"}
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((ad, slide) => (
              <a
                key={`${ad.href}-${slide}`}
                className="ad-slide"
                href={ad.href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={slide === index ? 0 : -1}
                aria-hidden={slide === index ? undefined : true}
              >
                <img src={ad.src} alt={ad.alt === "ลกเอี๋ยง V2" ? t("ลกเอี๋ยง V2", "Lok Aiang V2") : ad.alt} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="ad-dots">
        {ADS.map((ad, dot) => (
          <button
            key={ad.href}
            className={dot === page ? "ad-dot is-on" : "ad-dot"}
            type="button"
            aria-label={t(`ข่าวสารหน้าที่ ${dot + 1}`, `News page ${dot + 1}`)}
            aria-current={dot === page ? "true" : undefined}
            onClick={() => {
              setAnimate(true);
              setIndex(dot);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function BattleScene() {
  const { tx: t } = useLang();
  const stageRef = useRef<HTMLElement>(null);
  const { user } = useCurrentUserState();
  const owner = isOwnerEmail(user?.primaryEmail);

  useEffect(() => {
    const root = stageRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      tx = event.clientX / window.innerWidth - 0.5;
      ty = event.clientY / window.innerHeight - 0.5;
    };

    const loop = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
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

  return (
    <section id="สนามรบ" className="stage" ref={stageRef}>
      <div className="parallax-bg">
        <div className="bg-clip">
          <img className="bg-plate" src="/scene/battlefield.jpg" alt="" />
        </div>
      </div>
      <div className="scrim" />
      <div className="godrays" />
      <div className="fire-glow" />
      <div className="vignette" />
      <SeasonMark />
      <div className="knight-parallax">
        <img className="knight" src="/scene/zhouyu.webp?v=4" alt={t("จิวยี่ยืนเฝ้าสมรภูมิ", "Zhou Yu standing watch over the battlefield")} />
      </div>
      <div className="grain" />
      <EmberField />

      <AdPlaque />

      <div className="hud">
        <div className="actions">
          <div className="cta-row">
            <span className="slant-wrap">
              <i className="cn-c tl" aria-hidden="true" />
              <i className="cn-c tr" aria-hidden="true" />
              <i className="cn-c bl" aria-hidden="true" />
              <i className="cn-c br" aria-hidden="true" />
              <span className="cta-frame cta-frame-gold">
                <Link className="cta cta-gold" to="/s1">
                  {t("สรุป S1", "S1 recap")}
                </Link>
              </span>
            </span>
          </div>
          <div className="cta-row">
            <span className="slant-wrap">
              <i className="cn-c tl" aria-hidden="true" />
              <i className="cn-c tr" aria-hidden="true" />
              <i className="cn-c bl" aria-hidden="true" />
              <i className="cn-c br" aria-hidden="true" />
              <span className="cta-frame">
                <Link className="cta" to="/register">
                  {t("ลงทะเบียน S2", "Register S2")}
                </Link>
              </span>
            </span>
            {owner ? (
              <Link className="detail-btn" to="/registrations">
                {t("รายละเอียด", "Details")}
              </Link>
            ) : null}
          </div>
          <p className="fine">{t("สงครามเริ่มต้นแล้ว อนาคตอาณาจักร อยู่ในมือคุณ!", "The war has begun. The realm's future is in your hands!")}</p>
        </div>
      </div>
    </section>
  );
}

function SeasonMark() {
  const { lang } = useLang();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const left = Math.max(0, SEASON_END - now);
  const days = Math.floor(left / 86_400_000);
  const hours = Math.floor((left % 86_400_000) / 3_600_000);
  const minutes = Math.floor((left % 3_600_000) / 60_000);
  const seconds = Math.floor((left % 60_000) / 1000);

  return (
    <div className="season-mark" aria-hidden="true">
      <p className="mark-title">{lang === "en" ? "SEASON RECAP" : "สรุปซีซั่น"}</p>
      <p className="mark-count" suppressHydrationWarning>{countdownLabel(lang, days, hours, minutes, seconds, left === 0)}</p>
      <p className="mark-code">S1</p>
    </div>
  );
}

type Mote = {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
  sway: number;
  lift: number;
  hue: number;
  alpha: number;
};

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  w: number;
  kind: "ember" | "ash" | "streak";
};

function EmberField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    const motes: Mote[] = [];
    const sparks: Spark[] = [];

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
      for (let i = 0; i < count; i += 1) {
        motes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.8 + Math.random() * 2.1,
          phase: Math.random() * Math.PI * 2,
          speed: 0.35 + Math.random() * 0.55,
          sway: 10 + Math.random() * 22,
          lift: 8 + Math.random() * 16,
          hue: 24 + Math.random() * 28,
          alpha: 0.25 + Math.random() * 0.45,
        });
      }
    };

    const spawnSpark = (initial = false) => {
      const roll = Math.random();
      const kind = roll > 0.86 ? "streak" : roll > 0.62 ? "ash" : "ember";
      const fromRight = Math.random() > 0.35;
      sparks.push({
        x: fromRight ? width * (0.35 + Math.random() * 0.65) : Math.random() * width,
        y: initial ? Math.random() * height : height + 6,
        vx: (Math.random() - 0.45) * (kind === "streak" ? 50 : 18),
        vy: kind === "streak" ? -(90 + Math.random() * 80) : kind === "ash" ? -(14 + Math.random() * 16) : -(28 + Math.random() * 46),
        life: kind === "streak" ? 0.45 + Math.random() * 0.4 : 3.2 + Math.random() * 3.4,
        max: 0,
        w: kind === "ash" ? 1.6 + Math.random() * 2.2 : 0.7 + Math.random() * 1.5,
        kind,
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
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const time = now / 1000;
      ctx.clearRect(0, 0, width, height);

      for (const mote of motes) {
        const x = mote.x + Math.sin(time * mote.speed + mote.phase) * mote.sway;
        const y = mote.y + Math.cos(time * mote.speed * 0.8 + mote.phase) * mote.lift;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${mote.hue}, 90%, 68%, ${mote.alpha})`;
        ctx.arc(x, y, mote.r, 0, Math.PI * 2);
        ctx.fill();
      }

      const cap = width < 700 ? 40 : 70;
      if (sparks.length < cap && Math.random() < 0.7) spawnSpark(false);

      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const spark = sparks[i];
        spark.life -= dt;
        if (spark.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        spark.x += spark.vx * dt;
        spark.y += spark.vy * dt;
        spark.vx *= 0.99;
        const fade = Math.max(0, spark.life / spark.max);
        if (spark.kind === "streak") {
          ctx.strokeStyle = `hsla(32, 100%, 72%, ${fade})`;
          ctx.lineWidth = spark.w;
          ctx.beginPath();
          ctx.moveTo(spark.x, spark.y);
          ctx.lineTo(spark.x - spark.vx * 0.08, spark.y - spark.vy * 0.08);
          ctx.stroke();
        } else {
          const light = spark.kind === "ash" ? 78 : 62;
          const alpha = fade * (spark.kind === "ash" ? 0.35 : 0.85);
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

  return <canvas ref={ref} className="embers" aria-hidden="true" />;
}
