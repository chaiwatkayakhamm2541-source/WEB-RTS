import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";

function cleanName(value: unknown) {
  const name = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
  if (name.length < 1 || name.length > 48) return "";
  return name;
}

function cleanProfile(data: unknown) {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  const name = cleanName(row.name);
  if (!name) return null;
  if (row.image == null || row.image === "") return { name, image: null as string | null };
  if (typeof row.image !== "string" || !row.image.startsWith("data:image/jpeg;base64,")) return null;
  return { name, image: row.image };
}

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { readProfile } = await import("./profile.server");
    return readProfile(context.userId);
  });

export const saveMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: unknown) => cleanProfile(data) ?? { name: "", image: null })
  .handler(async ({ data, context }) => {
    if (!data.name) return { ok: false as const, error: "invalid" as const };
    const { writeProfile } = await import("./profile.server");
    try {
      return await writeProfile(context.userId, data.name, data.image);
    } catch (error) {
      console.error("[profile] save failed", error);
      return { ok: false as const, error: "failed" as const };
    }
  });
