// View: 카카오 지도를 그리고 핀(마커)을 표시한다.
// 핀 클릭 시 Presenter가 준 onSelect 콜백만 호출한다 (로직 없음).

import { useEffect, useRef, useState } from 'react'
import type { StudySpace } from '../models/studySpace'
import { STATUS_COLOR } from '../models/studySpace'
import { isKakaoKeyConfigured, loadKakaoMap } from '../lib/kakaoLoader'

// 숭실대학교 중심 좌표
const CAMPUS_CENTER = { lat: 37.49632, lng: 126.9577 }

interface MapViewProps {
  spaces: StudySpace[]
  onSelect: (id: string) => void
}

function pinImageSrc(color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="44" viewBox="0 0 34 44">
    <path d="M17 0C7.6 0 0 7.6 0 17c0 12 17 27 17 27s17-15 17-27C34 7.6 26.4 0 17 0z" fill="${color}"/>
    <circle cx="17" cy="17" r="6.5" fill="#fff"/>
  </svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export function MapView({ spaces, onSelect }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<kakao.maps.Map | null>(null)
  const markersRef = useRef<kakao.maps.Marker[]>([])
  const clustererRef = useRef<kakao.maps.MarkerClusterer | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  // 지도 SDK 로드 + 인스턴스 생성이 끝났는지. 마커는 이 값이 true가 된 뒤에 그린다.
  const [mapReady, setMapReady] = useState(false)

  // 지도 초기화 (1회)
  useEffect(() => {
    if (!isKakaoKeyConfigured()) {
      setMapError('카카오맵 API 키가 설정되지 않았습니다.')
      return
    }
    let disposed = false
    loadKakaoMap()
      .then(() => {
        if (disposed || !containerRef.current) return
        mapRef.current = new window.kakao.maps.Map(containerRef.current, {
          center: new window.kakao.maps.LatLng(CAMPUS_CENTER.lat, CAMPUS_CENTER.lng),
          level: 3,
        })
        setMapReady(true)
      })
      .catch((e: unknown) => {
        if (!disposed) setMapError(e instanceof Error ? e.message : '지도를 불러오지 못했습니다.')
      })
    return () => {
      disposed = true
    }
  }, [])

  // 마커 렌더링 (지도 준비 완료 후 / spaces 변경 시)
  useEffect(() => {
    const map = mapRef.current
    if (!mapReady || !map) return

    // 클러스터러 초기화
    if (!clustererRef.current) {
      clustererRef.current = new window.kakao.maps.MarkerClusterer({
        map: map,
        averageCenter: true,
        minLevel: 4, // 지도 축소 레벨 4 이상일 때만 클러스터링 적용
      })
    }

    const bounds = new window.kakao.maps.LatLngBounds()
    const newMarkers: kakao.maps.Marker[] = []

    spaces.forEach((space) => {
      const position = new window.kakao.maps.LatLng(space.lat, space.lng)
      const image = new window.kakao.maps.MarkerImage(
        pinImageSrc(STATUS_COLOR[space.status]),
        new window.kakao.maps.Size(34, 44),
        { offset: new window.kakao.maps.Point(17, 44) },
      )
      // 클러스터러가 직접 마커를 그려주므로 map 매개변수는 생략합니다.
      const marker = new window.kakao.maps.Marker({
        position,
        title: space.name,
        image,
      })
      window.kakao.maps.event.addListener(marker, 'click', () => onSelect(space.id))
      newMarkers.push(marker)
      bounds.extend(position)
    })

    markersRef.current = newMarkers
    clustererRef.current.addMarkers(newMarkers)

    // 6곳이 모두 화면에 들어오도록 지도 범위를 맞춘다.
    if (spaces.length > 0) {
      map.setBounds(bounds)
    }

    return () => {
      if (clustererRef.current) {
        clustererRef.current.clear()
      }
      markersRef.current = []
    }
  }, [mapReady, spaces, onSelect])

  if (mapError) {
    return <MapFallback spaces={spaces} onSelect={onSelect} reason={mapError} />
  }

  // touch-none: 브라우저가 터치 드래그를 스크롤 제스처로 가로채지 않도록 하여
  // 카카오맵의 터치 패닝(드래그 이동)이 모바일에서도 정상 동작하게 한다.
  return <div ref={containerRef} className="h-full w-full touch-none" />
}

// 키가 없거나 지도 로드 실패 시: 핀 클릭 기능은 유지하는 목록형 대체 화면
function MapFallback({
  spaces,
  onSelect,
  reason,
}: MapViewProps & { reason: string }) {
  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-slate-100 p-4">
      <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
        <p className="font-semibold">지도를 표시할 수 없습니다.</p>
        <p className="mt-1">{reason}</p>
        <p className="mt-1 text-xs">
          .env.local 에 VITE_KAKAO_MAP_KEY 를 설정하면 실제 지도가 표시됩니다. (아래 목록으로도 정보 확인 가능)
        </p>
      </div>
      <ul className="space-y-2">
        {spaces.map((s) => (
          <li key={s.id}>
            <button
              onClick={() => onSelect(s.id)}
              className="flex w-full items-center gap-3 rounded-lg bg-white p-3 text-left shadow-sm active:bg-slate-50"
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: STATUS_COLOR[s.status] }}
              />
              <span className="flex-1">
                <span className="block font-medium text-slate-800">{s.name}</span>
                <span className="block text-xs text-slate-500">{s.building}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
