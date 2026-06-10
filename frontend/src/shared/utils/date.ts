export function formatDate(date: string) {
  const [year, month, day] = date.split('-');

  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}/${year}`;
}

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}
