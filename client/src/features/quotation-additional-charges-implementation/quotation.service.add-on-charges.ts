import { randomUUID } from 'node:crypto'

import * as repository from './quotation.repository'
import type {
  CalculateQuoteInput,
  CalculatedLine,
  PublicRateCardFilters,
  SubmitQuoteInput,
} from './quotation.types'
import { CalculationBasis, RateCalculationType } from '../../generated'
import { emitToQuotationReviewers } from '../../realtime/socket'
import { prisma } from '../../config/prisma'

const money = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100
const numeric = (v: unknown, fallback = 0) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

type SelectionAwareLine = CalculatedLine & {
  /** Percentage value used to recompute subtotal-based fees after selection changes. */
  percentage?: number | null
}

const isSubtotalPercentage = (item: { calculationType?: unknown; calculationBasis?: unknown }) =>
  String(item.calculationType) === String(RateCalculationType.PERCENTAGE) &&
  String(item.calculationBasis) === String(CalculationBasis.SUBTOTAL)

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
    // Air freight always requires chargeable weight, independently of a legacy
    // weightEnabled toggle in the selected configuration.
    const weightRequired = config.weightEnabled || card.mode === "AIR"
    if (weightRequired && weightKg <= 0)
      throw new Error('WEIGHT_REQUIRED')
    if (config.quantityEnabled && quantity <= 0)
      throw new Error('QUANTITY_REQUIRED')
    if (config.customsValueEnabled && numeric(input.customsValue) < 0)
      throw new Error('INVALID_CUSTOMS_VALUE')
    if (config.freightAmountEnabled && numeric(input.freightAmount) < 0)
      throw new Error('INVALID_FREIGHT_AMOUNT')

    const selectedOptions = new Set(input.optionIds ?? [])
    const activeOptions = (config.options ?? []).filter(
      (option: any) => option.isActive !== false,
    )
    const validOptions = new Set(activeOptions.map((option: any) => option.id))
    for (const id of selectedOptions)
      if (!validOptions.has(id)) throw new Error('INVALID_OPTION')

    // Land choices (e.g. short/long haul) and sea container types (e.g. 20ft/40ft)
    // are exclusive variants. They must come from active RateCardOption records.
    const requiresSingleModeOption = card.mode === "LAND" || card.mode === "SEA"
    if (requiresSingleModeOption && activeOptions.length === 0)
      throw new Error('SHIPMENT_OPTIONS_NOT_CONFIGURED')
    if (requiresSingleModeOption && selectedOptions.size === 0)
      throw new Error('SHIPMENT_OPTION_REQUIRED')
    if (requiresSingleModeOption && selectedOptions.size !== 1)
      throw new Error('SELECT_ONE_SHIPMENT_OPTION')

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
    const lines: SelectionAwareLine[] = []
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
        percentage:
          component.calculationType === RateCalculationType.PERCENTAGE
            ? numeric(component.percentage)
            : null,
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
    percentage: null,
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
      weightKg: weightRequired ? weightKg : undefined,
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
  selectionRecalculationVersion: 1,
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

    const savedSnapshotLines: Array<Record<string, any>> = Array.isArray(
      (quote.pricingSnapshot as any)?.lines,
    )
      ? (quote.pricingSnapshot as any).lines
      : []

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
      // Return the item IDs attached to the corresponding saved snapshot line;
      // do not depend on the database's unspecified relation ordering.
      lines: lines.map((line, index) => ({
        ...line,
        quoteItemId:
          savedSnapshotLines[index]?.quoteItemId ?? quote.items[index]?.id,
      })),
      subtotal,
      taxAmount,
      totalAmount,
      currency: config.currency,
      vatEnabled: Boolean(config.vatEnabled),
      vatPercentage,
      vatRule: "FULL_SUBTOTAL",
      requiresReview,
    }
  }


