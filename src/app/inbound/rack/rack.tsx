"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { rackFloors } from "./sample";
import type { FloorId, RackFloor } from "./sample";
import styles from "./rack.module.css";

const floors = rackFloors();

function slotTotal(floor: RackFloor): number {
  return floor.zones.reduce((sum, zone) => sum + zone.slots.length, 0);
}

/** 층 카드와 빈 로케이션 박스. */
export function RackBoard() {
  const [floorId, setFloorId] = useState<FloorId>(floors[0].id);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const floor = floors.find((item) => item.id === floorId) ?? floors[0];

  function onTabsKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const index = floors.findIndex((item) => item.id === floor.id);
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + step + floors.length) % floors.length;
    setFloorId(floors[next].id);
    tabs.current[next]?.focus();
  }

  return (
    <section className={styles.board}>
      <div className={styles.floors} role="tablist" aria-label="층" onKeyDown={onTabsKey}>
        {floors.map((item, index) => (
          <button
            key={item.id}
            ref={(node) => {
              tabs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`floor-${item.id}`}
            className={item.id === floor.id ? styles.cardOn : styles.card}
            aria-selected={item.id === floor.id}
            aria-controls="rack-lanes"
            tabIndex={item.id === floor.id ? 0 : -1}
            onClick={() => setFloorId(item.id)}
          >
            <span className={styles.cardName}>
              {item.id} {item.label}
            </span>
            <span className={styles.cardCount}>{slotTotal(item).toLocaleString("ko-KR")}</span>
          </button>
        ))}
      </div>
      <div
        className={styles.lanes}
        id="rack-lanes"
        role="tabpanel"
        aria-labelledby={`floor-${floor.id}`}
      >
        {floor.zones.map((zone) => (
          <section key={zone.code} className={styles.lane} aria-labelledby={`zone-${zone.code}`}>
            <header className={styles.head}>
              <h2 id={`zone-${zone.code}`} className={styles.zone}>
                {zone.code}
              </h2>
              <p className={styles.count}>{zone.slots.length.toLocaleString("ko-KR")}</p>
            </header>
            <ul className={styles.slots}>
              {zone.slots.map((code) => (
                <li key={code} className={styles.slot}>
                  {code}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
