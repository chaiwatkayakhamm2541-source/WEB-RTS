//#region node_modules/.nitro/vite/services/ssr/assets/owner-VHsZlDO5.js
var ROSTER_EMAILS = /* @__PURE__ */ new Set([
	"chaiwatkayakham0@gmail.com",
	"phongpanod0@gmail.com",
	"promthep.thu@gmail.com"
]);
function isOwnerEmail(email) {
	return ROSTER_EMAILS.has(email?.trim().toLowerCase() ?? "");
}
//#endregion
export { isOwnerEmail as t };
