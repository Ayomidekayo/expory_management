import fs from "fs/promises";
import path from "path";

export async function deleteFile(fileUrl?: string | null) {
  if (!fileUrl) return;

  try {
    const filePath = path.join(
      process.cwd(),
      fileUrl.replace(/^\//, "")
    );

    await fs.unlink(filePath);
  } catch (error: any) {
    // Ignore if file doesn't exist
    if (error.code !== "ENOENT") {
      console.error("Failed to delete file:", error);
    }
  }
}