"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { matchOrder, ordersOf, shopLabel, stateLabel } from "./sample";
import type { Order, OrderShop, OrderState } from "./sample";
import styles from "./order.module.css";

const dayPattern = /^\d{4}-\d{2}-\d{2}$/;

type Result = {
  kind: "hit";
  from: string;
  to: string;
  state: OrderState | "all";
  shop: OrderShop | "all";
  no: string;
  orders: Order[];
};

/** 주문 기간, 상태, 주문처, 주문 번호 조회. */
export function OrderList() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [state, setState] = useState<OrderState | "all">("all");
  const [shop, setShop] = useState<OrderShop | "all">("all");
  const [orderNo, setOrderNo] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const fromOk = dayPattern.test(from);
  const toOk = dayPattern.test(to);
  const reversed = fromOk && toOk && from > to;
  const ready = fromOk && toOk && from <= to;
  const no = orderNo.trim();
  const current =
    result !== null &&
    result.from === from &&
    result.to === to &&
    result.state === state &&
    result.shop === shop &&
    result.no === no;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready) return;
    const made = ordersOf(from, to);
    if (made === null) return;
    const orders = made.filter((order) => matchOrder(order, { state, shop, no }));
    setResult({ kind: "hit", from, to, state, shop, no, orders });
  }

  const qty = current && result ? result.orders.reduce((sum, order) => sum + order.qty, 0) : 0;

  return (
    <section className={styles.board}>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.field}>
          <label htmlFor="order-from">시작일</label>
          <input
            id="order-from"
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
          <label htmlFor="order-to">종료일</label>
          <input
            id="order-to"
            type="date"
            autoComplete="off"
            value={to}
            onChange={(event) => setTo(event.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="order-state">상태</label>
          <select
            id="order-state"
            value={state}
            onChange={(event) => setState(event.target.value as OrderState | "all")}
          >
            <option value="all">전체</option>
            <option value="urgent">긴급</option>
            <option value="normal">보통</option>
            <option value="promo">프로모션</option>
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="order-shop">주문처</label>
          <select
            id="order-shop"
            value={shop}
            onChange={(event) => setShop(event.target.value as OrderShop | "all")}
          >
            <option value="all">전체</option>
            <option value="own">자사몰</option>
            <option value="coupang">쿠팡</option>
            <option value="naver">네이버</option>
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="order-no">주문 번호</label>
          <input
            id="order-no"
            type="text"
            autoComplete="off"
            value={orderNo}
            onChange={(event) => setOrderNo(event.target.value)}
          />
        </div>
        <button type="submit" disabled={!ready}>
          조회
        </button>
      </form>
      {reversed ? <p className={styles.note}>시작일이 종료일보다 늦습니다</p> : null}
      {!fromOk || !toOk ? <p className={styles.note}>시작일과 종료일을 선택하세요</p> : null}
      {ready && !current ? <p className={styles.note}>조회를 눌러 주세요</p> : null}
      {current && result ? (
        <>
          <div className={styles.cards}>
            <article className={styles.card}>
              <h2>총 주문 건수</h2>
              <p>{result.orders.length.toLocaleString("ko-KR")}</p>
            </article>
            <article className={styles.card}>
              <h2>총 주문 수량</h2>
              <p>{qty.toLocaleString("ko-KR")}</p>
            </article>
          </div>
          {result.orders.length === 0 ? (
            <p className={styles.note}>조건에 맞는 주문이 없습니다</p>
          ) : (
            <OrderTable from={result.from} to={result.to} orders={result.orders} />
          )}
        </>
      ) : null}
    </section>
  );
}

function OrderTable({ from, to, orders }: { from: string; to: string; orders: Order[] }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <caption className={styles.caption}>
          주문 기간 {from} ~ {to}
        </caption>
        <thead>
          <tr>
            <th scope="col">주문 번호</th>
            <th scope="col">주문일</th>
            <th scope="col">상태</th>
            <th scope="col">주문처</th>
            <th scope="col">수량</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.no}>
              <td>{order.no}</td>
              <td>{order.day}</td>
              <td>{stateLabel[order.state]}</td>
              <td>{shopLabel[order.shop]}</td>
              <td>{order.qty.toLocaleString("ko-KR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
