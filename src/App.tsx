// 앱 셸: Presenter를 호출해 상태를 받고 View들에 전달한다.

import { useStudyMapPresenter } from './presenters/useStudyMapPresenter'
import { MapView } from './views/MapView'
import { StudySpaceModal } from './views/StudySpaceModal'
import { ReportSpaceModal } from './views/ReportSpaceModal'

export default function App() {
  const {
    spaces,
    selected,
    loading,
    error,
    selectSpace,
    closeDetail,
    isReportOpen,
    openReport,
    closeReport,
  } = useStudyMapPresenter()

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-slate-100">
      <header className="z-10 flex items-center justify-between bg-blue-700 px-4 py-3 text-white shadow">
        <div>
          <h1 className="text-base font-bold leading-tight">스터디 스팟</h1>
          <p className="text-xs text-blue-100">숭실대 공부 공간 지도</p>
        </div>
        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs">
          {spaces.length}곳
        </span>
      </header>

      <main className="relative flex-1">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-100 text-slate-500">
            불러오는 중…
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-6 text-center text-red-600">
            {error}
          </div>
        )}
        {!loading && !error && (
          <>
            <MapView spaces={spaces} onSelect={selectSpace} />
            <button
              onClick={openReport}
              className="absolute bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/30 outline-none hover:bg-blue-700 active:scale-95 transition-all duration-200"
              title="공부 공간 제보하기"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="h-7 w-7"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </>
        )}
      </main>

      <StudySpaceModal space={selected} onClose={closeDetail} />
      <ReportSpaceModal isOpen={isReportOpen} onClose={closeReport} />
    </div>
  )
}
