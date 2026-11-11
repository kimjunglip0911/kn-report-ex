import { PageName } from "../../name";
import { RackBoard } from "./rack";

/** 비어 있는 랙을 구역 박스로 보여 준다. */
export default function RackPage() {
  return (
    <>
      <PageName name="랙 현황" />
      <RackBoard />
    </>
  );
}
