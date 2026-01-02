/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

export function getLast30Days() {
  const dates = [];

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const dateString = date.toISOString().split("T")[0];
    dates.push(dateString);
  }

  return dates;
}

export function formatDataArray(data: any) {
  // const resultArray = [];
  const dates: string[] = [];
  const values: number[] = [];

  const dateArray = getLast30Days();

  // Map the dateArray to the desired format using values from the original data
  dateArray.forEach((date: string) => {
    const value = data[date] || 0;
    // resultArray.push({ [date]: value });
    dates.unshift(date);
    values.unshift(value);
  });

  return { dates, values };
}





export function getCurrentTimeString(): string {
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleString('default', { month: 'short' });
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();
  const millisecond = now.getMilliseconds();

  const dayPostfix = getDayPostfix(day);

  return `${day}${dayPostfix} ${month} ${hour}:${minute}:${second}:${millisecond}ms`;
}

function getDayPostfix(day: number): string {
  if (day >= 11 && day <= 13) {
      return 'th';
  }
  switch (day % 10) {
      case 1:
          return 'st';
      case 2:
          return 'nd';
      case 3:
          return 'rd';
      default:
          return 'th';
  }
}

