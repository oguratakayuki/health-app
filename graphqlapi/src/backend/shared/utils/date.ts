// src/backend/shared/utils/date.ts

/**
 * 基準となる日付に "HH:mm" 形式の時間文字列を合成した Date オブジェクトを返します (UTC)
 */
export function combineDateAndTime(
  baseDate: Date,
  timeStr?: string,
): Date | undefined {
  if (!timeStr) return undefined;

  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date(baseDate);
  date.setUTCHours(hours, minutes, 0, 0);
  return date;
}
