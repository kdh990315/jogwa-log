const CHINESE_CALENDAR_LOCALE = "ko-KR-u-ca-chinese";
const DEFAULT_TIME_ZONE = "Asia/Seoul";

export interface TideResult {
  mulName: string;
  mulNumber: number;
  isSpringTide: boolean;
  isNeapTide: boolean;
}

function assertValidLunarDay(lunarDay: number) {
  if (!Number.isInteger(lunarDay) || lunarDay < 1 || lunarDay > 30) {
    throw new Error(
      `유효하지 않은 음력 날짜입니다: ${lunarDay}일. 1~30 사이의 정수만 입력할 수 있습니다.`,
    );
  }
}

function assertValidSolarDate(solarDate: Date) {
  if (!(solarDate instanceof Date) || Number.isNaN(solarDate.getTime())) {
    throw new Error("유효한 Date 객체가 필요합니다.");
  }
}

function createLunarDayFormatter(timeZone: string) {
  try {
    // 한국어 포맷 + Chinese calendar를 사용해 런타임 내장 음력 일을 추출합니다.
    return new Intl.DateTimeFormat(CHINESE_CALENDAR_LOCALE, {
      day: "numeric",
      timeZone,
    });
  } catch {
    throw new Error(
      "현재 런타임은 Chinese calendar 기반 음력 날짜 계산을 지원하지 않습니다.",
    );
  }
}

export function getTideByLunarDay(lunarDay: number): TideResult {
  assertValidLunarDay(lunarDay);

  // 서해안 7물때식은 음력 일을 15일 주기로 접어서 계산합니다.
  let cycleDay = lunarDay % 15;
  if (cycleDay === 0) {
    cycleDay = 15;
  }

  // 1~9일은 7~15물, 10~15일은 1~6물로 매핑됩니다.
  const mulNumber = cycleDay >= 10 ? cycleDay - 9 : cycleDay + 6;
  const mulName =
    mulNumber === 14 ? "조금" : mulNumber === 15 ? "무시" : `${mulNumber}물`;

  return {
    mulName,
    mulNumber,
    isSpringTide: mulNumber === 7,
    isNeapTide: mulNumber === 14 || mulNumber === 15,
  };
}

export function getLunarDayFromSolar(
  solarDate: Date,
  timeZone = DEFAULT_TIME_ZONE,
): number {
  assertValidSolarDate(solarDate);

  const formatter = createLunarDayFormatter(timeZone);
  // locale 문자열 파싱 대신 day 파트만 직접 읽어서 런타임 차이를 줄입니다.
  const lunarDayPart = formatter
    .formatToParts(solarDate)
    .find((part) => part.type === "day")?.value;
  const lunarDay = lunarDayPart ? Number.parseInt(lunarDayPart, 10) : Number.NaN;

  if (!Number.isInteger(lunarDay)) {
    throw new Error("양력 날짜에서 음력 일을 추출하지 못했습니다.");
  }

  return lunarDay;
}

export function getTideBySolarDate(
  solarDate: Date,
  timeZone = DEFAULT_TIME_ZONE,
): TideResult {
  return getTideByLunarDay(getLunarDayFromSolar(solarDate, timeZone));
}

// 기존 호출부 호환을 위해 alias를 유지합니다.
export const TideFormatter = getTideByLunarDay;
