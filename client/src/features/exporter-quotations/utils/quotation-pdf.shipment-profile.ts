import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { ExporterSubmission, ExporterQuoteItem } from "../api/exporter-quotations.api";

/**
 * Edit the document identity in one place. Add verified business contact details
 * here when they are available; the PDF intentionally does not invent them.
 */
export const EXPORTER_QUOTATION_PDF_BRANDING = {
  companyName: "OGW KAY IMPEX",
  tagline: "EXPORT & IMPORT MANAGEMENT",
  website: "ogwkayimpex.com",
};

type PdfRow = {
  item: ExporterQuoteItem;
  type: string;
  amount: number;
  isReduction: boolean;
};

const NAVY: [number, number, number] = [15, 39, 64];
const GREEN: [number, number, number] = [4, 120, 87];
const MUTED: [number, number, number] = [100, 116, 139];
const BORDER: [number, number, number] = [219, 227, 232];
const ROSE: [number, number, number] = [190, 24, 93];
const PAGE_WIDTH = 210;
const LEFT = 14;
const RIGHT = 14;
const CONTENT_WIDTH = PAGE_WIDTH - LEFT - RIGHT;

function numeric(value: unknown): number {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

function formatMoney(value: number, currency: string): string {
  const code = currency === "CFA" ? "XOF" : currency || "NGN";
  return `${code} ${formatNumber(value)}`;
}

function formatDate(value?: string | Date | null): string {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function humanize(value?: string | null): string {
  if (!value) return "Pending review";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function itemTypeLabel(item: ExporterQuoteItem): string {
  switch (String(item.itemType ?? "SERVICE").toUpperCase()) {
    case "CUSTOMS_CHARGE":
      return "Customs charge";
    case "TRANSPORT_CHARGE":
      return "Transportation";
    case "OTHER_CHARGE":
      return "Additional charge";
    case "SUBTRACTION":
      return "Bonus / reduction";
    default:
      return "Requested service";
  }
}

function getOriginalEstimate(submission: ExporterSubmission) {
  const selectedServices = (submission.items ?? []).filter((item) =>
    String(item.itemType ?? "SERVICE").toUpperCase() === "SERVICE" && item.isSelected,
  );
  if (selectedServices.length === 0) return null;

  const originalSubtotal = Math.round(
    selectedServices.reduce((sum, item) => sum + numeric(item.lineTotal), 0) * 100,
  ) / 100;
  const currentSubtotal = numeric(submission.subtotal);
  const currentTax = numeric(submission.taxAmount);
  const explicitVatEnabled = submission.vatEnabled;
  const vatEnabled = typeof explicitVatEnabled === "boolean"
    ? explicitVatEnabled
    : currentTax > 0;

  if (!vatEnabled) {
    return { subtotal: originalSubtotal, tax: 0, total: originalSubtotal };
  }

  const configuredRate = Number(submission.vatPercentage);
  const derivedRate = currentSubtotal > 0 ? (currentTax / currentSubtotal) * 100 : 0;
  const vatRate = Number.isFinite(configuredRate) && configuredRate > 0
    ? configuredRate
    : derivedRate;

  // Do not manufacture a comparison total when the source does not provide a
  // VAT rate and VAT is enabled. In that case the current totals remain valid.
  if (!Number.isFinite(vatRate) || vatRate <= 0) return null;

  const originalTax = Math.round((originalSubtotal * vatRate / 100 + Number.EPSILON) * 100) / 100;
  return {
    subtotal: originalSubtotal,
    tax: originalTax,
    total: Math.round((originalSubtotal + originalTax + Number.EPSILON) * 100) / 100,
  };
}

function getPdfRows(submission: ExporterSubmission): PdfRow[] {
  return (submission.items ?? [])
    .filter((item) => {
      const type = String(item.itemType ?? "SERVICE").toUpperCase();
      // Retain only selected original services, but always include priced
      // additional lines and reductions. Unpriced requests are not line items.
      return type === "SERVICE" ? item.isSelected : true;
    })
    .map((item) => {
      const type = String(item.itemType ?? "SERVICE").toUpperCase();
      const rawAmount = numeric(item.lineTotal);
      const amount = type === "SUBTRACTION" ? -Math.abs(rawAmount) : rawAmount;
      return {
        item,
        type: itemTypeLabel(item),
        amount,
        isReduction: type === "SUBTRACTION" || amount < 0,
      };
    });
}

type ShipmentSummaryField = {
  label: string;
  value: string;
  note: string;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function textValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function titleCase(value: string | undefined): string {
  if (!value) return "Not specified";
  return value
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getShipmentSummary(submission: ExporterSubmission): ShipmentSummaryField[] {
  const quote = submission.quote;
  const rateCard = quote?.rateCard;
  const inputSnapshot = asRecord(quote?.inputSnapshot);
  const configurationId = textValue(inputSnapshot.configurationId);
  const configurations = rateCard?.configurations ?? [];
  const configuration = configurationId
    ? configurations.find((entry) => entry.id === configurationId)
    : configurations.length === 1
      ? configurations[0]
      : undefined;

  const selectedOptionIds = Array.isArray(inputSnapshot.optionIds)
    ? inputSnapshot.optionIds.filter((value): value is string => typeof value === "string")
    : [];
  const selectedOptions = (configuration?.options ?? [])
    .filter((option) => selectedOptionIds.includes(option.id))
    .map((option) => option.name)
    .filter(Boolean);

  const rawMode = textValue(rateCard?.mode);
  const mode = titleCase(rawMode);
  const shipmentOption = selectedOptions.length
    ? selectedOptions.join(", ")
    : textValue(configuration?.name)
      || textValue(configuration?.routeLabel)
      || textValue(configuration?.equipmentType)
      || textValue(rateCard?.name)
      || "Not specified";
  const route = textValue(configuration?.routeLabel)
    || textValue(configuration?.routeCode)
    || textValue(inputSnapshot.routeLabel)
    || textValue(inputSnapshot.route)
    || "Not specified";
  const equipment = textValue(configuration?.equipmentType)
    || textValue(inputSnapshot.equipmentType)
    || "Not specified";
  const rateConfiguration = textValue(configuration?.name)
    || textValue(inputSnapshot.configurationName)
    || textValue(rateCard?.name)
    || "Not specified";
  const rateCardName = textValue(rateCard?.name) || "Not specified";
  const direction = titleCase(textValue(rateCard?.direction));

  return [
    { label: "TRANSPORT MODE", value: mode, note: "Air, land or sea freight" },
    { label: "SHIPMENT OPTION", value: shipmentOption, note: "Selected route, haul type or container option" },
    { label: "ROUTE / LANE", value: route, note: "Configured route for this rate card" },
    { label: "EQUIPMENT TYPE", value: equipment, note: "Container or handling equipment, where applicable" },
    { label: "RATE CONFIGURATION", value: rateConfiguration, note: `Rate card: ${rateCardName}` },
    { label: "SHIPMENT DIRECTION", value: direction, note: "Import or export" },
  ];
}

function drawShipmentSummary(doc: jsPDF, submission: ExporterSubmission, startY: number): number {
  const fields = getShipmentSummary(submission);
  const gapX = 2;
  const gapY = 1.8;
  const cellWidth = (CONTENT_WIDTH - gapX * 2) / 3;
  const cellHeight = 15.5;
  const gridY = startY + 4.2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...GREEN);
  doc.text("SHIPMENT PROFILE", LEFT, startY);

  fields.forEach((field, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const x = LEFT + column * (cellWidth + gapX);
    const y = gridY + row * (cellHeight + gapY);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, y, cellWidth, cellHeight, 1.4, 1.4, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.1);
    doc.setTextColor(...MUTED);
    doc.text(field.label, x + 3, y + 3.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.2);
    doc.setTextColor(...NAVY);
    const valueLines = doc.splitTextToSize(field.value, cellWidth - 6).slice(0, 2);
    doc.text(valueLines, x + 3, y + 7.4, { lineHeightFactor: 1.05 });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.0);
    doc.setTextColor(...MUTED);
    const noteLines = doc.splitTextToSize(field.note, cellWidth - 6).slice(0, 2);
    const noteY = y + (valueLines.length > 1 ? 12.2 : 11.1);
    doc.text(noteLines, x + 3, noteY, { lineHeightFactor: 1.0 });
  });

  return gridY + cellHeight * 2 + gapY;
}

function safeFilePart(value: string): string {
  return value
    .trim()
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "quotation";
}

function drawPageHeader(doc: jsPDF, submission: ExporterSubmission, compact = false) {
  const quoteNumber = submission.quote?.quoteNumber || "Quotation";
  if (compact) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...NAVY);
    doc.text(`${EXPORTER_QUOTATION_PDF_BRANDING.companyName}  |  ${quoteNumber}`, LEFT, 14);
    doc.setDrawColor(...GREEN);
    doc.setLineWidth(0.45);
    doc.line(LEFT, 18, PAGE_WIDTH - RIGHT, 18);
    return;
  }

  // Compact brand block: enough identity without wasting the first page.
  doc.setFillColor(...GREEN);
  doc.roundedRect(LEFT, 11, 12, 12, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("OGW", LEFT + 6, 18.4, { align: "center" });

  doc.setTextColor(...NAVY);
  doc.setFontSize(12.5);
  doc.text(EXPORTER_QUOTATION_PDF_BRANDING.companyName, LEFT + 17, 15.5);
  doc.setFontSize(6.5);
  doc.setTextColor(...GREEN);
  doc.text(EXPORTER_QUOTATION_PDF_BRANDING.tagline, LEFT + 17, 20);
  doc.setFontSize(6.5);
  doc.setTextColor(...MUTED);
  doc.text(EXPORTER_QUOTATION_PDF_BRANDING.website, LEFT + 17, 24);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...GREEN);
  doc.text("OFFICIAL QUOTATION", PAGE_WIDTH - RIGHT, 13, { align: "right" });
  doc.setFontSize(11);
  doc.setTextColor(...NAVY);
  doc.text(quoteNumber, PAGE_WIDTH - RIGHT, 19, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text(`Submitted ${formatDate(submission.submittedAt)}`, PAGE_WIDTH - RIGHT, 24, { align: "right" });

  doc.setDrawColor(...GREEN);
  doc.setLineWidth(0.7);
  doc.line(LEFT, 30, PAGE_WIDTH - RIGHT, 30);
}

function drawFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.25);
    doc.line(LEFT, 284, PAGE_WIDTH - RIGHT, 284);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED);
    doc.text(EXPORTER_QUOTATION_PDF_BRANDING.companyName, LEFT, 289);
    doc.text(`Page ${page} of ${pageCount}`, PAGE_WIDTH - RIGHT, 289, { align: "right" });
  }
}

