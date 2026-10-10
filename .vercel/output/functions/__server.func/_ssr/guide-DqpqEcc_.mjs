import { o as __toESM } from "../_runtime.mjs";
import { Y as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/guide-DqpqEcc_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function GuideRedirect() {
	(0, import_react.useEffect)(() => {
		window.location.replace("/guide/index.html");
	}, []);
	return null;
}
//#endregion
export { GuideRedirect as component };
