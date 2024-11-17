import roundDownDecimals from "./round-down-decimals";

export default function simplifiedNumber(num: number) {
  // billions
  if (num > 1e9) {
    const billions = num / 1e9;
    const billionsRounded = roundDownDecimals(billions, 1);
    return billionsRounded + "B";
  }
  // millions
  if (num > 1e6) {
    const millions = num / 1e6;
    const millionsRounded = roundDownDecimals(millions, 1);
    return millionsRounded + "M";
  }
  // thousands
  if (num > 1e3) {
    const millions = num / 1e6;
    const millionsRounded = roundDownDecimals(millions, 1);
    return millionsRounded + "K";
  }
  return roundDownDecimals(num, 1);
}
