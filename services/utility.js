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

export function isNotThursday(persianDate) {
  const { day, month, year } = persianDate;
  return (
    // 0 = Sunday, 1 = Monday, ..., 5 = Friday
    moment(`${year}/${month}/${day}`, "jYYYY/jM/jD").toDate().getDay() !== 4
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
