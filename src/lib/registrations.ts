import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { isOwnerEmail } from "@/lib/owner";

const alliances = ["IMT", "FOX", "UNS"];
const servers = Array.from({ length: 15 }, (_, index) => `S1-${String(index + 1).padStart(3, "0")}`);

export type Registration = {
  character: string;
  discord: string;
  uid: string;
  alliance: string;
  server: string;
  updatedAt: string;
};

function clean(value: unknown): Registration | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const next = {
    character: typeof row.character === "string" ? row.character.trim() : "",
    discord: typeof row.discord === "string" ? row.discord.trim() : "",
    uid: typeof row.uid === "string" ? row.uid.trim() : "",
    alliance: typeof row.alliance === "string" ? row.alliance.trim() : "",
    server: typeof row.server === "string" ? row.server.trim() : "",
    updatedAt: typeof row.updatedAt === "string" ? row.updatedAt : new Date().toISOString(),
  };
  if (!next.character || next.character.length > 40) return null;
  if (!next.discord || next.discord.length > 40) return null;
  if (!/^\d{1,20}$/.test(next.uid)) return null;
  if (!alliances.includes(next.alliance)) return null;
  if (!servers.includes(next.server)) return null;
  return next;
}

export const submitRegistration = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const row = clean(data);
    if (!row) throw new Error("ข้อมูลไม่ถูกต้อง");
    return row;
  })
  .handler(async ({ data }) => {
    const { saveRegistration } = await import("./registrations.server");
    return saveRegistration(data);
  });

export const listRegistrations = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Registration[]> => {
    const { listOwnerRegistrations } = await import("./registrations.server");
    return listOwnerRegistrations(context.userId);
  });

export { isOwnerEmail };
