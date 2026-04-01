export type KakaoSearchStatus = "OK" | "ZERO_RESULT" | "ERROR";

export interface KakaoPlaceResult {
  place_name: string;
  x: string;
  y: string;
}

export interface KakaoMapsLatLng {
  getLat(): number;
  getLng(): number;
}

export interface KakaoMapsLatLngBounds {
  extend(latlng: KakaoMapsLatLng): void;
}

export type KakaoMapsSize = object;

export type KakaoMapsPoint = object;

export type KakaoMapsMarkerImage = object;

export interface KakaoMapsApi {
  LatLng: new (latitude: number, longitude: number) => KakaoMapsLatLng;
  LatLngBounds: new () => KakaoMapsLatLngBounds;
  Map: new (
    container: HTMLElement,
    options: {
      center: KakaoMapsLatLng;
      level: number;
    },
  ) => {
    addControl(control: object, position: object): void;
    relayout?: () => void;
    setBounds(bounds: KakaoMapsLatLngBounds): void;
    setCenter(position: KakaoMapsLatLng): void;
    setLevel(level: number): void;
  };
  Marker: new (options: {
    clickable?: boolean;
    image?: KakaoMapsMarkerImage;
    map?: unknown;
    position: KakaoMapsLatLng;
  }) => {
    setMap(map: unknown): void;
    setPosition(position: KakaoMapsLatLng): void;
  };
  MarkerImage: new (
    src: string,
    size: KakaoMapsSize,
    options?: {
      offset?: KakaoMapsPoint;
    },
  ) => KakaoMapsMarkerImage;
  MapTypeControl: new () => object;
  Point: new (x: number, y: number) => KakaoMapsPoint;
  Size: new (width: number, height: number) => KakaoMapsSize;
  ControlPosition: {
    TOPRIGHT: object;
  };
  event: {
    addListener(
      target: object,
      type: "click",
      handler: (mouseEvent?: { latLng: KakaoMapsLatLng }) => void,
    ): void;
  };
  load(callback: () => void): void;
  services: {
    Places: new () => {
      keywordSearch(
        keyword: string,
        callback: (
          data: KakaoPlaceResult[],
          status: KakaoSearchStatus,
        ) => void,
      ): void;
    };
    Status: {
      OK: "OK";
      ZERO_RESULT: "ZERO_RESULT";
      ERROR: "ERROR";
    };
  };
}

declare global {
  interface Window {
    kakao?: {
      maps: KakaoMapsApi;
    };
  }
}

export {};
