import { useState } from 'react'

interface ReportSpaceModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ReportSpaceModal({ isOpen, onClose }: ReportSpaceModalProps) {
  const [name, setName] = useState('')
  const [building, setBuilding] = useState('')
  const [category, setCategory] = useState('열람실')
  const [seats, setSeats] = useState('')
  const [outlets, setOutlets] = useState(false)
  const [groupStudy, setGroupStudy] = useState(false)
  const [hours, setHours] = useState('')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // DB 전송 기능은 아직 미구현이므로 콘솔에만 출력하고 성공 상태를 보여준다.
    console.log({
      name,
      building,
      category,
      seats: seats ? Number(seats) : 0,
      outlets,
      groupStudy,
      hours,
      description,
    })
    setSubmitted(true)
  }

  const handleResetAndClose = () => {
    // 폼 초기화 및 닫기
    setName('')
    setBuilding('')
    setCategory('열람실')
    setSeats('')
    setOutlets(false)
    setGroupStudy(false)
    setHours('')
    setDescription('')
    setSubmitted(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleResetAndClose}
    >
      <div
        className="relative w-full max-w-md rounded-t-3xl bg-white p-6 pb-8 shadow-2xl transition-transform duration-300 max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 드래그 핸들 디자인 바 */}
        <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-slate-200" />

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
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  공간 이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 학생회관 3층 세미나실"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
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
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    공간 구분 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none"
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
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    운영 시간 (선택)
                  </label>
                  <input
                    type="text"
                    placeholder="예: 평일 09:00 - 22:00"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  편의 정보
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={outlets}
                      onChange={(e) => setOutlets(e.target.checked)}
                      className="h-5 w-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    콘센트 있음
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={groupStudy}
                      onChange={(e) => setGroupStudy(e.target.checked)}
                      className="h-5 w-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all"
                >
                  제보하기
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
