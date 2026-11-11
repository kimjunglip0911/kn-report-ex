import { PageName } from "../../name";
import styles from "./order.module.css";

/** 웨이브 주문 리스트. 조회 화면은 이후에 만든다. */
export default function OrderPage() {
  return (
    <>
      <PageName name="주문 리스트" />
      <section className={styles.blank}>
        <p>주문 리스트 화면은 이후에 만든다.</p>
      </section>
    </>
  );
}
