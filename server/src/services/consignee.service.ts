import consigneeRepository from "../Repository/consignee.repository";
import { CreateConsigneeDto, UpdateConsigneeDto } from "../validations/consignee.validation";


class ConsigneeService {
  async createConsignee(data: CreateConsigneeDto) {
    if (data.email) {
      const existing = await consigneeRepository.findByEmail(data.email);

      if (existing) {
        throw new Error("Consignee email already exists.");
      }
    }

    return consigneeRepository.create(data);
  }

  async getConsignees() {
    return consigneeRepository.findAll();
  }

  async getConsignee(id: string) {
    const consignee = await consigneeRepository.findById(id);

    if (!consignee) {
      throw new Error("Consignee not found.");
    }

    return consignee;
  }

  async updateConsignee(
    id: string,
    data: UpdateConsigneeDto
  ) {
    await this.getConsignee(id);

    return consigneeRepository.update(id, data);
  }

  async deleteConsignee(id: string) {
    await this.getConsignee(id);

    return consigneeRepository.delete(id);
  }
}

export default new ConsigneeService();