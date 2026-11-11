/** 조회 기간으로 주문을 만든다. 같은 기간은 항상 같다. */

export type OrderState = "urgent" | "normal" | "promo";
export type OrderShop = "own" | "coupang" | "naver";

export type Order = {
  no: string;
  day: string;
  state: OrderState;
  shop: OrderShop;
  qty: number;
};

export type OrderPick = {
  state: OrderState | "all";
  shop: OrderShop | "all";
  no: string;
};

export const stateLabel: Record<OrderState, string> = {
  urgent: "긴급",
  normal: "보통",
  promo: "프로모션",
};

export const shopLabel: Record<OrderShop, string> = {
  own: "자사몰",
  coupang: "쿠팡",
  naver: "네이버",
};

const states: OrderState[] = ["urgent", "normal", "promo"];
const shops: OrderShop[] = ["own", "coupang", "naver"];
const qtys = [1, 2, 4, 8, 12, 20, 40, 60];
const dayPattern = /^\d{4}-\d{2}-\d{2}$/;

type Seed = { n: number };

function hash(text: string): number {
  let n = 2166136261;
  for (let i = 0; i < text.length; i++) {
    n ^= text.charCodeAt(i);
    n = Math.imul(n, 16777619);
  }
  return n >>> 0;
}

function roll(seed: Seed): number {
  seed.n = (Math.imul(seed.n, 1664525) + 1013904223) >>> 0;
  return seed.n / 4294967296;
}

function daySpan(from: string, to: string): number {
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  const start = Date.UTC(fy, fm - 1, fd);
  const end = Date.UTC(ty, tm - 1, td);
  return Math.round((end - start) / 86400000) + 1;
}

function shiftDay(day: string, offset: number): string {
  const [y, m, d] = day.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + offset));
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dateNum = String(date.getUTCDate()).padStart(2, "0");
  return `${date.getUTCFullYear()}-${month}-${dateNum}`;
}

/** 시작일부터 종료일까지 주문. 양 끝 포함. 형식이 아니면 null. */
export function ordersOf(from: string, to: string): Order[] | null {
  if (!dayPattern.test(from) || !dayPattern.test(to) || from > to) return null;
  const span = daySpan(from, to);
  const count = Math.min(12, Math.max(4, span));
  const seed: Seed = { n: hash(`${from}|${to}`) };
  const seq = new Map<string, number>();
  const orders: Order[] = [];
  for (let i = 0; i < count; i++) {
    const offset = Math.min(span - 1, Math.floor((i * span) / count));
    const day = shiftDay(from, offset);
    const turn = (seq.get(day) ?? 0) + 1;
    seq.set(day, turn);
    const no = `WO${day.replace(/-/g, "")}${String(turn).padStart(2, "0")}`;
    const state = states[Math.floor(roll(seed) * states.length)];
    const shop = shops[Math.floor(roll(seed) * shops.length)];
    const qty = qtys[Math.floor(roll(seed) * qtys.length)];
    orders.push({ no, day, state, shop, qty });
  }
  return orders;
}

/** 상태, 주문처, 주문 번호 포함 여부. 번호의 앞뒤 공백은 뺀다. */
export function matchOrder(order: Order, pick: OrderPick): boolean {
  const no = pick.no.trim();
  if (pick.state !== "all" && order.state !== pick.state) return false;
  if (pick.shop !== "all" && order.shop !== pick.shop) return false;
  if (no !== "" && !order.no.includes(no)) return false;
  return true;
}
