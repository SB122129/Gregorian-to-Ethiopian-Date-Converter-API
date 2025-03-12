
# Ethiopian Date API

A simple Express API built with TypeScript that converts Gregorian dates to Ethiopian dates. It supports converting a provided date in `yyyy-mm-dd` format as well as converting the current date (today) to the Ethiopian calendar. The API returns both a numeric format (`yyyy-mm-dd`) and a verbose format (including the day of the week and Ethiopian month name in Amharic).

## Features

- Convert a given Gregorian date to the Ethiopian calendar.
- Convert the current (today's) Gregorian date.
- Returns date in two formats:
  - Numeric: `yyyy-mm-dd`
  - Verbose: `Weekday, Month (Amharic) DD, YYYY`
- Built with Express and TypeScript.

## Prerequisites

- [Node.js](https://nodejs.org/) installed.
- [npm](https://www.npmjs.com/) (comes with Node.js).

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ethiopian-date-api.git
   cd ethiopian-date-api
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. If you haven't already, build the TypeScript files (or run with ts-node):
   ```bash
   npx ts-node src/server.ts
   ```
   or compile using:
   ```bash
   npx tsc
   node dist/server.js
   ```

## API Endpoints

### `GET /today`
Converts the current Gregorian date to the Ethiopian date.

**Example Request:**
```bash
http://localhost:3000/today
```
**Example Response:**
```json
{
  "numeric": "YYYY-MM-DD",
  "verbose": "Weekday, MonthName DD, YYYY"
}
```

### `GET /convert`
Converts a provided Gregorian date (in `yyyy-mm-dd` format) to the Ethiopian date.

**Example Request:**
```bash
http://localhost:3000/convert?date=2025-03-01
```
**Example Response:**
```json
{
  "numeric": "YYYY-MM-DD",
  "verbose": "Weekday, MonthName DD, YYYY"
}
```

## Exposing Your API
If you want to test your API using a public service (like Power Automate), you can expose your local server using tools such as **ngrok**.

**Example:**
```bash
ngrok http 3000
```
This will give you a public URL that you can use in Power Automate or any other external service.

## Contributing
Feel free to fork the repository, create a feature branch, and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

