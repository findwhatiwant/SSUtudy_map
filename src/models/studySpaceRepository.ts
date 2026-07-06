// Model: 데이터 접근 계층.
// 빌드 타임에 생성된 static/spaces.json 파일을 먼저 읽어오고 (네트워크 오버헤드 방지),
// 실패 시 백업용으로 파이어스토어에서 직접 공간 정보를 로드합니다.

import { marked } from 'marked'
import { collection, getDocs } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../lib/firebase'
import type { StudySpace, StudySpaceStatus } from './studySpace'

marked.setOptions({ breaks: true })

export async function fetchStudySpaces(): Promise<StudySpace[]> {
  // 1. static spaces.json 가져오기 시도 (네트워크 읽기 비용 0원)
  try {
    const response = await fetch('./spaces.json')
    if (response.ok) {
      const spaces = await response.json() as StudySpace[]
      if (spaces && spaces.length > 0) {
        return spaces.sort((a, b) => a.name.localeCompare(b.name, 'ko'))
      }
    }
  } catch (error) {
    console.warn('정적 spaces.json 로드 실패. Firestore에서 실시간 조회를 시도합니다.', error)
  }

  // 2. 정적 파일 로드 실패 시 파이어스토어 실시간 직접 조회 (백업용 폴백)
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
          bodyHtml: String(data.bodyHtml ?? (data.description ? marked.parse(data.description) as string : '')),
        })
      })

      return spaces.sort((a, b) => a.name.localeCompare(b.name, 'ko'))
    } catch (e) {
      console.error('Firebase에서 직접 공간 정보를 조회하지 못했습니다:', e)
      return []
    }
  }

  return []
}
