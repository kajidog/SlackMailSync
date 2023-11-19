import { parseISO, format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

// iso形式で現在のタイムスタンプを返す関数
export const createTimeStamp = () => new Date().toISOString();

// iso時間を指定のタイムゾーンに変換する関数
export function convertDateFormat(isoStr: string, timezone: string = 'Asia/Tokyo') {
  const date = parseISO(isoStr);
  const zonedDate = utcToZonedTime(date, timezone);
  return format(zonedDate, 'yyyy/MM/dd HH:mm:ss');
}

// 指定の文字に制限して、分割する関数
export function splitAndProcess<T>(input: string, length: number, processor?: (chunk: string) => T): T[] {
  const result: T[] = [];

  let start = 0;

  while (start < input.length) {
    let end = start + length;
    if (end < input.length) {
      const lastNewLinePos = input.lastIndexOf('\n', end);
      if (lastNewLinePos > start) {
        end = lastNewLinePos;
      }
    }
    const chunk = input.substring(start, end);
    result.push(processor ? processor(chunk) : (chunk as unknown as T));

    start = end;
  }

  return result;
}

// 指定の区切り文字で分割する関数
export function splitStringByDelimiters(target: string, delimiters: string[]): string[] {
  const regex = new RegExp(delimiters.join('|'), 'g');
  return target
    .split(regex)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

// yyyy-MM-dd HH:mmのフォーマットに変換
export function formatDate(inputDateStr: string, timezone: string = 'Asia/Tokyo'): string {
  if (inputDateStr === '' || !inputDateStr) {
    return '';
  }
  const parsedDate = new Date(inputDateStr);
  const zonedDate = utcToZonedTime(parsedDate, timezone);
  return format(zonedDate, 'yyyy-MM-dd HH:mm');
}
