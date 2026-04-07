"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  Controller,
  useFormContext,
  useWatch,
  type UseFormSetValue,
} from "react-hook-form";

import { SearchIcon } from "@/components/icons/search/search";
import type { KakaoMapsApi, KakaoMapsLatLng } from "@/types/kakaoMap";

import { RegisterLogImagePicker } from "./registerLogImagePicker";
import type {
  RegisterLogFormState,
  RegisterLogImagePreview,
} from "./registerLog.types";

const DEFAULT_MAP_CENTER = {
  latitude: 33.450701,
  longitude: 126.570667,
};

const SELECTED_MARKER_IMAGE_SRC = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="8" fill="#F97316" stroke="white" stroke-width="3" />
  </svg>
`)}`;

type LocationNameSource = "empty" | "manual" | "search";

type MarkerRef = {
  current: InstanceType<KakaoMapsApi["Marker"]> | null;
};

type MarkerImageRef = {
  current: InstanceType<KakaoMapsApi["MarkerImage"]> | null;
};

type MapRef = {
  current: InstanceType<KakaoMapsApi["Map"]> | null;
};

type LocationNameSourceRef = {
  current: LocationNameSource;
};

interface PickLocationOptions {
  pointName?: string;
  successMessage: string;
}

interface RegisterLocationStepProps {
  imageErrorMessage: string | null;
  images: RegisterLogImagePreview[];
  onAddImages: (files: FileList) => void;
  onRemoveImage: (imageId: string) => void;
}

