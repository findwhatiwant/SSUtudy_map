// View: 선택된 공부 공간의 상세 정보를 모달(바텀시트)로 표시한다.
// 표시 전용 컴포넌트 — 닫기 동작만 콜백으로 위임한다.

import type { StudySpace } from '../models/studySpace'
import { STATUS_COLOR, STATUS_LABEL } from '../models/studySpace'

interface StudySpaceModalProps {
  space: StudySpace | null
  onClose: () => void
}

export function StudySpaceModal({ space, onClose }: StudySpaceModalProps) {
  if (!space) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-2xl bg-white p-5 pb-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-300" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{space.name}</h2>
            <p className="text-sm text-slate-500">
              {space.building} · {space.category}
            </p>
          </div>
          <span
            className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: STATUS_COLOR[space.status] }}
          >
            {STATUS_LABEL[space.status]}
          </span>
        </div>

        {space.statusNote && (
          <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            {space.statusNote}
          </p>
        )}

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <InfoItem label="좌석 수" value={`${space.seats}석`} />
          <InfoItem label="콘센트" value={space.outlets ? '있음' : '없음'} />
          <InfoItem label="그룹 스터디" value={space.groupStudy ? '가능' : '불가'} />
          <InfoItem label="운영 시간" value={space.hours} />
        </dl>

        {/* 본문은 마크다운(.md)을 렌더링한 HTML. 콘텐츠는 빌드에 포함된 자체 파일이라 신뢰 가능. */}
        <div
          className="study-body mt-4 text-sm leading-relaxed text-slate-600"
          dangerouslySetInnerHTML={{ __html: space.bodyHtml }}
        />

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-blue-700 py-3 font-semibold text-white active:bg-blue-800"
        >
          닫기
        </button>
      </div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-100 p-2">
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="mt-0.5 font-medium text-slate-800">{value}</dd>
    </div>
  )
}
