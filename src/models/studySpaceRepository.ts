// Model: 데이터 접근 계층.
// 빌드 타임에 생성된 static/spaces.json 파일을 읽어옵니다 (서버 읽기 비용 0원).

import type { StudySpace } from './studySpace'

export async function fetchStudySpaces(): Promise<StudySpace[]> {
  try {
    const response = await fetch(`./spaces.json?t=${Date.now()}`)
    if (response.ok) {
      const spaces = await response.json() as StudySpace[]
      if (spaces && spaces.length > 0) {
        return spaces.sort((a, b) => a.name.localeCompare(b.name, 'ko'))
      }
    }
  } catch (error) {
    console.error('공간 정보 로드 실패:', error)
  }

  return []
}
