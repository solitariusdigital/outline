import moment from "moment-jalaali";
import momentTimezone from "moment-timezone";

export function fourGenerator() {
  return Math.floor(1000 + Math.random() * 9000);
}

export function convertDate(date) {
  return new Date(date).toLocaleDateString("fa-IR");
}

export function toFarsiNumber(number) {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return number
    .toString()
    .split("")
    .map((x) => farsiDigits[x])
    .join("");
}

export function toEnglishNumber(number) {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return number
    .split("")
    .map((x) => farsiDigits.indexOf(x)) // Find the index of the Farsi digit
    .join("");
}

export function isEnglishNumber(str) {
  return Boolean(str.match(/^[A-Za-z0-9]*$/));
}

// 0 for today / 1 for tomorrow / 2 for afterTomorrow
export function filterVisitsByDate(visits, offsetDays = 0) {
  // Get the date based on the offset in YYYY-MM-DD format in Tehran local time
  const targetDate = momentTimezone
    .tz("Asia/Tehran")
    .add(offsetDays, "days")
    .startOf("day");
  const targetDateString = targetDate.format("YYYY-MM-DD"); // Format: YYYY-MM-DD
  // Filter visits array
  const filteredVisits = visits.filter((element) => {
    const visitDate = momentTimezone.tz(element.date, "Asia/Tehran"); // Convert date string to Tehran local time
    const visitDateString = visitDate.format("YYYY-MM-DD"); // Format: YYYY-MM-DD
    return visitDateString === targetDateString; // Compare dates
  });

  return filteredVisits.filter((visit) => !visit.completed && !visit.canceled);
}

export function convertPersianToGregorian(persianDate, time) {
  const { day, month, year } = persianDate;
  return moment(
    `${year}/${month}/${day} ${time}`,
    "jYYYY/jM/jD HH:mm"
  ).toISOString();
}

export function isSelectedDateFriday(persianDate) {
  const { day, month, year } = persianDate;
  return (
    // 0 = Sunday, 1 = Monday, ..., 5 = Friday
    moment(`${year}/${month}/${day}`, "jYYYY/jM/jD").toDate().getDay() === 5
  );
}

//  is not sat tue thu
export function ganjeDays(persianDate) {
  const { day, month, year } = persianDate;
  const dayOfWeek = moment(`${year}/${month}/${day}`, "jYYYY/jM/jD")
    .toDate()
    .getDay();
  return (
    dayOfWeek !== 1 &&
    dayOfWeek !== 2 &&
    dayOfWeek !== 3 &&
    dayOfWeek !== 4 &&
    dayOfWeek !== 6
  );
}

export function hajiluDays(persianDate) {
  const { day, month, year } = persianDate;
  const dayOfWeek = moment(`${year}/${month}/${day}`, "jYYYY/jM/jD")
    .toDate()
    .getDay();
  return (
    dayOfWeek === 0 ||
    dayOfWeek === 1 ||
    dayOfWeek === 2 ||
    dayOfWeek === 3 ||
    dayOfWeek === 6
  );
}

export function getCurrentDate() {
  // Get current time in Tehran
  const tehranTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Tehran",
  });
  const currentDate = new Date(tehranTime);
  // Set the current date to midnight to only compare dates
  currentDate.setHours(0, 0, 0, 0);
  return currentDate;
}

export function getCurrentDateFarsi() {
  const now = new Date();
  const date = now.toLocaleDateString("fa-IR", {
    timeZone: "Asia/Tehran",
  });
  return date;
}

export function getCurrentTimeFarsi() {
  const now = new Date();
  const time = now.toLocaleTimeString("fa-IR", {
    timeZone: "Asia/Tehran",
    hour12: false,
  });
  return time;
}

function parsePersianTime(timeString) {
  // Convert Persian numerals to English numerals
  const persianToEnglish = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
  };
  // Replace Persian numerals with English numerals
  const englishTimeString = timeString.replace(
    /[۰-۹]/g,
    (match) => persianToEnglish[match]
  );
  // Split the time string into hours, minutes, and seconds
  const [hours, minutes, seconds] = englishTimeString.split(":").map(Number);
  return { hours, minutes, seconds };
}

export function calculateTimeDifference(time1, time2) {
  const t1 = parsePersianTime(time1);
  const t2 = parsePersianTime(time2);
  // Convert both times to total seconds
  const totalSeconds1 = t1.hours * 3600 + t1.minutes * 60 + t1.seconds;
  const totalSeconds2 = t2.hours * 3600 + t2.minutes * 60 + t2.seconds;
  // Calculate the difference in seconds
  const differenceInSeconds = Math.abs(totalSeconds1 - totalSeconds2);
  // Convert back to hours, minutes, and seconds
  const hours = Math.floor(differenceInSeconds / 3600);
  const minutes = Math.floor((differenceInSeconds % 3600) / 60);
  const seconds = differenceInSeconds % 60;
  return { hours, minutes, seconds };
}
