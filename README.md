# kn-report-ex

물류창고 레포트 포트폴리오. 현재 설치된 런타임은 Next.js와 TypeScript이다. 메인 화면은 헤더, 풋, 왼쪽 메뉴 셸이고 본문은 비어 있다.

## 목적

DB 없이 창고 레포트 화면을 올리기 위한 프론트 기반을 둔다.

## 실행 방법

```powershell
npm ci
npm run typecheck
npm run dev
```

`npm run typecheck`는 `tsc --noEmit`이다. 통과하면 출력이 없고 종료 코드는 0이다.

`npm run dev`는 메인 셸을 연다. 주소는 터미널에 출력된 로컬 주소다.

`npm run build` 후 `npm run start`로 빌드 결과를 볼 수 있다.

## 환경 변수

없다.

## 주의사항

- 이 저장소의 에이전트 규칙은 `.cursor/rules/stack.mdc`이다.
- 직접 의존성은 `next` 16.4.5, `react` 19.3.1, `react-dom` 19.3.1이다. 개발 의존성은 `typescript` 7.0.2, `@types/react` 19.3.0, `@types/react-dom` 19.3.0, `@types/node` 26.6.6이다. React 패키지에는 선언 파일이 없어 타입 패키지가 필요하다.
- 데이터는 연결하지 않는다. Python 백엔드를 두지 않는다.
- 화면은 `src/app`이다. 헤더와 풋이 나뉘고, 너비 768px 이상이며 정밀 포인터일 때 왼쪽 가장자리에 커서를 두면 메뉴가 열린다. 좁은 화면에서는 헤더의 메뉴 버튼을 쓴다. 본문은 비어 있다.
- `src/ping.ts`의 `ping`은 화면이 아니라 타입 검사 샘플이다.
- Geist 글꼴은 빌드할 때 한 번 받아 실행 화면에서 로컬로 쓴다.
- TypeScript 7은 JavaScript 컴파일러 API(`typescript/lib/typescript.js`)를 제공하지 않는다. 타입 검사는 `tsc` CLI로 한다.
- Next.js를 붙일 때 `experimental.useTypeScriptCli: false`로 두지 않는다. 그 설정은 TypeScript 7에서 `next build`가 실패하는 경로이다.
