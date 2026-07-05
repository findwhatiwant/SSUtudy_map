// 카카오맵 JS SDK를 동적으로 로드한다.
// 키는 .env.local 의 VITE_KAKAO_MAP_KEY 에서 읽는다.

const KAKAO_KEY = import.meta.env.VITE_KAKAO_MAP_KEY as string | undefined

let loadPromise: Promise<void> | null = null

export function isKakaoKeyConfigured(): boolean {
  return Boolean(KAKAO_KEY)
}

export function loadKakaoMap(): Promise<void> {
  if (!KAKAO_KEY) {
    return Promise.reject(
      new Error('VITE_KAKAO_MAP_KEY 가 설정되지 않았습니다. .env.local 을 확인하세요.'),
    )
  }

  if (window.kakao?.maps) {
    return Promise.resolve()
  }

  if (loadPromise) {
    return loadPromise
  }

  loadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false&libraries=clusterer`
    script.async = true
    script.onload = () => {
      window.kakao.maps.load(() => resolve())
    }
    script.onerror = () => {
      loadPromise = null
      reject(new Error('카카오맵 SDK 로드에 실패했습니다.'))
    }
    document.head.appendChild(script)
  })

  return loadPromise
}
