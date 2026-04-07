export const WEATHER_OPTIONS = ["맑음", "구름", "흐림", "비"] as const;

export const REGISTER_LOG_MAX_IMAGE_COUNT = 5;
export const REGISTER_LOG_MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const REGISTER_LOG_ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
export const REGISTER_LOG_ACCEPTED_IMAGE_TYPE_INPUT =
  REGISTER_LOG_ACCEPTED_IMAGE_TYPES.join(",");
