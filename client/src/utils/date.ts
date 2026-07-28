export function toInputDate(
  value?: string | Date | null
) {
  if (!value) return "";

  return new Date(value)
    .toISOString()
    .split("T")[0];
}