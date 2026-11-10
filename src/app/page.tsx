import { redirect } from "next/navigation";

/** 첫 주소는 홈 대시보드로 보낸다. */
export default function IndexPage() {
  redirect("/home");
}
