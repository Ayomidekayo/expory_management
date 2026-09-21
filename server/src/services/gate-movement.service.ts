import {
  GateMovementStatus,
} from "../generated";

import gateMovementRepository from "../Repository/gate-movement.repository";
import containerRepository from "../Repository/container.repository";

import {
  CreateGateMovementDto,
  UpdateGateMovementDto,
} from "../validations/gate-movement.validation";

class GateMovementService {
  /*
  =========================================
  CREATE
  =========================================
  */

  async create(
    data: CreateGateMovementDto
  ) {
    let containerId:
      | string
      | undefined =
      data.containerId;

    let containerNumber =
      data.containerNumber;

    /*
     * If an existing container was selected,
     * validate it and use its actual
     * container number.
     */

    if (data.containerId) {
      const container =
        await containerRepository.findById(
          data.containerId
        );

      if (!container) {
        throw new Error(
          "Selected container not found."
        );
      }

      containerId =
        container.id;

      containerNumber =
        container.containerNumber;
    }

    /*
     * If no existing container was selected,
     * the supplied container number is used
     * as a manual entry.
     */

    const status =
      data.status ?? "PENDING";

    const now = new Date();

    let clearedAt:
      | Date
      | undefined;

    let crossedAt:
      | Date
      | undefined;

    if (
      status === "CLEARED" ||
      status === "CROSSED"
    ) {
      clearedAt = now;
    }

    if (status === "CROSSED") {
      crossedAt = now;
    }

    return gateMovementRepository.create({
      container: containerId
        ? {
            connect: {
              id: containerId,
            },
          }
        : undefined,

      containerNumber,

      yardStoreNumber:
        data.yardStoreNumber || null,

      truckFrontPlate:
        data.truckFrontPlate,

      truckBackPlate:
        data.truckBackPlate,

      gateType: data.gateType,

      status,

      clearedAt,

      crossedAt,

      notes:
        data.notes || null,
    });
  }

  /*
  =========================================
  FIND ALL
  =========================================
  */

  async findAll(params?: {
    gateType?: any;
    status?: any;
    containerNumber?: string;
    yardStoreNumber?: string;
  }) {
    return gateMovementRepository.findAll(
      params
    );
  }

  /*
  =========================================
  FIND ONE
  =========================================
  */

  async findById(id: string) {
    const movement =
      await gateMovementRepository.findById(
        id
      );

    if (!movement) {
      throw new Error(
        "Gate movement not found."
      );
    }

    return movement;
  }

  /*
  =========================================
  UPDATE
  =========================================
  */

  async update(
    id: string,
    data: UpdateGateMovementDto
  ) {
    const existing =
      await this.findById(id);

    let containerId =
      existing.containerId ??
      undefined;

    let containerNumber =
      data.containerNumber;

    /*
     * If a new existing container
     * has been selected.
     */

    if (data.containerId) {
      const container =
        await containerRepository.findById(
          data.containerId
        );

      if (!container) {
        throw new Error(
          "Selected container not found."
        );
      }

      containerId =
        container.id;

      containerNumber =
        container.containerNumber;
    }

    /*
     * If container selection was removed,
     * allow manual container number.
     */

    const status =
      data.status;

    const now = new Date();

    let clearedAt:
      | Date
      | null = existing.clearedAt;

    let crossedAt:
      | Date
      | null = existing.crossedAt;

    if (
      status === "PENDING" ||
      status === "CANCELLED"
    ) {
      clearedAt = null;
      crossedAt = null;
    }

    if (status === "CLEARED") {
      clearedAt =
        existing.clearedAt ??
        now;

      crossedAt = null;
    }

    if (status === "CROSSED") {
      clearedAt =
        existing.clearedAt ??
        now;

      crossedAt =
        existing.crossedAt ??
        now;
    }

    return gateMovementRepository.update(
      id,
      {
        container: data.containerId
          ? {
              connect: {
                id: containerId,
              },
            }
          : {
              disconnect: true,
            },

        containerNumber,

        yardStoreNumber:
          data.yardStoreNumber ||
          null,

        truckFrontPlate:
          data.truckFrontPlate,

        truckBackPlate:
          data.truckBackPlate,

        gateType:
          data.gateType,

        status,

        clearedAt,

        crossedAt,

        notes:
          data.notes || null,
      }
    );
  }

  /*
  =========================================
  UPDATE STATUS
  =========================================
  */

  async updateStatus(
    id: string,
    status: GateMovementStatus
  ) {
    const existing =
      await this.findById(id);

    const now = new Date();

    let clearedAt =
      existing.clearedAt;

    let crossedAt =
      existing.crossedAt;

    if (
      status === "PENDING" ||
      status === "CANCELLED"
    ) {
      clearedAt = null;
      crossedAt = null;
    }

    if (status === "CLEARED") {
      clearedAt =
        existing.clearedAt ??
        now;

      crossedAt = null;
    }

    if (status === "CROSSED") {
      clearedAt =
        existing.clearedAt ??
        now;

      crossedAt =
        existing.crossedAt ??
        now;
    }

    return gateMovementRepository.update(
      id,
      {
        status,
        clearedAt,
        crossedAt,
      }
    );
  }

  /*
  =========================================
  DELETE
  =========================================
  */

  async delete(id: string) {
    await this.findById(id);

    return gateMovementRepository.delete(
      id
    );
  }

  /*
  =========================================
  STATISTICS
  =========================================
  */

  async getStatistics() {
    const [
      total,
      pending,
      cleared,
      crossed,
      cancelled,
      terminalGate,
      ecowasGate,
    ] = await Promise.all([
      gateMovementRepository.count(),

      gateMovementRepository.count({
        status: "PENDING",
      }),

      gateMovementRepository.count({
        status: "CLEARED",
      }),

      gateMovementRepository.count({
        status: "CROSSED",
      }),

      gateMovementRepository.count({
        status: "CANCELLED",
      }),

      gateMovementRepository.count({
        gateType: "TERMINAL_GATE",
      }),

      gateMovementRepository.count({
        gateType: "ECOWAS_GATE",
      }),
    ]);

    return {
      total,
      pending,
      cleared,
      crossed,
      cancelled,
      terminalGate,
      ecowasGate,
    };
  }
}

export default new GateMovementService();