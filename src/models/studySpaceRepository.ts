// Model: 데이터 접근 계층.
// 백엔드가 없으므로 src/content/spaces/*.md 파일들을 빌드 시점에 읽어와
// frontmatter(메타데이터)와 본문(마크다운)을 파싱해 StudySpace로 변환한다.
// Firebase가 구성된 경우 Firestore에서 실시간 핀 정보를 읽어오며, 없을 경우 로컬 md 파일을 로드합니다.

import { marked } from 'marked'
import { collection, getDocs } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../lib/firebase'
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
    id: String(data.id ?? ''),
    name: String(data.name ?? '이름 없음'),
    category: String(data.category ?? '기타'),
    building: String(data.building ?? '미지정'),
    lat: Number(data.lat ?? 0),
    lng: Number(data.lng ?? 0),
    seats: Number(data.seats ?? 0),
    hours: String(data.hours ?? '정보 없음'),
    outlets: data.outlets === true,
    groupStudy: data.groupStudy === true,
    status: (String(data.status ?? 'open') as StudySpaceStatus) || 'open',
    statusNote: data.statusNote ? String(data.statusNote) : '',
    bodyHtml: marked.parse(body) as string,
  }
}

// 로컬 폴백용 정적 데이터
const fallbackSpaces: StudySpace[] = Object.values(files)
  .map(toStudySpace)
  .sort((a, b) => a.name.localeCompare(b.name, 'ko'))

export async function fetchStudySpaces(): Promise<StudySpace[]> {
  if (isFirebaseConfigured && db) {
    try {
      const querySnapshot = await getDocs(collection(db, 'spaces'))
      const spaces: StudySpace[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        spaces.push({
          id: doc.id,
          name: String(data.name ?? '이름 없음'),
          category: String(data.category ?? '기타'),
          building: String(data.building ?? '미지정'),
          lat: Number(data.lat ?? 0),
          lng: Number(data.lng ?? 0),
          seats: Number(data.seats ?? 0),
          hours: String(data.hours ?? '정보 없음'),
          outlets: data.outlets === true,
          groupStudy: data.groupStudy === true,
          status: (String(data.status ?? 'open') as StudySpaceStatus) || 'open',
          statusNote: data.statusNote ? String(data.statusNote) : '',
          // DB에 bodyHtml이 없으면 markdown description을 파싱해 사용
          bodyHtml: String(data.bodyHtml ?? (data.description ? marked.parse(data.description) : '')),
        })
      })

      // 만약 DB에서 가져온 데이터가 하나도 없으면 로컬 데이터 반환 (첫 마이그레이션 전 대응)
      if (spaces.length === 0) {
        console.warn('Firestore "spaces" 컬렉션이 비어있어 로컬 데이터를 반환합니다.')
        return fallbackSpaces
      }

      return spaces.sort((a, b) => a.name.localeCompare(b.name, 'ko'))
    } catch (e) {
      console.error('Firebase에서 공간 정보를 불러오지 못했습니다. 로컬 데이터를 사용합니다:', e)
      return fallbackSpaces
    }
  }

  return fallbackSpaces
}
