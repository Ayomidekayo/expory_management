
import transportRepository from "../Repository/transport.repository";
import shipmentRepository from "../Repository/shipment.repository";

import { ApiError } from "../utils/ApiError";

import {
  TransportQuery,
} from "../validations/transport-query.validation";

import {
  CreateTransportDto,
  UpdateTransportDto,
} from "../validations/transport.validation";
import { Prisma } from "../generated";

import { TransportColumnKey, transportColumnKeys, UpdateTransportColumnLockDto } from "../validations/transport-column-lock.validation";

class TransportService {



  
  /* ===========================================
     GENERATE TRANSPORT NUMBER
  =========================================== */

  private async generateTransportNumber() {
    const year = new Date().getFullYear();

    const latest =
      await transportRepository.findLatestTransport();

    if (!latest) {
      return `TRN-${year}-00001`;
    }

    const parts = latest.transportNumber.split("-");

    const sequence = Number(parts[2]);

    return `TRN-${year}-${String(
      sequence + 1
    ).padStart(5, "0")}`;
  }


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

  if (chargeAmount.greaterThan(0) && totalPaid.greaterThanOrEqualTo(chargeAmount)) {
    return "PAID" as const;
  }

  if (totalPaid.equals(0)) {
    return "UNPAID" as const;
  }

  if (payments.some((payment) => payment.paymentType === "REGULAR")) {
    return "PARTIALLY_PAID" as const;
  }

  return "ADVANCE" as const;
}



/* ===========================================
   LOCK / UNLOCK TRANSPORT ITEM
=========================================== */

