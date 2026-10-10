import assert from "node:assert/strict";
import test from "node:test";
import { readAmountFromSlipText } from "./slip-amount.ts";

test("reads the transfer amount and skips the fee", () => {
  const text = `
โอ น เง ิ น ส ํ า เร ็ จ
09 ต . ค . 2569 21:03
จ ํ า น ว น เง ิ น
50.00 บ า ท
ค ่ า ธร ร ม เน ี ย ม 0.00 บ า ท
เล ข ท ี ่ ร า ย ก า ร 202610091234
`;
  assert.equal(readAmountFromSlipText(text), 50);
});

test("keeps satang and thousands separators", () => {
  const text = `
จ ํ า น ว น เง ิ น
1,250.50
บ า ท
ค ่ า ธร ร ม เน ี ย ม 0.00
09/10/2026 21:04
`;
  assert.equal(readAmountFromSlipText(text), 1250.5);
});

test("prefers money received over the remaining balance", () => {
  const text = `
ค ุ ณ ไ ด ้ ร ั บ เง ิ น
100.00 บ า ท
เข ้ า บ ั ญ ช ี xxx-1-23456-7
ย อ ด เง ิ น ค ง เห ล ื อ 9,999.00 บ า ท
`;
  assert.equal(readAmountFromSlipText(text), 100);
});

test("reads an english amount line", () => {
  assert.equal(readAmountFromSlipText("โอนเงิน\nAmount\nTHB 75.00\nRef 881234567890"), 75);
});

test("reads a whole-baht line and ignores references", () => {
  assert.equal(readAmountFromSlipText("จำนวนเงิน\n20 บาท\nรหัสอ้างอิง 1234567890123"), 20);
});

test("does not guess when the slip has no amount", () => {
  assert.equal(readAmountFromSlipText("เลขที่รายการ 202610091234\n09/10/2026 21:03"), null);
});
