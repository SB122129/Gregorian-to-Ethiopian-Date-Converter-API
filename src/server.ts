import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Utility to check if a Gregorian year is a leap year
function isGregorianLeap(year: number): boolean {
  return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
}

// Get the Gregorian date of Ethiopian New Year for a given Gregorian year.
// Note: In most years Ethiopian New Year falls on September 11,
// but if (year - 1) was a leap year, it falls on September 12.
function getEthiopianNewYearDate(gYear: number): Date {
  if (isGregorianLeap(gYear - 1)) {
    return new Date(gYear, 8, 12); // September 12 (month index 8)
  }
  return new Date(gYear, 8, 11);   // September 11
}

// Convert a Gregorian date into an Ethiopian date.
function convertToEthiopian(gregDate: Date): { year: number; month: number; day: number } {
  const gYear = gregDate.getFullYear();
  const newYear = getEthiopianNewYearDate(gYear);
  let ethYear: number;
  let ethNewYear: Date;
  
  if (gregDate >= newYear) {
    ethYear = gYear - 7;
    ethNewYear = newYear;
  } else {
    ethYear = gYear - 8;
    ethNewYear = getEthiopianNewYearDate(gYear - 1);
  }
  
  // Calculate the difference in days from the Ethiopian New Year
  const diff = Math.floor((gregDate.getTime() - ethNewYear.getTime()) / (1000 * 60 * 60 * 24));
  
  // In the Ethiopian calendar, the first 12 months have 30 days each,
  // and the 13th month (Pagume) has 5 or 6 days.
  const ethMonth = Math.floor(diff / 30) + 1;
  const ethDay = (diff % 30) + 1;
  
  return { year: ethYear, month: ethMonth, day: ethDay };
}

// Helper function to pad numbers with a leading zero when needed.
function pad(num: number): string {
  return num < 10 ? '0' + num : num.toString();
}

// Define weekday names (the weekly cycle remains the same as in Gregorian)
const weekdays = [
  "እሁድ", "ሰኞ", "ማክሰኞ", "እሮብ", "ሓሙስ", "አርብ", "ቅዳሜ"
];

// Ethiopian month names according to the Ethiopian calendar.
const ethiopianMonthNames = [
    "መስከረም", // Meskerem
    "ጥቅምት",    // Tikimt
    "ኅዳር",     // Hidar
    "ታህሳስ",    // Tahsas
    "ጥር",      // Tir
    "የካቲት",   // Yekatit
    "መጋቢት",   // Megabit
    "ሚያዝያ",   // Miyazya
    "ግንቦት",   // Ginbot
    "ሰኔ",      // Sene
    "ሐምሌ",     // Hamle
    "ነሐሴ",     // Nehase
    "ጳጉሜ"     // Pagume
  ];
  
// Format the Ethiopian date as a numeric string: yyyy-mm-dd
function formatNumeric(ethDate: { year: number; month: number; day: number }): string {
  return `${ethDate.year}-${pad(ethDate.month)}-${pad(ethDate.day)}`;
}

// Format a verbose string using the Ethiopian month name and the Gregorian weekday.
function formatVerbose(gregDate: Date, ethDate: { year: number; month: number; day: number }): string {
  const weekday = weekdays[gregDate.getDay()];
  const monthName = ethiopianMonthNames[ethDate.month - 1] || "Unknown";
  return `${weekday}, ${monthName} ${pad(ethDate.day)}, ${ethDate.year}`;
}

// Explicitly typed route handler for the /convert endpoint.
const convertHandler: express.RequestHandler = (req, res) => {
  const dateStr = req.query.date as string;
  if (!dateStr) {
    res.status(400).json({ error: "Missing date parameter in yyyy-mm-dd format" });
    return;
  }
  const parts = dateStr.split('-');
  if (parts.length !== 3) {
    res.status(400).json({ error: "Date must be in yyyy-mm-dd format" });
    return;
  }
  const [yearStr, monthStr, dayStr] = parts;
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // JavaScript Date months are 0-indexed
  const day = parseInt(dayStr, 10);
  
  const gregDate = new Date(year, month, day);
  if (isNaN(gregDate.getTime())) {
    res.status(400).json({ error: "Invalid date provided" });
    return;
  }
  
  const ethDate = convertToEthiopian(gregDate);
  res.json({
    numeric: formatNumeric(ethDate),
    verbose: formatVerbose(gregDate, ethDate)
  });
};

app.get('/convert', convertHandler);

// Endpoint that converts the current date (today) into the Ethiopian date.
app.get('/today', (req: Request, res: Response) => {
  const gregDate = new Date();
  const ethDate = convertToEthiopian(gregDate);
  res.json({
    numeric: formatNumeric(ethDate),
    verbose: formatVerbose(gregDate, ethDate)
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
