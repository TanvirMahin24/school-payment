export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2033];

export const getLastMonthAndYear = () => {
  const now = new Date();
  const currentMonthIndex = now.getMonth();
  if (currentMonthIndex === 0) {
    return { month: months[11], year: now.getFullYear() - 1 };
  }
  return { month: months[currentMonthIndex - 1], year: now.getFullYear() };
};







