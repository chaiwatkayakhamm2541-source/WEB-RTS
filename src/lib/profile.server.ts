import { getSql } from "@/lib/db";

const JPEG_PREFIX = "data:image/jpeg;base64,";

export async function readProfile(userId: string) {
  const sql = await getSql();
  const rows = await sql<{ image: string }>`
    select image from user_profiles where user_id = ${userId} limit 1
  `;
  return { image: rows[0]?.image ?? null };
}

export async function writeProfile(userId: string, name: string, image: string | null) {
  if (image && !jpegDataUrl(image)) return { ok: false as const, error: "invalid" as const };
  const sql = await getSql();
  const users = await sql<{ id: string }>`select id from "user" where id = ${userId} limit 1`;
  if (!users[0]) return { ok: false as const, error: "failed" as const };
  await sql`
    update "user"
    set name = ${name}, "updatedAt" = now()
    where id = ${userId}
  `;
  await sql`
    update coffee_slips
    set account_name = ${name}, donor_name = ${name}
    where user_id = ${userId}
  `;
  if (image) {
    await sql`
      insert into user_profiles (user_id, image, updated_at)
      values (${userId}, ${image}, now())
      on conflict (user_id) do update set image = excluded.image, updated_at = now()
    `;
  }
  return { ok: true as const };
}

function jpegDataUrl(image: string) {
  if (!image.startsWith(JPEG_PREFIX)) return false;
  const body = image.slice(JPEG_PREFIX.length);
  if (body.length < 100 || body.length > 180_000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(body)) return false;
  const bytes = Buffer.from(body, "base64");
  return bytes.length >= 32 && bytes.length <= 140_000 && bytes[0] === 0xff && bytes[1] === 0xd8;
}
