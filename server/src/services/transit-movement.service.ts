
import transitMovementRepository from "../Repository/transit-movement.repository";
import shipmentRepository from "../Repository/shipment.repository";

import { ApiError } from "../utils/ApiError";
import { Prisma } from "../generated";

import {
  CreateTransitMovementDto,
  UpdateTransitMovementDto,
} from "../validations/transit-movement.validation";

import {
  TransitMovementQuery,
} from "../validations/transit-movement-query.validation";

import {
  TransitMovementColumnKey,
  transitMovementColumnKeys,
  UpdateTransitMovementColumnLockDto,
} from "../validations/transit-movement-column-lock.validation";
import { CreateTransitMovementPaymentDto } from "../validations/transit-movement-payment.validation";

class TransitMovementService {
  /* ===========================================
     GENERATE TRANSIT MOVEMENT NUMBER
  =========================================== */

  private async generateTransitMovementNumber(
    direction: "IN" | "OUT",
  ) {
    const year = new Date().getFullYear();

    const latest =
      await transitMovementRepository.findLatestMovement(
        direction,
      );

    const prefix = direction === "IN" ? "TMI" : "TMO";

    if (!latest) {
      return `${prefix}-${year}-00001`;
    }

    const parts = latest.transitNumber.split("-");
    const latestYear = Number(parts[1]);
    const sequence = Number(parts[2]);

    // Start a fresh sequence for a new year.
    if (latestYear !== year) {
      return `${prefix}-${year}-00001`;
    }

    if (!Number.isInteger(sequence) || sequence < 0) {
      throw new ApiError(
        500,
        "Unable to generate a valid Transit Movement number.",
      );
    }

    return `${prefix}-${year}-${String(
      sequence + 1,
    ).padStart(5, "0")}`;
  }

  /* ===========================================
     NORMALIZE VALUES FOR COMPARISON
  =========================================== */

