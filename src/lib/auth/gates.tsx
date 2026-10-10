import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { ProfileDrawer } from "@/components/profile-drawer";
import { useLang } from "@/lib/i18n";
import { getMyProfile } from "@/lib/profile";
import { GROK_PROVIDERS, authEnabled, signIn, signOut } from "./client";
import { hasGateSessionMarker } from "./gate-session-marker";
import { resolveSignInGateState } from "./sign-in-gate";
import { useCurrentUser, useCurrentUserState } from "./use-current-user";

const subscribeToNothing = () => () => {};
const noGateSessionOnServer = () => false;

function sharpAvatar(url: string) {
  return url.replace(/=s\d+(-[a-z])?(?=$|[?#])/i, "=s256-c");
}

/**
 * Auth state components — plain wrappers around `useCurrentUserState()`.
 *
 * With auth on, visitors are signed out until they authenticate — in the sandbox
 * live preview too, which does real sign-in. The shared dev user appears only
 * when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
 * While the session is still resolving, gates that care about signed-out state
 * render nothing so there's no signed-out flash on hard reload.
 */

/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
export const SIGN_IN_PATH = "/login";

/** Render children only when a user is present (real session, or the disabled-auth dev user). */
export function SignedIn({ children }: { children: ReactNode }) {
  const { user } = useCurrentUserState();
  return user ? <>{children}</> : null;
}

/**
 * Render children only once we KNOW the visitor is signed out (`isPending` has
 * cleared and there is no user). Hidden while the session is still loading.
 */
export function SignedOut({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending || user) return null;
  return <>{children}</>;
}

/**
 * Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
 * `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
 * session loading, which feels like a second "Loading…" on /login.
 *
 * Guard routes by waiting out `isPending` first (see `use-current-user`), then
 * render this.
 */
export function RedirectToSignIn({ to = SIGN_IN_PATH }: { to?: string }) {
  return <Navigate to={to} />;
}

export function SignInGate({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { user, isPending } = useCurrentUserState();
  const state = resolveSignInGateState({ isPending, hasUser: user !== null });
  if (state === "pending") return null;
  if (state === "signed_in") return <>{children}</>;
  return <>{fallback ?? <SignInButtons />}</>;
}

export function SignInButtons() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      {GROK_PROVIDERS.map((p) => (
        <button
          key={p.providerId}
          type="button"
          onClick={() => signIn(p.providerId, { callbackURL: "/" })}
          className="w-full cursor-pointer rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
        >
          Continue with {p.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Minimal signed-in identity chip + sign-out. Restyle freely (see the
 * `design-ui` skill). Sign-out is only shown when auth is enabled (the
 * disabled-auth dev user has nothing to sign out of) and the session is not
 * gate-materialized — behind the gate the next request signs the viewer
 * straight back in, so a sign-out control there is a broken loop.
 */
export function UserButton() {
  const user = useCurrentUser();
  const { tx } = useLang();
  const [signingOut, setSigningOut] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customName, setCustomName] = useState<string | null>(null);
  const gateSession = useSyncExternalStore(
    subscribeToNothing,
    hasGateSessionMarker,
    noGateSessionOnServer,
  );
  const userId = user?.id;
  const devFallback = user?.isDevFallback;
  useEffect(() => {
    if (!userId || devFallback) return;
    let cancel = false;
    getMyProfile()
      .then((profile) => {
        if (!cancel && profile.image) setCustomImage(profile.image);
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, [userId, devFallback]);
  if (!user) return null;
  const label = customName ?? user.displayName ?? user.primaryEmail ?? "Account";
  const sessionPhoto = user.profileImageUrl ? sharpAvatar(user.profileImageUrl) : null;
  const photo = customImage ?? sessionPhoto;
  return (
    <div className="account-chip">
      <button
        className="account-photo-btn"
        type="button"
        aria-label={tx("โปรไฟล์", "Profile")}
        aria-expanded={profileOpen}
        onClick={() => setProfileOpen(true)}
      >
        {photo ? (
          <img className="account-photo" src={photo} alt="" referrerPolicy="no-referrer" />
        ) : (
          <span className="account-photo account-fallback" aria-hidden="true">
            {label.charAt(0).toUpperCase()}
          </span>
        )}
      </button>
      <span className="account-name">{label}</span>
      {authEnabled && !gateSession && (
        <button
          type="button"
          className="account-out"
          disabled={signingOut}
          onClick={() => {
            setSigningOut(true);
            void signOut().catch(() => setSigningOut(false));
          }}
        >
          {signingOut ? tx("กำลังออก…", "Signing out…") : tx("ออก", "Sign out")}
        </button>
      )}
      <ProfileDrawer
        open={profileOpen}
        name={label}
        email={user.primaryEmail ?? ""}
        photo={photo}
        onClose={() => setProfileOpen(false)}
        onSaved={({ name, photo: nextPhoto }) => {
          setCustomName(name);
          if (nextPhoto) setCustomImage(nextPhoto);
        }}
      />
    </div>
  );
}
