// 앱 셸: Presenter를 호출해 상태를 받고 View들에 전달한다.

import { useStudyMapPresenter } from './presenters/useStudyMapPresenter'
import { MapView } from './views/MapView'
import { StudySpaceModal } from './views/StudySpaceModal'

export default function App() {
  const { spaces, selected, loading, error, selectSpace, closeDetail } =
    useStudyMapPresenter()

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-slate-100">
      <header className="z-10 flex items-center justify-between bg-blue-700 px-4 py-3 text-white shadow">
        <div>
          <h1 className="text-base font-bold leading-tight">SSUtudy Map</h1>
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
        {!loading && !error && <MapView spaces={spaces} onSelect={selectSpace} />}
      </main>

      <StudySpaceModal space={selected} onClose={closeDetail} />
    </div>
  )
}
