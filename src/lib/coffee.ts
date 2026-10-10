import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";

export type CoffeeRank = {
  name: string;
  amount: number;
};

function clean(data: unknown) {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  const imageHash = typeof row.imageHash === "string" ? row.imageHash.trim().toLowerCase() : "";
  const image = typeof row.image === "string" ? row.image.replace(/\s/g, "") : "";
  if (!/^[a-f0-9]{64}$/.test(imageHash)) return null;
  if (image.length < 100 || image.length > 1_600_000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(image)) return null;
  return { imageHash, image };
}

export const listCoffee = createServerFn({ method: "GET" }).handler(async () => {
  const { listCoffeeRanks } = await import("./coffee.server");
  return listCoffeeRanks();
});

export type CoffeeAccount = {
  key: string;
  name: string;
  email: string;
  rounds: number;
  total: number;
};

export const listCoffeeAccounts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<CoffeeAccount[]> => {
    const { listCoffeeAccounts: load } = await import("./coffee.server");
    return load(context.userId);
  });

export const submitCoffee = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: unknown) => clean(data) ?? { imageHash: "", image: "" })
  .handler(async ({ data, context }) => {
    if (!data.imageHash || !data.image) return { ok: false as const, error: "invalid" as const };
    const { addCoffeeSlip } = await import("./coffee.server");
    return addCoffeeSlip(context.userId, data.imageHash, data.image);
  });
