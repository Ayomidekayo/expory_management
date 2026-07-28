import { prisma } from "../config/prisma";

import clientRepository from "../Repository/client.repository";

import { ApiError } from "../utils/ApiError";
import { generateClientCode } from "../utils/generateClientCode";

import {
  CreateClientDto,
  UpdateClientDto,
} from "../validations/client.validation";

import { ClientQueryDto } from "../validations/client-query.validation";

class ClientService {
  /*
  =====================================
  Create Client
  =====================================
  */

  async create(
    data: CreateClientDto
  ) {
    /*
    Prevent Duplicate Email
    */

    if (data.email) {
      const existingEmail =
        await prisma.client.findFirst({
          where: {
            email: data.email,
          },
        });

      if (existingEmail) {
        throw new ApiError(
          400,
          "Email already exists."
        );
      }
    }

    /*
    Generate Client Code
    */

    const clientCode =
      await generateClientCode();

    return clientRepository.create({
      clientCode,

      companyName: data.companyName,

      clientType: data.clientType,

      contactPerson: data.contactPerson,

      email: data.email,

      phone: data.phone,

      alternatePhone:
        data.alternatePhone,

      address: data.address,

      city: data.city,

      state: data.state,

      country: data.country,

      website: data.website,

      taxNumber: data.taxNumber,

      remarks: data.remarks,
    });
  }

  /*
  =====================================
  Find All Clients
  =====================================
  */

  async findAll(
    query: ClientQueryDto
  ) {
    return clientRepository.findAll(
      query
    );
  }

  /*
  =====================================
  Find Client By Id
  =====================================
  */

  async findById(id: string) {
    const client =
      await clientRepository.findById(
        id
      );

    if (!client) {
      throw new ApiError(
        404,
        "Client not found."
      );
    }

    return client;
  }

  /*
  =====================================
  Update Client
  =====================================
  */

  async update(
    id: string,
    data: UpdateClientDto
  ) {
    await this.findById(id);

    /*
    Prevent Duplicate Email
    */

    if (data.email) {
      const existing =
        await prisma.client.findFirst({
          where: {
            email: data.email,

            NOT: {
              id,
            },
          },
        });

      if (existing) {
        throw new ApiError(
          400,
          "Email already exists."
        );
      }
    }

    return clientRepository.update(
      id,
      data
    );
  }

  /*
  =====================================
  Delete Client
  =====================================
  */

  async delete(id: string) {
    const client =
      await this.findById(id);

    if (
      client._count.allocations >
        0 ||
      client._count.shipments > 0
    ) {
      throw new ApiError(
        400,
        "This client cannot be deleted because it has related allocations or shipments."
      );
    }

    return clientRepository.delete(id);
  }

  /*
  =====================================
  Activate / Deactivate Client
  =====================================
  */

  async updateStatus(
    id: string,
    isActive: boolean
  ) {
    await this.findById(id);

    return clientRepository.updateStatus(
      id,
      isActive
    );
  }
}

export default new ClientService();