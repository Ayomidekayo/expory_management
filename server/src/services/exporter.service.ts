import { Prisma } from "../generated/client";
import { ExporterRepository } from "../Repository/exporter.repository";

import { ApiError } from "../utils/ApiError";

export class ExporterService {
  private repository =
    new ExporterRepository();

  async findAll() {
    return this.repository.findAll();
  }

  async findById(id: string) {
    const exporter =
      await this.repository.findById(id);

    if (!exporter) {
      throw new ApiError(
        404,
        "Exporter not found."
      );
    }

    return exporter;
  }

  async create(
    data: Prisma.ExporterCreateInput
  ) {
    return this.repository.create(data);
  }

  async update(
    id: string,
    data: Prisma.ExporterUpdateInput
  ) {
    await this.findById(id);

    return this.repository.update(
      id,
      data
    );
  }

  async delete(id: string) {
    const exporter =
      await this.findById(id);

    if (
      exporter._count.allocations > 0 ||
      exporter._count.shipments > 0
    ) {
      throw new ApiError(
        400,
        "Exporter cannot be deleted because it is linked to allocations or shipments."
      );
    }

    return this.repository.delete(id);
  }
}