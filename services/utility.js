import moment from "moment-timezone";

export function convertNumber(number) {
  return number.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function fourGenerator() {
  return Math.floor(1000 + Math.random() * 9000);
}

export function sixGenerator() {
  return Math.floor(100000 + Math.random() * 900000);
}

export function convertDate(date) {
  return new Date(date).toLocaleDateString("fa-IR");
}

export function abbreviateNumber(num) {
  return new Intl.NumberFormat("en-GB", {
    notation: "compact",
    compactDisplay: "short",
  }).format(num);
}

export function calculatePercentage(percentage, value) {
  return value * (percentage / 100);
}

export function getMonthName(number) {
  const date = new Date();
  date.setMonth(monthNumber + 2);
  return date.toLocaleString("fa-IR", { month: "long" });
}

export function toFarsiNumber(number) {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return number
    .toString()
    .split("")
    .map((x) => farsiDigits[x])
    .join("");
}

export function filterTomorrowVisits(visits) {
  // Get tomorrow's date in YYYY-MM-DD format in Tehran local time
  const tomorrow = moment.tz("Asia/Tehran").add(1, "days").startOf("day");
  const tomorrowDateString = tomorrow.format("YYYY-MM-DD"); // Format: YYYY-MM-DD
  // Filter visits array
  const filteredVisits = visits.filter((element) => {
    const visitDate = moment.tz(element.date, "Asia/Tehran"); // Convert date string to Tehran local time
    const visitDateString = visitDate.format("YYYY-MM-DD"); // Format: YYYY-MM-DD
    return visitDateString === tomorrowDateString; // Compare dates
  });
  return filteredVisits;
}
