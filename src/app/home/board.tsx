"use client";

import { useEffect, useState } from "react";
import { cleanQty, formatPct, parseQty, ratePct, splitTarget } from "./rates";
import { floors, statusLabel, urgentRows } from "./sample";
import styles from "./board.module.css";

const STORE_KEY = "wms.dailyTarget";

type Goal = { qty: string; f1: string; f2: string };

type Stored = {
  day: string;
  qty: number | null;
  f1: number | null;
  f2: number | null;
};

const emptyGoal: Goal = { qty: "", f1: "", f2: "" };

function localDay(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function textQty(value: unknown): string {
  if (typeof value !== "number" || !Number.isInteger(value)) return "";
  const text = String(value);
  return parseQty(text) === null ? "" : text;
}

function splitText(total: number): Pick<Goal, "f1" | "f2"> {
  const [f1, f2] = splitTarget(total, floors.map((floor) => floor.plan));
  return { f1: String(f1), f2: String(f2) };
}

function readGoal(): Goal {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return emptyGoal;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return emptyGoal;
    const row = parsed as { day?: unknown; qty?: unknown; f1?: unknown; f2?: unknown };
    if (row.day !== localDay(new Date())) return emptyGoal;
    const qty = textQty(row.qty);
    if (!("f1" in row) && !("f2" in row)) {
      const total = parseQty(qty);
      if (total === null) return emptyGoal;
      return { qty, ...splitText(total) };
    }
    return { qty, f1: textQty(row.f1), f2: textQty(row.f2) };
  } catch {
    return emptyGoal;
  }
}

function writeGoal(goal: Goal) {
  const qty = parseQty(goal.qty);
  const f1 = parseQty(goal.f1);
  const f2 = parseQty(goal.f2);
  if (qty === null && f1 === null && f2 === null) {
    localStorage.removeItem(STORE_KEY);
    return;
  }
  const payload: Stored = { day: localDay(new Date()), qty, f1, f2 };
  localStorage.setItem(STORE_KEY, JSON.stringify(payload));
}

function countText(done: number, target: number | null): string {
  const goal = target === null ? "—" : target.toLocaleString("ko-KR");
  return `${done.toLocaleString("ko-KR")} / ${goal}`;
}

type CardProps = {
  title: string;
  done: number;
  target: number | null;
  large?: boolean;
};

function RateCard({ title, done, target, large }: CardProps) {
  const pct = ratePct(done, target);
  const width = pct === null ? 0 : Math.min(pct, 100);
  const shown = pct === null ? 0 : Math.min(100, Math.round(pct));
  return (
    <article className={large ? styles.overall : styles.card}>
      <h2>{title}</h2>
      <p className={styles.pct}>{formatPct(pct)}</p>
      <p className={styles.meta}>{countText(done, target)}</p>
      <div
        className={styles.track}
        role="progressbar"
        aria-label={title}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={shown}
        aria-valuetext={formatPct(pct)}
      >
        <div className={styles.fill} style={{ width: `${width}%` }} />
      </div>
    </article>
  );
}

/** 일일 목표, 층 목표, 피킹 달성률, 긴급 출하. */
export function Board() {
  const [goal, setGoal] = useState<Goal>(emptyGoal);
  const rows = urgentRows();

  useEffect(() => {
    setGoal(readGoal());
  }, []);

  function apply(next: Goal) {
    setGoal(next);
    writeGoal(next);
  }

  function onDaily(value: string) {
    const qty = cleanQty(value);
    const total = parseQty(qty);
    apply(total === null ? { ...goal, qty } : { qty, ...splitText(total) });
  }

  function onFloor(key: "f1" | "f2", value: string) {
    apply({ ...goal, [key]: cleanQty(value) });
  }

  const qty = parseQty(goal.qty);
  const floorTargets = [parseQty(goal.f1), parseQty(goal.f2)];
  const doneSum = floors.reduce((sum, floor) => sum + floor.done, 0);

  return (
    <section className={styles.board}>
      <div className={styles.goal}>
        <div className={styles.field}>
          <label htmlFor="daily-target">일일 목표 수량</label>
          <input
            id="daily-target"
            inputMode="numeric"
            autoComplete="off"
            value={goal.qty}
            onChange={(event) => onDaily(event.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="floor1-target">1층 목표 수량</label>
          <input
            id="floor1-target"
            inputMode="numeric"
            autoComplete="off"
            value={goal.f1}
            onChange={(event) => onFloor("f1", event.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="floor2-target">2층 목표 수량</label>
          <input
            id="floor2-target"
            inputMode="numeric"
            autoComplete="off"
            value={goal.f2}
            onChange={(event) => onFloor("f2", event.target.value)}
          />
        </div>
      </div>
      <div className={styles.rates}>
        <RateCard title="전체 피킹 달성률" done={doneSum} target={qty} large />
        <div className={styles.floors}>
          {floors.map((floor, index) => (
            <RateCard
              key={floor.id}
              title={`${floor.label} 피킹 달성률`}
              done={floor.done}
              target={floorTargets[index] ?? null}
            />
          ))}
        </div>
      </div>
      <section>
        <h2 className={styles.section}>긴급 출하</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">출고번호</th>
                <th scope="col">층</th>
                <th scope="col">수량</th>
                <th scope="col">출고 마감</th>
                <th scope="col">상태</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.no}>
                  <td>{row.no}</td>
                  <td>{row.floor}</td>
                  <td>{row.qty.toLocaleString("ko-KR")}</td>
                  <td>{row.due}</td>
                  <td>
                    <span className={row.status === "picking" ? styles.picking : styles.idle}>
                      {statusLabel[row.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
