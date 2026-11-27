/**
 * Hotel Rajmahal Palace - Check-In Timing Utilities
 * Full 24-hour access from 12:00 AM to 11:00 PM.
 * For today, past hours are filtered out (e.g. at 12:23 AM, slots from 1:00 AM to 11:00 PM are available).
 * Check-out timing is calculated as exactly 22 hours from the booking timing.
 * Always calibrated to Indian Standard Time (IST / Asia/Kolkata: UTC + 5:30)
 */

export const ALL_HOURLY_SLOTS = [
  { value: "12:00 AM", hour: 0 },
  { value: "1:00 AM", hour: 1 },
  { value: "2:00 AM", hour: 2 },
  { value: "3:00 AM", hour: 3 },
  { value: "4:00 AM", hour: 4 },
  { value: "5:00 AM", hour: 5 },
  { value: "6:00 AM", hour: 6 },
  { value: "7:00 AM", hour: 7 },
  { value: "8:00 AM", hour: 8 },
  { value: "9:00 AM", hour: 9 },
  { value: "10:00 AM", hour: 10 },
  { value: "11:00 AM", hour: 11 },
  { value: "12:00 PM", hour: 12 },
  { value: "1:00 PM", hour: 13 },
  { value: "2:00 PM", hour: 14 },
  { value: "3:00 PM", hour: 15 },
  { value: "4:00 PM", hour: 16 },
  { value: "5:00 PM", hour: 17 },
  { value: "6:00 PM", hour: 18 },
  { value: "7:00 PM", hour: 19 },
  { value: "8:00 PM", hour: 20 },
  { value: "9:00 PM", hour: 21 },
  { value: "10:00 PM", hour: 22 },
  { value: "11:00 PM", hour: 23 },
];

export const CHECK_IN_TIME_SLOTS = ALL_HOURLY_SLOTS;

/**
 * Get current date/time in Indian Standard Time (IST: UTC + 5 hours 30 mins)
 * Ensures consistency across Vercel servers (UTC) and client browsers.
 */
export function getNowInIST() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 5.5 * 3600000);
}

/**
 * Format a Date to YYYY-MM-DD
 */
export function getLocalDateString(date = getNowInIST()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Check if a time slot has already passed for a given check-in date
 */
export function isSlotPassed(slotValue, checkInDate) {
  if (!checkInDate) return false;
  const now = getNowInIST();
  const todayStr = getLocalDateString(now);

  if (checkInDate < todayStr) return true;
  if (checkInDate > todayStr) return false;

  // checkInDate === today: past if hour is <= current hour
  const currentHour = now.getHours();
  const slot = ALL_HOURLY_SLOTS.find((s) => s.value === slotValue);
  if (!slot) return false;

  return slot.hour <= currentHour;
}

/**
 * Get available time slots for the check-in date.
 * For today: only future hours (e.g. at 12:23 AM, returns 1:00 AM to 11:00 PM).
 * For future dates: returns all 24 slots.
 */
export function getAvailableTimeSlots(checkInDate) {
  const now = getNowInIST();
  const todayStr = getLocalDateString(now);

  if (!checkInDate || checkInDate > todayStr) {
    return ALL_HOURLY_SLOTS.map((s) => ({ ...s, isPassed: false }));
  }

  if (checkInDate < todayStr) {
    return ALL_HOURLY_SLOTS.map((s) => ({ ...s, isPassed: true }));
  }

  const currentHour = now.getHours();
  return ALL_HOURLY_SLOTS.map((s) => ({
    ...s,
    isPassed: s.hour <= currentHour,
  }));
}

/**
 * Get sensible default booking time:
 * For today: first available upcoming hour (e.g. 1:00 AM at 12:23 AM).
 * For future date: "12:00 PM".
 */
export function getDefaultBookingTime(checkInDate) {
  const slots = getAvailableTimeSlots(checkInDate);
  const now = getNowInIST();
  const todayStr = getLocalDateString(now);

  if (!checkInDate || checkInDate > todayStr) {
    return "12:00 PM";
  }

  const firstAvailable = slots.find((s) => !s.isPassed);
  return firstAvailable ? firstAvailable.value : "12:00 PM";
}

/**
 * Default check-in date: Today
 */
export function getSensibleDefaultCheckInDate() {
  return getLocalDateString(getNowInIST());
}

/**
 * Calculate check-out timing: exactly 22 hours from the check-in timing.
 * (e.g. 1:00 AM -> 11:00 PM, 12:00 PM -> 10:00 AM, 11:00 PM -> 9:00 PM)
 */
export function getCheckOutTime(checkInTime = "12:00 PM") {
  const match = ALL_HOURLY_SLOTS.find((s) => s.value === checkInTime);
  let hour24 = match ? match.hour : 12;

  // Fallback parsing if string doesn't directly match
  if (!match && typeof checkInTime === "string") {
    const parts = checkInTime.trim().split(" ");
    if (parts.length >= 2) {
      const [hStr] = parts[0].split(":");
      const hNum = parseInt(hStr, 10);
      const isPM = parts[1].toUpperCase() === "PM";
      hour24 = isPM ? (hNum === 12 ? 12 : hNum + 12) : (hNum === 12 ? 0 : hNum);
    }
  }

  // 22 hours later is (hour24 - 2 + 24) % 24
  const outHour24 = (hour24 - 2 + 24) % 24;
  const period = outHour24 >= 12 ? "PM" : "AM";
  const displayHour = outHour24 % 12 === 0 ? 12 : outHour24 % 12;
  return `${displayHour}:00 ${period}`;
}
