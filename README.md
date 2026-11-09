# kn-report-ex

물류창고 레포트 포트폴리오. 현재 설치된 런타임은 Next.js와 TypeScript이다. 화면 라우트는 아직 없다.

## 목적

DB 없이 창고 레포트 화면을 올리기 위한 프론트 기반을 둔다.

## 실행 방법

```powershell
npm ci
npm run typecheck
npx next --version
```

`npm run typecheck`는 `tsc --noEmit`이다. 통과하면 출력이 없고 종료 코드는 0이다.

`npx next --version`은 설치된 Next.js 버전을 출력한다.

`npm run dev`, `npm run build`는 `app/` 또는 `pages/` 라우트가 생긴 뒤에 쓴다. 지금은 화면 파일이 없다.

## 환경 변수

없다.

## 주의사항

- 직접 의존성은 `next` 16.4.5, `react` 19.3.1, `react-dom` 19.3.1, `typescript` 7.0.2이다.
- 데이터는 연결하지 않는다. Python 백엔드를 두지 않는다.
- `src/ping.ts`의 `ping`은 화면이 아니라 타입 검사 샘플이다.
- TypeScript 7은 JavaScript 컴파일러 API(`typescript/lib/typescript.js`)를 제공하지 않는다. 타입 검사는 `tsc` CLI로 한다.
- Next.js를 붙일 때 `experimental.useTypeScriptCli: false`로 두지 않는다. 그 설정은 TypeScript 7에서 `next build`가 실패하는 경로이다.
