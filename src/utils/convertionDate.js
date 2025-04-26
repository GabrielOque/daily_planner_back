import { DateTime } from "luxon";

// Local a UTC → Sumar 5 horas
export function localToUTC(localDateStr) {
  const local = DateTime.fromISO(localDateStr);
  return local.plus({ hours: 5 }).toISO();
}

// UTC a Local → Restar 5 horas
export function utcToLocal(utcDateStr) {
  const utc = DateTime.fromISO(utcDateStr);
  return utc.minus({ hours: 5 }).toISO();
}

// String ISO a Date
export const stringToDate = (dateString) => {
  return DateTime.fromISO(dateString).toJSDate();
};
