import type { Money } from "./commerce/types";

const formatters = new Map<string, Intl.NumberFormat>();

export function formatMoney(m: Money | number, currency = "PHP", locale = "en-PH") {
  const amount = typeof m === "number" ? m : m.amount;
  const code = typeof m === "number" ? currency : m.currencyCode;
  const whole = amount % 1 === 0;
  const key = `${locale}-${code}-${whole}`;
  if (!formatters.has(key)) {
    formatters.set(
      key,
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: code,
        minimumFractionDigits: whole ? 0 : 2,
        maximumFractionDigits: 2,
      }),
    );
  }
  return formatters.get(key)!.format(amount);
}

export function discountPercent(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
