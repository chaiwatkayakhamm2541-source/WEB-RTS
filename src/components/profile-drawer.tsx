import { useEffect, useRef, useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";
import { saveMyProfile } from "@/lib/profile";
import { useLang } from "@/lib/i18n";

export function ProfileDrawer({
  open,
  name,
  email,
  photo,
  onClose,
  onSaved,
}: {
  open: boolean;
  name: string;
  email: string;
  photo: string | null;
  onClose: () => void;
  onSaved: (next: { name: string; photo: string | null }) => void;
}) {
  const { tx } = useLang();
  const fileRef = useRef<HTMLInputElement>(null);
  const [draftName, setDraftName] = useState(name);
  const [draftPhoto, setDraftPhoto] = useState<string | null>(photo);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open && !wasOpen.current) {
      setDraftName(name);
      setDraftPhoto(photo);
      setNote("");
    }
    wasOpen.current = open;
  }, [open, name, photo]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function onPick(file: File | undefined) {
    if (!file) return;
    setNote("");
    try {
      setDraftPhoto(await portraitDataUrl(file));
    } catch {
      setNote(tx("ใช้รูป jpg หรือ png", "Use a jpg or png photo"));
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const nextName = draftName.trim().replace(/\s+/g, " ");
    if (nextName.length < 1 || nextName.length > 48) {
      setNote(tx("ชื่อต้องมี 1–48 ตัวอักษร", "Use 1–48 characters"));
      return;
    }
    setBusy(true);
    setNote("");
    try {
      const image = draftPhoto?.startsWith("data:image/jpeg;base64,") ? draftPhoto : null;
      const updated = await authClient.updateUser({ name: nextName });
      if (updated.error) {
        setNote(tx("เปลี่ยนชื่อไม่สำเร็จ ลองอีกครั้ง", "Could not change the name. Try again"));
        return;
      }
      const saved = await saveMyProfile({ data: { name: nextName, image } });
      if (!saved.ok) {
        setNote(tx("บันทึกไม่สำเร็จ ลองอีกครั้ง", "Could not save. Try again"));
        return;
      }
      onSaved({ name: nextName, photo: image ?? photo });
      window.dispatchEvent(new Event("coffee-updated"));
      setNote(tx("บันทึกแล้ว", "Saved"));
    } catch {
      setNote(tx("บันทึกไม่สำเร็จ ลองอีกครั้ง", "Could not save. Try again"));
    } finally {
      setBusy(false);
    }
  }

  const initial = (draftName || name || "?").charAt(0).toUpperCase();

  return (
    <div className="profile-drawer" role="presentation">
      <button className="profile-backdrop" type="button" aria-label={tx("ปิด", "Close")} onClick={onClose} />
      <aside className="profile-sheet" role="dialog" aria-modal="true" aria-labelledby="profile-title">
        <div className="profile-head">
          <h2 id="profile-title">{tx("โปรไฟล์", "Profile")}</h2>
          <button className="profile-close" type="button" onClick={onClose}>
            {tx("ปิด", "Close")}
          </button>
        </div>
        <form className="profile-form" onSubmit={(event) => void onSubmit(event)}>
          <button className="profile-photo-btn" type="button" onClick={() => fileRef.current?.click()}>
            {draftPhoto ? (
              <img className="profile-photo" src={draftPhoto} alt="" />
            ) : (
              <span className="profile-photo profile-fallback">{initial}</span>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              void onPick(file);
            }}
          />
          <button className="profile-change" type="button" onClick={() => fileRef.current?.click()}>
            {tx("เปลี่ยนรูป", "Change photo")}
          </button>
          <label>
            {tx("ชื่อ", "Name")}
            <input
              value={draftName}
              maxLength={48}
              autoComplete="nickname"
              onChange={(event) => setDraftName(event.target.value)}
            />
          </label>
          {email ? <p className="profile-email">{email}</p> : null}
          <p className="profile-hint">{tx("ชื่อนี้แสดงบนบอร์ดค่ากาแฟ", "This name shows on the coffee board")}</p>
          <button className="profile-save" type="submit" disabled={busy}>
            {busy ? tx("กำลังบันทึก", "Saving") : tx("บันทึก", "Save")}
          </button>
          {note ? <p className="profile-note">{note}</p> : null}
        </form>
      </aside>
    </div>
  );
}

async function portraitDataUrl(file: File) {
  const bitmap = await createImageBitmap(file);
  const longest = Math.max(bitmap.width, bitmap.height);
  const scale = Math.min(1, 256 / longest);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas");
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => (value ? resolve(value) : reject(new Error("blob"))), "image/jpeg", 0.82);
  });
  const bytes = new Uint8Array(await blob.arrayBuffer());
  if (bytes.length > 120_000) throw new Error("large");
  return `data:image/jpeg;base64,${bytesToBase64(bytes)}`;
}

function bytesToBase64(bytes: Uint8Array) {
  let text = "";
  const chunk = 8192;
  for (let index = 0; index < bytes.length; index += chunk) {
    text += String.fromCharCode(...bytes.subarray(index, index + chunk));
  }
  return btoa(text);
}
