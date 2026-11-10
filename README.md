# kn-report-ex

물류창고 레포트 포트폴리오. 현재 설치된 런타임은 Next.js와 TypeScript이다. 메인 화면은 헤더, 풋, 왼쪽 메뉴 셸이고 홈은 대시보드이다.

## 목적

DB 없이 창고 레포트 화면을 올리기 위한 프론트 기반을 둔다.

## 실행 방법

```powershell
npm ci
npm run typecheck
npm run dev
```

`npm run typecheck`는 `tsc --noEmit`이다. 통과하면 출력이 없고 종료 코드는 0이다.

`npm run dev`는 메인 셸을 연다. 주소는 터미널에 출력된 로컬 주소다. `/`는 `/home`으로 이동한다.

`npm run build` 후 `npm run start`로 빌드 결과를 볼 수 있다.

## 환경 변수

없다.

## 주의사항

- 이 저장소의 에이전트 규칙은 `.cursor/rules/stack.mdc`이다.
- 직접 의존성은 `next` 16.4.5, `react` 19.3.1, `react-dom` 19.3.1이다. 개발 의존성은 `typescript` 7.0.2, `@types/react` 19.3.0, `@types/react-dom` 19.3.0, `@types/node` 26.6.6이다. React 패키지에는 선언 파일이 없어 타입 패키지가 필요하다.
- 데이터는 연결하지 않는다. Python 백엔드를 두지 않는다. 피킹 완료 수량과 긴급 출하는 `src/app/home/sample.ts` 샘플이다. 입고 라인은 조회를 누를 때 `src/app/inbound/list/sample.ts`가 선택 기간으로 만든다.
- 일일·1층·2층 목표 수량은 브라우저 `localStorage` 키 `wms.dailyTarget`에 로컬 날짜와 함께 남는다. 날짜가 바뀌면 복원하지 않는다. 환경 변수는 아니다.
- 화면은 `src/app`이다. 그 바로 아래는 레이아웃, 셸, 전역 스타일, `/`에서 `/home`으로 보내는 진입만 둔다. 메뉴와 페이지 소스는 하위 폴더에 둔다. 홈은 `src/app/home`이고 주소는 `/home`이다. 왼쪽 메뉴의 입고를 누르면 입고 리스트가 펼쳐지고, 소스는 `src/app/inbound/list`, 주소는 `/inbound/list`이다. 시작일과 종료일을 조회하면 그 기간의 입고 제품 표를 만들어 보여 준다. 양 끝 날짜가 포함되고, 어떤 기간이든 결과가 있다. 같은 기간은 같은 목록이다.
- 헤더와 풋이 나뉜다. 풋에는 개발 시작일 2026년 11월 9일, 사용 도구 Cursor, 100% AI만으로 개발했다는 문구가 있다. 너비 768px 이상이며 정밀 포인터일 때 왼쪽 가장자리에 커서를 두면 메뉴가 열린다. 좁은 화면에서는 헤더의 메뉴 버튼을 쓴다. 페이지는 `PageName`으로 헤더 가운데에 이름을 올린다. 홈 이름은 대시보드이다. 홈에는 일일·1층·2층 목표 입력, 전체·1층·2층 피킹 달성률, 긴급 출하 표가 있다. 일일 목표를 바꾸면 층 목표가 계획 비율 600:400으로 채워지고, 층 칸은 따로 고칠 수 있다. 달성률은 소수점 한 자리이다.
- `src/ping.ts`의 `ping`은 화면이 아니라 타입 검사 샘플이다.
- Geist 글꼴은 빌드할 때 한 번 받아 실행 화면에서 로컬로 쓴다.
- TypeScript 7은 JavaScript 컴파일러 API(`typescript/lib/typescript.js`)를 제공하지 않는다. 타입 검사는 `tsc` CLI로 한다.
- Next.js를 붙일 때 `experimental.useTypeScriptCli: false`로 두지 않는다. 그 설정은 TypeScript 7에서 `next build`가 실패하는 경로이다.