  private normalizeValue(value: unknown): string {
    if (value === null || value === undefined) {
      return "";
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (
      typeof value === "object" &&
      value !== null &&
      "toString" in value
    ) {
      return String(value);
    }

    return String(value);
  }

  /* ===========================================
     CALCULATE PAYMENT STATUS
  =========================================== */

  private calculatePaymentStatus(
    chargeAmount: Prisma.Decimal,
    payments: {
      amount: Prisma.Decimal;
      paymentType: "ADVANCE" | "REGULAR";
    }[],
  ) {
    const totalPaid = payments.reduce(
      (total, payment) => total.plus(payment.amount),
      new Prisma.Decimal(0),
    );

    if (
      chargeAmount.greaterThan(0) &&
      totalPaid.greaterThanOrEqualTo(chargeAmount)
    ) {
      return "PAID" as const;
    }

    if (totalPaid.equals(0)) {
      return "UNPAID" as const;
    }

    if (
      payments.some(
        (payment) => payment.paymentType === "REGULAR",
      )
    ) {
      return "PARTIALLY_PAID" as const;
    }

    return "ADVANCE" as const;
  }

/* ===========================================
   HANDLE PAYMENT REPOSITORY ERRORS
=========================================== */

private handlePaymentRepositoryError(error: unknown): never {
  if (!(error instanceof Error)) {
    throw error;
  }

  switch (error.message) {
    case "TRANSIT_MOVEMENT_ITEM_NOT_FOUND":
      throw new ApiError(404, "Transit Movement item not found.");

    case "TRANSIT_MOVEMENT_LOCKED":
      throw new ApiError(
        400,
        "This Transit Movement is locked. Payments cannot be recorded.",
      );

    case "TRANSIT_MOVEMENT_ITEM_LOCKED":
      throw new ApiError(
        400,
        "This item is locked. Payments cannot be recorded.",
      );

    case "TRANSIT_MOVEMENT_NO_CHARGE":
      throw new ApiError(
        400,
        "A payment cannot be recorded because this item has no charge amount.",
      );

    case "TRANSIT_MOVEMENT_OVERPAYMENT":
      throw new ApiError(
        400,
        "The payment amount exceeds the outstanding balance.",
      );

    default:
      throw error;
  }
}

/* ===========================================
   RECORD PAYMENT
=========================================== */

async createPayment(
  itemId: string,
  data: CreateTransitMovementPaymentDto,
  userId?: string,
) {
  if (!itemId || itemId === "new" || itemId === "create") {
    throw new ApiError(400, "Invalid Transit Movement item ID.");
  }

  if (!userId) {
    throw new ApiError(
      401,
      "Authenticated user is required to record a payment.",
    );
  }

  const item =
    await transitMovementRepository.findItemById(itemId);

  if (!item) {
    throw new ApiError(404, "Transit Movement item not found.");
  }

  if (item.transitMovement.isLocked) {
    throw new ApiError(
      400,
      "This Transit Movement is locked. Payments cannot be recorded.",
    );
  }

  if (item.isLocked) {
    throw new ApiError(
      400,
      "This Transit Movement item is locked.",
    );
  }

  try {
    return await transitMovementRepository.createPayment(
      itemId,
      {
        ...data,
        recordedById: userId,
      },
    );
  } catch (error) {
    this.handlePaymentRepositoryError(error);
  }
}

/* ===========================================
   GET PAYMENT HISTORY
=========================================== */

async findItemPayments(itemId: string) {
  if (!itemId || itemId === "new" || itemId === "create") {
    throw new ApiError(400, "Invalid Transit Movement item ID.");
  }

  const item =
    await transitMovementRepository.findItemById(itemId);

  if (!item) {
    throw new ApiError(404, "Transit Movement item not found.");
  }

  return transitMovementRepository.findItemPayments(itemId);
}


/* ===========================================
   LOCK / UNLOCK ITEM
=========================================== */

async updateItemLock(
  itemId: string,
  isLocked: boolean,
) {
  if (!itemId || itemId === "new" || itemId === "create") {
    throw new ApiError(400, "Invalid Transit Movement item ID.");
  }

  const item =
    await transitMovementRepository.findItemById(itemId);

  if (!item) {
    throw new ApiError(404, "Transit Movement item not found.");
  }

  if (item.transitMovement.isLocked) {
    throw new ApiError(
      400,
      "The parent Transit Movement is locked. Its item locks cannot be changed.",
    );
  }

  try {
    return await transitMovementRepository.updateItemLock(
      itemId,
      isLocked,
    );
  } catch (error) {
    this.handlePaymentRepositoryError(error);
  }
}

  /* ===========================================
     VALIDATE SHIPMENT
  =========================================== */

  private async validateShipment(
    shipmentId?: string | null,
  ) {
    if (!shipmentId) {
      return;
    }

    if (
      shipmentId === "new" ||
      shipmentId === "create"
    ) {
      throw new ApiError(400, "Invalid shipment ID.");
    }

    const shipment =
      await shipmentRepository.findById(shipmentId);

    if (!shipment) {
      throw new ApiError(404, "Shipment not found.");
    }
  }

  /* ===========================================
     CREATE TRANSIT MOVEMENT
  =========================================== */

  async create(data: CreateTransitMovementDto) {
    await this.validateShipment(data.shipmentId);

    const transitNumber =
      await this.generateTransitMovementNumber(
        data.direction,
      );

    return transitMovementRepository.create({
      ...data,
      transitNumber,
    });
  }

  /* ===========================================
     GET ALL TRANSIT MOVEMENTS
  =========================================== */

  async findAll(query: TransitMovementQuery) {
    return transitMovementRepository.findAll(query);
  }

  /* ===========================================
     GET ONE TRANSIT MOVEMENT
  =========================================== */

  async findById(id: string) {
    if (
      !id ||
      id === "new" ||
      id === "create"
    ) {
      throw new ApiError(
        400,
        "Invalid Transit Movement ID.",
      );
    }

    const movement =
      await transitMovementRepository.findById(id);

    if (!movement) {
      throw new ApiError(
        404,
        "Transit Movement record not found.",
      );
    }

    return movement;
  }

  /* ===========================================
     FIND TRANSIT MOVEMENTS BY SHIPMENT
  =========================================== */

  async findByShipmentId(shipmentId: string) {
    if (
      !shipmentId ||
      shipmentId === "new" ||
      shipmentId === "create"
    ) {
      throw new ApiError(400, "Invalid shipment ID.");
    }

    await this.validateShipment(shipmentId);

    return transitMovementRepository.findByShipmentId(
      shipmentId,
    );
  }

  /* ===========================================
     UPDATE TRANSIT MOVEMENT
  =========================================== */

  async update(
    id: string,
    data: UpdateTransitMovementDto,
  ) {
    const movement = await this.findById(id);

    // Parent-level lock.
    if (movement.isLocked) {
      throw new ApiError(
        400,
        "This Transit Movement is locked and cannot be modified.",
      );
    }

    // Validate shipment only when supplied.
    if (data.shipmentId !== undefined) {
      await this.validateShipment(data.shipmentId);
    }

    // Direction is deliberately immutable.
    // It is not accepted in UpdateTransitMovementDto.

    const globallyLockedColumns =
      await transitMovementRepository.findLockedColumnKeys();

    if (data.items?.length) {
      for (const item of data.items) {
        // New items have no existing item locks.
        if (!item.id) {
          continue;
        }

        const existingItem = movement.items.find(
          (existing) => existing.id === item.id,
        );

        if (!existingItem) {
          throw new ApiError(
            400,
            "Transit Movement item does not belong to this record.",
          );
        }

        // Whole-item lock.
        if (existingItem.isLocked) {
          throw new ApiError(
            400,
            `Transit Movement item ${item.id} is locked and cannot be modified.`,
          );
        }

        const currentValues =
          existingItem as unknown as Record<string, unknown>;

        const incomingValues =
          item as unknown as Record<string, unknown>;

        // Individual field locks.
        for (const field of existingItem.lockedFields) {
          const incomingValue = incomingValues[field];

          if (incomingValue === undefined) {
            continue;
          }

          const currentValue = currentValues[field];

          const normalizedIncoming =
            field === "itemDate" && incomingValue
              ? this.normalizeValue(
                  new Date(String(incomingValue)),
                )
              : this.normalizeValue(incomingValue);

          if (
            normalizedIncoming !==
            this.normalizeValue(currentValue)
          ) {
            throw new ApiError(
              400,
              `The ${field} field is locked for this Transit Movement item.`,
            );
          }
        }

        // Global column locks.
        for (const field of globallyLockedColumns) {
          const incomingValue = incomingValues[field];

          if (incomingValue === undefined) {
            continue;
          }

          const currentValue = currentValues[field];

          const normalizedIncoming =
            field === "itemDate" && incomingValue
              ? this.normalizeValue(
                  new Date(String(incomingValue)),
                )
              : this.normalizeValue(incomingValue);

          if (
            normalizedIncoming !==
            this.normalizeValue(currentValue)
          ) {
            throw new ApiError(
              400,
              `The ${field} column is globally locked for all Transit Movement items.`,
            );
          }
        }

        // Protect existing payment history.
        const totalPaid = existingItem.payments.reduce(
          (total, payment) =>
            total.plus(payment.amount),
          new Prisma.Decimal(0),
        );

        const newCharge =
          item.chargeAmount !== undefined
            ? new Prisma.Decimal(item.chargeAmount)
            : new Prisma.Decimal(existingItem.chargeAmount);

        if (newCharge.lessThan(totalPaid)) {
          throw new ApiError(
            400,
            `Charge amount cannot be less than the total paid amount for item ${item.id}.`,
          );
        }

        // Currency must not change after payment has been recorded.
        if (
          existingItem.payments.length > 0 &&
          item.chargeCurrency !== undefined &&
          item.chargeCurrency !== existingItem.chargeCurrency
        ) {
          throw new ApiError(
            400,
            "The charge currency cannot be changed after payments have been recorded.",
          );
        }
      }
    }

    return transitMovementRepository.update(id, data);
  }

  /* ===========================================
     DELETE TRANSIT MOVEMENT
  =========================================== */

  async delete(id: string) {
    const movement = await this.findById(id);

    if (movement.isLocked) {
      throw new ApiError(
        400,
        "This Transit Movement is locked and cannot be deleted.",
      );
    }

    // Never delete financial history.
    const hasPayments = movement.items.some(
      (item) => item.payments.length > 0,
    );

    if (hasPayments) {
      throw new ApiError(
        400,
        "This Transit Movement cannot be deleted because one or more items have payment history.",
      );
    }

    return transitMovementRepository.delete(id);
  }

  /* ===========================================
     GET GLOBAL COLUMN LOCKS
  =========================================== */

  async getColumnLocks() {
    return transitMovementRepository.findColumnLocks();
  }

  /* ===========================================
     GET LOCKED COLUMN KEYS
  =========================================== */

  async findLockedColumnKeys() {
    return transitMovementRepository.findLockedColumnKeys();
  }

  /* ===========================================
     UPDATE GLOBAL COLUMN LOCK
  =========================================== */

  async updateColumnLock(
    columnKey: string,
    data: UpdateTransitMovementColumnLockDto,
    userId?: string,
  ) {
    if (
      !transitMovementColumnKeys.includes(
        columnKey as TransitMovementColumnKey,
      )
    ) {
      throw new ApiError(
        400,
        "Invalid Transit Movement column key.",
      );
    }

    if (data.isLocked && !userId) {
      throw new ApiError(
        400,
        "A user ID is required to lock a Transit Movement column.",
      );
    }

    return transitMovementRepository.updateColumnLock(
      columnKey,
      {
        isLocked: data.isLocked,
        lockedById: userId,
        lockReason: data.isLocked
          ? data.lockReason ?? null
          : null,
      },
    );
  }
}

export default new TransitMovementService();
