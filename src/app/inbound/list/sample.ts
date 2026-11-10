/** 조회 기간으로 입고 제품을 만든다. 같은 기간은 항상 같다. */

export type InLine = {
  day: string;
  no: string;
  line: number;
  code: string;
  name: string;
  expect: number;
  recv: number;
  unit: string;
};

type Good = { code: string; name: string; unit: string };

const goods: Good[] = [
  { code: "SKU-1001", name: "골판지 박스 중", unit: "EA" },
  { code: "SKU-1002", name: "완충재 롤", unit: "EA" },
  { code: "SKU-2044", name: "테이프 48mm", unit: "EA" },
  { code: "SKU-3301", name: "팔레트 목재", unit: "EA" },
  { code: "SKU-1188", name: "라벨 롤", unit: "EA" },
  { code: "SKU-2210", name: "스트레치 필름", unit: "ROLL" },
  { code: "SKU-4502", name: "안전화", unit: "PR" },
  { code: "SKU-0780", name: "작업장갑", unit: "PR" },
];

const qtys = [12, 24, 40, 80, 120, 200, 320, 500];

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

function offsets(span: number, count: number, seed: Seed): number[] {
  if (count === 1) return [0];
  const used = new Set<number>();
  const picked: number[] = [];
  for (let i = 0; i < count; i++) {
    const base = Math.round((i * (span - 1)) / (count - 1));
    const room = Math.max(1, Math.floor((span - 1) / (count - 1) / 3));
    const jitter = Math.floor(roll(seed) * (room * 2 + 1)) - room;
    let offset = Math.min(span - 1, Math.max(0, base + jitter));
    let guard = 0;
    while (used.has(offset) && guard < span) {
      offset = (offset + 1) % span;
      guard += 1;
    }
    used.add(offset);
    picked.push(offset);
  }
  return picked.sort((a, b) => a - b);
}

function takeGoods(seed: Seed, count: number): Good[] {
  const pool = [...goods];
  const picked: Good[] = [];
  for (let i = 0; i < count; i++) {
    const index = Math.floor(roll(seed) * pool.length);
    const [item] = pool.splice(index, 1);
    picked.push(item);
    if (pool.length === 0) pool.push(...goods);
  }
  return picked;
}

function qtyPair(seed: Seed): { expect: number; recv: number } {
  const expect = qtys[Math.floor(roll(seed) * qtys.length)];
  if (roll(seed) > 0.35) return { expect, recv: expect };
  const ratio = 0.4 + roll(seed) * 0.5;
  return { expect, recv: Math.max(1, Math.round(expect * ratio)) };
}

/** 시작일부터 종료일까지 입고된 제품. 양 끝 포함. 형식이 아니면 null. */
export function linesOf(from: string, to: string): InLine[] | null {
  if (!dayPattern.test(from) || !dayPattern.test(to) || from > to) return null;
  const span = daySpan(from, to);
  const seed: Seed = { n: hash(`${from}|${to}`) };
  const receiptN = span === 1 ? 1 : Math.min(3, span);
  const lines: InLine[] = [];
  for (const offset of offsets(span, receiptN, seed)) {
    const day = shiftDay(from, offset);
    const lineN = span === 1 ? 4 : 2 + Math.floor(roll(seed) * 2);
    const no = `${day.replace(/-/g, "")}01`;
    takeGoods(seed, lineN).forEach((item, index) => {
      const qty = qtyPair(seed);
      lines.push({
        day,
        no,
        line: index + 1,
        code: item.code,
        name: item.name,
        expect: qty.expect,
        recv: qty.recv,
        unit: item.unit,
      });
    });
  }
  return lines;
}
