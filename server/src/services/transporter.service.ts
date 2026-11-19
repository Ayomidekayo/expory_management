import { ItemPaymentType, PaymentStatus, Prisma, TransporterStatus } from "../generated";
import { TransporterRepository } from "../Repository/transporter.repository";
import { CreateTransporterDto, CreateTransporterItemDto, CreateTransporterPaymentDto, TransporterQuery, UpdateTransporterDto, UpdateTransporterItemDto } from "../types/transporter.types";



export class TransporterServiceError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "TransporterServiceError";
  }
}

export class TransporterService {
  constructor(
    private readonly repository: TransporterRepository
  ) {}

  async findAll(query: TransporterQuery) {
    return this.repository.findAll(query);
  }

  async findById(id: string) {
    const transporter = await this.repository.findById(id);

    if (!transporter) {
      throw new TransporterServiceError(
        404,
        "Transporter record not found."
      );
    }

    return transporter;
  }
private async generateTransporterNumber(): Promise<string> {
  const year = new Date().getFullYear();

  const latest =
    await this.repository.findLatestTransporter(year);

  if (!latest) {
    return `TPR-${year}-00001`;
  }

  const parts = latest.transportNumber.split("-");

  const sequence = Number(parts[2]);

  if (!Number.isSafeInteger(sequence) || sequence < 0) {
    throw new TransporterServiceError(
      500,
      "Unable to generate transporter number."
    );
  }

  return `TPR-${year}-${String(sequence + 1).padStart(5, "0")}`;
}
/* ===========================================
   CREATE TRANSPORTER
=========================================== */

async create(input: CreateTransporterDto) {
  const transportNumber =
    await this.generateTransporterNumber();

  return this.repository.create({
    ...input,
    transportNumber,
  });
}

  async update(
    id: string,
    input: UpdateTransporterDto
  ) {
    const transporter = await this.findById(id);

    if (transporter.isLocked) {
      throw new TransporterServiceError(
        403,
        "This transporter record is locked."
      );
    }

    if (
      input.transportNumber &&
      input.transportNumber !== transporter.transportNumber
    ) {
      const existing =
        await this.repository.findByTransportNumber(
          input.transportNumber
        );

      if (existing) {
        throw new TransporterServiceError(
          409,
          "This transport number is already in use."
        );
      }
    }

    const data: Prisma.TransporterUncheckedUpdateInput = {
      ...(input.transportNumber !== undefined && {
        transportNumber: input.transportNumber,
      }),

      ...(input.transportDate !== undefined && {
        transportDate: input.transportDate,
      }),

      ...(input.truckOwnerName !== undefined && {
        truckOwnerName: input.truckOwnerName,
      }),

      ...(input.shipmentId !== undefined && {
        shipmentId: input.shipmentId,
      }),

      ...(input.remarks !== undefined && {
        remarks: input.remarks,
      }),
    };

    return this.repository.update(id, data);
  }

 async delete(id: string) {
  const transporter = await this.findById(id);

  if (transporter.isLocked) {
    throw new TransporterServiceError(
      403,
      "This transporter record is locked and cannot be deleted."
    );
  }

  // Associated items and payment histories are deleted
  // automatically through Prisma's Cascade relationships.
  return this.repository.delete(id);
}

  async addItem(
    transporterId: string,
    input: CreateTransporterItemDto
  ) {
    const transporter = await this.findById(transporterId);

    if (transporter.isLocked) {
      throw new TransporterServiceError(
        403,
        "This transporter record is locked."
      );
    }

    const data: Prisma.TransporterItemUncheckedCreateInput = {
      transporterId,
      itemDate: input.itemDate,
      itemType: input.itemType,

      name: input.name ?? null,
      frontPlateNumber: input.frontPlateNumber ?? null,
      backPlateNumber: input.backPlateNumber ?? null,

      containerName: input.containerName ?? null,
      containerNumber: input.containerNumber ?? null,

      status: input.status ?? TransporterStatus.PENDING,

      chargeAmount: new Prisma.Decimal(
        input.chargeAmount ?? 0
      ),

      chargeCurrency: input.chargeCurrency,
      paymentStatus: input.paymentStatus,

      remarks: input.remarks ?? null,
    };

    return this.repository.createItem(data);
  }

