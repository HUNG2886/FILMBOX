/**
 * VietQR manual bank transfer helper.
 *
 * Uses the public img.vietqr.io service (no API key required) to render a
 * ready-to-pay QR with account number, amount, and transfer memo embedded.
 * Admin still approves VIP manually in /admin/users once the transfer is
 * reconciled in the bank statement.
 */

export type PlanId = "monthly" | "quarterly" | "yearly";

export type BankConfig = {
  bin: string;
  accountNo: string;
  accountName: string;
  displayName: string;
};

/**
 * VND amount for each VIP plan. Keep in sync with the price* i18n keys.
 */
const PLAN_AMOUNT: Record<PlanId, number> = {
  monthly: 99000,
  quarterly: 269000,
  yearly: 899000,
};

const PLAN_DAYS: Record<PlanId, number> = {
  monthly: 30,
  quarterly: 90,
  yearly: 365,
};

export function getPlanAmount(plan: PlanId): number {
  return PLAN_AMOUNT[plan];
}

export function getPlanDays(plan: PlanId): number {
  return PLAN_DAYS[plan];
}

/**
 * Read bank config from NEXT_PUBLIC_BANK_* env. Returns null when any of the
 * three critical fields (bin/account no/holder) is missing, so the UI can fall
 * back to a "contact support" panel.
 */
export function getBankConfig(): BankConfig | null {
  const bin = (process.env.NEXT_PUBLIC_BANK_BIN ?? "").trim();
  const accountNo = (process.env.NEXT_PUBLIC_BANK_ACCOUNT_NO ?? "").trim();
  const accountName = (process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME ?? "").trim();
  const displayName =
    (process.env.NEXT_PUBLIC_BANK_DISPLAY_NAME ?? "").trim() || "Ngân hàng";

  if (!bin || !accountNo || !accountName) return null;

  return { bin, accountNo, accountName, displayName };
}

/**
 * Build a short, bank-memo-safe order code.
 *
 * Format: `FILMBOX<userId 6 chars uppercased><planDays>` — e.g. FILMBOXABC12330.
 * Length stays ≤ 20 chars to fit bank transfer memo limits and only uses
 * ASCII letters and digits so it survives VND bank rails.
 */
export function buildOrderCode(userId: string, planDays: number): string {
  const raw = (userId || "USER").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const short = raw.slice(0, 6).padEnd(6, "X");
  return `FILMBOX${short}${planDays}`;
}

/**
 * Build a VietQR image URL (compact2 template). See https://vietqr.io/docs.
 */
export function buildVietQRUrl(input: {
  bank: BankConfig;
  amount: number;
  memo: string;
}): string {
  const { bank, amount, memo } = input;
  const params = new URLSearchParams({
    amount: String(amount),
    addInfo: memo,
    accountName: bank.accountName,
  });
  return `https://img.vietqr.io/image/${encodeURIComponent(
    bank.bin,
  )}-${encodeURIComponent(bank.accountNo)}-compact2.png?${params.toString()}`;
}

/**
 * Format a VND amount for display. Falls back gracefully if Intl data is
 * unavailable for the locale.
 */
export function formatVnd(amount: number, locale: string = "vi"): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString("vi-VN")} ₫`;
  }
}
