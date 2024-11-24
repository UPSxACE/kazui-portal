export default function clampString(str: string, maxSize: number) {
  if (str.length <= maxSize) return str;
  return str.slice(0, maxSize) + "...";
}
