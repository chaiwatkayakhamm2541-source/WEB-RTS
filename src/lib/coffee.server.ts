import { createHash } from "node:crypto";
import { getSql } from "@/lib/db";
import { isOwnerEmail } from "@/lib/owner";

export type CoffeeRank = {
  name: string;
  amount: number;
};

type Slip = {
  donor_name: string;
  amount: number;
};

export async function listCoffeeRanks(): Promise<CoffeeRank[]> {
  const sql = await getSql();
  const rows = await sql<Slip>`
    select coalesce(max(nullif(account_name, '')), max(donor_name)) as donor_name,
           sum(amount)::float8 as amount
    from coffee_slips
    group by coalesce(nullif(user_id, ''), lower(donor_name))
    order by sum(amount) desc, min(created_at) asc
    limit 5
  `;
  return rows.map((row) => ({ name: row.donor_name, amount: Number(row.amount) }));
}

export type CoffeeAccount = {
  key: string;
  name: string;
  email: string;
  rounds: number;
  total: number;
};

export async function listCoffeeAccounts(userId: string): Promise<CoffeeAccount[]> {
  const sql = await getSql();
  const users = await sql<{ email: string }>`select email from "user" where id = ${userId}`;
  if (!isOwnerEmail(users[0]?.email)) throw new Error("Forbidden");
  const rows = await sql<{
    account_key: string;
    account_name: string;
    account_email: string | null;
    rounds: number;
    total: number;
  }>`
    select
      coalesce(nullif(user_id, ''), lower(donor_name)) as account_key,
      coalesce(max(account_name), max(donor_name)) as account_name,
      max(account_email) as account_email,
      count(*)::int as rounds,
      sum(amount)::float8 as total
    from coffee_slips
    group by coalesce(nullif(user_id, ''), lower(donor_name))
    order by sum(amount) desc, min(created_at) asc
  `;
  return rows.map((row) => ({
    key: row.account_key,
    name: row.account_name,
    email: row.account_email ?? "",
    rounds: Number(row.rounds),
    total: Number(row.total),
  }));
}

export async function addCoffeeSlip(userId: string, imageHash: string, image: string) {
  try {
    const bytes = slipBytes(image, imageHash);
    if (!bytes) return { ok: false as const, error: "invalid" as const };
    const sql = await getSql();
    const existing = await sql<{ amount: number }>`
      select amount from coffee_slips where image_hash = ${imageHash} limit 1
    `;
    const { readSlipImage } = await import("./slip-ocr.server");
    const amount = await readSlipImage(bytes);
    if (amount == null) return { ok: false as const, error: "unread" as const };
    if (existing.length) {
      if (Number(existing[0]?.amount) > 0) return { ok: false as const, error: "duplicate" as const };
      await sql`update coffee_slips set amount = ${amount} where image_hash = ${imageHash}`;
      return { ok: true as const, amount, ranks: await listCoffeeRanks() };
    }
    const accounts = await sql<{ email: string; name: string }>`
      select email, name from "user" where id = ${userId}
    `;
    const account = accounts[0];
    if (!account) return { ok: false as const, error: "failed" as const };
    await sql`
      insert into coffee_slips (image_hash, donor_name, amount, user_id, account_email, account_name)
      values (${imageHash}, ${account.name}, ${amount}, ${userId}, ${account.email}, ${account.name})
    `;
    return { ok: true as const, amount, ranks: await listCoffeeRanks() };
  } catch (error) {
    console.error("[coffee] save slip failed", error);
    return { ok: false as const, error: "failed" as const };
  }
}

function slipBytes(image: string, imageHash: string) {
  if (image.length > 1_600_000) return null;
  const bytes = Buffer.from(image, "base64");
  if (bytes.length < 32 || bytes.length > 1_200_000) return null;
  const hash = createHash("sha256").update(bytes).digest("hex");
  if (hash !== imageHash) return null;
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8;
  const png = bytes[0] === 0x89 && bytes[1] === 0x50;
  const webp = bytes[0] === 0x52 && bytes[1] === 0x49;
  if (!jpeg && !png && !webp) return null;
  return bytes;
}
