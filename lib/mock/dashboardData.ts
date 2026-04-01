export type FishingMode = "sea" | "freshwater";

export interface DashboardMetric {
  change?: string;
  icon: "catch" | "point" | "species" | "trip" | "tide";
  label: string;
  subtext?: string;
  value: string;
}

export interface MonthlyCatchPoint {
  count: number;
  month: string;
}

export interface SpeciesStat {
  label: string;
  value: number;
}

export interface TimePatternStat {
  count: number;
  label: string;
  range: string;
}

export interface LocationPerformanceStat {
  averageCatch: number;
  averageSize: string;
  name: string;
  species: string;
  successRate: number;
  trips: number;
}

export interface TideStat {
  tripCount: number;
  count: number;
  label: string;
}

export interface CalendarEntry {
  count: number;
  date: string;
  species: string;
  status: "empty" | "fishing";
}

export interface RecentLogEntry {
  count: number;
  date: string;
  id: number;
  location: string;
  species: string;
  tide: string;
  weather: string;
}

export interface DashboardData {
  calendarEntries: CalendarEntry[];
  locationInsight: string;
  locations: LocationPerformanceStat[];
  metrics: DashboardMetric[];
  monthlyCatch: MonthlyCatchPoint[];
  recentLogs: RecentLogEntry[];
  speciesStats: SpeciesStat[];
  tideInsight?: string;
  tideStats?: TideStat[];
  timeInsight: string;
  timePatterns: TimePatternStat[];
}

