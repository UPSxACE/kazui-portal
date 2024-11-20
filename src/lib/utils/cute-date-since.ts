import dayjs from "dayjs";

export default function cuteDateSince(dateUtc: Date) {
  const yearsSince = dayjs(new Date()).diff(dateUtc, "year");
  if (yearsSince > 0) {
    return yearsSince + "y";
  }
  const monthsSince = dayjs(new Date()).diff(dateUtc, "month");
  if (monthsSince > 0) {
    return monthsSince + "m";
  }
  const daysSince = dayjs(new Date()).diff(dateUtc, "day");
  if (daysSince > 0) {
    return daysSince + "d";
  }
  const hoursSince = dayjs(new Date()).diff(dateUtc, "hour");
  if (hoursSince > 0) {
    return hoursSince + "h";
  }
  const minutesSince = dayjs(new Date()).diff(dateUtc, "minute");
  if (minutesSince > 0) {
    return minutesSince + "min";
  }
  const secondsSince = dayjs(new Date()).diff(dateUtc, "second");
  return secondsSince + "sec";
}
