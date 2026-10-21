import { randomUUID } from 'node:crypto'

import * as repository from './quotation.repository'
import type {
  CalculateQuoteInput,
  CalculatedLine,
  PublicRateCardFilters,
  SubmitQuoteInput,
} from './quotation.types'
import { CalculationBasis, RateCalculationType } from '../../generated'

const money = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100
const numeric = (v: unknown, fallback = 0) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

// function getSlabRate(
//   slabs: any[],
//   componentId: string,
//   weightKg: number,
//   optionId: string | null,
//   sectionId: string | null,
// ) {
//   const slab = slabs.find((s) => {
//     const min = numeric(s.minWeightKg)
//     const max = s.maxWeightKg == null ? Infinity : numeric(s.maxWeightKg)
//     return (
//       weightKg >= min &&
//       weightKg <= max &&
//       (s.optionId ?? null) === optionId &&
//       (s.pricingSectionId ?? null) === sectionId
//     )
//   })
//   const rate = slab?.rates?.find((r: any) => r.componentId === componentId)
//   return rate ? { amount: numeric(rate.amount), slabLabel: slab.label } : null
// }



function getSlabRate(
  slabs: any[],
  componentId: string,
  weightKg: number,
  optionId: string | null,
  sectionId: string | null,
) {
  console.log("\n========== WEIGHT SLAB LOOKUP ==========");
  console.log("Component ID:", componentId);
  console.log("Weight (kg):", weightKg);
  console.log("Requested optionId:", optionId);
  console.log("Requested sectionId:", sectionId);
  console.log("Number of slabs:", slabs.length);

  console.log(
    "Available slabs:",
    JSON.stringify(
      slabs.map((slab) => ({
        id: slab.id,
        label: slab.label,
        minWeightKg: slab.minWeightKg,
        maxWeightKg: slab.maxWeightKg,
        optionId: slab.optionId ?? null,
        pricingSectionId: slab.pricingSectionId ?? null,
        rates: (slab.rates ?? []).map((rate: any) => ({
          componentId: rate.componentId,
          amount: rate.amount,
        })),
      })),
      null,
      2,
    ),
  );

  const weightMatches = slabs.filter((slab) => {
    const min = numeric(slab.minWeightKg);
    const max =
      slab.maxWeightKg == null
        ? Infinity
        : numeric(slab.maxWeightKg);

    // Inclusive boundaries for debugging the existing ranges.
    return weightKg >= min && weightKg <= max;
  });

  console.log(
    "Slabs matching weight:",
    weightMatches.map((slab) => ({
      id: slab.id,
      label: slab.label,
      minWeightKg: slab.minWeightKg,
      maxWeightKg: slab.maxWeightKg,
    })),
  );

  const rateMatches = weightMatches.filter((slab) =>
    slab.rates?.some(
      (rate: any) => rate.componentId === componentId,
    ),
  );

  console.log(
    "Slabs containing this component's rate:",
    rateMatches.map((slab) => ({
      id: slab.id,
      label: slab.label,
      pricingSectionId: slab.pricingSectionId ?? null,
      optionId: slab.optionId ?? null,
      rates: slab.rates
        ?.filter((rate: any) => rate.componentId === componentId)
        .map((rate: any) => ({
          componentId: rate.componentId,
          amount: rate.amount,
        })),
    })),
  );

  const exact = rateMatches.find(
    (slab) =>
      (slab.optionId ?? null) === optionId &&
      (slab.pricingSectionId ?? null) === sectionId,
  );

  const shared = rateMatches.find(
    (slab) =>
      slab.pricingSectionId == null &&
      (slab.optionId ?? null) === optionId,
  );

  const slab = exact ?? shared;

  if (!slab) {
    console.error("❌ NO MATCHING WEIGHT RATE", {
      componentId,
      weightKg,
      optionId,
      sectionId,
      weightMatchingSlabCount: weightMatches.length,
      componentRateMatchCount: rateMatches.length,
    });
    console.log("========================================\n");
    return null;
  }

  const rate = slab.rates.find(
    (item: any) => item.componentId === componentId,
  );

  console.log("✅ MATCHED SLAB:", slab.label);
  console.log("Matched slab ID:", slab.id);
  console.log("Matched component ID:", rate.componentId);
  console.log("Matched amount:", rate.amount);
  console.log("========================================\n");

  return {
    amount: numeric(rate.amount),
    slabLabel: slab.label,
  };
}


