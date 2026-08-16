export const TIME_ZONE = 'Asia/Tokyo';

const inputFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/**
 * TIMESTAMPTZ の値を datetime-local input 用の JST 文字列 (YYYY-MM-DDTHH:mm) に変換
 */
export function toJstInputValue(value: string | Date | null | undefined): string {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  const parts = inputFormatter.formatToParts(d);
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}

/**
 * datetime-local input の値を JST として解釈し、UTC の ISO 文字列に変換
 * (DB は TIMESTAMPTZ なので、タイムゾーンを付けずに渡すと UTC 扱いされてしまう)
 */
export function fromJstInputValue(value: string): string {
  const m = value.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(:\d{2})?$/);
  if (!m) return value;
  const d = new Date(`${m[1]}T${m[2]}${m[3] ?? ':00'}+09:00`);
  return isNaN(d.getTime()) ? value : d.toISOString();
}
