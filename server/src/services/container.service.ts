import {
  ContainerStatus,
  TerminalChargeStatus,
} from "../generated";

import containerRepository from "../Repository/container.repository";
import packingListRepository from "../Repository/packing-list.repository";
import shipmentRepository from "../Repository/shipment.repository";

import { ContainerQuery } from "../validations/container-query.validation";

import {
  CreateContainerDto,
  UpdateContainerDto,
} from "../validations/container.validation";

class ContainerService {
  /*
  =====================================
  Generate Container Number
  =====================================
  */

  private async generateContainerNumber() {
    const year =
      new Date().getFullYear();

    const latest =
      await containerRepository.findLatestContainer();

    if (!latest) {
      return `CTR-${year}-00001`;
    }

    const sequence = Number(
      latest.containerNumber
        .split("-")[2]
    );

    return `CTR-${year}-${String(
      sequence + 1
    ).padStart(5, "0")}`;
  }

  /*
  =====================================
  Create
  =====================================
  */

  async create(
    data: CreateContainerDto
  ) {
    const shipment =
      await shipmentRepository.findById(
        data.shipmentId
      );

    if (!shipment) {
      throw new Error(
        "Shipment not found."
      );
    }

    /*
    Packing List - Optional
    */

    if (data.packingListId) {
      const packingList =
        await packingListRepository.findById(
          data.packingListId
        );

      if (!packingList) {
        throw new Error(
          "Packing List not found."
        );
      }

      if (
        packingList.shipmentId !==
        data.shipmentId
      ) {
        throw new Error(
          "Packing List does not belong to the selected shipment."
        );
      }
    }

    /*
    Check Container Number
    */

    const existing =
      await containerRepository.findByContainerNumber(
        data.containerNumber
      );

    if (existing) {
      throw new Error(
        "Container number already exists."
      );
    }

    return containerRepository.create(
      data
    );
  }

  /*
  =====================================
  Find All
  =====================================
  */

  async findAll(
    query: ContainerQuery
  ) {
    return containerRepository.findAll(
      query
    );
  }

  /*
  =====================================
  Find By Id
  =====================================
  */

  async findById(
    id: string
  ) {
    const container =
      await containerRepository.findById(
        id
      );

    if (!container) {
      throw new Error(
        "Container not found."
      );
    }

    return container;
  }

  /*
  =====================================
  Update Status
  =====================================
  */

  async updateStatus(
    id: string,
    status: ContainerStatus
  ) {
    // Make sure container exists
    await this.findById(id);

    return containerRepository.updateStatus(
      id,
      status
    );
  }
/*
=====================================
Update Terminal Charge Status
=====================================
*/

async updateTerminalChargeStatus(
  id: string,
  terminalChargeStatus: TerminalChargeStatus
) {
  // Make sure container exists
  await this.findById(id);

  return containerRepository
    .updateTerminalChargeStatus(
      id,
      terminalChargeStatus
    );
}
  /*
  =====================================
  Update
  =====================================
  */

  async update(
    id: string,
    data: UpdateContainerDto
  ) {
    await this.findById(id);

    /*
    Validate Shipment
    */

    if (data.shipmentId) {
      const shipment =
        await shipmentRepository.findById(
          data.shipmentId
        );

      if (!shipment) {
        throw new Error(
          "Shipment not found."
        );
      }
    }

    /*
    Validate Packing List
    */

    if (
      data.packingListId &&
      data.shipmentId
    ) {
      const packingList =
        await packingListRepository.findById(
          data.packingListId
        );

      if (!packingList) {
        throw new Error(
          "Packing List not found."
        );
      }

      if (
        packingList.shipmentId !==
        data.shipmentId
      ) {
        throw new Error(
          "Packing List does not belong to the selected shipment."
        );
      }
    }

    return containerRepository.update(
      id,
      data
    );
  }



  async updateTerminalCharge(
  id: string,
  status: TerminalChargeStatus,
  amount?: number
) {
  // Make sure container exists
  await this.findById(id);

  // Paid containers must have an amount
  if (
    status === "PAID" &&
    (amount === undefined ||
      amount <= 0)
  ) {
    throw new Error(
      "Payment amount is required when terminal charges are marked as paid."
    );
  }

  // If marked unpaid,
  // remove any previous amount
  if (status === "UNPAID") {
    amount = undefined;
  }

  return containerRepository.updateTerminalCharge(
    id,
    status,
    amount
  );
}
  /*
  =====================================
  Delete
  =====================================
  */

  async delete(
    id: string
  ) {
    await this.findById(id);

    return containerRepository.delete(
      id
    );
  }
}

export default new ContainerService();