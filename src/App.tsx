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
    isSelectingLocation,
    tempLocation,
    reportedLocation,
    startLocationSelection,
    confirmLocationSelection,
    cancelLocationSelection,
    setTempLocation,
    clearReportedLocation,
  } = useStudyMapPresenter()

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-slate-100">
      {!isSelectingLocation && (
        <header className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between bg-white/80 border border-white/20 px-4 py-3.5 text-slate-800 shadow-lg rounded-2xl backdrop-blur-md ring-1 ring-black/5">
          <div>
            <h1 className="text-base font-bold leading-tight text-slate-900">스터디 스팟</h1>
            <p className="text-xs text-slate-500 mt-0.5">모두의 공부 공간 지도</p>
          </div>
          <span className="rounded-full bg-slate-100 border border-slate-200/60 px-3.5 py-1 text-xs font-semibold text-slate-600">
            {spaces.length}곳
          </span>
        </header>
      )}

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
            <MapView
              spaces={spaces}
              onSelect={selectSpace}
              isSelectingLocation={isSelectingLocation}
              tempLocation={tempLocation}
              onMapClick={setTempLocation}
            />

            {isSelectingLocation && (
              <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between rounded-2xl bg-slate-900/95 text-white px-4 py-3.5 shadow-2xl backdrop-blur-md ring-1 ring-white/10">
                <span className="text-xs font-semibold tracking-wide">지도를 탭하여 핀 위치를 지정하세요</span>
                <div className="flex gap-2">
                  <button
                    onClick={cancelLocationSelection}
                    className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium hover:bg-slate-700 active:scale-95 transition-all"
                  >
                    취소
                  </button>
                  <button
                    onClick={confirmLocationSelection}
                    disabled={!tempLocation}
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    선택 완료
                  </button>
                </div>
              </div>
            )}

            {!isSelectingLocation && (
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
            )}
          </>
        )}
      </main>

      <StudySpaceModal space={selected} onClose={closeDetail} />
      <ReportSpaceModal
        isOpen={isReportOpen}
        onClose={closeReport}
        isSelectingLocation={isSelectingLocation}
        startLocationSelection={startLocationSelection}
        reportedLocation={reportedLocation}
        clearReportedLocation={clearReportedLocation}
      />
    </div>
  )
}
