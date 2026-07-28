import shipmentRepository from "../Repository/shipment.repository";
import allocationRepository from "../Repository/allocation.repository";
import clientRepository from "../Repository/client.repository";
import exporterRepository from "../Repository/exporter.repository";
import consigneeRepository from "../Repository/consignee.repository";

import {
  CreateShipmentDto,
  UpdateShipmentDto,
} from "../validations/shipment.validation";

import { ShipmentQuery } from "../validations/shipment-query.validation";
import { ApiError } from "../utils/ApiError";

class ShipmentService {
  /*
  =====================================
  Generate Shipment Number
  =====================================
  */

  private async generateShipmentNumber() {
    const year = new Date().getFullYear();

    const latest =
      await shipmentRepository.findLatestShipment();

    if (!latest) {
      return `SHP-${year}-00001`;
    }

    const sequence = Number(
      latest.shipmentNumber.split("-")[2]
    );

    return `SHP-${year}-${String(sequence + 1).padStart(5, "0")}`;
  }

  /*
  =====================================
  Create
  =====================================
  */

  async create(
    data: CreateShipmentDto,
    createdById: string
  ) {
    // Verify Client

    const client =
      await clientRepository.findById(
        data.clientId
      );

    if (!client) {
  throw new ApiError(
    404,
    "Client not found."
  );
}

    // Verify Exporter

    const exporter =
      await exporterRepository.findById(
        data.exporterId
      );

   if (!exporter) {
  throw new ApiError(
    404,
    "Exporter not found."
  );
}

    // Verify Consignee

    const consignee =
      await consigneeRepository.findById(
        data.consigneeId
      );

  if (!consignee) {
  throw new ApiError(
    404,
    "Consignee not found."
  );
}

    // Verify Allocation

    if (data.allocationId) {
      const allocation =
        await allocationRepository.findById(
          data.allocationId
        );

   if (!allocation) {
  throw new ApiError(
    404,
    "Allocation not found."
  );
}
      const existingShipment =
        await shipmentRepository.findByAllocationId(
          data.allocationId
        );

      if (existingShipment) {
        throw new Error(
          "This allocation already has a shipment."
        );
      }
    }

    const shipmentNumber =
      await this.generateShipmentNumber();

    return shipmentRepository.create({
      ...data,

      shipmentNumber,

      createdById,
    });
  }

  /*
  =====================================
  Find All
  =====================================
  */

  async findAll(
    query: ShipmentQuery
  ) {
    return shipmentRepository.findAll(
      query
    );
  }

  /*
  =====================================
  Find One
  =====================================
  */

  async findById(id: string) {
    const shipment =
      await shipmentRepository.findById(
        id
      );

  if (!shipment) {
  throw new ApiError(
    404,
    "Shipment not found."
  );
}

    return shipment;
  }

  /*
  =====================================
  Update
  =====================================
  */

  async update(
    id: string,
    data: UpdateShipmentDto
  ) {
    await this.findById(id);

    if (data.allocationId) {
      const allocation =
        await allocationRepository.findById(
          data.allocationId
        );

     if (!allocation) {
  throw new ApiError(
    404,
    "Allocation not found."
  );
}

      const existingShipment =
        await shipmentRepository.findByAllocationId(
          data.allocationId
        );

    if (
  existingShipment &&
  existingShipment.id !== id
) {
  throw new ApiError(
    400,
    "Allocation already belongs to another shipment."
  );
}
    }

    return shipmentRepository.update(
      id,
      data
    );
  }

  /*
  =====================================
  Delete
  =====================================
  */

  async delete(id: string) {
    const shipment =
      await this.findById(id);

   if (shipment.invoice) {
  throw new ApiError(
    400,
    "Cannot delete a shipment that already has an invoice."
  );
}

   if (shipment.packingList) {
  throw new ApiError(
    400,
    "Cannot delete a shipment that already has a packing list."
  );
}

if (shipment._count.containers > 0) {
  throw new ApiError(
    400,
    "Cannot delete a shipment with containers."
  );
}

if (shipment._count.transits > 0) {
  throw new ApiError(
    400,
    "Cannot delete a shipment with transit records."
  );
}

    return shipmentRepository.delete(id);
  }
  async findAvailable() {
  return shipmentRepository.findAvailable();
}
}

export default new ShipmentService();