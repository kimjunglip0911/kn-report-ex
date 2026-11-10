import { PageName } from "../name";
import { Board } from "./board";

/** 홈 대시보드. */
export default function HomePage() {
  return (
    <>
      <PageName name="대시보드" />
      <Board />
    </>
  );
}
