import { PageName } from "../../name";
import { OrderList } from "./list";

/** 웨이브 주문 기간과 조건으로 주문 목록을 조회한다. */
export default function OrderPage() {
  return (
    <>
      <PageName name="주문 리스트" />
      <OrderList />
    </>
  );
}
