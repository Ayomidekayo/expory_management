import { prisma } from "../config/prisma";

export async function generateClientCode(): Promise<string> {
  const year = new Date().getFullYear();

  const lastClient =
    await prisma.client.findFirst({
      where: {
        clientCode: {
          startsWith: `CLI-${year}-`,
        },
      },
      orderBy: {
        clientCode: "desc",
      },
      select: {
        clientCode: true,
      },
    });

  let nextNumber = 1;

  if (lastClient?.clientCode) {
    const match =
      lastClient.clientCode.match(
        /^CLI-\d{4}-(\d+)$/
      );

    if (match) {
      nextNumber =
        Number(match[1]) + 1;
    }
  }

  let clientCode =
    `CLI-${year}-${String(
      nextNumber
    ).padStart(5, "0")}`;

  // Extra protection against duplicate codes
  while (
    await prisma.client.findUnique({
      where: {
        clientCode,
      },
    })
  ) {
    nextNumber++;

    clientCode =
      `CLI-${year}-${String(
        nextNumber
      ).padStart(5, "0")}`;
  }

  return clientCode;
}