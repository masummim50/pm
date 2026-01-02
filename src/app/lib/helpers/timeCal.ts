export const getTimeDifference = (timestamp1: number, timestamp2: number) => {
  const differenceInMilliseconds = Math.abs(timestamp1 - timestamp2);

  const millisecondsInMinute = 1000 * 60;
  const millisecondsInHour = millisecondsInMinute * 60;
  const millisecondsInDay = millisecondsInHour * 24;

  const days = Math.floor(differenceInMilliseconds / millisecondsInDay);
  const hours = Math.floor(
    (differenceInMilliseconds % millisecondsInDay) / millisecondsInHour
  );
  const minutes = Math.floor(
    (differenceInMilliseconds % millisecondsInHour) / millisecondsInMinute
  );
  const seconds = Math.floor(
    (differenceInMilliseconds % millisecondsInMinute) / 1000
  );

  let result = "";

  if (days > 0) {
    result += `${days} day${days !== 1 ? "s" : ""} `;
  }
  if (hours > 0) {
    result += `${hours} hour${hours !== 1 ? "s" : ""} `;
  }
  if (minutes > 0) {
    result += `${minutes} minute${minutes !== 1 ? "s" : ""} `;
  }
  if (seconds > 0) {
    result += `${seconds} second${seconds !== 1 ? "s" : ""} `;
  }

  return result.trim(); // Remove extra whitespace at the end
};

export const calcTime = (dateNumber: number) => {
  const msPerSecond = 1000;
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;

  const difference = dateNumber;

  const days = Math.floor(difference / msPerDay);
  const hours = Math.floor((difference % msPerDay) / msPerHour);
  const minutes = Math.floor((difference % msPerHour) / msPerMinute);

  const seconds = Math.floor((difference % msPerMinute) / msPerSecond);

  let result = "";

  if (days > 0) {
    result += `${days}d `;
  }
  if (hours > 0) {
    result += `${hours}h `;
  }
  if (minutes > 0) {
    result += `${minutes}m `;
  }
  if (seconds > 0 || (days === 0 && hours === 0 && minutes === 0)) {
    result += `${seconds}s `;
  }

  return result.trim();
};
