"use client";

import { createContext, useContext, useLayoutEffect, useState } from "react";
import type { ReactNode } from "react";

const TitleCtx = createContext<(name: string) => void>(() => {});

/** 헤더 가운데 이름을 페이지와 공유한다. */
export function TitleFrame({ children }: { children: (title: string) => ReactNode }) {
  const [title, setTitle] = useState("");
  return <TitleCtx.Provider value={setTitle}>{children(title)}</TitleCtx.Provider>;
}

/** 현재 페이지 이름. 떠나면 헤더에서 지운다. */
export function PageName({ name }: { name: string }) {
  const setTitle = useContext(TitleCtx);
  useLayoutEffect(() => {
    setTitle(name);
    return () => setTitle("");
  }, [name, setTitle]);
  return null;
}
