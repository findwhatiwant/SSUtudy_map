# 프로젝트 명

SSUtudy Map

# 프로젝트 개요

숭실대 내의 공부 공간을 보여주는 모바일 웹

# 목표

도서관 휴무 사태에 학생들이 대응할 수 있게 하자
사용자 목표 수: 200명

# 주요 기능

지도를 이동시키고 지도 위의 핀을 선택 시 해당 공부공간의 자세한 정보가 모달창으로 올라온다.
지도는 숭실대 내부를 기준으로 한다.
방문자 수를 체크할 수 있어야한다.

# 필요 스택

- **빌드/언어**: Vite + React + TypeScript — 가볍고 빠른 모바일 SPA, 마커 클릭/팝업 상태 관리에 적합
- **스타일**: Tailwind CSS — 모바일 반응형·터치 UI 빠르게 구성
- **지도**: 카카오맵 (JS SDK 또는 Static Image API) — 국내 데이터 정확, 무료 티어, 가벼운 인터랙션에 적합
- **상태관리**: React useState/Context (필요 시 Zustand)
- **데이터**: `public/`의 정적 JSON (백엔드 없이 공부 공간·마커 정보 포함)
- **배포**: Vercel 또는 Netlify — 정적 호스팅, 자동 배포
- **추가**: PWA (홈 화면 추가)로 모바일 웹 사용성 향상

# 시스템 구조

데이터베이스가 없는 형태이지만 MVP 디자인패턴을 최대한 지향한다.

# UI 화면 구성

# 데이터 모델

# API 설계

# 일정 및 마일스톤

# 배포 및 운영

깃허브 웹페이지 배포 (GitHub Pages)

- 배포 URL: https://findwhatiwant.github.io/SSUtudy_map/
- `main` 브랜치 push 시 GitHub Actions(`.github/workflows`)가 빌드 후 자동 배포한다.
- `vite.config.ts`의 `base`는 저장소 이름(`/SSUtudy_map/`)과 일치해야 한다.
- 카카오맵 JavaScript 키는 코드에 넣지 않고 **GitHub Secret `VITE_KAKAO_MAP_KEY`** 로 주입한다.
  - 로컬 개발은 `.env.local`(gitignore됨)에 키를 둔다.
  - Vite는 빌드 시점에 환경변수를 번들에 박으므로, **Secret을 바꾸면 반드시 재배포**해야 반영된다.

# 작업 기록 (트러블슈팅)

## 1. 배포본에서 카카오맵이 표시되지 않던 문제
- **원인 A — Secret 미적용**: Secret 등록 이후 재배포를 하지 않아 번들의 키가 비어 있었음. → 워크플로 재실행으로 해결.
- **원인 B — 카카오맵 서비스 비활성화**: 키/도메인은 정상이나 카카오 콘솔에서 "카카오맵" 제품이 OFF 상태였음
  (SDK 응답: `NotAuthorizedError: disabled OPEN_MAP_AND_LOCAL service`).
  → 카카오 개발자 콘솔 → 앱 → 제품 설정 → **카카오맵 활성화 ON** 으로 해결.

## 2. 모바일(터치)에서 지도 드래그 이동이 안 되던 문제
- **원인**: 지도 컨테이너의 기본 `touch-action: auto` 때문에 브라우저가 한 손가락 드래그를
  스크롤 제스처로 가로채 카카오맵에 `touchmove`가 전달되지 않음.
- **해결**: 지도 `div`에 `touch-none`(= `touch-action: none`) 적용 (`src/views/MapView.tsx`).

## 3. API 키 노출 점검
- 키 문자열은 git 히스토리 어디에도 없음. `.env*`, `dist`는 추적 제외(정상).
- 카카오 **JavaScript 키는 본래 클라이언트에 공개되는 키**이며, 보호는 키 은닉이 아니라
  **콘솔의 웹 도메인 화이트리스트**로 이루어진다(등록되지 않은 도메인은 `domain mismatched`로 차단됨).
- 운영 수칙: REST/Admin 키는 절대 프론트엔드에 두지 않는다. 도메인 화이트리스트는 필요한 것만 등록한다.
