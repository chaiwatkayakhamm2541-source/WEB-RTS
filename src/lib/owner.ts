export const OWNER_EMAIL = "chaiwatkayakham0@gmail.com";

const ROSTER_EMAILS = new Set([
  OWNER_EMAIL,
  "phongpanod0@gmail.com",
  "promthep.thu@gmail.com",
]);

export function isOwnerEmail(email: string | null | undefined) {
  return ROSTER_EMAILS.has(email?.trim().toLowerCase() ?? "");
}
