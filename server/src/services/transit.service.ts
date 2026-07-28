import transitRepository from "../Repository/transit.repository";
import shipmentRepository from "../Repository/shipment.repository";
import containerRepository from "../Repository/container.repository";

import {
  CreateTransitDto,
  UpdateTransitDto,
} from "../validations/transit.validation";

import {
  TransitQuery,
} from "../validations/transit-query.validation";
import { ApiError } from "../utils/ApiError";

class TransitService {

  /*
  =====================================
  Generate Transit Number
  =====================================
  */

  private async generateTransitNumber() {

    const year =
      new Date().getFullYear();

    const latest =
      await transitRepository.findLatestTransit();

    if (!latest) {

      return `TRN-${year}-00001`;

    }

    const sequence =
      Number(
        latest.transitNumber.split("-")[2]
      );

    return `TRN-${year}-${String(
      sequence + 1
    ).padStart(5, "0")}`;

  }

  /*
  =====================================
  Create
  =====================================
  */

  async create(
    data: CreateTransitDto
  ) {

    /*
    Shipment must exist
    */

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

const container =
  await containerRepository.findById(
    data.containerId
  );

if (!container) {
  throw new ApiError(
    404,
    "Container not found."
  );
}

if (
  container.shipmentId !==
  data.shipmentId
) {
  throw new ApiError(
    400,
    "Selected container does not belong to the selected shipment."
  );
}

    /*
    Auto Calculate Total Price
    */

    const totalPrice =

      data.quantity &&
      data.unitPrice

        ? Number(data.quantity) *
          Number(data.unitPrice)

        : undefined;

    /*
    Generate Transit Number
    */

    const transitNumber =
      await this.generateTransitNumber();

    return transitRepository.create({

      ...data,

      totalPrice,

      transitNumber,

    });

  }

  /*
  =====================================
  Find All
  =====================================
  */

  async findAll(
    query: TransitQuery
  ) {

    return transitRepository.findAll(
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

    const transit =
      await transitRepository.findById(
        id
      );

    if (!transit) {
  throw new ApiError(
    404,
    "Transit not found."
  );
}

    return transit;

  }

  /*
  =====================================
  Update
  =====================================
  */

  async update(

    id: string,

    data: UpdateTransitDto

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
  throw new ApiError(
    404,
    "Shipment not found."
  );
}

    }

    /*
    Validate Container
    */

    if (data.containerId) {

      const container =
        await containerRepository.findById(
          data.containerId
        );

     if (!container) {
  throw new ApiError(
    404,
    "Container not found."
  );
}

      if (

        data.shipmentId &&

        container.shipmentId !==
          data.shipmentId

      ) {
throw new ApiError(
  400,
  "Selected container does not belong to the selected shipment."
);

      }

    }

    /*
    Auto Calculate Price
    */

    const payload = {

      ...data,

      totalPrice:

        data.quantity &&
        data.unitPrice

          ? Number(
              data.quantity
            ) *
            Number(
              data.unitPrice
            )

          : data.totalPrice,

    };

    return transitRepository.update(

      id,

      payload

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

    return transitRepository.delete(
      id
    );

  }

}

export default new TransitService();