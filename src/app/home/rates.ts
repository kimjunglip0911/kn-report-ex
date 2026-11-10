/** 일일 목표를 층 계획 비율로 나누고 달성률을 계산한다. */

export const MAX_QTY = 9_999_999;

/** 숫자만 남기고 앞의 0을 뺀다. 자릿수는 상한에 맞춘다. */
export function cleanQty(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, String(MAX_QTY).length);
  if (digits === "") return "";
  return String(Number(digits));
}

/** 1 이상 상한 이하 정수만 목표로 인정한다. */
export function parseQty(raw: string): number | null {
  if (!/^[1-9]\d*$/.test(raw)) return null;
  const qty = Number(raw);
  if (!Number.isInteger(qty) || qty > MAX_QTY) return null;
  return qty;
}

/** 계획 비율로 나누고, 정수 합이 입력 목표와 같게 나머지를 배분한다. */
export function splitTarget(total: number, plans: readonly number[]): number[] {
  const planSum = plans.reduce((sum, plan) => sum + plan, 0);
  if (planSum <= 0) return plans.map(() => 0);
  const raw = plans.map((plan) => (total * plan) / planSum);
  const shares = raw.map((value) => Math.floor(value));
  let remain = total - shares.reduce((sum, share) => sum + share, 0);
  const order = raw
    .map((value, index) => ({ index, frac: value - Math.floor(value) }))
    .sort((a, b) => b.frac - a.frac || a.index - b.index);
  for (const item of order) {
    if (remain <= 0) break;
    shares[item.index] += 1;
    remain -= 1;
  }
  return shares;
}

/** 목표가 없으면 null. */
export function ratePct(done: number, target: number | null): number | null {
  if (target === null || target < 1) return null;
  return (done / target) * 100;
}

/** 소수점 한 자리. 값이 없으면 대시. */
export function formatPct(value: number | null): string {
  if (value === null) return "—";
  return `${value.toFixed(1)}%`;
}
