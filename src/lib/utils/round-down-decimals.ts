export default function roundDownDecimals(num: number, decimals: number) {
  if (decimals < 0)
    throw new Error("decimals argument must be equal to or bigger than 0");
  const scalingFactor = 10 ** decimals;
  const rounded = Math.floor(num * scalingFactor) / scalingFactor;
  return rounded;
}