async submit(
  quoteId: string,
  exporterId: string,
  input: SubmitQuoteInput,
) {
  const quote = await repository.findQuoteForSubmission(quoteId)
  if (!quote) throw new Error("QUOTE_NOT_FOUND")
  if (quote.status !== "CALCULATED") throw new Error("QUOTE_NOT_SUBMITTABLE")

  if (input?.customsChargeRequested !== undefined && typeof input.customsChargeRequested !== "boolean") {
    throw new Error("INVALID_ADDITIONAL_CHARGE_REQUEST")
  }
  if (input?.transportChargeRequested !== undefined && typeof input.transportChargeRequested !== "boolean") {
    throw new Error("INVALID_ADDITIONAL_CHARGE_REQUEST")
  }
  const customsChargeRequested = input.customsChargeRequested === true
  const transportChargeRequested = input.transportChargeRequested === true
  let invoiceValue: number | undefined
  let invoiceCurrency: string | undefined
  if (customsChargeRequested) {
    invoiceValue = Number(input.invoiceValue)
    if (!Number.isFinite(invoiceValue) || invoiceValue <= 0) {
      throw new Error("INVOICE_VALUE_REQUIRED")
    }
    invoiceCurrency = typeof input.invoiceCurrency === "string"
      ? input.invoiceCurrency.trim().toUpperCase()
      : ""
    if (!/^[A-Z]{3}$/.test(invoiceCurrency)) {
      throw new Error("INVALID_INVOICE_CURRENCY")
    }
  }
  const customerMessage = typeof input.customerMessage === "string"
    ? input.customerMessage.trim()
    : ""
  if (customerMessage.length > 5000) throw new Error("INVALID_CUSTOMER_MESSAGE")

  const requestedIds = input?.selectedQuoteItemIds
  if (!Array.isArray(requestedIds) || requestedIds.length === 0) {
    throw new Error("SELECT_AT_LEAST_ONE_SERVICE")
  }
  if (
    requestedIds.some((id) => typeof id !== "string" || id.trim().length === 0) ||
    new Set(requestedIds).size !== requestedIds.length
  ) {
    throw new Error("INVALID_SELECTED_QUOTE_ITEM")
  }

  const quoteItems = quote.items as Array<any>
  const validIds = new Set(quoteItems.map((item) => item.id))
  if (requestedIds.some((id) => !validIds.has(id))) {
    throw new Error("INVALID_SELECTED_QUOTE_ITEM")
  }

  const selected = new Set(requestedIds)
  const selectedItems = quoteItems.filter((item) => selected.has(item.id))
  const snapshot = (quote.pricingSnapshot ?? {}) as Record<string, any>
  const snapshotLines: Array<Record<string, any>> = Array.isArray(snapshot.lines)
    ? snapshot.lines
    : []
  const usedSnapshotIndexes = new Set<number>()

  // Match saved pricing metadata to persisted quote items. The repository adds
  // quoteItemId to new snapshots; signature matching supports older snapshots.
  const selectedEntries = selectedItems.map((item) => {
    let snapshotIndex = snapshotLines.findIndex(
      (line, index) =>
        !usedSnapshotIndexes.has(index) && line.quoteItemId === item.id,
    )

    if (snapshotIndex < 0 && item.componentId) {
      snapshotIndex = snapshotLines.findIndex(
        (line, index) =>
          !usedSnapshotIndexes.has(index) &&
          line.componentId === item.componentId,
      )
    }

    if (snapshotIndex < 0) {
      snapshotIndex = snapshotLines.findIndex((line, index) =>
        !usedSnapshotIndexes.has(index) &&
        String(line.componentName ?? "") === String(item.componentName ?? "") &&
        (line.componentCode ?? null) === (item.componentCode ?? null) &&
        String(line.calculationType) === String(item.calculationType) &&
        numeric(line.quantity, 1) === numeric(item.quantity, 1) &&
        numeric(line.lineTotal) === numeric(item.lineTotal),
      )
    }

    if (snapshotIndex < 0 && quoteItems.indexOf(item) < snapshotLines.length) {
      const fallbackIndex = quoteItems.indexOf(item)
      if (!usedSnapshotIndexes.has(fallbackIndex)) snapshotIndex = fallbackIndex
    }

    const pricingLine = snapshotIndex >= 0 ? snapshotLines[snapshotIndex] : undefined
    if (snapshotIndex >= 0) usedSnapshotIndexes.add(snapshotIndex)

    if (
      isSubtotalPercentage(item) &&
      (!pricingLine || typeof pricingLine.percentage !== "number" ||
        !Number.isFinite(pricingLine.percentage))
    ) {
      // Old, already-calculated quotes may not contain the percentage needed
      // to safely recalculate a subtotal fee after services are removed.
      throw new Error("QUOTE_SELECTION_RECALCULATION_REQUIRED")
    }

    return { item, pricingLine }
  })

  // Subtotal-based percentage charges must be recomputed from the selected
  // non-subtotal-percentage lines, not copied from the original full quote.
  const selectedBaseSubtotal = money(
    selectedEntries
      .filter(({ item }) => String(item.calculationType) !== String(RateCalculationType.PERCENTAGE))
      .reduce((sum, { item }) => sum + numeric(item.lineTotal), 0),
  )

  const selectedQuoteItems = selectedEntries.map(({ item, pricingLine }) => {
    let rateApplied = numeric(item.rateApplied)
    let lineTotal = numeric(item.lineTotal)

    if (isSubtotalPercentage(item)) {
      const recalculatedAmount = money(
        (selectedBaseSubtotal * numeric(pricingLine?.percentage)) / 100,
      )
      // Existing QuoteItem.rateApplied stores the calculated amount for
      // percentage charges, so preserve that convention in the submission.
      rateApplied = recalculatedAmount
      lineTotal = recalculatedAmount
    }

    return {
      id: item.id as string,
      componentName: item.componentName as string,
      componentCode: (item.componentCode ?? null) as string | null,
      quantity: numeric(item.quantity, 1),
      rateApplied,
      lineTotal,
    }
  })

  const subtotal = money(
    selectedQuoteItems.reduce((sum, item) => sum + item.lineTotal, 0),
  )
  const originalSubtotal = numeric(snapshot.subtotal, numeric(quote.subtotal))
  const originalTax = numeric(
    snapshot.taxAmount,
    numeric(snapshot.totalAmount, numeric(quote.totalAmount)) - originalSubtotal,
  )
  const vatEnabled =
    typeof snapshot.vatEnabled === "boolean"
      ? snapshot.vatEnabled
      : originalTax > 0
  const vatPercentage =
    typeof snapshot.vatPercentage === "number" &&
    Number.isFinite(snapshot.vatPercentage)
      ? snapshot.vatPercentage
      : originalSubtotal > 0
        ? (originalTax / originalSubtotal) * 100
        : 0

  // The calculator's saved rule is VAT on the full applicable subtotal.
  // Never accept prices or totals from the browser as authoritative.
  const taxAmount = vatEnabled
    ? money((subtotal * vatPercentage) / 100)
    : 0
  const totalAmount = money(subtotal + taxAmount)

  const submission = await repository.createSubmission({
    quoteId: quote.id,
    exporterId,
    customerName: input.customerName ?? undefined,
    email: input.email ?? undefined,
    phone: input.phone ?? undefined,
    customerMessage: customerMessage || undefined,
    selectedQuoteItemIds: requestedIds,
    selectedQuoteItems,
    currency: quote.currency,
    subtotal,
    taxAmount,
    totalAmount,
    customsChargeRequested,
    invoiceValue,
    invoiceCurrency,
    transportChargeRequested,
    vatEnabled,
    vatPercentage,
  })

  emitToQuotationReviewers("quotation:submitted", {
    submissionId: submission.id,
    quoteId: submission.quoteId,
    status: submission.status,
    submittedAt: submission.submittedAt,
    customsChargeRequested,
    invoiceValue: customsChargeRequested ? invoiceValue : undefined,
    invoiceCurrency: customsChargeRequested ? invoiceCurrency : undefined,
    transportChargeRequested,
  })

  return submission
}

  async updateSubmissionCharges(data: {
    submissionId: string;
    adminId: string;
    customsChargeAmount?: number | null;
    transportChargeAmount?: number | null;
  }) {
    const submission = await repository.updateSubmissionCharges(data)
    emitToQuotationReviewers("quotation:charges-updated", {
      submissionId: submission.id,
      quoteId: submission.quoteId,
      status: submission.status,
      updatedAt: submission.updatedAt,
    })
    return submission
  }

  async listExporterSubmissions(exporterId: string) {
  return repository.listExporterSubmissions(exporterId);
}



  async getExporterSubmission(
    submissionId: string,
    exporterId: string,
  ) {
    return repository.findExporterSubmission(
      submissionId,
      exporterId,
    );
  }

  // Admin: list quotation submissions.
  async listAdminSubmissions(status?: string) {
    return listAdminSubmissions(status);
  }

  // Admin: change a submission's status.
  async updateSubmissionStatus(data: {
    submissionId: string;
    status: any;
    adminId: string;
    note?: string;
  }) {
    return updateSubmissionStatus(data);
  }

  // Admin: send a message to an exporter.
  async addSubmissionMessage(data: {
    submissionId: string;
    adminId: string;
    message: string;
  }) {
    return addSubmissionMessage(data);
  }

  // Exporter: send a message about a submission.
  async addExporterSubmissionMessage(data: {
    submissionId: string;
    exporterId: string;
    message: string;
  }) {
    return addExporterSubmissionMessage(data);
  }

}

