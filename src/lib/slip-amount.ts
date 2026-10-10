const THAI_DIGITS = "๐๑๒๓๔๕๖๗๘๙";

/** Read the transferred baht amount from bank-slip text. Fees, balances, and references are ignored. */
export function readAmountFromSlipText(raw: string): number | null {
  const lines = normalizeSlip(raw)
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const hits: { amount: number; score: number }[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (isIgnoredMoneyLine(line)) continue;
    const bonus = keywordScore(line) || keywordScore(lines[index - 1] ?? "");
    for (const amount of amountsIn(line)) {
      let score = bonus;
      if (hasMoneyUnit(line)) score += 4;
      if (isCashAmount(amount)) score += 1;
      if (score === 0 && isCashAmount(amount)) score = 2;
      if (score > 0) hits.push({ amount, score });
    }
  }

  const ranked = hits.filter((hit) => hit.score >= 4).sort((a, b) => b.score - a.score);
  if (ranked.length > 0) return roundBaht(ranked[0].amount);
  const only = hits.filter((hit) => hit.score >= 2);
  if (only.length === 1) return roundBaht(only[0].amount);
  return null;
}

export function formatBahtAmount(amount: number) {
  const cents = Math.round(Number(amount) * 100);
  const abs = Math.abs(cents);
  const whole = Math.floor(abs / 100);
  const satang = abs % 100;
  const grouped = whole.toLocaleString("en-US");
  const text = satang === 0 ? grouped : `${grouped}.${String(satang).padStart(2, "0")}`;
  return cents < 0 ? `-${text}` : text;
}

function normalizeSlip(raw: string) {
  let text = raw.replace(/[\u200B-\u200D\uFEFF]/g, "");
  text = text.replace(/[๐-๙]/g, (digit) => String(THAI_DIGITS.indexOf(digit)));
  text = text.replace(/([\u0E00-\u0E7F])[ \t]+(?=[\u0E00-\u0E7F])/g, "$1");
  text = text.replace(/\u0E4D\u0E32/g, "\u0E33");
  text = text.replace(/(\d)[ \t]+(?=\d)/g, "$1");
  text = text.replace(/(\d)[ \t]+([.,])[ \t]*(\d)/g, "$1$2$3");
  text = text.replace(/(\d),(\d{3})(?!\d)/g, "$1,$2");
  text = text.replace(/(\d),(\d{2})(?!\d)/g, "$1.$2");
  return text.toLowerCase();
}

function keywordScore(line: string) {
  if (/จำนวนเงิน|จานวนเงิน|ยอดโอน|ยอดชำระ|ยอดเงินที่โอน|ได้รับเงิน|amount/.test(line)) return 10;
  return 0;
}

function isIgnoredMoneyLine(line: string) {
  return /ค่าธรรมเนียม|ธรรมเนียม|\bfee\b|คงเหลือ|balance|เลขที่รายการ|เลขอ้างอิง|รหัสอ้างอิง|เลขที่บัญชี|หมายเลขอ้างอิง/.test(line);
}

function hasMoneyUnit(line: string) {
  return /บาท|\bthb\b|฿/.test(line);
}

function isCashAmount(amount: number) {
  const satang = Math.round(amount * 100) % 100;
  return satang === 0 || satang === 25 || satang === 50 || satang === 75;
}

function amountsIn(line: string) {
  const found: number[] = [];
  const decimal = /(?:฿|\bthb\b)?\s*(\d{1,3}(?:,\d{3})+|\d{1,7})[.](\d{2})(?!\d)/gi;
  for (const match of line.matchAll(decimal)) {
    const value = Number(`${match[1].replace(/,/g, "")}.${match[2]}`);
    if (value > 0 && value <= 1_000_000) found.push(value);
  }
  if (found.length > 0) return found;
  const whole = /(?:฿|\bthb\b)?\s*(\d{1,3}(?:,\d{3})+|\d{1,6})\s*บาท/gi;
  for (const match of line.matchAll(whole)) {
    const value = Number(match[1].replace(/,/g, ""));
    if (value >= 1 && value <= 1_000_000) found.push(value);
  }
  return found;
}

function roundBaht(amount: number) {
  return Math.round(amount * 100) / 100;
}
