import { RateCardStatus } from "../../../generated";
import { rateCardOptionRepository as repository } from "./rate-card-option.repository";
import type {
  CreateRateCardOptionInput,
  UpdateRateCardOptionInput,
} from "./rate-card-option.types";

class RateCardOptionService {
  async list(configurationId: string) {
    const configuration = await repository.findConfiguration(configurationId);
    if (!configuration) throw Object.assign(new Error("Rate card configuration not found."), { statusCode: 404 });
    return repository.list(configurationId);
  }

  async getById(id: string) {
    const option = await repository.findById(id);
    if (!option) throw Object.assign(new Error("Rate card option not found."), { statusCode: 404 });
    return option;
  }

  async create(configurationId: string, input: CreateRateCardOptionInput) {
    const configuration = await repository.findConfiguration(configurationId);
    if (!configuration) throw Object.assign(new Error("Rate card configuration not found."), { statusCode: 404 });
    if (configuration.rateCard.status !== RateCardStatus.DRAFT) {
      throw Object.assign(new Error("Options can only be changed while the rate card is in DRAFT status."), { statusCode: 409 });
    }

    const code = input.code.trim().toUpperCase().replace(/\s+/g, "_");
    const existing = await repository.findByCode(configurationId, code);
    if (existing) throw Object.assign(new Error("An option with this code already exists in this configuration."), { statusCode: 409 });

    return repository.create(configurationId, { ...input, code });
  }

  async update(id: string, input: UpdateRateCardOptionInput) {
    const option = await repository.findById(id);
    if (!option) throw Object.assign(new Error("Rate card option not found."), { statusCode: 404 });
    if (option.configuration.rateCard.status !== RateCardStatus.DRAFT) {
      throw Object.assign(new Error("Options can only be changed while the rate card is in DRAFT status."), { statusCode: 409 });
    }

    if (input.code !== undefined) {
      const code = input.code.trim().toUpperCase().replace(/\s+/g, "_");
      const existing = await repository.findByCode(option.configurationId, code);
      if (existing && existing.id !== id) {
        throw Object.assign(new Error("An option with this code already exists in this configuration."), { statusCode: 409 });
      }
      input = { ...input, code };
    }

    return repository.update(id, input);
  }
}

export const rateCardOptionService = new RateCardOptionService();
