
import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { allowedOrigins } from "../config/allowed-origins";

type SocketUser = {
  id: string;
  role: string;
  permissions: string[];
};

let io: Server | undefined;

export function initializeSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const authToken = socket.handshake.auth?.token;
      const header = socket.handshake.headers.authorization;

      const token =
        typeof authToken === "string"
          ? authToken
          : header?.replace(/^Bearer\s+/i, "");

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(token, env.JWT_SECRET);

      if (
        typeof decoded !== "object" ||
        decoded === null ||
        typeof decoded.userId !== "string"
      ) {
        return next(new Error("Invalid authentication token"));
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          role: true,
          isActive: true,
          permissions: {
            select: { permission: true },
          },
        },
      });

      if (!user || !user.isActive) {
        return next(new Error("Account is inactive or unavailable"));
      }

      socket.data.user = {
        id: user.id,
        role: user.role,
        permissions: user.permissions.map(
          (item) => item.permission
        ),
      } satisfies SocketUser;

      next();
    } catch {
      next(new Error("Invalid authentication token"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user as SocketUser;

    socket.join(`user:${user.id}`);

    const canReview =
      user.role === "ADMIN" ||
      user.permissions.includes("REVIEW_QUOTE") ||
      user.permissions.includes("REVIEW_QUOTATIONS") ||
      user.permissions.includes("VIEW_ALL_QUOTES");

    if (canReview) {
      socket.join("quotation-reviewers");
    }
  });

  return io;
}

export function emitToQuotationReviewers(
  event: string,
  payload: unknown
) {
  io?.to("quotation-reviewers").emit(event, payload);
}

export function emitToUser(
  userId: string,
  event: string,
  payload: unknown
) {
  io?.to(`user:${userId}`).emit(event, payload);
}
