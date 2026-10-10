import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { LanguageProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth/provider";
import { LegalFooter } from "@/components/legal-footer";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "สมรภูมิ RTS";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "description", content: "เว็บสมรภูมิ RTS — วางแผน รวมพลัง ขยายอาณาจักร และปักธงเข้าสมรภูมิ" },
      { name: "theme-color", content: "#070605" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&family=Cinzel:wght@700;900&family=Figtree:wght@700;800&family=Noto+Sans+Thai:wght@400;500;600;900&family=Noto+Serif+Thai:wght@600;700&family=Russo+One&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="th" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <LanguageProvider>
            <Outlet />
            <LegalFooter />
          </LanguageProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