export function RegisterLocationStep({
  imageErrorMessage,
  images,
  onAddImages,
  onRemoveImage,
}: RegisterLocationStepProps) {
  const { control, register, setValue } =
    useFormContext<RegisterLogFormState>();
  const locationQuery = useWatch({ control, name: "locationQuery" }) ?? "";
  const locationName = useWatch({ control, name: "locationName" }) ?? "";
  const latitude = useWatch({ control, name: "latitude" });
  const longitude = useWatch({ control, name: "longitude" });
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<InstanceType<KakaoMapsApi["Map"]> | null>(null);
  const placesRef = useRef<InstanceType<
    KakaoMapsApi["services"]["Places"]
  > | null>(null);
  const markersRef = useRef<InstanceType<KakaoMapsApi["Marker"]>[]>([]);
  const selectedMarkerImageRef = useRef<InstanceType<
    KakaoMapsApi["MarkerImage"]
  > | null>(null);
  const selectedMarkerRef = useRef<InstanceType<KakaoMapsApi["Marker"]> | null>(
    null,
  );
  const locationNameSourceRef = useRef<LocationNameSource>("empty");
  const setValueRef = useRef<UseFormSetValue<RegisterLogFormState>>(setValue);
  const [isMapReady, setIsMapReady] = useState(false);
  const [searchMessage, setSearchMessage] = useState(
    "지역명을 검색하면 지도 범위를 이동합니다.",
  );

  useEffect(() => {
    setValueRef.current = setValue;
  }, [setValue]);

  useEffect(() => {
    function initMap() {
      if (!mapContainerRef.current || !window.kakao?.maps) {
        return;
      }

      window.kakao.maps.load(() => {
        const kakaoMaps = window.kakao?.maps;

        if (!mapContainerRef.current || !kakaoMaps) {
          return;
        }

        const options = {
          center: new kakaoMaps.LatLng(
            DEFAULT_MAP_CENTER.latitude,
            DEFAULT_MAP_CENTER.longitude,
          ),
          level: 3,
        };

        const map = new kakaoMaps.Map(mapContainerRef.current, options);
        const mapTypeControl = new kakaoMaps.MapTypeControl();

        map.addControl(mapTypeControl, kakaoMaps.ControlPosition.TOPRIGHT);
        mapRef.current = map;
        placesRef.current = new kakaoMaps.services.Places();
        kakaoMaps.event.addListener(map, "click", (mouseEvent) => {
          if (!mouseEvent?.latLng) {
            return;
          }

          const successMessage =
            locationNameSourceRef.current === "manual"
              ? "선택한 위치 좌표를 저장했습니다."
              : "선택한 위치 좌표를 저장했습니다. 포인트 명칭을 입력해주세요.";

          pickLocation({
            locationNameSourceRef,
            mapRef,
            options: { successMessage },
            position: mouseEvent.latLng,
            setValue: setValueRef.current,
            selectedMarkerImageRef,
            selectedMarkerRef,
            setSearchMessage,
          });
        });
        setIsMapReady(true);

        window.requestAnimationFrame(() => {
          map.relayout?.();
        });
      });
    }

    const kakaoScript = document.getElementById("kakao-map-sdk");

    if (window.kakao?.maps) {
      initMap();
      return;
    }

    kakaoScript?.addEventListener("load", initMap);

    return () => {
      kakaoScript?.removeEventListener("load", initMap);
      removeMarkers(markersRef.current);
      selectedMarkerRef.current?.setMap(null);
      selectedMarkerImageRef.current = null;
      selectedMarkerRef.current = null;
      mapRef.current = null;
      placesRef.current = null;
      locationNameSourceRef.current = "empty";
    };
  }, []);

  function searchPlaces(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!window.kakao?.maps || !mapRef.current || !placesRef.current) {
      setSearchMessage("지도가 아직 준비되지 않았습니다.");
      return;
    }

    const keyword = locationQuery.trim();

    if (!keyword) {
      setSearchMessage("검색어를 입력해주세요.");
      return;
    }

    placesRef.current.keywordSearch(keyword, (data, status) => {
      const kakaoMaps = window.kakao?.maps;

      if (!kakaoMaps || !mapRef.current) {
        return;
      }

      removeMarkers(markersRef.current);
      markersRef.current = [];

      if (status === kakaoMaps.services.Status.OK) {
        const bounds = new kakaoMaps.LatLngBounds();

        data.forEach((place) => {
          const position = new kakaoMaps.LatLng(
            Number(place.y),
            Number(place.x),
          );
          const marker = new kakaoMaps.Marker({
            clickable: true,
            map: mapRef.current,
            position,
          });

          kakaoMaps.event.addListener(marker, "click", () => {
            mapRef.current?.setCenter(position);
            mapRef.current?.setLevel(6);

            pickLocation({
              locationNameSourceRef,
              mapRef,
              options: {
                pointName: place.place_name,
                successMessage:
                  "검색한 장소를 포인트 명칭과 좌표로 선택했습니다.",
              },
              position,
              setValue: setValueRef.current,
              selectedMarkerImageRef,
              selectedMarkerRef,
              setSearchMessage,
            });
          });

          markersRef.current.push(marker);
          bounds.extend(position);
        });

        mapRef.current.setBounds(bounds);
        setSearchMessage(`${data.length}개의 장소를 찾았습니다.`);
        return;
      }

      if (status === kakaoMaps.services.Status.ZERO_RESULT) {
        setSearchMessage("검색 결과가 없습니다.");
        return;
      }

      setSearchMessage("장소 검색 중 오류가 발생했습니다.");
    });
  }

  function syncLocationNameSource(event: ChangeEvent<HTMLInputElement>) {
    locationNameSourceRef.current = event.target.value.trim()
      ? "manual"
      : "empty";
  }

  const hasSelectedPoint = latitude !== null && longitude !== null;

  return (
    <div className="flex h-full flex-col space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <form className="space-y-3" onSubmit={searchPlaces}>
        <label
          className="mb-1.5 ml-1 block text-xs font-bold uppercase text-fg-faint"
          htmlFor="register-log-location-search"
        >
          장소 검색
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
            <input
              className="w-full rounded-xl border border-line bg-surface-muted py-3 pl-10 pr-4 text-sm text-fg transition-all placeholder:text-fg-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              id="register-log-location-search"
              placeholder="항구, 방파제, 낚시터 검색..."
              type="text"
              {...register("locationQuery", {
                validate: (value) => value.trim().length > 0,
              })}
            />
          </div>
          <button
            className="shrink-0 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={!isMapReady}
            type="submit"
          >
            검색
          </button>
        </div>
      </form>

      <div>
        <label
          className="mb-1.5 ml-1 block text-xs font-bold uppercase text-fg-faint"
          htmlFor="register-log-location-name"
        >
          포인트 명칭
        </label>
        <Controller
          control={control}
          name="locationName"
          rules={{
            validate: (value) => value.trim().length > 0,
          }}
          render={({ field }) => (
            <input
              className="w-full rounded-xl border border-line bg-surface-muted px-4 py-3 text-sm text-fg transition-all placeholder:text-fg-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              id="register-log-location-name"
              onBlur={field.onBlur}
              onChange={(event) => {
                syncLocationNameSource(event);
                field.onChange(event);
              }}
              placeholder="직접 이름을 입력하거나 검색 결과를 클릭하세요"
              ref={field.ref}
              type="text"
              value={locationName}
            />
          )}
        />
        <p className="mt-2 ml-1 text-xs text-fg-dim">
          검색 결과를 클릭하면 포인트 명칭이 자동으로 들어갑니다.
        </p>
      </div>

      <div>
        <p className="mb-1.5 ml-1 text-xs font-bold uppercase text-fg-faint">
          지도에서 포인트 선택
        </p>
        <div
          className="h-[240px] w-full overflow-hidden rounded-xl border border-line bg-surface-muted"
          ref={mapContainerRef}
        />
        <p className="mt-2 ml-1 text-xs text-fg-dim">{searchMessage}</p>
        <p className="mt-1 ml-1 text-xs text-fg-dim">
          {hasSelectedPoint
            ? `선택 좌표: ${latitude?.toFixed(6)}, ${longitude?.toFixed(6)}`
            : "지도를 클릭하거나 검색 결과 마커를 선택해 좌표를 저장하세요."}
        </p>
      </div>

      <div>
        <label
          className="mb-1.5 ml-1 block text-xs font-bold uppercase text-fg-faint"
          htmlFor="register-log-memo"
        >
          메모
        </label>
        <textarea
          className="h-24 w-full resize-none rounded-xl border border-line bg-surface-muted p-3 text-sm text-fg transition-all placeholder:text-fg-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          id="register-log-memo"
          placeholder="채비, 미끼, 특이사항 등을 기록하세요..."
          {...register("memo")}
        />
      </div>

      <RegisterLogImagePicker
        errorMessage={imageErrorMessage}
        images={images}
        onAddImages={onAddImages}
        onRemoveImage={onRemoveImage}
      />
    </div>
  );
}