export class QuotationService {
  async listPublicRateCards(filters: PublicRateCardFilters) {
    return repository.listPublicRateCards(filters)
  }

  async getPublicConfigurations(rateCardId: string) {
    const card = await repository.findPublicRateCardConfiguration(rateCardId)
    if (!card) throw new Error('ACTIVE_RATE_CARD_NOT_FOUND')
    return {
      id: card.id,
      name: card.name,
      mode: card.mode,
      direction: card.direction,
      configurations: card.configurations.map((c: any) => ({
        id: c.id,
        name: c.name,
        code: c.code,
        currency: c.currency,
        routeCode: c.routeCode,
        routeLabel: c.routeLabel,
        equipmentType: c.equipmentType,
        weightEnabled: c.weightEnabled,
        freightAmountEnabled: c.freightAmountEnabled,
        customsValueEnabled: c.customsValueEnabled,
        quantityEnabled: c.quantityEnabled,
        airlineSelectorEnabled: c.airlineSelectorEnabled,
        transportEnabled: c.transportEnabled,
        nafdacEnabled: c.nafdacEnabled,
        vatEnabled: c.vatEnabled,
        vatPercentage: c.vatPercentage,
        vatCalculationBasis: c.vatCalculationBasis,
        options: c.options,
        pricingSections: c.pricingSections,
        airlines: c.airlines.map((a: any) => ({
          id: a.id,
          code: a.code,
          name: a.name,
          ratePerKg: a.ratePerKg,
        })),
        services: c.components.map((component: any) => ({
          id: component.id,
          name: component.name,
          code: component.code,
          calculationType: component.calculationType,
          isOptional: component.isOptional,
          isTaxable: component.isTaxable,
          optionId: component.optionId,
          pricingSectionId: component.pricingSectionId,
          unit: component.unit,
        })),
        weightSlabs: c.weightSlabs.map((s: any) => ({
          id: s.id,
          label: s.label,
          minWeightKg: s.minWeightKg,
          maxWeightKg: s.maxWeightKg,
          optionId: s.optionId,
          pricingSectionId: s.pricingSectionId,
        })),
      })),
    }
  }

