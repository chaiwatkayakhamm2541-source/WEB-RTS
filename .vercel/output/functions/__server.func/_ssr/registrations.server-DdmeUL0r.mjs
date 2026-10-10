import { t as isOwnerEmail } from "./owner-VHsZlDO5.mjs";
import { r as getSql } from "./db-B8Bu_r-F.mjs";
import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
//#region node_modules/.nitro/vite/services/ssr/assets/registrations.server-DdmeUL0r.js
var filePath = path.join(process.cwd(), "data", "s2-registrations.json");
function fromRow(row) {
	const updated = row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at);
	return {
		character: row.character_name,
		discord: row.discord_name,
		uid: row.uid,
		alliance: row.alliance,
		server: row.server_name,
		updatedAt: updated
	};
}
async function readFileRows() {
	try {
		const raw = await readFile(filePath, "utf8");
		const data = JSON.parse(raw);
		if (!Array.isArray(data)) return [];
		return data.filter((item) => {
			return Boolean(item && typeof item === "object" && "uid" in item);
		});
	} catch {
		return [];
	}
}
async function writeFileRows(rows) {
	try {
		await mkdir(path.dirname(filePath), { recursive: true });
		await writeFile(filePath, JSON.stringify(rows));
	} catch {}
}
async function rowsFromDb() {
	return (await (await getSql())`
    select character_name, discord_name, uid, alliance, server_name, updated_at
    from s2_registrations
    order by updated_at desc
  `).map(fromRow);
}
async function upsert(row) {
	await (await getSql())`
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
async function saveRegistration(row) {
	const saved = await readFileRows();
	for (const item of saved) if (!(await rowsFromDb()).some((entry) => entry.uid === item.uid)) await upsert(item);
	await upsert(row);
	await writeFileRows(await rowsFromDb());
	return { ok: true };
}
async function listOwnerRegistrations(userId) {
	const users = await (await getSql())`select email from "user" where id = ${userId}`;
	if (!isOwnerEmail(users[0]?.email)) throw new Error("Forbidden");
	const saved = await readFileRows();
	const current = await rowsFromDb();
	for (const item of saved) if (!current.some((entry) => entry.uid === item.uid)) await upsert(item);
	const rows = await rowsFromDb();
	await writeFileRows(rows);
	return rows;
}
//#endregion
export { listOwnerRegistrations, saveRegistration };
