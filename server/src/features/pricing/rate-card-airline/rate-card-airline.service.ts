import {
  QuoteMode,
  RateCardStatus,
} from "../../../generated";

import * as repository from "./rate-card-airline.repository";

import type {
  CreateRateCardAirlineInput,
  UpdateRateCardAirlineInput,
} from "./rate-card-airline.types";

export class RateCardAirlineService {
  /**
   * Validate that the configuration belongs to
   * an Air rate card and supports airline selection.
   */
  private async validateConfiguration(
    configurationId: string,
  ) {
    const configuration =
      await repository.findConfiguration(
        configurationId,
      );

    if (!configuration) {
      throw new Error("CONFIGURATION_NOT_FOUND");
    }

    if (configuration.rateCard.mode !== QuoteMode.AIR) {
      throw new Error("AIRLINE_SELECTOR_ONLY_FOR_AIR");
    }

    if (!configuration.airlineSelectorEnabled) {
      throw new Error("AIRLINE_SELECTOR_DISABLED");
    }

    return configuration;
  }

  /**
   * Ensure that airline details can only be modified
   * while the associated rate card is a draft.
   */
  private assertDraft(status: RateCardStatus) {
    if (status !== RateCardStatus.DRAFT) {
      throw new Error("RATE_CARD_MUST_BE_DRAFT");
    }
  }

  /**
   * List airlines for a configuration.
   *
   * Administrators can retrieve inactive airlines.
   * Exporter-facing requests should use activeOnly=true.
   */
  async list(
    rateCardId: string,
    configurationId: string,
    activeOnly = false,
  ) {
    const configuration =
      await this.validateConfiguration(
        configurationId,
      );

    if (configuration.rateCardId !== rateCardId) {
      throw new Error("CONFIGURATION_RATE_CARD_MISMATCH");
    }

    return repository.listAirlines(
      configurationId,
      activeOnly,
    );
  }

  /**
   * Retrieve an airline belonging to the specified
   * rate card.
   */
  async getById(
    rateCardId: string,
    airlineId: string,
  ) {
    const airline =
      await repository.findAirlineById(airlineId);

    if (!airline) {
      throw new Error("AIRLINE_NOT_FOUND");
    }

    const configuration =
      await this.validateConfiguration(
        airline.configurationId,
      );

    if (configuration.rateCardId !== rateCardId) {
      throw new Error("CONFIGURATION_RATE_CARD_MISMATCH");
    }

    return airline;
  }

  /**
   * Create an airline for a draft Air configuration.
   */
  async create(
    rateCardId: string,
    input: CreateRateCardAirlineInput,
  ) {
    const configuration =
      await this.validateConfiguration(
        input.configurationId,
      );

    if (configuration.rateCardId !== rateCardId) {
      throw new Error("CONFIGURATION_RATE_CARD_MISMATCH");
    }

    this.assertDraft(configuration.rateCard.status);

    const code = input.code.trim().toUpperCase();

    const existing =
      await repository.findAirlineByCode(
        input.configurationId,
        code,
      );

    if (existing) {
      throw new Error("AIRLINE_CODE_ALREADY_EXISTS");
    }

    return repository.createAirline({
      ...input,
      code,
      name: input.name.trim(),
    });
  }

  /**
   * Update an airline belonging to a draft Air
   * configuration.
   */

async update(
  rateCardId: string,
  airlineId: string,
  input: UpdateRateCardAirlineInput,
) {
  const airline = await repository.findAirlineById(airlineId);

  if (!airline) {
    throw new Error("AIRLINE_NOT_FOUND");
  }

  const configuration = await this.validateConfiguration(
    airline.configurationId,
  );

  if (configuration.rateCardId !== rateCardId) {
    throw new Error("CONFIGURATION_RATE_CARD_MISMATCH");
  }

  this.assertDraft(configuration.rateCard.status);

  const updates: UpdateRateCardAirlineInput = { ...input };

  if (input.code !== undefined && input.code !== null) {
    const code = input.code.trim().toUpperCase();

    if (!code) {
      throw new Error("INVALID_AIRLINE_CODE");
    }

    if (code !== airline.code) {
      const duplicate = await repository.findAirlineByCode(
        airline.configurationId,
        code,
      );

      if (duplicate && duplicate.id !== airline.id) {
        throw new Error("AIRLINE_CODE_ALREADY_EXISTS");
      }
    }

    updates.code = code;
  }

  if (input.name !== undefined && input.name !== null) {
    const name = input.name.trim();

    if (!name) {
      throw new Error("INVALID_AIRLINE_NAME");
    }

    updates.name = name;
  }

  return repository.updateAirline(airlineId, updates);
}

}

export const rateCardAirlineService =
  new RateCardAirlineService();