  async updateItem(
    transporterId: string,
    itemId: string,
    input: UpdateTransporterItemDto
  ) {
    const transporter = await this.findById(transporterId);

    if (transporter.isLocked) {
      throw new TransporterServiceError(
        403,
        "This transporter record is locked."
      );
    }

    const item = await this.repository.findItemById(
      transporterId,
      itemId
    );

    if (!item) {
      throw new TransporterServiceError(
        404,
        "Transporter item not found."
      );
    }

    if (item.isLocked) {
      throw new TransporterServiceError(
        403,
        "This transporter item is locked."
      );
    }

    const data: Prisma.TransporterItemUncheckedUpdateInput = {
      ...(input.itemDate !== undefined && {
        itemDate: input.itemDate,
      }),

      ...(input.itemType !== undefined && {
        itemType: input.itemType,
      }),

      ...(input.name !== undefined && {
        name: input.name,
      }),

      ...(input.frontPlateNumber !== undefined && {
        frontPlateNumber: input.frontPlateNumber,
      }),

      ...(input.backPlateNumber !== undefined && {
        backPlateNumber: input.backPlateNumber,
      }),

      ...(input.containerName !== undefined && {
        containerName: input.containerName,
      }),

      ...(input.containerNumber !== undefined && {
        containerNumber: input.containerNumber,
      }),

      ...(input.status !== undefined && {
        status: input.status,
      }),

      ...(input.chargeAmount !== undefined && {
        chargeAmount: new Prisma.Decimal(
          input.chargeAmount
        ),
      }),

      ...(input.chargeCurrency !== undefined && {
        chargeCurrency: input.chargeCurrency,
      }),

      ...(input.paymentStatus !== undefined && {
        paymentStatus: input.paymentStatus,
      }),

      ...(input.remarks !== undefined && {
        remarks: input.remarks,
      }),
    };

    return this.repository.updateItem(itemId, data);
  }

  async deleteItem(
    transporterId: string,
    itemId: string
  ) {
    const transporter = await this.findById(transporterId);

    if (transporter.isLocked) {
      throw new TransporterServiceError(
        403,
        "This transporter record is locked."
      );
    }

    const item = await this.repository.findItemById(
      transporterId,
      itemId
    );

    if (!item) {
      throw new TransporterServiceError(
        404,
        "Transporter item not found."
      );
    }

    if (item.isLocked) {
      throw new TransporterServiceError(
        403,
        "This transporter item is locked."
      );
    }

    if (item.payments.length > 0) {
      throw new TransporterServiceError(
        409,
        "This item cannot be deleted because payment records exist."
      );
    }

    return this.repository.deleteItem(itemId);
  }

  async getItemPayments(
  transporterId: string,
  itemId: string
) {
  const transporter = await this.findById(transporterId);

  const item = await this.repository.findItemById(
    transporterId,
    itemId
  );

  if (!item) {
    throw new TransporterServiceError(
      404,
      "Transporter item not found."
    );
  }

  return this.repository.getItemPayments(
    transporter.id,
    item.id
  );
}

async recordPayment(
  transporterId: string,
  itemId: string,
  input: CreateTransporterPaymentDto,
  recordedById: string
) {
  const transporter = await this.findById(transporterId);

  if (transporter.isLocked) {
    throw new TransporterServiceError(
      403,
      "This transporter record is locked."
    );
  }

  const item = await this.repository.findItemById(
    transporterId,
    itemId
  );

  if (!item) {
    throw new TransporterServiceError(
      404,
      "Transporter item not found."
    );
  }

  if (item.isLocked) {
    throw new TransporterServiceError(
      403,
      "This transporter item is locked."
    );
  }

  const totalPaid = item.payments.reduce(
    (total, payment) => total.plus(payment.amount),
    new Prisma.Decimal(0)
  );

  const chargeAmount = new Prisma.Decimal(
    item.chargeAmount
  );

  const newTotalPaid = totalPaid.plus(input.amount);

  if (chargeAmount.lessThanOrEqualTo(0)) {
    throw new TransporterServiceError(
      400,
      "A payment cannot be recorded for an item without a charge."
    );
  }

  if (newTotalPaid.greaterThan(chargeAmount)) {
    throw new TransporterServiceError(
      400,
      "Payment exceeds the outstanding transporter charge."
    );
  }

  let paymentStatus: PaymentStatus;

  if (newTotalPaid.equals(chargeAmount)) {
    paymentStatus = PaymentStatus.PAID;
  } else {
    const allPaymentsAreAdvances = [
      ...item.payments,
      { paymentType: input.paymentType },
    ].every(
      (payment) =>
        payment.paymentType === ItemPaymentType.ADVANCE
    );

    paymentStatus = allPaymentsAreAdvances
      ? PaymentStatus.ADVANCE
      : PaymentStatus.PARTIALLY_PAID;
  }

  return this.repository.createPayment({
    transportItemId: itemId,
    recordedById,
    amount: new Prisma.Decimal(input.amount),
    paymentType: input.paymentType,
    paymentDate: input.paymentDate,
    paymentMethod: input.paymentMethod ?? null,
    reference: input.reference ?? null,
    description: input.description ?? null,
    notes: input.notes ?? null,
  }).then(async (payment) => {
    await this.repository.updateItem(itemId, {
      paymentStatus,
    });

    return payment;
  });
}


/* ===========================================
   GENERATE TRANSPORTER NUMBER
=========================================== */


}