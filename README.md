# kn-report-ex

물류창고 레포트 포트폴리오. 이번 단계의 산출물은 TypeScript 타입 검사 툴체인이다.

## 목적

창고 레포트 화면을 올리기 전에, DB 없이 TypeScript 7.0.2만으로 타입이 검사되는 프로젝트를 만든다.

## 실행 방법

```powershell
npm ci
npm run typecheck
```

`npm run typecheck`는 `tsc --noEmit`이다. 통과하면 출력이 없고 종료 코드는 0이다.

## 환경 변수

없다.

## 주의사항

- 설치된 npm 패키지는 `typescript` 7.0.2뿐이다.
- 데이터는 연결하지 않는다. Python 백엔드를 두지 않는다.
- `src/ping.ts`의 `ping`은 화면이 아니라 타입 검사 샘플이다.
- TypeScript 7은 JavaScript 컴파일러 API(`typescript/lib/typescript.js`)를 제공하지 않는다. 타입 검사는 `tsc` CLI로 한다.
- 이후 화면은 Next.js로 붙인다. 그 작업은 별도 플랜이다. Next.js를 붙일 때 `experimental.useTypeScriptCli: false`로 두지 않는다. 그 설정은 TypeScript 7에서 `next build`가 실패하는 경로이다.
