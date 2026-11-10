"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { linesOf } from "./sample";
import type { InLine } from "./sample";
import styles from "./list.module.css";

const dayPattern = /^\d{4}-\d{2}-\d{2}$/;

type Result = { kind: "idle" } | { kind: "hit"; from: string; to: string; lines: InLine[] };

/** 입고 기간 조회와 제품 표. */
export function InList() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [result, setResult] = useState<Result>({ kind: "idle" });
  const fromOk = dayPattern.test(from);
  const toOk = dayPattern.test(to);
  const reversed = fromOk && toOk && from > to;
  const ready = fromOk && toOk && from <= to;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready) return;
    const lines = linesOf(from, to);
    if (lines === null) return;
    setResult({ kind: "hit", from, to, lines });
  }

  const current = result.kind !== "idle" && result.from === from && result.to === to;

  return (
    <section className={styles.board}>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.field}>
          <label htmlFor="inbound-from">시작일</label>
          <input
            id="inbound-from"
            type="date"
            autoComplete="off"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
          />
        </div>
        <span className={styles.tilde} aria-hidden="true">
          ~
        </span>
        <div className={styles.field}>
          <label htmlFor="inbound-to">종료일</label>
          <input
            id="inbound-to"
            type="date"
            autoComplete="off"
            value={to}
            onChange={(event) => setTo(event.target.value)}
          />
        </div>
        <button type="submit" disabled={!ready}>
          조회
        </button>
      </form>
      {reversed ? <p className={styles.note}>시작일이 종료일보다 늦습니다</p> : null}
      {!fromOk || !toOk ? <p className={styles.note}>시작일과 종료일을 선택하세요</p> : null}
      {ready && !current ? <p className={styles.note}>조회를 눌러 주세요</p> : null}
      {result.kind === "hit" && current ? (
        <LineTable from={result.from} to={result.to} lines={result.lines} />
      ) : null}
    </section>
  );
}

function LineTable({ from, to, lines }: { from: string; to: string; lines: InLine[] }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <caption className={styles.caption}>
          입고 기간 {from} ~ {to}
        </caption>
        <thead>
          <tr>
            <th scope="col">입고 일자</th>
            <th scope="col">입고 번호</th>
            <th scope="col">라인</th>
            <th scope="col">품목코드</th>
            <th scope="col">품목명</th>
            <th scope="col">예정수량</th>
            <th scope="col">입고수량</th>
            <th scope="col">단위</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((row) => (
            <tr key={`${row.no}-${row.line}`}>
              <td>{row.day}</td>
              <td>{row.no}</td>
              <td>{row.line}</td>
              <td>{row.code}</td>
              <td>{row.name}</td>
              <td>{row.expect.toLocaleString("ko-KR")}</td>
              <td>{row.recv.toLocaleString("ko-KR")}</td>
              <td>{row.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
