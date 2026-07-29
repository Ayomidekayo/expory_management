const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:5000";

export function getileUrl(fileUrl: string) {
  if (!fileUrl) return "";

  if (fileUrl.startsWith("http")) {
    return fileUrl;
  }

  return `${API_URL}${fileUrl}`;
}