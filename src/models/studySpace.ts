// Model: 도메인 타입 정의 (View/Presenter에 의존하지 않음)

export type StudySpaceStatus = 'open' | 'closed' | 'crowded'

export interface StudySpace {
  id: string
  name: string
  category: string
  building: string
  lat: number
  lng: number
  seats: number
  hours: string
  outlets: boolean
  groupStudy: boolean
  status: StudySpaceStatus
  statusNote: string
  /** 마크다운 본문을 렌더링한 HTML */
  bodyHtml: string
}

export const STATUS_LABEL: Record<StudySpaceStatus, string> = {
  open: '이용 가능',
  closed: '휴관',
  crowded: '혼잡',
}

export const STATUS_COLOR: Record<StudySpaceStatus, string> = {
  open: '#16a34a',
  closed: '#dc2626',
  crowded: '#f59e0b',
}
