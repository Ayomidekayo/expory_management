import { prisma } from "../config/prisma";

export async function generateAllocationNumber() {
  const year = new Date().getFullYear();

  const total =
    await prisma.allocation.count();

  return `ALC-${year}-${String(total + 1).padStart(
    6,
    "0"
  )}`;
}