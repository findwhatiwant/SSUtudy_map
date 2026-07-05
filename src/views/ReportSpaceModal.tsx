import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../lib/firebase'

interface ReportSpaceModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormState {
  name: string
  building: string
  category: string
  seats: string
  outlets: boolean
  groupStudy: boolean
  hours: string
  description: string
}

const INITIAL_FORM: FormState = {
  name: '',
  building: '',
  category: '열람실',
  seats: '',
  outlets: false,
  groupStudy: false,
  hours: '',
  description: '',
}

export function ReportSpaceModal({ isOpen, onClose }: ReportSpaceModalProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [startY, setStartY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleStart = (clientY: number) => {
    setStartY(clientY)
    setIsDragging(true)
  }

  const handleMove = (clientY: number) => {
    if (!isDragging) return
    const deltaY = clientY - startY
    if (deltaY > 0) {
      setDragOffset(deltaY)
    }
  }

  const handleEnd = () => {
    setIsDragging(false)
    if (dragOffset > 100) {
      handleResetAndClose()
    }
    setDragOffset(0)
  }

  const handleChange = (key: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const suggestionData = {
      ...form,
      seats: form.seats ? Number(form.seats) : 0,
      status: 'pending',
    }

    try {
      if (isFirebaseConfigured && db) {
        await addDoc(collection(db, 'suggestions'), {
          ...suggestionData,
          submittedAt: serverTimestamp(),
        })
      } else {
        // Firebase가 설정되지 않은 경우 모의 동작(콘솔 출력)
        console.warn('Firebase가 설정되지 않아 로컬 모의 동작을 수행합니다.')
        console.log('제보 데이터:', suggestionData)
        await new Promise((resolve) => setTimeout(resolve, 800)) // 로딩 애니메이션 연출용 딜레이
      }
      setSubmitted(true)
    } catch (err: unknown) {
      console.error('제보 전송 중 에러 발생:', err)
      setError(err instanceof Error ? err.message : '서버 전송 중 알 수 없는 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleResetAndClose = () => {
    setForm(INITIAL_FORM)
    setSubmitted(false)
    setDragOffset(0)
    setError(null)
    setSubmitting(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleResetAndClose}
    >
      <div
        className="relative w-full max-w-md rounded-t-3xl bg-white px-6 pb-8 shadow-2xl max-h-[90dvh] overflow-y-auto"
        style={{
          transform: `translateY(${dragOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 드래그 핸들 디자인 영역 */}
        <div
          onTouchStart={(e) => handleStart(e.touches[0].clientY)}
          onTouchMove={(e) => handleMove(e.touches[0].clientY)}
          onTouchEnd={handleEnd}
          onMouseDown={(e) => handleStart(e.clientY)}
          onMouseMove={(e) => { if (isDragging) handleMove(e.clientY); }}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          className="w-full cursor-grab active:cursor-grabbing pb-3 pt-2 select-none flex flex-col items-center touch-none"
        >
          <div className="h-1.5 w-12 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors" />
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-500 animate-bounce">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="h-8 w-8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">제보 감사드립니다!</h3>
            <p className="mt-2 text-sm text-slate-500 px-4 leading-relaxed">
              작성해주신 정보는 관리자의 검토 과정을 거친 뒤 지도 상에 반영될 예정입니다.
            </p>
            <button
              onClick={handleResetAndClose}
              className="mt-8 w-full rounded-2xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
              확인
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">공부 공간 제보하기</h2>
              <p className="text-xs text-slate-500 mt-1">
                숭실대 내에 숨겨진 또 다른 좋은 공부 공간을 학생들과 공유해 주세요!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-600 leading-relaxed">
                  ⚠️ {error}
                </div>
              )}

              <fieldset disabled={submitting} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    공간 이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="예: 학생회관 3층 세미나실"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all disabled:opacity-60"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      건물명 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="예: 학생회관"
                      value={form.building}
                      onChange={(e) => handleChange('building', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      공간 구분 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none disabled:opacity-60"
                    >
                      <option value="열람실">열람실</option>
                      <option value="도서관">도서관</option>
                      <option value="로비/쉼터">로비/쉼터</option>
                      <option value="카페">카페</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      좌석 수 (선택)
                    </label>
                    <input
                      type="number"
                      placeholder="예: 30"
                      value={form.seats}
                      onChange={(e) => handleChange('seats', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      운영 시간 (선택)
                    </label>
                    <input
                      type="text"
                      placeholder="예: 평일 09:00 - 22:00"
                      value={form.hours}
                      onChange={(e) => handleChange('hours', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    편의 정보
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700 select-none disabled:opacity-60">
                      <input
                        type="checkbox"
                        checked={form.outlets}
                        onChange={(e) => handleChange('outlets', e.target.checked)}
                        className="h-5 w-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-60"
                      />
                      콘센트 있음
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700 select-none disabled:opacity-60">
                      <input
                        type="checkbox"
                        checked={form.groupStudy}
                        onChange={(e) => handleChange('groupStudy', e.target.checked)}
                        className="h-5 w-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-60"
                      />
                      그룹 스터디 가능
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    공간 설명 (선택)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="공간의 세부 위치나 특징(예: 전반적으로 조용함, 와이파이 빠름 등)을 자유롭게 적어주세요."
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none disabled:opacity-60"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="flex-1 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {submitting ? '제보 중...' : '제보하기'}
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
