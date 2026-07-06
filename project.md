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
- **지도**: 카카오맵 JS SDK (마커 클러스터러 라이브러리 사용) — 국내 데이터 정확, 무료 티어 제공
- **상태관리**: React useState / React Callback Hook / Presenter Hook
- **데이터**: `src/content/spaces/` 내의 개별 `.md` 마크다운 파일 (프론트매터 파싱 및 Marked 기반 HTML 변환)
- **배포**: GitHub Pages (GitHub Actions를 통한 `main` 브랜치 자동 빌드 및 배포)
- **추가**: PWA (홈 화면 추가)로 모바일 웹 사용성 향상

# 시스템 구조

백엔드가 없는 정적 클라이언트 단일 애플리케이션으로, 코드의 관심사 분리를 위해 MVP 디자인패턴을 지향한다.
- **Model**: [studySpace.ts](file:///Users/jousig/programming/SSU_study_map/src/models/studySpace.ts), [frontmatter.ts](file:///Users/jousig/programming/SSU_study_map/src/models/frontmatter.ts), [studySpaceRepository.ts](file:///Users/jousig/programming/SSU_study_map/src/models/studySpaceRepository.ts) (데이터 구조 정의 및 마크다운 정적 파싱)
- **Presenter**: [useStudyMapPresenter.ts](file:///Users/jousig/programming/SSU_study_map/src/presenters/useStudyMapPresenter.ts) (동작 관리 및 로직 캡슐화)
- **View**: [MapView.tsx](file:///Users/jousig/programming/SSU_study_map/src/views/MapView.tsx), [StudySpaceModal.tsx](file:///Users/jousig/programming/SSU_study_map/src/views/StudySpaceModal.tsx), [ReportSpaceModal.tsx](file:///Users/jousig/programming/SSU_study_map/src/views/ReportSpaceModal.tsx) (UI 표출)

# UI 화면 구성

- **헤더**: 스터디 스팟 앱 제목 및 전체 공간 개수 노출
- **지도 뷰 (MapView)**: 숭실대학교 캠퍼스 지도를 바탕으로, 카카오맵 API 연동. 지도 축소(레벨 4 이상) 시 핀 마커 클러스터링 표출.
- **상세 정보 모달 (StudySpaceModal)**: 핀 선택 시 하단 바텀 시트로 올라오며, 상세 속성(좌석 수, 콘센트, 그룹 스터디, 운영 시간)과 마크다운 렌더링된 본문 HTML 표출.
- **공간 제보 모달 (ReportSpaceModal)**: 우하단 플로팅 버튼 클릭 시 올라오는 입력 폼. 제스처(스와이프/드래그 다운)를 통한 닫기 지원.
- **대체 리스트 뷰 (MapFallback)**: 카카오맵 SDK 로드 실패 시 나타나는 백업 리스트. 핀 선택 기능은 동일하게 작동.

# 데이터 모델

### StudySpace 인터페이스
- `id: string` : 고유 식별자
- `name: string` : 공간명
- `category: string` : 카테고리 (도서관, 열람실, 로비/쉼터, 카페, 기타)
- `building: string` : 소속 건물명
- `lat: number` : 위도
- `lng: number` : 경도
- `seats: number` : 총 좌석 수
- `hours: string` : 이용 가능 시간
- `outlets: boolean` : 콘센트 유무
- `groupStudy: boolean` : 그룹 스터디 가능 여부
- `status: 'open' | 'closed' | 'crowded'` : 혼잡도/이용상태
- `statusNote: string` : 상태 관련 안내문구
- `bodyHtml: string` : 마크다운에서 변환된 설명 영역 HTML

# API 설계

### 정적 빌드 컴파일 (Option 2) 및 런타임 페치
- 빌드 타임에 Node.js 스크립트([compile-spaces.js](file:///Users/jousig/programming/SSU_study_map/scripts/compile-spaces.js))가 Firestore에서 승인된 스팟 데이터를 REST API로 조회하여 [spaces.json](file:///Users/jousig/programming/SSU_study_map/public/spaces.json) 파일로 컴파일합니다.
- 런타임 클라이언트([studySpaceRepository.ts](file:///Users/jousig/programming/SSU_study_map/src/models/studySpaceRepository.ts))는 이 `./spaces.json`을 단일 HTTP GET 요청으로 비동기 호출하여 로드함으로써 파이어베이스 데이터 읽기(Read) 비용을 0원으로 완벽히 예방합니다.

# 일정 및 마일스톤 (개발 현황 및 해야할 일)

### 1단계: MVP 개발 및 기능 구현 (완료)
- [x] 프로젝트 초기 환경 설정 및 기본 뼈대 구성
- [x] 마크다운 기반 공간 데이터 추가 및 파서 구현
- [x] 카카오맵 SDK 연동 및 공간별 커스텀 마커(상태별 색상 분기) 표출
- [x] 마커 클러스터러 도입 (지도 축소 시 자동 그룹화 적용)
- [x] 공간 선택 시 하단 상세 바텀 시트 연동 (Marked 렌더링)
- [x] 모바일 스와이프 제스처가 적용된 공간 제보 폼 모달 개발
- [x] GitHub Pages 빌드 및 배포 자동화 파이프라인 구성

### 2단계: 최적화 및 파이어베이스 데이터 마이그레이션 (완료)
- [x] 파이어베이스(Firestore) 연동 및 마이그레이션 스크립트 작성 (`migrate.js`)
- [x] 빌드 타임 컴파일 (`compile-spaces.js`)을 적용한 데이터 로드 방식 구현 (서버 읽기 비용 0원)
- [x] 깃허브 배포 워크플로우(`deploy.yml`) 빌드 시점에 파이어베이스 환경변수 주입 적용
- [x] 공간 제보 시 Firestore `suggestions` 컬렉션에 실시간 데이터 적재 연동
- [x] 제보 폼 내 지도를 통한 핀 위치 지정 및 위도/경도 자동 기입 기능 구현
- [x] 제보 버튼 상단 영역 구글 애드센스 플로팅 배너 컴포넌트(`GoogleAd.tsx`) 추가

### 3단계: 운영 릴리즈 및 모니터링 준비 (진행 중)
- [ ] **파이어베이스 Firestore DB 규칙 임시 오픈 및 핀 복구 마이그레이션 실행** (규칙 수정 대기 중)
- [ ] **구글 애드센스 승인 완료 후 깃허브 Secrets 등록 및 활성화** (VITE_GOOGLE_AD_CLIENT, VITE_GOOGLE_AD_SLOT)
- [ ] **API 비용 추적 및 사용량 모니터링**
  - 카카오 디벨로퍼스 일일 제한 쿼터(지도 호출 30만 건, 로컬 API 10만 건) 모니터링 및 알림 설정
  - 비즈월렛 연동 정책 및 단일 무료 앱 쿼터 활성화 여부 주기적 체크
- [ ] **보안 관리 강화**
  - 카카오 개발자 콘솔의 **Web 플랫폼 도메인 화이트리스트** 설정을 엄격히 관리 (`localhost`, github.io 배포 도메인만 허용)
  - 주기적인 API 키 이상 트래픽 관리 및 GitHub Secrets 관리 강화
- [ ] **방문자 수 측정 기능 구현**
  - 사용자 수 목표(200명) 도달을 추적하기 위한 Google Analytics(GA4) 또는 카카오 픽셀/Vercel Analytics 연동
- [ ] **PWA (Progressive Web App) 도입**
  - 모바일 홈 화면 바로가기 추가 및 오프라인에서도 기본 정보 확인이 가능하도록 캐싱 설정 추가

# 배포 및 운영

깃허브 웹페이지 배포 (GitHub Pages)

- 배포 URL: https://findwhatiwant.github.io/SSUtudy_map/
- `main` 브랜치 push 시 GitHub Actions(`.github/workflows`)가 빌드 후 자동 배포한다.
- `vite.config.ts`의 `base`는 저장소 이름(`/SSUtudy_map/`)과 일치해야 한다.
- 카카오맵 JavaScript 키 및 파이어베이스/애드센스 설정 키는 코드에 넣지 않고 **GitHub Secrets**로 주입한다.
  - 로컬 개발은 `.env.local`(gitignore됨)에 키를 둔다.
  - Vite는 빌드 시점에 환경변수를 번들에 박으므로, **Secret을 바꾸면 반드시 재배포(워크플로우 수동 실행 등)**해야 반영된다.

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

## 4. 마커 클러스터링 도입 및 코드 리팩토링
- **클러스터러 기능 도입**: 지도를 대폭 축소했을 때 다수의 핀이 겹치지 않고 보기 편하도록 `MarkerClusterer` 라이브러리를 동적 로드하고 `minLevel: 4` 옵션으로 숭실대 내부 상세 뷰를 유지하며 축소 시에만 클러스터로 묶이도록 보완.
- **입력 폼 상태 결합**: `ReportSpaceModal` 내 8개의 단일 필드 `useState` 훅을 하나의 `FormState` 객체 관리형태로 통폐합해, 초기화(`INITIAL_FORM`) 및 갱신(`handleChange`) 코드를 간략하고 확장성 있게 리팩토링.
- **데이터 예외 복구**: 공부 공간 레포지토리 로드 시 데이터가 비어있거나 타입 불일치가 있을 시 기본값(Fallback)을 주도록 안전 장치를 구축하고, 마크다운 렌더러를 동기 빌드 타임에 부합하는 `marked.parseSync`로 구조적 전환.

## 5. 깃허브 배포 워크플로우 내 파이어베이스 환경변수 누락
- **원인**: GitHub Secrets에 파이어베이스 설정값들을 등록했으나, `.github/workflows/deploy.yml` 파일의 빌드 단계(`npm run build`) 환경변수 매핑(`env`) 부분에 누락되어 정적 배포 사이트에서 핀 조회가 되지 않던 현상.
- **해결**: `deploy.yml`에 `VITE_FIREBASE_API_KEY` 등 7가지 비밀키 주입 코드를 매핑하여 자동 빌딩 시 포함되도록 수정.

## 6. 제보 폼 내 지도를 통한 핀 위치 좌표 지정 UI 구현
- **기능**: 공간 제보 시 학생들이 마커를 직접 지도에 꽂아 위도/경도를 전송할 수 있는 고급 좌표 입력 인터페이스 제공.
- **해결**: `ReportSpaceModal`에서 **[위치 지정]** 클릭 시 모달창이 슬라이드 아웃되고 지도를 탭하여 파란색 선택 핀을 꽂은 뒤 **[선택 완료]**를 누르면 폼의 위도와 경도가 자동으로 채워지는 모바일 터치 친화 UX 구현.

## 7. 구글 애드센스 플로팅 광고 배너 및 폴백 구현
- **기능**: 서버/플랫폼 유지 비용 충당을 위해 하단 제보 버튼 상단(`bottom-24` 및 `right-6`)에 플로팅 형태로 자연스럽게 녹아드는 구글 애드센스(Google AdSense) 카드 배너 컴포넌트(`GoogleAd.tsx`) 추가.
- **예외 처리**: 광고 차단 필터가 설정되었거나 환경변수가 등록되지 않은 환경(예: 개발 도중)에는 사용자 방해가 덜하면서 완성도 높은 **"☕️ 개발자 커피 한 잔 후원하기" 모의 배너**로 자동 폴백 노출되도록 제어 로직 추가.