export const DASHBOARD_DATA: Record<FishingMode, DashboardData> = {
  freshwater: {
    calendarEntries: [
      { count: 8, date: "2024-05-05", species: "붕어", status: "fishing" },
      { count: 14, date: "2024-05-10", species: "붕어", status: "fishing" },
      { count: 6, date: "2024-05-18", species: "배스", status: "fishing" },
      { count: 0, date: "2024-05-22", species: "꽝", status: "empty" },
      { count: 3, date: "2024-05-30", species: "쏘가리", status: "fishing" },
    ],
    locationInsight: "팔당호와 낙동강 구미가 전체 기록의 중심입니다.",
    locations: [
      {
        averageCatch: 6.1,
        averageSize: "35cm",
        name: "팔당호",
        species: "배스",
        successRate: 80,
        trips: 18,
      },
      {
        averageCatch: 11.4,
        averageSize: "22cm",
        name: "낙동강 구미",
        species: "붕어",
        successRate: 88,
        trips: 12,
      },
      {
        averageCatch: 4.5,
        averageSize: "48cm",
        name: "충주호",
        species: "잉어",
        successRate: 75,
        trips: 8,
      },
      {
        averageCatch: 3.8,
        averageSize: "31cm",
        name: "남한강 여주",
        species: "쏘가리",
        successRate: 67,
        trips: 10,
      },
    ],
    metrics: [
      {
        change: "+8%",
        icon: "catch",
        label: "이번 달 조과",
        value: "28마리",
      },
      {
        change: "유지",
        icon: "trip",
        label: "이번 달 출조",
        value: "4회",
      },
      {
        icon: "species",
        label: "최대 어종",
        subtext: "전체 35%",
        value: "붕어",
      },
      {
        icon: "point",
        label: "성공률 1위 포인트",
        subtext: "평균 6마리",
        value: "팔당호",
      },
    ],
    monthlyCatch: [
      { count: 4, month: "1월" },
      { count: 6, month: "2월" },
      { count: 14, month: "3월" },
      { count: 20, month: "4월" },
      { count: 28, month: "5월" },
      { count: 22, month: "6월" },
      { count: 10, month: "7월" },
      { count: 8, month: "8월" },
      { count: 18, month: "9월" },
      { count: 30, month: "10월" },
      { count: 16, month: "11월" },
      { count: 5, month: "12월" },
    ],
    recentLogs: [
      {
        count: 6,
        date: "05.18",
        id: 21,
        location: "팔당호",
        species: "배스",
        tide: "-",
        weather: "맑음",
      },
      {
        count: 14,
        date: "05.10",
        id: 22,
        location: "낙동강 구미",
        species: "붕어",
        tide: "-",
        weather: "흐림",
      },
      {
        count: 2,
        date: "04.30",
        id: 23,
        location: "남한강 여주",
        species: "쏘가리",
        tide: "-",
        weather: "맑음",
      },
      {
        count: 3,
        date: "04.22",
        id: 24,
        location: "충주호",
        species: "잉어",
        tide: "-",
        weather: "맑음",
      },
      {
        count: 20,
        date: "04.05",
        id: 25,
        location: "팔당호",
        species: "붕어",
        tide: "-",
        weather: "흐림",
      },
    ],
    speciesStats: [
      { label: "붕어", value: 35 },
      { label: "배스", value: 30 },
      { label: "잉어", value: 20 },
      { label: "쏘가리", value: 15 },
    ],
    timeInsight: "새벽 피딩 타임이 가장 강하고 오전까지 흐름이 이어집니다.",
    timePatterns: [
      { count: 30, label: "새벽", range: "04-08" },
      { count: 18, label: "오전", range: "08-12" },
      { count: 8, label: "오후", range: "12-16" },
      { count: 12, label: "저녁", range: "16-20" },
      { count: 6, label: "밤", range: "20-24" },
    ],
  },
  sea: {
    calendarEntries: [
      { count: 3, date: "2024-05-01", species: "노래미", status: "fishing" },
      { count: 5, date: "2024-05-08", species: "갑오징어", status: "fishing" },
      { count: 8, date: "2024-05-15", species: "우럭", status: "fishing" },
      { count: 12, date: "2024-05-20", species: "광어", status: "fishing" },
      { count: 0, date: "2024-05-25", species: "꽝", status: "empty" },
    ],
    locationInsight: "영목항과 오천항이 성과와 안정성 모두에서 앞섭니다.",
    locations: [
      {
        averageCatch: 5.2,
        averageSize: "42cm",
        name: "안면도 영목항",
        species: "광어",
        successRate: 85,
        trips: 24,
      },
      {
        averageCatch: 12.5,
        averageSize: "28cm",
        name: "보령 오천항",
        species: "우럭",
        successRate: 92,
        trips: 18,
      },
      {
        averageCatch: 8,
        averageSize: "-",
        name: "군산 야미도",
        species: "갑오징어",
        successRate: 60,
        trips: 12,
      },
      {
        averageCatch: 4.5,
        averageSize: "35cm",
        name: "태안 만리포",
        species: "노래미",
        successRate: 70,
        trips: 8,
      },
    ],
    metrics: [
      {
        change: "+12%",
        icon: "catch",
        label: "이번 달 조과",
        value: "42마리",
      },
      {
        change: "유지",
        icon: "trip",
        label: "이번 달 출조",
        value: "5회",
      },
      {
        icon: "species",
        label: "최대 어종",
        subtext: "전체 40%",
        value: "광어",
      },
      {
        icon: "tide",
        label: "성공률 1위 물때",
        subtext: "평균 8마리",
        value: "4물",
      },
    ],
    monthlyCatch: [
      { count: 12, month: "1월" },
      { count: 8, month: "2월" },
      { count: 15, month: "3월" },
      { count: 24, month: "4월" },
      { count: 42, month: "5월" },
      { count: 38, month: "6월" },
      { count: 25, month: "7월" },
      { count: 18, month: "8월" },
      { count: 45, month: "9월" },
      { count: 60, month: "10월" },
      { count: 32, month: "11월" },
      { count: 10, month: "12월" },
    ],
    recentLogs: [
      {
        count: 12,
        date: "05.20",
        id: 1,
        location: "안면도 영목항",
        species: "광어",
        tide: "4물",
        weather: "맑음",
      },
      {
        count: 8,
        date: "05.15",
        id: 2,
        location: "태안 만리포",
        species: "우럭",
        tide: "2물",
        weather: "흐림",
      },
      {
        count: 5,
        date: "05.08",
        id: 3,
        location: "오천항",
        species: "갑오징어",
        tide: "무시",
        weather: "비",
      },
      {
        count: 3,
        date: "05.01",
        id: 4,
        location: "대천항",
        species: "노래미",
        tide: "9물",
        weather: "맑음",
      },
      {
        count: 4,
        date: "04.28",
        id: 5,
        location: "보령 무창포",
        species: "광어",
        tide: "11물",
        weather: "맑음",
      },
    ],
    speciesStats: [
      { label: "광어", value: 40 },
      { label: "우럭", value: 30 },
      { label: "갑오징어", value: 20 },
      { label: "농어", value: 10 },
    ],
    tideInsight: "4물과 10물이 가장 안정적으로 조과를 만들어냅니다.",
    tideStats: [
      { tripCount: 1, count: 2, label: "무시" },
      { tripCount: 2, count: 5, label: "1물" },
      { tripCount: 3, count: 8, label: "2물" },
      { tripCount: 4, count: 12, label: "3물" },
      { tripCount: 6, count: 25, label: "4물" },
      { tripCount: 5, count: 18, label: "5물" },
      { tripCount: 3, count: 10, label: "6물" },
      { tripCount: 2, count: 4, label: "7물" },
      { tripCount: 2, count: 6, label: "8물" },
      { tripCount: 4, count: 15, label: "9물" },
      { tripCount: 5, count: 20, label: "10물" },
      { tripCount: 4, count: 14, label: "11물" },
      { tripCount: 3, count: 9, label: "12물" },
      { tripCount: 2, count: 5, label: "13물" },
      { tripCount: 1, count: 3, label: "조금" },
    ],
    timeInsight: "새벽과 저녁 물돌이 시간대가 조과를 가장 많이 만듭니다.",
    timePatterns: [
      { count: 25, label: "새벽", range: "04-08" },
      { count: 12, label: "오전", range: "08-12" },
      { count: 5, label: "오후", range: "12-16" },
      { count: 18, label: "저녁", range: "16-20" },
      { count: 10, label: "밤", range: "20-24" },
    ],
  },
};

export function getDashboardData(mode: FishingMode) {
  return DASHBOARD_DATA[mode];
}

export function getFishingMode(mode: string | undefined): FishingMode {
  return mode === "freshwater" ? "freshwater" : "sea";
}