  async calculate(input: CalculateQuoteInput) {
    const card = await repository.findPublicRateCardConfiguration(
      input.rateCardId,
      input.configurationId,
    )
    if (!card) throw new Error('ACTIVE_RATE_CARD_NOT_FOUND')
    const config = card.configurations[0]
    if (!config) throw new Error('ACTIVE_CONFIGURATION_NOT_FOUND')

    const weightKg = numeric(input.weightKg)
    const quantity = Math.max(0, numeric(input.quantity, 1))
    if (config.weightEnabled && weightKg <= 0)
      throw new Error('WEIGHT_REQUIRED')
    if (config.quantityEnabled && quantity <= 0)
      throw new Error('QUANTITY_REQUIRED')
    if (config.customsValueEnabled && numeric(input.customsValue) < 0)
      throw new Error('INVALID_CUSTOMS_VALUE')
    if (config.freightAmountEnabled && numeric(input.freightAmount) < 0)
      throw new Error('INVALID_FREIGHT_AMOUNT')

    const selectedOptions = new Set(input.optionIds ?? [])
    const validOptions = new Set(config.options.map((o: any) => o.id))
    for (const id of selectedOptions)
      if (!validOptions.has(id)) throw new Error('INVALID_OPTION')
    if (
      input.airlineId &&
      !config.airlines.some((a: any) => a.id === input.airlineId)
    )
      throw new Error('INVALID_AIRLINE')
    if (config.airlineSelectorEnabled && !input.airlineId)
      throw new Error('AIRLINE_REQUIRED')

    const components: any[] = [
      ...card.components,
      ...config.components.filter(
        (c: any) => !c.optionId || selectedOptions.has(c.optionId),
      ),
    ]
    const lines: CalculatedLine[] = []
    let requiresReview = false

    for (const component of components) {
      if (!component.isActive) continue
      if (component.optionId && !selectedOptions.has(component.optionId))
        continue
      if (component.pricingSectionId) {
        const section = config.pricingSections.find(
          (s: any) => s.id === component.pricingSectionId,
        )
        if (!section || !section.isActive) continue
        if (section.optionId && !selectedOptions.has(section.optionId)) continue
      }
      let rateApplied = 0
      let lineTotal = 0
      let isEstimate = false
      let remarks: string | null = null
      const lineQuantity =
        component.calculationType === RateCalculationType.PER_UNIT
          ? quantity
          : 1

      if (component.calculationType === RateCalculationType.FIXED) {
        rateApplied = numeric(component.value)
        lineTotal = rateApplied
      } else if (component.calculationType === RateCalculationType.PER_UNIT) {
        rateApplied = numeric(component.value)
        lineTotal = rateApplied * lineQuantity
     
} else if (
  component.calculationType === RateCalculationType.WEIGHT_SLAB
) {
  const match =
    getSlabRate(
      config.weightSlabs,
      component.id,
      weightKg,
      component.optionId ?? null,
      component.pricingSectionId ?? null,
    ) ??
    getSlabRate(
      card.weightSlabs,
      component.id,
      weightKg,
      component.optionId ?? null,
      component.pricingSectionId ?? null,
    );

  if (!match) {
    requiresReview = true;
    isEstimate = true;
    remarks = `No matching saved weight rate for ${weightKg} kg; manual review required.`;
  } else {
    rateApplied = match.amount;
    lineTotal = match.amount;
    remarks = `Weight slab: ${match.slabLabel}`;
  }
      } else if (component.calculationType === RateCalculationType.PERCENTAGE) {
        const basis = component.calculationBasis
        if (basis === CalculationBasis.CUSTOMS_VALUE)
          rateApplied =
            (numeric(input.customsValue) * numeric(component.percentage)) / 100
        else if (basis === CalculationBasis.FREIGHT_AMOUNT)
          rateApplied =
            (numeric(input.freightAmount) * numeric(component.percentage)) / 100
        else rateApplied = 0 // SUBTOTAL percentage is calculated in a second pass below.
        lineTotal = rateApplied
        if (basis === CalculationBasis.SUBTOTAL) {
          requiresReview = true
          isEstimate = true
          remarks =
            'Subtotal-based percentage needs final subtotal calculation.'
        }
      } else {
        requiresReview = true
        isEstimate = true
        remarks = 'Variable charge requires manual quotation review.'
      }

      lines.push({
        componentId: component.id,
        componentName: component.name,
        componentCode: component.code ?? null,
        calculationType: component.calculationType,
        calculationBasis: component.calculationBasis ?? null,
        unit: component.unit ?? null,
        quantity: lineQuantity,
        rateApplied: money(rateApplied),
        lineTotal: money(lineTotal),
        isTaxable: Boolean(component.isTaxable),
        isOptional: Boolean(component.isOptional),
        isEstimate,
        requiresReview: isEstimate,
        remarks,
      })
    }

  if (config.airlineSelectorEnabled) {
  if (!input.airlineId) {
    throw new Error("AIRLINE_REQUIRED");
  }

  const airline = config.airlines.find(
    (item: any) => item.id === input.airlineId && item.isActive,
  );

  if (!airline) {
    throw new Error("INVALID_AIRLINE");
  }

  if (weightKg <= 0) {
    throw new Error("WEIGHT_REQUIRED");
  }

  const ratePerKg = numeric(airline.ratePerKg);

  if (ratePerKg < 0) {
    throw new Error("INVALID_AIRLINE_RATE");
  }

  const freightTotal = money(ratePerKg * weightKg);

  lines.push({
    componentId: `airline:${airline.id}`,
    componentName: `${airline.name} freight`,
    componentCode: airline.code,
    calculationType: "PER_UNIT",
    calculationBasis: null,
    unit: "kg",
    quantity: weightKg,
    rateApplied: ratePerKg,
    lineTotal: freightTotal,
    isTaxable: false,
    isOptional: false,
    isEstimate: false,
    requiresReview: false,
    remarks: `${airline.name}: ${ratePerKg} per kg × ${weightKg} kg`,
  });
}

    // Recalculate SUBTOTAL-based percentage lines using the sum of non-percentage lines.
    const baseSubtotal = lines
      .filter((l) => l.calculationType !== RateCalculationType.PERCENTAGE)
      .reduce((sum, l) => sum + l.lineTotal, 0)
    for (const line of lines) {
      if (
        line.calculationType === RateCalculationType.PERCENTAGE &&
        line.calculationBasis === CalculationBasis.SUBTOTAL
      ) {
        const component = components.find((c) => c.id === line.componentId)
        const amount = money(
          (baseSubtotal * numeric(component?.percentage)) / 100,
        )
        line.rateApplied = amount
        line.lineTotal = amount
        line.isEstimate = false
        line.requiresReview = false
        line.remarks = null
      }
    }

    
const subtotal = money(
  lines.reduce((sum, line) => sum + line.lineTotal, 0),
);

// Agreed rule: VAT applies to the full subtotal of applicable charges.
const vatBase = subtotal;

const vatPercentage = numeric(config.vatPercentage, 7.5);

if (vatPercentage < 0 || vatPercentage > 100) {
  throw new Error("INVALID_VAT_PERCENTAGE");
}

const taxAmount = config.vatEnabled
  ? money((vatBase * vatPercentage) / 100)
  : 0;

const totalAmount = money(subtotal + taxAmount);
const requiresReviewFromLines = lines.some(
  (line) => line.requiresReview,
);
requiresReview ||= requiresReviewFromLines;


    const quoteNumber = `Q-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${randomUUID().slice(0, 8).toUpperCase()}`
    const quote = await repository.createCalculatedQuote({
      rateCardId: card.id,
      quoteNumber,
      source: 'GUEST',
      weightKg: config.weightEnabled ? weightKg : undefined,
      goodsDescription: input.goodsDescription,
      hsCode: input.hsCode,
      customsValue: config.customsValueEnabled
        ? numeric(input.customsValue)
        : undefined,
      freightAmount: config.freightAmountEnabled
        ? numeric(input.freightAmount)
        : undefined,
      quantity: config.quantityEnabled ? quantity : undefined,
      currency: config.currency,
      subtotal,
      taxAmount,
      totalAmount,
      requiresReview,
      inputSnapshot: {
        ...input,
        optionIds: [...selectedOptions],
        configurationId: config.id,
      },
    
pricingSnapshot: {
  configurationId: config.id,
  currency: config.currency,
  lines,
  subtotal,
  vatEnabled: config.vatEnabled,
  vatBase,
  vatPercentage,
  taxAmount,
  totalAmount,
  vatRule: "FULL_SUBTOTAL",
  calculatedAt: new Date().toISOString(),
},
      items: lines
        .map((line) => ({
          componentId: line.componentId.startsWith('airline:')
            ? ''
            : line.componentId,
          componentName: line.componentName,
          componentCode: line.componentCode,
          calculationType: line.calculationType as any,
          calculationBasis: line.calculationBasis as any,
          unit: line.unit,
          rateApplied: line.rateApplied,
          quantity: line.quantity,
          lineTotal: line.lineTotal,
          isEstimate: line.isEstimate,
          requiresReview: line.requiresReview,
          remarks: line.remarks,
        }))
        .map((item) => ({
          ...item,
          componentId: item.componentId || null,
        })) as any,
    })

    return {
      quoteId: quote.id,
      quoteNumber: quote.quoteNumber,
      status: quote.status,
      rateCard: {
        id: card.id,
        name: card.name,
        mode: card.mode,
        direction: card.direction,
      },
      configuration: {
        id: config.id,
        name: config.name,
        currency: config.currency,
      },
      lines: quote.items.map((item: any, index: number) => ({
        ...lines[index],
        quoteItemId: item.id,
      })),
      subtotal,
      taxAmount,
      totalAmount,
      currency: config.currency,
      requiresReview,
    }
  }

  async submit(quoteId: string, exporterId: string, input: SubmitQuoteInput) {
    const quote = await repository.findQuoteForSubmission(quoteId)
    if (!quote) throw new Error('QUOTE_NOT_FOUND')
    if (quote.status !== 'CALCULATED' && quote.status !== 'PENDING_REVIEW')
      throw new Error('QUOTE_NOT_SUBMITTABLE')
    if (!input.selectedQuoteItemIds?.length)
      throw new Error('SELECT_AT_LEAST_ONE_SERVICE')
    return repository.createSubmission({
      quoteId,
      exporterId,
      customerName: input.customerName ?? undefined,
      email: input.email ?? undefined,
      phone: input.phone ?? undefined,
      customerMessage: input.customerMessage ?? undefined,
      selectedQuoteItemIds: input.selectedQuoteItemIds,
      quoteItems: quote.items,
      currency: quote.currency,
      subtotal: quote.subtotal ?? 0,
      taxAmount: (quote.pricingSnapshot as any)?.taxAmount ?? 0,
      totalAmount: quote.totalAmount ?? 0,
    })
  }
}
