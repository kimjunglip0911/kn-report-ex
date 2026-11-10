/** 층별 피킹 실적과 긴급 출하 샘플. */

export type FloorStat = {
  id: "f1" | "f2";
  label: string;
  plan: number;
  done: number;
};

export const floors: FloorStat[] = [
  { id: "f1", label: "1층", plan: 600, done: 420 },
  { id: "f2", label: "2층", plan: 400, done: 180 },
];

export type ShipStatus = "idle" | "picking";

export type Urgent = {
  no: string;
  floor: string;
  qty: number;
  due: string;
  status: ShipStatus;
};

export const statusLabel: Record<ShipStatus, string> = {
  idle: "미착수",
  picking: "피킹중",
};

const urgent: Urgent[] = [
  { no: "OUT-2408", floor: "2층", qty: 12, due: "10:15", status: "idle" },
  { no: "OUT-2401", floor: "1층", qty: 24, due: "09:40", status: "picking" },
  { no: "OUT-2416", floor: "1층", qty: 16, due: "15:00", status: "idle" },
  { no: "OUT-2411", floor: "1층", qty: 40, due: "11:00", status: "picking" },
  { no: "OUT-2419", floor: "2층", qty: 8, due: "13:20", status: "idle" },
];

/** 출고 마감이 빠른 순. */
export function urgentRows(): Urgent[] {
  return [...urgent].sort((a, b) => a.due.localeCompare(b.due));
}
