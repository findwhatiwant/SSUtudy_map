import { useEffect, useState } from 'react'

interface GoogleAdProps {
  className?: string
}

export function GoogleAd({ className = '' }: GoogleAdProps) {
  const [isVisible, setIsVisible] = useState(true)
  const adClient = import.meta.env.VITE_GOOGLE_AD_CLIENT as string | undefined
  const adSlot = import.meta.env.VITE_GOOGLE_AD_SLOT as string | undefined
  const isAdConfigured = Boolean(adClient && adSlot)

  useEffect(() => {
    if (!isVisible || !isAdConfigured) return

    // 1. Google AdSense 스크립트 동적 주입
    const scriptId = 'google-adsense-script'
    let script = document.getElementById(scriptId) as HTMLScriptElement | null

    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`
      script.crossOrigin = 'anonymous'
      script.async = true
      document.head.appendChild(script)
    }

    // 2. 광고 초기화 푸시
    try {
      // @ts-ignore
      const adsbygoogle = window.adsbygoogle || []
      adsbygoogle.push({})
    } catch (e) {
      console.error('Google AdSense 초기화 실패:', e)
    }
  }, [isVisible, isAdConfigured, adClient])

  if (!isVisible) return null

  return (
    <div
      className={`fixed bottom-24 right-6 left-6 sm:left-auto sm:w-80 z-30 flex flex-col rounded-2xl border border-slate-200/60 bg-white/95 p-3 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-[1.01] ${className}`}
    >
      {/* 상단 메타 영역 */}
      <div className="mb-2 flex items-center justify-between">
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-slate-500 uppercase">
          Sponsor
        </span>
        <button
          onClick={() => setIsVisible(false)}
          className="flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          title="광고 닫기"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-3.5 w-3.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* 광고 삽입 영역 */}
      <div className="flex min-h-[60px] items-center justify-center overflow-hidden rounded-lg bg-slate-50 text-center">
        {isAdConfigured ? (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '60px' }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format="horizontal"
            data-full-width-responsive="false"
          />
        ) : (
          /* 개발 모드 / 미설정 시 나타나는 프리미엄 모의 광고 */
          <div className="flex h-full w-full flex-col justify-center p-3 text-left">
            <h4 className="text-xs font-bold text-slate-800">☕️ 개발자에게 커피 한 잔 후원하기</h4>
            <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
              스터디 스팟은 학생들을 위해 무료로 운영됩니다. 광고 등록 시 이 영역에 배너가 노출됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
