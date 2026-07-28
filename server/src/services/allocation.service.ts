

import {
  CreateAllocationDto,
  UpdateAllocationDto,
} from "../validations/allocation.validation";

import { AllocationQuery } from "../validations/allocation-query.validation";
import allocationRepository from "../Repository/allocation.repository";
import consigneeRepository from "../Repository/consignee.repository";
import exporterRepository from "../Repository/exporter.repository";
import clientRepository from "../Repository/client.repository";
import { AllocationStatus } from "../generated";

class AllocationService {
  /*
  =====================================
  Generate Allocation Number
  =====================================
  */

  private async generateAllocationNumber() {
  const year = new Date().getFullYear();

  const latest =
    await allocationRepository.findLatestAllocation();

  if (!latest) {
    return `AL-${year}-00001`;
  }

  const sequence = Number(
    latest.allocationNumber.split("-")[2]
  );

  return `AL-${year}-${String(sequence + 1).padStart(5, "0")}`;
}

  /*
  =====================================
  Create
  =====================================
  */

  async create(
    data: CreateAllocationDto,
    createdById: string
  ) {
    // Verify Client

    const client =
      await clientRepository.findById(
        data.clientId
      );

    if (!client) {
      throw new Error(
        "Client not found."
      );
    }

    // Verify Exporter

    if (data.exporterId) {
      const exporter =
        await exporterRepository.findById(
          data.exporterId
        );

      if (!exporter) {
        throw new Error(
          "Exporter not found."
        );
      }
    }

    // Verify Consignee

    if (data.consigneeId) {
      const consignee =
        await consigneeRepository.findById(
          data.consigneeId
        );

      if (!consignee) {
        throw new Error(
          "Consignee not found."
        );
      }
    }

    const allocationNumber =
      await this.generateAllocationNumber();

    return allocationRepository.create({
      ...data,

      allocationNumber,

      createdById,
    });
  }

  /*
  =====================================
  Find All
  =====================================
  */

  async findAll(
    query: AllocationQuery
  ) {
    return allocationRepository.findAll(
      query
    );
  }

  /*
  =====================================
  Find By Id
  =====================================
  */

  async findById(id: string) {
    const allocation =
      await allocationRepository.findById(
        id
      );

    if (!allocation) {
      throw new Error(
        "Allocation not found."
      );
    }

    return allocation;
  }

  /*
  =====================================
  Update
  =====================================
  */

  async update(
    id: string,
    data: UpdateAllocationDto
  ) {
    await this.findById(id);

    return allocationRepository.update(
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
    const allocation =
      await this.findById(id);

    if (allocation.shipment) {
      throw new Error(
        "Cannot delete an allocation that already has a shipment."
      );
    }

    return allocationRepository.delete(id);
  }

    async updateStatus(
    id: string,
    status: AllocationStatus
  ) {
    await this.findById(id);
  
    return allocationRepository.updateStatus(
      id,
      status
    );
  }
}


export default new AllocationService();