import type { FishingMode } from "./dashboardData";

export interface LocationSpeciesBreakdown {
  colorHex: string;
  label: string;
  value: number;
}

export interface LocationMonthlyPoint {
  catchCount: number;
  month: string;
}

export interface LocationRecentLog {
  catchCount: number;
  dateLabel: string;
  species: string;
  tideLabel: string;
  weather: string;
}

export interface LocationStatDetail {
  averageCatch: number;
  averageSize: number;
  bestSeason: string;
  bestTime: string;
  bestTide: string | null;
  bestWeather: string;
  id: string;
  insight: string;
  mainSpecies: string;
  maxCatch: number;
  monthlyPoints: LocationMonthlyPoint[];
  name: string;
  recentLogs: LocationRecentLog[];
  region: string;
  speciesBreakdown: LocationSpeciesBreakdown[];
  successRate: number;
  totalCatch: number;
  totalTrips: number;
  typeLabel: string;
}

export interface LocationStatsData {
  heroDescription: string;
  rankingDescription: string;
  locations: LocationStatDetail[];
}

export const LOCATION_STATS_DATA: Record<FishingMode, LocationStatsData> = {
  freshwater: {
    heroDescription:
      "민물 포인트는 계절과 시간대 영향이 더 직접적으로 보입니다. 평균 마릿수보다 안정적인 성공률과 주력 어종 구성이 더 중요하게 보이도록 정리했습니다.",
    locations: [
      {
        averageCatch: 6.1,
        averageSize: 35,
        bestSeason: "봄 · 가을",
        bestTime: "새벽 (04-08)",
        bestTide: null,
        bestWeather: "맑음",
        id: "paldang",
        insight:
          "봄·가을 배스 활성도가 가장 높고, 새벽 수초대 루어 공략에서 기록이 집중됩니다.",
        mainSpecies: "배스",
        maxCatch: 20,
        monthlyPoints: [
          { catchCount: 0, month: "1" },
          { catchCount: 2, month: "2" },
          { catchCount: 10, month: "3" },
          { catchCount: 18, month: "4" },
          { catchCount: 22, month: "5" },
          { catchCount: 14, month: "6" },
          { catchCount: 5, month: "7" },
          { catchCount: 4, month: "8" },
          { catchCount: 20, month: "9" },
          { catchCount: 15, month: "10" },
          { catchCount: 0, month: "11" },
          { catchCount: 0, month: "12" },
        ],
        name: "팔당호",
        recentLogs: [
          {
            catchCount: 6,
            dateLabel: "05.18",
            species: "배스",
            tideLabel: "-",
            weather: "맑음",
          },
          {
            catchCount: 20,
            dateLabel: "04.05",
            species: "붕어",
            tideLabel: "-",
            weather: "흐림",
          },
          {
            catchCount: 3,
            dateLabel: "01.20",
            species: "배스",
            tideLabel: "-",
            weather: "맑음",
          },
        ],
        region: "경기 남양주",
        speciesBreakdown: [
          { colorHex: "#16a34a", label: "배스", value: 55 },
          { colorHex: "#d97706", label: "붕어", value: 30 },
          { colorHex: "#0891b2", label: "잉어", value: 10 },
          { colorHex: "#94a3b8", label: "기타", value: 5 },
        ],
        successRate: 80,
        totalCatch: 110,
        totalTrips: 18,
        typeLabel: "저수지",
      },
      {
        averageCatch: 11.4,
        averageSize: 22,
        bestSeason: "봄 · 여름",
        bestTime: "오전 (08-12)",
        bestTide: null,
        bestWeather: "맑음 · 흐림",
        id: "nakdong",
        insight:
          "붕어 조황이 연중 안정적이고, 떡밥과 찌낚시 조합이 오전 시간대에 가장 잘 맞습니다.",
        mainSpecies: "붕어",
        maxCatch: 24,
        monthlyPoints: [
          { catchCount: 2, month: "1" },
          { catchCount: 5, month: "2" },
          { catchCount: 14, month: "3" },
          { catchCount: 22, month: "4" },
          { catchCount: 24, month: "5" },
          { catchCount: 20, month: "6" },
          { catchCount: 10, month: "7" },
          { catchCount: 8, month: "8" },
          { catchCount: 16, month: "9" },
          { catchCount: 12, month: "10" },
          { catchCount: 4, month: "11" },
          { catchCount: 0, month: "12" },
        ],
        name: "낙동강 구미",
        recentLogs: [
          {
            catchCount: 14,
            dateLabel: "05.10",
            species: "붕어",
            tideLabel: "-",
            weather: "흐림",
          },
          {
            catchCount: 11,
            dateLabel: "02.10",
            species: "붕어",
            tideLabel: "-",
            weather: "비",
          },
          {
            catchCount: 9,
            dateLabel: "03.05",
            species: "붕어",
            tideLabel: "-",
            weather: "맑음",
          },
        ],
        region: "경북 구미",
        speciesBreakdown: [
          { colorHex: "#d97706", label: "붕어", value: 65 },
          { colorHex: "#16a34a", label: "배스", value: 20 },
          { colorHex: "#0891b2", label: "잉어", value: 10 },
          { colorHex: "#94a3b8", label: "기타", value: 5 },
        ],
        successRate: 88,
        totalCatch: 137,
        totalTrips: 12,
        typeLabel: "강",
      },
      {
        averageCatch: 4.5,
        averageSize: 48,
        bestSeason: "봄 · 가을",
        bestTime: "오전 (08-12)",
        bestTide: null,
        bestWeather: "맑음",
        id: "chungju",
        insight:
          "대형 잉어 비중이 높고, 수심 3m 이상 구간에서 바닥 채비 운용 시 평균 크기가 안정적으로 나옵니다.",
        mainSpecies: "잉어",
        maxCatch: 10,
        monthlyPoints: [
          { catchCount: 0, month: "1" },
          { catchCount: 0, month: "2" },
          { catchCount: 4, month: "3" },
          { catchCount: 8, month: "4" },
          { catchCount: 10, month: "5" },
          { catchCount: 8, month: "6" },
          { catchCount: 3, month: "7" },
          { catchCount: 0, month: "8" },
          { catchCount: 8, month: "9" },
          { catchCount: 4, month: "10" },
          { catchCount: 0, month: "11" },
          { catchCount: 0, month: "12" },
        ],
        name: "충주호",
        recentLogs: [
          {
            catchCount: 3,
            dateLabel: "04.22",
            species: "잉어",
            tideLabel: "-",
            weather: "맑음",
          },
          {
            catchCount: 8,
            dateLabel: "02.28",
            species: "잉어",
            tideLabel: "-",
            weather: "맑음",
          },
          {
            catchCount: 5,
            dateLabel: "05.12",
            species: "붕어",
            tideLabel: "-",
            weather: "흐림",
          },
        ],
        region: "충북 충주",
        speciesBreakdown: [
          { colorHex: "#0891b2", label: "잉어", value: 55 },
          { colorHex: "#d97706", label: "붕어", value: 30 },
          { colorHex: "#16a34a", label: "배스", value: 10 },
          { colorHex: "#94a3b8", label: "기타", value: 5 },
        ],
        successRate: 75,
        totalCatch: 45,
        totalTrips: 10,
        typeLabel: "댐호",
      },
      {
        averageCatch: 3.8,
        averageSize: 32,
        bestSeason: "여름",
        bestTime: "새벽 (04-08)",
        bestTide: null,
        bestWeather: "맑음",
        id: "namhangang",
        insight:
          "쏘가리 시즌이 짧지만 뚜렷하고, 여울목과 바위 틈을 새벽에 노릴 때 반응이 좋습니다.",
        mainSpecies: "쏘가리",
        maxCatch: 8,
        monthlyPoints: [
          { catchCount: 0, month: "1" },
          { catchCount: 0, month: "2" },
          { catchCount: 2, month: "3" },
          { catchCount: 6, month: "4" },
          { catchCount: 8, month: "5" },
          { catchCount: 7, month: "6" },
          { catchCount: 5, month: "7" },
          { catchCount: 2, month: "8" },
          { catchCount: 0, month: "9" },
          { catchCount: 0, month: "10" },
          { catchCount: 0, month: "11" },
          { catchCount: 0, month: "12" },
        ],
        name: "남한강 여주",
        recentLogs: [
          {
            catchCount: 2,
            dateLabel: "04.30",
            species: "쏘가리",
            tideLabel: "-",
            weather: "맑음",
          },
          {
            catchCount: 0,
            dateLabel: "03.22",
            species: "배스",
            tideLabel: "-",
            weather: "흐림",
          },
          {
            catchCount: 5,
            dateLabel: "05.28",
            species: "쏘가리",
            tideLabel: "-",
            weather: "맑음",
          },
        ],
        region: "경기 여주",
        speciesBreakdown: [
          { colorHex: "#e11d48", label: "쏘가리", value: 55 },
          { colorHex: "#16a34a", label: "배스", value: 35 },
          { colorHex: "#d97706", label: "붕어", value: 7 },
          { colorHex: "#94a3b8", label: "기타", value: 3 },
        ],
        successRate: 67,
        totalCatch: 30,
        totalTrips: 8,
        typeLabel: "강",
      },
      {
        averageCatch: 3.5,
        averageSize: 29,
        bestSeason: "봄 · 여름",
        bestTime: "오전 (08-12)",
        bestTide: null,
        bestWeather: "맑음",
        id: "geumgang",
        insight:
          "공주 보 상류 여울목이 핵심 포인트. 루어 채비 시 반응이 즉각적.",
        mainSpecies: "쏘가리",
        maxCatch: 6,
        monthlyPoints: [
          { catchCount: 0, month: "1" },
          { catchCount: 0, month: "2" },
          { catchCount: 2, month: "3" },
          { catchCount: 4, month: "4" },
          { catchCount: 5, month: "5" },
          { catchCount: 6, month: "6" },
          { catchCount: 4, month: "7" },
          { catchCount: 0, month: "8" },
          { catchCount: 0, month: "9" },
          { catchCount: 0, month: "10" },
          { catchCount: 0, month: "11" },
          { catchCount: 0, month: "12" },
        ],
        name: "금강 공주",
        recentLogs: [
          {
            catchCount: 4,
            dateLabel: "03.08",
            species: "쏘가리",
            tideLabel: "-",
            weather: "맑음",
          },
          {
            catchCount: 3,
            dateLabel: "04.18",
            species: "쏘가리",
            tideLabel: "-",
            weather: "맑음",
          },
          {
            catchCount: 6,
            dateLabel: "05.30",
            species: "붕어",
            tideLabel: "-",
            weather: "흐림",
          },
        ],
        region: "충남 공주",
        speciesBreakdown: [
          { colorHex: "#e11d48", label: "쏘가리", value: 60 },
          { colorHex: "#d97706", label: "붕어", value: 25 },
          { colorHex: "#16a34a", label: "배스", value: 10 },
          { colorHex: "#94a3b8", label: "기타", value: 5 },
        ],
        successRate: 70,
        totalCatch: 21,
        totalTrips: 6,
        typeLabel: "강",
      },
    ],
    rankingDescription:
      "민물은 평균 마릿수보다 시즌별 피크와 안정적인 성공률이 중요해서, 랭킹과 상세 지표를 함께 보여주도록 구성했습니다.",
  },
  sea: {
    heroDescription:
      "바다 포인트는 물때, 계절, 포인트 유형이 조과 편차를 크게 만듭니다. 단순 평균보다 어떤 조건에서 강한지까지 보이도록 요약했습니다.",
    locations: [
      {
        averageCatch: 5.2,
        averageSize: 42,
        bestSeason: "봄 · 가을",
        bestTime: "새벽 (04-08)",
        bestTide: "4물",
        bestWeather: "맑음",
        id: "youngmok",
        insight:
          "4물 새벽 첫 조류에 기록이 가장 집중됩니다. 썰물 직전 2시간이 골든타임으로 보입니다.",
        mainSpecies: "광어",
        maxCatch: 18,
        monthlyPoints: [
          { catchCount: 0, month: "1" },
          { catchCount: 0, month: "2" },
          { catchCount: 8, month: "3" },
          { catchCount: 18, month: "4" },
          { catchCount: 25, month: "5" },
          { catchCount: 15, month: "6" },
          { catchCount: 10, month: "7" },
          { catchCount: 8, month: "8" },
          { catchCount: 22, month: "9" },
          { catchCount: 19, month: "10" },
          { catchCount: 0, month: "11" },
          { catchCount: 0, month: "12" },
        ],
        name: "안면도 영목항",
        recentLogs: [
          {
            catchCount: 12,
            dateLabel: "05.20",
            species: "광어",
            tideLabel: "4물",
            weather: "맑음",
          },
          {
            catchCount: 8,
            dateLabel: "04.15",
            species: "광어",
            tideLabel: "5물",
            weather: "흐림",
          },
          {
            catchCount: 5,
            dateLabel: "03.28",
            species: "우럭",
            tideLabel: "3물",
            weather: "맑음",
          },
        ],
        region: "충남 태안",
        speciesBreakdown: [
          { colorHex: "#0d9488", label: "광어", value: 65 },
          { colorHex: "#3b82f6", label: "우럭", value: 20 },
          { colorHex: "#8b5cf6", label: "농어", value: 10 },
          { colorHex: "#94a3b8", label: "기타", value: 5 },
        ],
        successRate: 85,
        totalCatch: 125,
        totalTrips: 24,
        typeLabel: "방파제",
      },
      {
        averageCatch: 12.5,
        averageSize: 28,
        bestSeason: "봄 · 여름",
        bestTime: "오전 (08-12)",
        bestTide: "7물",
        bestWeather: "맑음 · 흐림",
        id: "ocheon",
        insight:
          "우럭 조황이 연중 안정적이고, 암초 지형 수심 20m 이상 구간에서 가장 높은 반응을 보입니다.",
        mainSpecies: "우럭",
        maxCatch: 30,
        monthlyPoints: [
          { catchCount: 5, month: "1" },
          { catchCount: 8, month: "2" },
          { catchCount: 22, month: "3" },
          { catchCount: 30, month: "4" },
          { catchCount: 28, month: "5" },
          { catchCount: 25, month: "6" },
          { catchCount: 20, month: "7" },
          { catchCount: 18, month: "8" },
          { catchCount: 15, month: "9" },
          { catchCount: 12, month: "10" },
          { catchCount: 10, month: "11" },
          { catchCount: 8, month: "12" },
        ],
        name: "보령 오천항",
        recentLogs: [
          {
            catchCount: 22,
            dateLabel: "05.15",
            species: "우럭",
            tideLabel: "7물",
            weather: "맑음",
          },
          {
            catchCount: 18,
            dateLabel: "04.20",
            species: "우럭",
            tideLabel: "6물",
            weather: "흐림",
          },
          {
            catchCount: 15,
            dateLabel: "03.10",
            species: "노래미",
            tideLabel: "8물",
            weather: "맑음",
          },
        ],
        region: "충남 보령",
        speciesBreakdown: [
          { colorHex: "#3b82f6", label: "우럭", value: 70 },
          { colorHex: "#f59e0b", label: "노래미", value: 20 },
          { colorHex: "#0d9488", label: "광어", value: 7 },
          { colorHex: "#94a3b8", label: "기타", value: 3 },
        ],
        successRate: 92,
        totalCatch: 225,
        totalTrips: 18,
        typeLabel: "방파제",
      },
      {
        averageCatch: 8,
        averageSize: 0,
        bestSeason: "여름 · 가을",
        bestTime: "저녁 (16-20)",
        bestTide: "9물",
        bestWeather: "흐림",
        id: "yamido",
        insight:
          "갑오징어 시즌이 시작되는 6월 이후 피크가 뚜렷하고, 석양 전후 시간대에 에깅 채비 반응이 집중됩니다.",
        mainSpecies: "갑오징어",
        maxCatch: 20,
        monthlyPoints: [
          { catchCount: 0, month: "1" },
          { catchCount: 0, month: "2" },
          { catchCount: 0, month: "3" },
          { catchCount: 2, month: "4" },
          { catchCount: 5, month: "5" },
          { catchCount: 18, month: "6" },
          { catchCount: 20, month: "7" },
          { catchCount: 22, month: "8" },
          { catchCount: 20, month: "9" },
          { catchCount: 9, month: "10" },
          { catchCount: 0, month: "11" },
          { catchCount: 0, month: "12" },
        ],
        name: "군산 야미도",
        recentLogs: [
          {
            catchCount: 5,
            dateLabel: "05.08",
            species: "갑오징어",
            tideLabel: "무시",
            weather: "비",
          },
          {
            catchCount: 20,
            dateLabel: "09.22",
            species: "갑오징어",
            tideLabel: "9물",
            weather: "흐림",
          },
          {
            catchCount: 15,
            dateLabel: "08.14",
            species: "갑오징어",
            tideLabel: "10물",
            weather: "맑음",
          },
        ],
        region: "전북 군산",
        speciesBreakdown: [
          { colorHex: "#8b5cf6", label: "갑오징어", value: 80 },
          { colorHex: "#0d9488", label: "광어", value: 12 },
          { colorHex: "#3b82f6", label: "우럭", value: 5 },
          { colorHex: "#94a3b8", label: "기타", value: 3 },
        ],
        successRate: 60,
        totalCatch: 96,
        totalTrips: 12,
        typeLabel: "선상",
      },
      {
        averageCatch: 4.5,
        averageSize: 35,
        bestSeason: "봄",
        bestTime: "새벽 (04-08)",
        bestTide: "3물",
        bestWeather: "맑음",
        id: "mallipo",
        insight:
          "봄철 노래미 시즌이 뚜렷하고, 갯바위 바닥 채비에서 꾸준한 반응을 보입니다.",
        mainSpecies: "노래미",
        maxCatch: 10,
        monthlyPoints: [
          { catchCount: 0, month: "1" },
          { catchCount: 2, month: "2" },
          { catchCount: 8, month: "3" },
          { catchCount: 10, month: "4" },
          { catchCount: 9, month: "5" },
          { catchCount: 5, month: "6" },
          { catchCount: 2, month: "7" },
          { catchCount: 0, month: "8" },
          { catchCount: 0, month: "9" },
          { catchCount: 0, month: "10" },
          { catchCount: 0, month: "11" },
          { catchCount: 0, month: "12" },
        ],
        name: "태안 만리포",
        recentLogs: [
          {
            catchCount: 8,
            dateLabel: "05.02",
            species: "우럭",
            tideLabel: "3물",
            weather: "맑음",
          },
          {
            catchCount: 7,
            dateLabel: "04.12",
            species: "노래미",
            tideLabel: "2물",
            weather: "맑음",
          },
          {
            catchCount: 5,
            dateLabel: "03.25",
            species: "노래미",
            tideLabel: "4물",
            weather: "흐림",
          },
        ],
        region: "충남 태안",
        speciesBreakdown: [
          { colorHex: "#f59e0b", label: "노래미", value: 60 },
          { colorHex: "#3b82f6", label: "우럭", value: 30 },
          { colorHex: "#0d9488", label: "광어", value: 8 },
          { colorHex: "#94a3b8", label: "기타", value: 2 },
        ],
        successRate: 70,
        totalCatch: 36,
        totalTrips: 8,
        typeLabel: "갯바위",
      },
      {
        averageCatch: 3.2,
        averageSize: 38,
        bestSeason: "여름",
        bestTime: "오전 (08-12)",
        bestTide: "11물",
        bestWeather: "맑음",
        id: "muchangpo",
        insight:
          "조과 편차가 크므로 조류 방향 확인 후 출조 권장. 썰물 포인트 유망.",
        mainSpecies: "광어",
        maxCatch: 8,
        monthlyPoints: [
          { catchCount: 0, month: "1" },
          { catchCount: 0, month: "2" },
          { catchCount: 0, month: "3" },
          { catchCount: 3, month: "4" },
          { catchCount: 5, month: "5" },
          { catchCount: 8, month: "6" },
          { catchCount: 3, month: "7" },
          { catchCount: 0, month: "8" },
          { catchCount: 0, month: "9" },
          { catchCount: 0, month: "10" },
          { catchCount: 0, month: "11" },
          { catchCount: 0, month: "12" },
        ],
        name: "보령 무창포",
        recentLogs: [
          {
            catchCount: 4,
            dateLabel: "04.28",
            species: "광어",
            tideLabel: "11물",
            weather: "맑음",
          },
          {
            catchCount: 8,
            dateLabel: "06.05",
            species: "광어",
            tideLabel: "10물",
            weather: "맑음",
          },
          {
            catchCount: 3,
            dateLabel: "05.18",
            species: "우럭",
            tideLabel: "12물",
            weather: "흐림",
          },
        ],
        region: "충남 보령",
        speciesBreakdown: [
          { colorHex: "#0d9488", label: "광어", value: 55 },
          { colorHex: "#3b82f6", label: "우럭", value: 35 },
          { colorHex: "#8b5cf6", label: "농어", value: 7 },
          { colorHex: "#94a3b8", label: "기타", value: 3 },
        ],
        successRate: 55,
        totalCatch: 19,
        totalTrips: 6,
        typeLabel: "방파제",
      },
    ],
    rankingDescription:
      "바다는 포인트 유형과 물때가 조과 편차를 크게 만들기 때문에, 평균 성과와 함께 어떤 조건에서 강한지 바로 보이도록 정리했습니다.",
  },
};

export function getLocationStatsData(mode: FishingMode) {
  return LOCATION_STATS_DATA[mode];
}
