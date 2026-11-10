import { PageName } from "../../name";
import { InList } from "./list";

/** 입고 기간으로 제품 목록을 조회한다. */
export default function InListPage() {
  return (
    <>
      <PageName name="입고 리스트" />
      <InList />
    </>
  );
}
