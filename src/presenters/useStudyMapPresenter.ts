// Presenter: Model(데이터)과 View(컴포넌트)를 잇는 로직.
// View는 상태를 표시만 하고, 모든 흐름 제어는 여기서 담당한다.

import { useCallback, useEffect, useState } from 'react'
import type { StudySpace } from '../models/studySpace'
import { fetchStudySpaces } from '../models/studySpaceRepository'

export interface StudyMapState {
  spaces: StudySpace[]
  selected: StudySpace | null
  loading: boolean
  error: string | null
  selectSpace: (id: string) => void
  closeDetail: () => void
  isReportOpen: boolean
  openReport: () => void
  closeReport: () => void
}

export function useStudyMapPresenter(): StudyMapState {
  const [spaces, setSpaces] = useState<StudySpace[]>([])
  const [selected, setSelected] = useState<StudySpace | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReportOpen, setIsReportOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchStudySpaces()
      .then((data) => {
        if (!cancelled) setSpaces(data)
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : '알 수 없는 오류')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const selectSpace = useCallback(
    (id: string) => {
      setSelected(spaces.find((s) => s.id === id) ?? null)
    },
    [spaces],
  )

  const closeDetail = useCallback(() => setSelected(null), [])

  const openReport = useCallback(() => setIsReportOpen(true), [])
  const closeReport = useCallback(() => setIsReportOpen(false), [])

  return {
    spaces,
    selected,
    loading,
    error,
    selectSpace,
    closeDetail,
    isReportOpen,
    openReport,
    closeReport,
  }
}
