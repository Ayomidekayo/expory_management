import { prisma } from "../config/prisma";

export async function generateClientCode() {
  const year = new Date().getFullYear();

  const count =
    await prisma.client.count();

  return `CLI-${year}-${String(
    count + 1
  ).padStart(5, "0")}`;
}