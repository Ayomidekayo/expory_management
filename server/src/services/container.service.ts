


import containerRepository from "../Repository/container.repository";
import packingListRepository from "../Repository/packing-list.repository";
import shipmentRepository from "../Repository/shipment.repository";
import { ContainerQuery } from "../validations/container-query.validation";
import {
  CreateContainerDto,
  UpdateContainerDto,
} from "../validations/container.validation";

class ContainerService {
  private async generateContainerNumber() {
    const year = new Date().getFullYear();
    const latest = await containerRepository.findLatestContainer();

    if (!latest) {
      return `CTR-${year}-00001`;
    }

    const sequence = Number(latest.containerNumber.split("-")[2]);

    return `CTR-${year}-${String(sequence + 1).padStart(5, "0")}`;
  }

  async create(data: CreateContainerDto) {
    // Shipment must exist
    const shipment = await shipmentRepository.findById(data.shipmentId);
    if (!shipment) {
      throw new Error("Shipment not found.");
    }

    // Packing List (Optional)
    if (data.packingListId) {
      const packingList = await packingListRepository.findById(data.packingListId);
      if (!packingList) {
        throw new Error("Packing List not found.");
      }
      if (packingList.shipmentId !== data.shipmentId) {
        throw new Error("Packing List does not belong to the selected shipment.");
      }
    }

    // Auto Number
    // const containerNumber = await this.generateContainerNumber();

    // return containerRepository.create({
    //   ...data,
    //   containerNumber,
    // });


    const existing =
  await containerRepository.findByContainerNumber(
    data.containerNumber
  );

if (existing) {
  throw new Error(
    "Container number already exists."
  );
}

return containerRepository.create(data);
  }
async findAll(
  query: ContainerQuery
) {
  return containerRepository.findAll(
    query
  );
}
  async findById(id: string) {
    const container = await containerRepository.findById(id);
    if (!container) {
      throw new Error("Container not found.");
    }
    return container;
  }

  async update(id: string, data: UpdateContainerDto) {
    await this.findById(id);

    if (data.shipmentId) {
      const shipment = await shipmentRepository.findById(data.shipmentId);
      if (!shipment) {
        throw new Error("Shipment not found.");
      }
    }

    if (data.packingListId && data.shipmentId) {
      const packingList = await packingListRepository.findById(data.packingListId);
      if (!packingList) {
        throw new Error("Packing List not found.");
      }
      if (packingList.shipmentId !== data.shipmentId) {
        throw new Error("Packing List does not belong to the selected shipment.");
      }
    }

    return containerRepository.update(id, data);
  }

  async delete(id: string) {
    await this.findById(id);
    return containerRepository.delete(id);
  }
}

export default new ContainerService();
