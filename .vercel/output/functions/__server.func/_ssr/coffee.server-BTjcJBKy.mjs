import { t as isOwnerEmail } from "./owner-VHsZlDO5.mjs";
import { r as getSql } from "./db-B8Bu_r-F.mjs";
import { createHash } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/coffee.server-BTjcJBKy.js
async function listCoffeeRanks() {
	return (await (await getSql())`
    select coalesce(max(nullif(account_name, '')), max(donor_name)) as donor_name,
           sum(amount)::float8 as amount
    from coffee_slips
    group by coalesce(nullif(user_id, ''), lower(donor_name))
    order by sum(amount) desc, min(created_at) asc
    limit 5
  `).map((row) => ({
		name: row.donor_name,
		amount: Number(row.amount)
	}));
}
async function listCoffeeAccounts(userId) {
	const sql = await getSql();
	const users = await sql`select email from "user" where id = ${userId}`;
	if (!isOwnerEmail(users[0]?.email)) throw new Error("Forbidden");
	return (await sql`
    select
      coalesce(nullif(user_id, ''), lower(donor_name)) as account_key,
      coalesce(max(account_name), max(donor_name)) as account_name,
      max(account_email) as account_email,
      count(*)::int as rounds,
      sum(amount)::float8 as total
    from coffee_slips
    group by coalesce(nullif(user_id, ''), lower(donor_name))
    order by sum(amount) desc, min(created_at) asc
  `).map((row) => ({
		key: row.account_key,
		name: row.account_name,
		email: row.account_email ?? "",
		rounds: Number(row.rounds),
		total: Number(row.total)
	}));
}
async function addCoffeeSlip(userId, imageHash, image) {
	try {
		const bytes = slipBytes(image, imageHash);
		if (!bytes) return {
			ok: false,
			error: "invalid"
		};
		const sql = await getSql();
		const existing = await sql`
      select amount from coffee_slips where image_hash = ${imageHash} limit 1
    `;
		const { readSlipImage } = await import("./slip-ocr.server-Dl_4zITn.mjs");
		const amount = await readSlipImage(bytes);
		if (amount == null) return {
			ok: false,
			error: "unread"
		};
		if (existing.length) {
			if (Number(existing[0]?.amount) > 0) return {
				ok: false,
				error: "duplicate"
			};
			await sql`update coffee_slips set amount = ${amount} where image_hash = ${imageHash}`;
			return {
				ok: true,
				amount,
				ranks: await listCoffeeRanks()
			};
		}
		const account = (await sql`
      select email, name from "user" where id = ${userId}
    `)[0];
		if (!account) return {
			ok: false,
			error: "failed"
		};
		await sql`
      insert into coffee_slips (image_hash, donor_name, amount, user_id, account_email, account_name)
      values (${imageHash}, ${account.name}, ${amount}, ${userId}, ${account.email}, ${account.name})
    `;
		return {
			ok: true,
			amount,
			ranks: await listCoffeeRanks()
		};
	} catch (error) {
		console.error("[coffee] save slip failed", error);
		return {
			ok: false,
			error: "failed"
		};
	}
}
function slipBytes(image, imageHash) {
	if (image.length > 16e5) return null;
	const bytes = Buffer.from(image, "base64");
	if (bytes.length < 32 || bytes.length > 12e5) return null;
	if (createHash("sha256").update(bytes).digest("hex") !== imageHash) return null;
	const jpeg = bytes[0] === 255 && bytes[1] === 216;
	const png = bytes[0] === 137 && bytes[1] === 80;
	const webp = bytes[0] === 82 && bytes[1] === 73;
	if (!jpeg && !png && !webp) return null;
	return bytes;
}
//#endregion
export { addCoffeeSlip, listCoffeeAccounts, listCoffeeRanks };
