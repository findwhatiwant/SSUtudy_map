# SSUtudy Map

숭실대학교 내 공부 공간을 보여주는 모바일 웹. 지도를 이동하고 핀을 누르면 해당 공부 공간의 상세 정보가 모달로 표시됩니다. (도서관 휴관 시 대체 공간 안내가 주 목적)

## 기술 스택

- Vite + React + TypeScript
- Tailwind CSS
- 카카오맵 JS SDK
- 데이터: `src/content/spaces/*.md` (핀 하나당 마크다운 파일 하나, 백엔드 없음)
- 마크다운 렌더링: `marked`
- 아키텍처: MVP 패턴
  - **Model** — `src/models/` (타입, frontmatter 파서, 데이터 접근)
  - **View** — `src/views/` (`MapView`, `StudySpaceModal`)
  - **Presenter** — `src/presenters/useStudyMapPresenter.ts`

### 핀(공부 공간) 추가/수정

`src/content/spaces/` 에 `.md` 파일을 만들면 됩니다. 상단 frontmatter에 좌표·상태 등
구조화된 값을, 본문에 마크다운 설명을 적으면 빌드 시 자동으로 지도 핀과 모달에 반영됩니다.

```markdown
---
id: my-space
name: 새 공부 공간
category: 열람실
building: 어느 건물
lat: 37.4960
lng: 126.9577
seats: 100
hours: 평일 09:00 - 22:00
outlets: true
groupStudy: false
status: open        # open | closed | crowded
statusNote: 안내 문구 (없으면 비워둠)
---

여기에 **마크다운**으로 설명을 적습니다. 목록, 인용구 등 사용 가능.
```

## 시작하기

```bash
npm install
cp .env.example .env.local   # VITE_KAKAO_MAP_KEY 채우기
npm run dev
```

카카오 JavaScript 키는 [카카오 개발자 콘솔](https://developers.kakao.com)에서 발급하고,
앱 설정 > 플랫폼 > Web 에 실행 도메인(예: `http://localhost:5173`)을 등록하세요.

> 키가 없어도 앱은 동작합니다 — 지도 대신 공부 공간 목록 화면으로 대체되며 핀(항목) 선택 시 모달이 뜹니다.

## 빌드 & 배포

```bash
npm run build     # 타입체크 + 프로덕션 번들
npm run preview   # 빌드 결과 미리보기
```

`main` 브랜치 푸시 시 `.github/workflows/deploy.yml` 가 GitHub Pages로 자동 배포합니다.
저장소 Settings > Secrets 에 `VITE_KAKAO_MAP_KEY` 를 등록하세요.
`vite.config.ts` 의 `base` 는 저장소 이름(`/SSU_study_map/`)에 맞춰져 있습니다.
