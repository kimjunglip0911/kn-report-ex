"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { TitleFrame } from "./name";

/** 헤더, 풋, 왼쪽 호버 메뉴. */
type MenuMode = "closed" | "hover" | "pinned";

const OPEN_MS = 180;
const CLOSE_MS = 280;
const HOVER_QUERY = "(hover: hover) and (pointer: fine) and (min-width: 768px)";

type Timer = { current: number | null };

function clearTimer(timer: Timer) {
  if (timer.current !== null) {
    window.clearTimeout(timer.current);
    timer.current = null;
  }
}

export function SiteShell({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<MenuMode>("closed");
  const [canHover, setCanHover] = useState(false);
  const modeRef = useRef(mode);
  const hoverRef = useRef(canHover);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const subId = useId();
  const path = usePathname();
  const [groupOpen, setGroupOpen] = useState(path.startsWith("/inbound"));

  modeRef.current = mode;
  hoverRef.current = canHover;

  function setMode(next: MenuMode) {
    modeRef.current = next;
    setModeState(next);
  }

  function closeToBtn() {
    clearTimer(openTimer);
    clearTimer(closeTimer);
    setMode("closed");
    menuBtn.current?.focus();
  }

  useEffect(() => {
    const query = window.matchMedia(HOVER_QUERY);
    const apply = () => setCanHover(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!canHover && mode === "hover") setMode("closed");
  }, [canHover, mode]);

  useEffect(() => {
    return () => {
      clearTimer(openTimer);
      clearTimer(closeTimer);
    };
  }, []);

  useEffect(() => {
    if (path.startsWith("/inbound")) setGroupOpen(true);
  }, [path]);

  useEffect(() => {
    if (mode === "closed") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeToBtn();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

  function scheduleOpen() {
    if (!hoverRef.current || modeRef.current === "pinned") return;
    clearTimer(closeTimer);
    if (modeRef.current === "hover" || openTimer.current !== null) return;
    openTimer.current = window.setTimeout(() => {
      openTimer.current = null;
      if (modeRef.current === "pinned" || !hoverRef.current) return;
      setMode("hover");
    }, OPEN_MS);
  }

  function scheduleClose() {
    if (modeRef.current === "pinned") return;
    clearTimer(openTimer);
    if (modeRef.current !== "hover") return;
    clearTimer(closeTimer);
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;
      if (modeRef.current !== "hover") return;
      setMode("closed");
    }, CLOSE_MS);
  }

  function togglePinned() {
    clearTimer(openTimer);
    clearTimer(closeTimer);
    setMode(modeRef.current === "pinned" ? "closed" : "pinned");
  }

  const open = mode !== "closed";

  return (
    <TitleFrame>
      {(title) => (
        <div className="frame">
          <header className="header">
            <button
              ref={menuBtn}
              type="button"
              className="menu-btn"
              aria-expanded={open}
              aria-controls={menuId}
              onClick={togglePinned}
            >
              메뉴
            </button>
            <h1 className="page-name">{title}</h1>
            <p className="brand">WMS Report</p>
          </header>
          <main className="main">{children}</main>
          <footer className="footer">
            <p className="footer-note">물류창고 레포트</p>
            <p className="footer-note">개발 시작 2026년 11월 9일 · 사용 도구 Cursor · 100% AI만으로 개발</p>
          </footer>
          {mode === "pinned" ? (
            <button type="button" className="backdrop" aria-label="메뉴 닫기" onClick={closeToBtn} />
          ) : null}
          <div className="edge" onPointerEnter={scheduleOpen} onPointerLeave={scheduleClose} />
          <nav
            id={menuId}
            className={open ? "menu menu-open" : "menu"}
            aria-label="메뉴"
            aria-hidden={open ? undefined : true}
            inert={open ? undefined : true}
            onPointerEnter={scheduleOpen}
            onPointerLeave={scheduleClose}
          >
            <Link
              className="menu-link"
              href="/home"
              aria-current={path === "/home" ? "page" : undefined}
              onClick={closeToBtn}
            >
              홈
            </Link>
            <div className="menu-group">
              <button
                type="button"
                className="menu-link menu-parent"
                aria-expanded={groupOpen}
                aria-controls={subId}
                onClick={() => setGroupOpen((open) => !open)}
              >
                입고
                <span className="menu-caret" aria-hidden="true" />
              </button>
              <div className="menu-subs" id={subId} hidden={groupOpen ? undefined : true}>
                <Link
                  className="menu-link menu-sub"
                  href="/inbound/list"
                  aria-current={path === "/inbound/list" ? "page" : undefined}
                  onClick={closeToBtn}
                >
                  입고 리스트
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </TitleFrame>
  );
}