async updateItemLock(
  itemId: string,
  isLocked: boolean,
) {
  if (!itemId) {
    throw new ApiError(400, "Transport item ID is required.");
  }

  const existingItem =
    await transportRepository.findItemForLock(itemId);

  if (!existingItem) {
    throw new ApiError(404, "Transport item not found.");
  }

  if (existingItem.transport.isLocked) {
    throw new ApiError(
      400,
      "Cannot lock or unlock an item while its parent transport is locked.",
    );
  }

  const updatedItem =
    await transportRepository.updateItemLock(
      itemId,
      isLocked,
    );

  return updatedItem;
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

    // Handles Prisma Decimal values.
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
     CREATE TRANSPORT
  =========================================== */

  async create(data: CreateTransportDto) {
    // Validate optional shipment association.
    if (data.shipmentId) {
      const shipment =
        await shipmentRepository.findById(
          data.shipmentId
        );

      if (!shipment) {
        throw new ApiError(
          404,
          "Shipment not found."
        );
      }
    }

    const transportNumber =
      await this.generateTransportNumber();

    return transportRepository.create({
      ...data,
      transportNumber,
    });
  }

  /* ===========================================
     GET ALL TRANSPORTS
  =========================================== */

  async findAll(query: TransportQuery) {
    return transportRepository.findAll(query);
  }

  /* ===========================================
     GET ONE TRANSPORT
  =========================================== */

  async findById(id: string) {
    if (
      !id ||
      id === "new" ||
      id === "create"
    ) {
      throw new ApiError(
        400,
        "Invalid transport ID."
      );
    }

    const transport =
      await transportRepository.findById(id);

    if (!transport) {
      throw new ApiError(
        404,
        "Transport record not found."
      );
    }

    return transport;
  }

  /* ===========================================
     FIND BY SHIPMENT
  =========================================== */

  async findByShipmentId(shipmentId: string) {
    if (
      !shipmentId ||
      shipmentId === "new" ||
      shipmentId === "create"
    ) {
      throw new ApiError(
        400,
        "Invalid shipment ID."
      );
    }

    const shipment =
      await shipmentRepository.findById(
        shipmentId
      );

    if (!shipment) {
      throw new ApiError(
        404,
        "Shipment not found."
      );
    }

    return transportRepository.findByShipmentId(
      shipmentId
    );
  }

  /* ===========================================
     UPDATE TRANSPORT
  =========================================== */

/* ===========================================
   UPDATE TRANSPORT
=========================================== */

async update(
  id: string,
  data: UpdateTransportDto,
  userId?: string,
) {
  const transport = await this.findById(id);

  // Parent-level lock.
  if (transport.isLocked) {
    throw new ApiError(
      400,
      "This transport record is locked and cannot be modified.",
    );
  }

  // Validate shipment association.
  // null means the user wants to make it Independent.
  if (data.shipmentId) {
    const shipment = await shipmentRepository.findById(
      data.shipmentId,
    );

    if (!shipment) {
      throw new ApiError(404, "Shipment not found.");
    }
  }

  // Get all globally locked columns.
  const globallyLockedColumns =
    await transportRepository.findLockedColumnKeys();

  // Validate submitted items.
  if (data.items?.length) {
    for (const item of data.items) {
      // New items have no existing row to compare against.
      if (!item.id) {
        continue;
      }

      const existingItem = transport.items.find(
        (existing) => existing.id === item.id,
      );

      // Ensure the item belongs to this Transport.
      if (!existingItem) {
        throw new ApiError(
          400,
          "Transport item does not belong to this transport.",
        );
      }

      // Whole-item lock.
      if (existingItem.isLocked) {
        throw new ApiError(
          400,
          `Transport item ${item.id} is locked and cannot be modified.`,
        );
      }

      const currentValues =
        existingItem as unknown as Record<string, unknown>;

      const incomingValues =
        item as unknown as Record<string, unknown>;

      // GLOBAL COLUMN LOCK CHECK.
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

        const normalizedCurrent =
          this.normalizeValue(currentValue);

        if (normalizedIncoming !== normalizedCurrent) {
          throw new ApiError(
            400,
            `The ${field} column is globally locked for all Transport items.`,
          );
        }
      }

      // INDIVIDUAL FIELD LOCK CHECK.
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

        const normalizedCurrent =
          this.normalizeValue(currentValue);

        if (normalizedIncoming !== normalizedCurrent) {
          throw new ApiError(
            400,
            `The ${field} field is locked for this transport item.`,
          );
        }
      }

      // FINANCIAL PROTECTION.
      const totalPaid = existingItem.payments.reduce(
        (total, payment) =>
          total + Number(payment.amount),
        0,
      );

      if (Number(item.chargeAmount) < totalPaid) {
        throw new ApiError(
          400,
          `Charge amount cannot be less than the total paid amount for item ${item.id}.`,
        );
      }

      // Do not change currency after payments exist.
      if (
        existingItem.payments.length > 0 &&
        item.chargeCurrency !== existingItem.chargeCurrency
      ) {
        throw new ApiError(
          400,
          "Charge currency cannot be changed after payments have been recorded.",
        );
      }
    }
  }

  return transportRepository.update(id, data,userId);
}

  /* ===========================================
     DELETE TRANSPORT
  =========================================== */

  async delete(id: string) {
    const transport = await this.findById(id);

    // Parent-level lock.
    if (transport.isLocked) {
      throw new ApiError(
        400,
        "This transport record is locked and cannot be deleted."
      );
    }

    // Protect financial history.
    const hasPayments = transport.items.some(
      (item) => item.payments.length > 0
    );

    if (hasPayments) {
      throw new ApiError(
        400,
        "This transport cannot be deleted because one or more items have payment history."
      );
    }

    return transportRepository.delete(id);
  }
/* ===========================================
   GET COLUMN LOCKS
=========================================== */

async getColumnLocks() {
  return transportRepository.findColumnLocks();
}

/* ===========================================
   UPDATE GLOBAL COLUMN LOCK
=========================================== */

async updateColumnLock(
  columnKey: string,
  data: UpdateTransportColumnLockDto,
  userId?: string,
) {
  if (
    !transportColumnKeys.includes(
      columnKey as TransportColumnKey,
    )
  ) {
    throw new ApiError(
      400,
      "Invalid Transport column key.",
    );
  }

  if (data.isLocked && !userId) {
    throw new ApiError(
      400,
      "A user ID is required to lock a Transport column.",
    );
  }

  return transportRepository.updateColumnLock(
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

export default new TransportService();
