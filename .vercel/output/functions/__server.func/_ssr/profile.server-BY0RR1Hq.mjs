import { r as getSql } from "./db-B8Bu_r-F.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile.server-BY0RR1Hq.js
var JPEG_PREFIX = "data:image/jpeg;base64,";
async function readProfile(userId) {
	return { image: (await (await getSql())`
    select image from user_profiles where user_id = ${userId} limit 1
  `)[0]?.image ?? null };
}
async function writeProfile(userId, name, image) {
	if (image && !jpegDataUrl(image)) return {
		ok: false,
		error: "invalid"
	};
	const sql = await getSql();
	if (!(await sql`select id from "user" where id = ${userId} limit 1`)[0]) return {
		ok: false,
		error: "failed"
	};
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
	if (image) await sql`
      insert into user_profiles (user_id, image, updated_at)
      values (${userId}, ${image}, now())
      on conflict (user_id) do update set image = excluded.image, updated_at = now()
    `;
	return { ok: true };
}
function jpegDataUrl(image) {
	if (!image.startsWith(JPEG_PREFIX)) return false;
	const body = image.slice(23);
	if (body.length < 100 || body.length > 18e4 || !/^[A-Za-z0-9+/]+={0,2}$/.test(body)) return false;
	const bytes = Buffer.from(body, "base64");
	return bytes.length >= 32 && bytes.length <= 14e4 && bytes[0] === 255 && bytes[1] === 216;
}
//#endregion
export { readProfile, writeProfile };