export async function listAdminSubmissions(status?: string) {
  const allowedStatuses = [
    "PENDING_REVIEW",
    "CHANGES_REQUESTED",
    "APPROVED",
    "REJECTED",
    "IN_PROGRESS",
    "COMPLETED",
    "ARCHIVED",
  ] as const;

  if (
    status &&
    !allowedStatuses.includes(
      status as (typeof allowedStatuses)[number],
    )
  ) {
    throw new Error("INVALID_SUBMISSION_STATUS");
  }

  return prisma.quoteSubmission.findMany({
    where: status
      ? { status: status as (typeof allowedStatuses)[number] }
      : undefined,

    orderBy: {
      submittedAt: "desc",
    },

    include: {
      // Exporter/customer information
      exporter: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },

      // Original quotation and shipment information
      quote: {
        select: {
          id: true,
          quoteNumber: true,
          goodsDescription: true,
          hsCode: true,
          weightKg: true,
          quantity: true,
          customsValue: true,
          freightAmount: true,
          currency: true,
          requiresReview: true,
          inputSnapshot: true,
          pricingSnapshot: true,

          rateCard: {
            select: {
              id: true,
              name: true,
              mode: true,
              direction: true,

              // Historical configuration and option details
              configurations: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                  routeLabel: true,
                  routeCode: true,
                  equipmentType: true,

                  options: {
                    select: {
                      id: true,
                      name: true,
                      code: true,
                    },
                  },
                },
              },
            },
          },
        },
      },

      // Service/pricing breakdown
      items: {
        select: {
          id: true,
          componentName: true,
          componentCode: true,
          quantity: true,
          rateApplied: true,
          lineTotal: true,
          isSelected: true,
        },
      },

      // Conversation history
      messages: {
        orderBy: {
          createdAt: "asc",
        },

        select: {
          id: true,
          senderType: true,
          message: true,
          createdAt: true,

          attachments: {
            select: {
              id: true,
              fileName: true,
              originalName: true,
              fileUrl: true,
              mimeType: true,
              fileSize: true,
              remarks: true,
              uploadedByType: true,
              createdAt: true,
            },
          },
        },
      },

      // Files attached directly to the submission
      attachments: {
        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          fileName: true,
          originalName: true,
          fileUrl: true,
          mimeType: true,
          fileSize: true,
          remarks: true,
          uploadedByType: true,
          createdAt: true,
        },
      },
    },
  });
}


export async function updateSubmissionStatus(data: {
  submissionId: string;
  status: any;
  adminId: string;
  note?: string;
}) {
  return repository.updateSubmissionStatus(data);
}


export async function addSubmissionMessage(data: {
  submissionId: string;
  adminId: string;
  message: string;
}) {
  const message = await repository.addSubmissionMessage(data);

  emitToQuotationReviewers("quotation:message", {
    submissionId: data.submissionId,
    messageId: message.id,
    senderType: "ADMIN",
    message: message.message,
    createdAt: message.createdAt,
  });

  return message;
}

export async function addExporterSubmissionMessage(data: {
  submissionId: string;
  exporterId: string;
  message: string;
}) {
  const message = await repository.addExporterSubmissionMessage(data);

  emitToQuotationReviewers("quotation:message", {
    submissionId: data.submissionId,
    messageId: message.id,
    senderType: "EXPORTER",
    message: message.message,
    createdAt: message.createdAt,
  });

  return message;
}