/** Generate and immediately download a concise, itemised quotation PDF. */
export async function downloadExporterQuotationPdf(
  submission: ExporterSubmission,
): Promise<void> {
  if (!submission?.id || !submission.quote?.quoteNumber) {
    throw new Error("The quotation reference is not available. Refresh and try again.");
  }

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  const currency = submission.currency || "NGN";
  const quoteNumber = submission.quote.quoteNumber;
  const rows = getPdfRows(submission);

  drawPageHeader(doc, submission);

  // Compact customer metadata band, followed by the shipment profile.
  // The operations-request form remains excluded; the six shipment fields are
  // included without letting them compete with the itemised pricing table.
  const infoY = 35;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(LEFT, infoY, CONTENT_WIDTH, 17, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...MUTED);
  doc.text("PREPARED FOR", LEFT + 4, infoY + 5);
  doc.text("SUBMISSION DATE", LEFT + 88, infoY + 5);
  doc.text("STATUS", LEFT + 133, infoY + 5);

  doc.setFontSize(8.2);
  doc.setTextColor(...NAVY);
  const preparedFor = (submission.customerName || "Exporter").trim();
  doc.text(doc.splitTextToSize(preparedFor, 78), LEFT + 4, infoY + 11);
  doc.text(formatDate(submission.submittedAt), LEFT + 88, infoY + 11);
  doc.text(doc.splitTextToSize(humanize(submission.status), 43), LEFT + 133, infoY + 11);

  const shipmentEndY = drawShipmentSummary(doc, submission, 57);
  const tableTitleY = shipmentEndY + 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...NAVY);
  doc.text("Itemised quotation", LEFT, tableTitleY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text("Priced services, additional charges and applied reductions", LEFT, tableTitleY + 5);

  const tableBody = rows.length
    ? rows.map(({ item, type, amount }) => {
        const name = String(item.componentName || "Quotation item").trim();
        const reason = item.reason?.trim();
        const itemText = reason ? `${name}\nReason: ${reason}` : name;
        const itemType = String(item.itemType ?? "SERVICE").toUpperCase();
        return [
          "", // sequence number is set below for stable ordering
          itemText,
          type,
          item.componentCode || "-",
          itemType === "SUBTRACTION" ? "-" : String(item.quantity ?? "-"),
          itemType === "SUBTRACTION" ? "-" : formatMoney(numeric(item.rateApplied), currency),
          formatMoney(amount, currency),
        ];
      })
    : [["", "No priced quotation items are available.", "", "", "", "", ""]];

  tableBody.forEach((row, index) => {
    row[0] = rows.length ? String(index + 1) : "";
  });

  autoTable(doc, {
    startY: tableTitleY + 10,
    margin: { left: LEFT, right: RIGHT, top: 26, bottom: 22 },
    head: [["#", "ITEM / SERVICE", "TYPE", "CODE", "QTY", "UNIT RATE", "AMOUNT"]],
    body: tableBody,
    theme: "grid",
    showHead: "everyPage",
    styles: {
      font: "helvetica",
      fontSize: 7,
      cellPadding: { top: 2.5, right: 2, bottom: 2.5, left: 2 },
      lineColor: BORDER,
      lineWidth: 0.18,
      textColor: NAVY,
      valign: "middle",
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: NAVY,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 6.5,
      cellPadding: 2.5,
      lineColor: NAVY,
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 8, halign: "center" },
      1: { cellWidth: 47, fontStyle: "bold" },
      2: { cellWidth: 25 },
      3: { cellWidth: 20 },
      4: { cellWidth: 12, halign: "right" },
      5: { cellWidth: 32, halign: "right" },
      6: { cellWidth: 38, halign: "right", fontStyle: "bold" },
    },
    didParseCell: (hook) => {
      if (hook.section !== "body") return;
      const row = rows[hook.row.index];
      if (row?.isReduction && hook.column.index === 6) {
        hook.cell.styles.textColor = ROSE;
      }
      if (hook.column.index === 1 && row?.item.reason) {
        hook.cell.styles.fontSize = 6.8;
      }
    },
    didDrawPage: (hook) => {
      if (hook.pageNumber > 1) drawPageHeader(doc, submission, true);
    },
  });

  const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 82;
  const subtotal = numeric(submission.subtotal);
  const taxAmount = numeric(submission.taxAmount);
  const totalAmount = numeric(submission.totalAmount);
  const original = getOriginalEstimate(submission);
  const comparisonHeight = original ? 42 : 39;
  let summaryY = finalY + 8;
  if (summaryY + comparisonHeight + 17 > 278) {
    doc.addPage();
    drawPageHeader(doc, submission, true);
    summaryY = 29;
  }

  // A compact before/after panel preserves the price movement context without
  // adding the non-essential shipment-information or operations-request pages.
  if (original) {
    const gap = 5;
    const cardWidth = (CONTENT_WIDTH - gap) / 2;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(LEFT, summaryY, cardWidth, comparisonHeight, 2, 2, "FD");
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(LEFT + cardWidth + gap, summaryY, cardWidth, comparisonHeight, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED);
    doc.text("ORIGINAL ESTIMATE", LEFT + 4, summaryY + 6);
    doc.text("CURRENT QUOTATION", LEFT + cardWidth + gap + 4, summaryY + 6);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    doc.text(formatMoney(original.total, currency), LEFT + 4, summaryY + 14);
    doc.setTextColor(...GREEN);
    doc.text(formatMoney(totalAmount, currency), LEFT + cardWidth + gap + 4, summaryY + 14);

    const difference = Math.round((totalAmount - original.total + Number.EPSILON) * 100) / 100;
    const differenceLabel = Math.abs(difference) < 0.005
      ? "No change from original"
      : difference > 0 ? "Increase from original" : "Decrease from original";
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.7);
    doc.setTextColor(...MUTED);
    doc.text(`Selected services + original VAT`, LEFT + 4, summaryY + 20);
    doc.text("After priced additions and adjustments", LEFT + cardWidth + gap + 4, summaryY + 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(difference > 0 ? ROSE[0] : difference < 0 ? GREEN[0] : MUTED[0], difference > 0 ? ROSE[1] : difference < 0 ? GREEN[1] : MUTED[1], difference > 0 ? ROSE[2] : difference < 0 ? GREEN[2] : MUTED[2]);
    doc.text(differenceLabel, LEFT + 4, summaryY + 30);
    doc.text(formatMoney(Math.abs(difference), currency), LEFT + cardWidth - 4, summaryY + 30, { align: "right" });

    doc.setDrawColor(...BORDER);
    doc.line(LEFT + 4, summaryY + 34, LEFT + cardWidth - 4, summaryY + 34);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.3);
    doc.setTextColor(...MUTED);
    doc.text(`Original subtotal: ${formatMoney(original.subtotal, currency)}  |  VAT: ${formatMoney(original.tax, currency)}`, LEFT + 4, summaryY + 39);
  } else {
    // Fallback when original selected-service/VAT data is not available.
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(LEFT, summaryY, CONTENT_WIDTH, comparisonHeight, 2, 2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED);
    doc.text("CURRENT QUOTATION", LEFT + 4, summaryY + 7);
    doc.setFontSize(10.5);
    doc.setTextColor(...GREEN);
    doc.text(formatMoney(totalAmount, currency), PAGE_WIDTH - RIGHT - 4, summaryY + 14, { align: "right" });
  }

  // Itemised totals remain authoritative values returned by the backend.
  const breakdownY = summaryY + comparisonHeight + 5;
  const breakdownX = 112;
  const breakdownWidth = PAGE_WIDTH - RIGHT - breakdownX;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(breakdownX, breakdownY, breakdownWidth, 26, 2, 2, "FD");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text("Subtotal", breakdownX + 4, breakdownY + 7);
  doc.text(formatMoney(subtotal, currency), breakdownX + breakdownWidth - 4, breakdownY + 7, { align: "right" });
  doc.text("VAT / tax", breakdownX + 4, breakdownY + 13);
  doc.text(formatMoney(taxAmount, currency), breakdownX + breakdownWidth - 4, breakdownY + 13, { align: "right" });
  doc.setDrawColor(...BORDER);
  doc.line(breakdownX + 4, breakdownY + 16, breakdownX + breakdownWidth - 4, breakdownY + 16);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  doc.text("CURRENT TOTAL", breakdownX + 4, breakdownY + 22.5);
  doc.setFontSize(9);
  doc.setTextColor(...GREEN);
  doc.text(formatMoney(totalAmount, currency), breakdownX + breakdownWidth - 4, breakdownY + 22.5, { align: "right" });

  const noteY = breakdownY + 31;
  if (noteY < 278) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED);
    const note = "Only priced items shown in this document are included in the current quotation total. Any unpriced service request is excluded until operations confirms its price.";
    doc.text(doc.splitTextToSize(note, CONTENT_WIDTH), LEFT, noteY);
  }

  drawFooter(doc);
  doc.save(`${safeFilePart(quoteNumber)}-quotation.pdf`);
}
