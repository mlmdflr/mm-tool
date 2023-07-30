/**
 * 指定范围内的随机整数
 * @param start
 * @param end
 */
export function random(start: number = 0, end: number = 1): number {
  return (Math.random() * (end - start + 1) + start) | 0;
}

/**
 * @description 保留小数
 * @author 没礼貌的芬兰人
 * @date 2021-10-06 17:08:35
 * @param n
 * @param fixed 保留位数
 */
export function toFixed(n: number, fixed: number) {
  return fixed <= 0
    ? n
    : !(n % 1)
    ? n
    : fixed <= n.toString().split(".")[1].length
    ? ~~(Math.pow(10, fixed) * n) / Math.pow(10, fixed)
    : ~~(Math.pow(10, n.toString().split(".")[1].length) * n) /
      Math.pow(10, n.toString().split(".")[1].length);
}

/**
 * @description 颜色RGB转十六进制
 * @author 没礼貌的芬兰人
 * @date 2021-10-06 16:29:56
 * @param r
 * @param g
 * @param b
 * @returns 十六进制
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const units = [
  "B",
  "KB",
  "MB",
  "GB",
  "TB",
  "PB",
  "EB",
  "ZB",
  "YB",
  "BB",
  "NB",
  "DB",
] as const;
type unit = (typeof units)[number];

export type treatedBytes = { bytes: number; unit: unit };

/**
 * bytes 向上转换为单位
 * @param bytes 字节数
 */
export function bytesToSize(bytes: number): treatedBytes {
  if (bytes === 0) return { bytes: 0, unit: units[0] };
  let k: number = 1024,
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return {
    bytes:
      Math.round((bytes / Math.pow(k, i)) * Math.pow(10, 1)) / Math.pow(10, 1),
    unit: units[i],
  };
}
