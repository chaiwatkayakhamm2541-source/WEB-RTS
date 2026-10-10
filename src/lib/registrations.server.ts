import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getSql } from "@/lib/db";
import { isOwnerEmail } from "@/lib/owner";
import type { Registration } from "@/lib/registrations";

const filePath = path.join(process.cwd(), "data", "s2-registrations.json");

type Row = {
  character_name: string;
  discord_name: string;
  uid: string;
  alliance: string;
  server_name: string;
  updated_at: string | Date;
};

function fromRow(row: Row): Registration {
  const updated = row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at);
  return {
    character: row.character_name,
    discord: row.discord_name,
    uid: row.uid,
    alliance: row.alliance,
    server: row.server_name,
    updatedAt: updated,
  };
}

async function readFileRows(): Promise<Registration[]> {
  try {
    const raw = await readFile(filePath, "utf8");
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter((item): item is Registration => {
      return Boolean(item && typeof item === "object" && "uid" in item);
    });
  } catch {
    return [];
  }
}

async function writeFileRows(rows: Registration[]) {
  try {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, JSON.stringify(rows));
  } catch {
    // The published host may not allow a local file. The database row still stands.
  }
}

async function rowsFromDb() {
  const sql = await getSql();
  const rows = await sql<Row>`
    select character_name, discord_name, uid, alliance, server_name, updated_at
    from s2_registrations
    order by updated_at desc
  `;
  return rows.map(fromRow);
}

async function upsert(row: Registration) {
  const sql = await getSql();
  await sql`
    insert into s2_registrations (uid, character_name, discord_name, alliance, server_name, updated_at)
    values (${row.uid}, ${row.character}, ${row.discord}, ${row.alliance}, ${row.server}, now())
    on conflict (uid) do update set
      character_name = excluded.character_name,
      discord_name = excluded.discord_name,
      alliance = excluded.alliance,
      server_name = excluded.server_name,
      updated_at = now()
  `;
}

export async function saveRegistration(row: Registration) {
  const saved = await readFileRows();
  for (const item of saved) {
    const existing = await rowsFromDb();
    if (!existing.some((entry) => entry.uid === item.uid)) await upsert(item);
  }
  await upsert(row);
  const rows = await rowsFromDb();
  await writeFileRows(rows);
  return { ok: true as const };
}

export async function listOwnerRegistrations(userId: string) {
  const sql = await getSql();
  const users = await sql<{ email: string }>`select email from "user" where id = ${userId}`;
  if (!isOwnerEmail(users[0]?.email)) throw new Error("Forbidden");
  const saved = await readFileRows();
  const current = await rowsFromDb();
  for (const item of saved) {
    if (!current.some((entry) => entry.uid === item.uid)) await upsert(item);
  }
  const rows = await rowsFromDb();
  await writeFileRows(rows);
  return rows;
}
