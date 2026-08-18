export function toInputDate(
  value?: string | Date | null
) {
  if (!value) return "";

  return new Date(value)
    .toISOString()
    .split("T")[0];
}

export function formatDateOnly(
  value?: string | Date | null
): string {
  if (!value) return "-";

  const dateString =
    typeof value === "string"
      ? value.slice(0, 10)
      : value.toISOString().slice(0, 10);

  const [year, month, day] =
    dateString.split("-");

  if (!year || !month || !day) {
    return "-";
  }

  const months = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec",
  ];

  return `${day} ${
    months[Number(month) - 1] ?? month
  } ${year}`;
}