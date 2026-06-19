// Model: 데이터 접근 계층.
// 백엔드가 없으므로 src/content/spaces/*.md 파일들을 빌드 시점에 읽어와
// frontmatter(메타데이터)와 본문(마크다운)을 파싱해 StudySpace로 변환한다.
// 핀을 추가하려면 .md 파일 하나만 더 만들면 된다.

import { marked } from 'marked'
import type { StudySpace, StudySpaceStatus } from './studySpace'
import { parseMarkdown } from './frontmatter'

// Vite glob import: 모든 마크다운을 원문 문자열로 가져온다 (eager = 동기 로드).
const files = import.meta.glob('../content/spaces/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

marked.setOptions({ breaks: true })

function toStudySpace(raw: string): StudySpace {
  const { data, body } = parseMarkdown(raw)
  return {
    id: String(data.id),
    name: String(data.name),
    category: String(data.category),
    building: String(data.building),
    lat: Number(data.lat),
    lng: Number(data.lng),
    seats: Number(data.seats),
    hours: String(data.hours),
    outlets: data.outlets === true,
    groupStudy: data.groupStudy === true,
    status: String(data.status) as StudySpaceStatus,
    statusNote: data.statusNote ? String(data.statusNote) : '',
    bodyHtml: marked.parse(body) as string,
  }
}

const spaces: StudySpace[] = Object.values(files)
  .map(toStudySpace)
  .sort((a, b) => a.name.localeCompare(b.name, 'ko'))

export async function fetchStudySpaces(): Promise<StudySpace[]> {
  // 인터페이스 호환을 위해 Promise로 감싼다. 추후 API 서버로 바꿔도 시그니처 유지.
  return spaces
}
