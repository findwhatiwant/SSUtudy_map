// 카카오맵 SDK에서 우리가 사용하는 최소한의 타입만 선언한다.
export {}

declare global {
  interface Window {
    kakao: typeof kakao
  }

  namespace kakao {
    namespace maps {
      function load(callback: () => void): void

      class LatLng {
        constructor(lat: number, lng: number)
      }

      class LatLngBounds {
        constructor()
        extend(latlng: LatLng): void
      }

      interface MapOptions {
        center: LatLng
        level: number
      }

      class Map {
        constructor(container: HTMLElement, options: MapOptions)
        setCenter(latlng: LatLng): void
        setBounds(bounds: LatLngBounds): void
        relayout(): void
      }

      interface MarkerImageOptions {
        offset?: Point
      }

      class Size {
        constructor(width: number, height: number)
      }

      class Point {
        constructor(x: number, y: number)
      }

      class MarkerImage {
        constructor(src: string, size: Size, options?: MarkerImageOptions)
      }

      interface MarkerOptions {
        position: LatLng
        map?: Map
        title?: string
        image?: MarkerImage
      }

      class Marker {
        constructor(options: MarkerOptions)
        setMap(map: Map | null): void
        setPosition(latlng: LatLng): void
      }

      interface MarkerClustererOptions {
        map?: Map
        markers?: Marker[]
        gridSize?: number
        averageCenter?: boolean
        minLevel?: number
        minClusterSize?: number
        styles?: object[]
        texts?: string[] | ((size: number) => string)
        calculator?: number[] | ((size: number) => number[])
        disableClickZoom?: boolean
        clickable?: boolean
        hoverable?: boolean
      }

      class MarkerClusterer {
        constructor(options: MarkerClustererOptions)
        addMarkers(markers: Marker[], nodraw?: boolean): void
        addMarker(marker: Marker, nodraw?: boolean): void
        removeMarkers(markers: Marker[], nodraw?: boolean): void
        removeMarker(marker: Marker, nodraw?: boolean): void
        clear(): void
        redraw(): void
      }

      namespace event {
        function addListener(
          target: object,
          type: string,
          handler: (...args: any[]) => void,
        ): void
        function removeListener(
          target: object,
          type: string,
          handler: (...args: any[]) => void,
        ): void
      }
    }
  }
}
