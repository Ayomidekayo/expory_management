import packingListRepository from "../Repository/packing-list.repository";
import shipmentRepository from "../Repository/shipment.repository";

import { ApiError } from "../utils/ApiError";

import {
  CreatePackingListDto,
  UpdatePackingListDto,
} from "../validations/packing-list.validation";

import { PackingListQuery } from "../validations/packing-list-query.validation";

class PackingListService {
  /*
  =====================================
  Generate Packing List Number
  =====================================
  */

  private async generatePackingListNumber() {
    const year = new Date().getFullYear();

    const latest =
      await packingListRepository.findLatestPackingList();

    if (!latest) {
      return `PKL-${year}-00001`;
    }

    const sequence = Number(
      latest.packingListNumber.split("-")[2]
    );

    return `PKL-${year}-${String(
      sequence + 1
    ).padStart(5, "0")}`;
  }

  /*
  =====================================
  Create
  =====================================
  */

  async create(
    data: CreatePackingListDto
  ) {
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

    const existing =
      await packingListRepository.findByShipmentId(
        data.shipmentId
      );

    if (existing) {
      throw new ApiError(
        400,
        "This shipment already has a packing list."
      );
    }

    const packingListNumber =
      await this.generatePackingListNumber();

    return packingListRepository.create({
      ...data,
      packingListNumber,
    });
  }

  /*
  =====================================
  Find All
  =====================================
  */

  async findAll(
    query: PackingListQuery
  ) {
    return packingListRepository.findAll(
      query
    );
  }

  /*
  =====================================
  Find By Id
  =====================================
  */

  async findById(id: string) {
    const packingList =
      await packingListRepository.findById(
        id
      );

    if (!packingList) {
      throw new ApiError(
        404,
        "Packing list not found."
      );
    }

    return packingList;
  }

  /*
  =====================================
  Update
  =====================================
  */

  async update(
    id: string,
    data: UpdatePackingListDto
  ) {
    await this.findById(id);

    return packingListRepository.update(
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
    await this.findById(id);

    return packingListRepository.delete(
      id
    );
  }
}

export default new PackingListService();