function getMarkerImage({
  selectedMarkerImageRef,
}: {
  selectedMarkerImageRef: MarkerImageRef;
}) {
  const kakaoMaps = window.kakao?.maps;

  if (!kakaoMaps) {
    return null;
  }

  if (!selectedMarkerImageRef.current) {
    const imageSize = new kakaoMaps.Size(22, 22);
    const imageOption = {
      offset: new kakaoMaps.Point(11, 11),
    };

    selectedMarkerImageRef.current = new kakaoMaps.MarkerImage(
      SELECTED_MARKER_IMAGE_SRC,
      imageSize,
      imageOption,
    );
  }

  return selectedMarkerImageRef.current;
}

function placeMarker({
  mapRef,
  position,
  selectedMarkerImageRef,
  selectedMarkerRef,
}: {
  mapRef: MapRef;
  position: KakaoMapsLatLng;
  selectedMarkerImageRef: MarkerImageRef;
  selectedMarkerRef: MarkerRef;
}) {
  const kakaoMaps = window.kakao?.maps;
  const markerImage = getMarkerImage({ selectedMarkerImageRef });

  if (!kakaoMaps || !mapRef.current || !markerImage) {
    return false;
  }

  if (!selectedMarkerRef.current) {
    selectedMarkerRef.current = new kakaoMaps.Marker({
      image: markerImage,
      map: mapRef.current,
      position,
    });
    return true;
  }

  selectedMarkerRef.current.setPosition(position);
  selectedMarkerRef.current.setMap(mapRef.current);
  return true;
}

function pickLocation({
  locationNameSourceRef,
  mapRef,
  options,
  position,
  setValue,
  selectedMarkerImageRef,
  selectedMarkerRef,
  setSearchMessage,
}: {
  locationNameSourceRef: LocationNameSourceRef;
  mapRef: MapRef;
  options: PickLocationOptions;
  position: KakaoMapsLatLng;
  setValue: UseFormSetValue<RegisterLogFormState>;
  selectedMarkerImageRef: MarkerImageRef;
  selectedMarkerRef: MarkerRef;
  setSearchMessage: (message: string) => void;
}) {
  const isMarkerPlaced = placeMarker({
    mapRef,
    position,
    selectedMarkerImageRef,
    selectedMarkerRef,
  });

  if (!isMarkerPlaced) {
    setSearchMessage("지도가 아직 준비되지 않았습니다.");
    return;
  }

  setValue("latitude", position.getLat(), { shouldDirty: true });
  setValue("longitude", position.getLng(), { shouldDirty: true });

  if (options.pointName) {
    setValue("locationName", options.pointName, {
      shouldDirty: true,
      shouldValidate: true,
    });
    locationNameSourceRef.current = "search";
    setSearchMessage(options.successMessage);
    return;
  }

  if (locationNameSourceRef.current === "search") {
    setValue("locationName", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    locationNameSourceRef.current = "empty";
  }

  setSearchMessage(options.successMessage);
}

function removeMarkers(markers: Array<{ setMap(map: unknown): void }>) {
  markers.forEach((marker) => marker.setMap(null));
}
