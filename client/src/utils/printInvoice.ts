import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { Invoice } from "../types/invoice";

export function printInvoice(invoice: Invoice) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // =========================================================
  // COLORS
  // =========================================================

  const NAVY: [number, number, number] = [15, 39, 64];
  const DARK: [number, number, number] = [31, 41, 55];
  const GREEN: [number, number, number] = [5, 150, 105];
  const LIGHT_GREEN: [number, number, number] = [236, 253, 245];
  const LIGHT_GRAY: [number, number, number] = [248, 250, 252];
  const BORDER: [number, number, number] = [226, 232, 240];
  const MUTED: [number, number, number] = [100, 116, 139];
  const WHITE: [number, number, number] = [255, 255, 255];

  // =========================================================
  // PAGE SETTINGS
  // =========================================================

  const PAGE_WIDTH = 210;
  const PAGE_HEIGHT = 297;
  const MARGIN = 15;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

  // =========================================================
  // HELPERS
  // =========================================================

  const currency = invoice.currency || "NGN";

  const formatMoney = (
    value: number | string | null | undefined
  ) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(value) || 0);
    } catch {
      return `${currency} ${(Number(value) || 0).toFixed(2)}`;
    }
  };

  /**
   * Formats invoice dates without timezone shifting.
   *
   * For values such as:
   * 2026-09-21
   * 2026-09-21T00:00:00.000Z
   *
   * we use the actual date portion rather than allowing
   * the browser timezone to change the displayed day.
   */
  const formatDate = (
    value: string | Date | null | undefined
  ) => {
    if (!value) {
      return "-";
    }

    let year: string;
    let month: string;
    let day: string;

    if (typeof value === "string") {
      const match = value.match(
        /^(\d{4})-(\d{2})-(\d{2})/
      );

      if (match) {
        [, year, month, day] = match;
      } else {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
          return "-";
        }

        year = String(date.getFullYear());
        month = String(date.getMonth() + 1).padStart(2, "0");
        day = String(date.getDate()).padStart(2, "0");
      }
    } else {
      if (Number.isNaN(value.getTime())) {
        return "-";
      }

      year = String(value.getFullYear());
      month = String(value.getMonth() + 1).padStart(2, "0");
      day = String(value.getDate()).padStart(2, "0");
    }

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthIndex = Number(month) - 1;

    if (
      !year ||
      !month ||
      !day ||
      monthIndex < 0 ||
      monthIndex > 11
    ) {
      return "-";
    }

    return `${day} ${monthNames[monthIndex]} ${year}`;
  };

  const drawSectionTitle = (
    title: string,
    x: number,
    y: number,
    width = CONTENT_WIDTH
  ) => {
    doc.setFillColor(...NAVY);

    doc.roundedRect(
      x,
      y,
      width,
      8,
      1.5,
      1.5,
      "F"
    );

    doc.setTextColor(...WHITE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    doc.text(
      title.toUpperCase(),
      x + 4,
      y + 5.3
    );

    doc.setTextColor(...DARK);
  };

  const drawLabelValue = (
    label: string,
    value: string,
    x: number,
    y: number,
    width = 55
  ) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);

    doc.text(label, x, y);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...DARK);

    const wrapped = doc.splitTextToSize(
      value || "-",
      width
    );

    doc.text(
      wrapped,
      x,
      y + 4.5
    );
  };

  // =========================================================
  // HEADER
  // =========================================================

  doc.setFillColor(...NAVY);
  doc.rect(
    0,
    0,
    PAGE_WIDTH,
    42,
    "F"
  );

  // Brand
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);

  doc.text(
    "ogwKayImpex",
    MARGIN,
    17
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);

  doc.setTextColor(
    220,
    230,
    240
  );

  doc.text(
    "EXPORT & IMPORT MANAGEMENT",
    MARGIN,
    23
  );

  // Invoice title
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);

  doc.text(
    "COMMERCIAL INVOICE",
    PAGE_WIDTH - MARGIN,
    16,
    {
      align: "right",
    }
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.setTextColor(
    220,
    230,
    240
  );

  doc.text(
    "Official Commercial Document",
    PAGE_WIDTH - MARGIN,
    22,
    {
      align: "right",
    }
  );

  // =========================================================
  // INVOICE NUMBER / STATUS
  // =========================================================

  const status = invoice.status;

  const statusConfig = {
    PAID: {
      background: [
        220,
        252,
        231,
      ] as [number, number, number],

      text: [
        22,
        101,
        52,
      ] as [number, number, number],
    },

    UNPAID: {
      background: [
        254,
        242,
        242,
      ] as [number, number, number],

      text: [
        180,
        83,
        9,
      ] as [number, number, number],
    },

    PARTIALLY_PAID: {
      background: [
        254,
        249,
        195,
      ] as [number, number, number],

      text: [
        133,
        77,
        14,
      ] as [number, number, number],
    },

    CANCELLED: {
      background: [
        241,
        245,
        249,
      ] as [number, number, number],

      text: [
        71,
        85,
        105,
      ] as [number, number, number],
    },
  } as const;

  const currentStatus =
    statusConfig[
      status as keyof typeof statusConfig
    ] ?? {
      background: LIGHT_GRAY,
      text: MUTED,
    };

  doc.setFillColor(...LIGHT_GREEN);

  doc.roundedRect(
    MARGIN,
    48,
    180,
    17,
    2,
    2,
    "F"
  );

  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);

  doc.text(
    "INVOICE NUMBER",
    MARGIN + 5,
    54
  );

  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);

  doc.text(
    invoice.invoiceNumber ?? "-",
    MARGIN + 5,
    60
  );

  // Status badge
  doc.setFillColor(
    ...currentStatus.background
  );

  doc.roundedRect(
    PAGE_WIDTH - MARGIN - 27,
    52,
    22,
    8,
    4,
    4,
    "F"
  );

  doc.setTextColor(
    ...currentStatus.text
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);

  doc.text(
    status ?? "-",
    PAGE_WIDTH - MARGIN - 16,
    57.3,
    {
      align: "center",
    }
  );

  // =========================================================
  // INVOICE INFORMATION
  // =========================================================

  drawSectionTitle(
    "Invoice Information",
    MARGIN,
    72
  );

  const infoY = 86;

  drawLabelValue(
    "Invoice Date",
    formatDate(invoice.invoiceDate),
    MARGIN,
    infoY
  );

  drawLabelValue(
    "Currency",
    currency,
    MARGIN + 58,
    infoY
  );

  drawLabelValue(
    "Payment Terms",
    invoice.paymentTerms ?? "-",
    MARGIN + 116,
    infoY
  );

  drawLabelValue(
    "External Invoice No.",
    invoice.externalInvoiceNumber ?? "-",
    MARGIN,
    infoY + 17
  );

  drawLabelValue(
    "Exchange Rate",
    String(invoice.exchangeRate ?? "-"),
    MARGIN + 58,
    infoY + 17
  );

  drawLabelValue(
    "Commercial Reference",
    invoice.commercialReference ?? "-",
    MARGIN + 116,
    infoY + 17
  );

  // =========================================================
  // SHIPMENT INFORMATION
  // =========================================================

  drawSectionTitle(
    "Shipment Information",
    MARGIN,
    126
  );

  const shipmentY = 140;

  drawLabelValue(
    "Shipment Number",
    invoice.shipment?.shipmentNumber ?? "-",
    MARGIN,
    shipmentY
  );

  drawLabelValue(
    "Booking Number",
    invoice.shipment?.bookingNumber ?? "-",
    MARGIN + 58,
    shipmentY
  );

  drawLabelValue(
    "Incoterm",
    invoice.incoterm ?? "-",
    MARGIN + 116,
    shipmentY
  );

  drawLabelValue(
    "Shipping Line",
    invoice.shipment?.shippingLine ?? "-",
    MARGIN,
    shipmentY + 17
  );

  drawLabelValue(
    "Vessel",
    invoice.shipment?.vesselName ?? "-",
    MARGIN + 58,
    shipmentY + 17
  );

  drawLabelValue(
    "Voyage",
    invoice.shipment?.voyageNumber ?? "-",
    MARGIN + 116,
    shipmentY + 17
  );

  drawLabelValue(
    "Port of Loading",
    invoice.shipment?.portOfLoading ?? "-",
    MARGIN,
    shipmentY + 34,
    75
  );

  drawLabelValue(
    "Port of Discharge",
    invoice.shipment?.portOfDischarge ?? "-",
    MARGIN + 116,
    shipmentY + 34,
    60
  );

  // =========================================================
  // PARTIES
  // =========================================================

  drawSectionTitle(
    "Parties",
    MARGIN,
    194
  );

  const partyY = 207;
  const boxWidth = 57;
  const boxGap = 4;

  const partyBoxes = [
    {
      x: MARGIN,
      title: "BILL TO",
      value:
        invoice.shipment?.client?.companyName ??
        "-",
    },

    {
      x: MARGIN + boxWidth + boxGap,
      title: "EXPORTER",
      value:
        invoice.shipment?.exporter?.name ??
        "-",
    },

    {
      x:
        MARGIN +
        (boxWidth + boxGap) * 2,
      title: "CONSIGNEE",
      value:
        invoice.shipment?.consignee?.name ??
        "-",
    },
  ];

  partyBoxes.forEach((box) => {
    doc.setFillColor(...LIGHT_GRAY);
    doc.setDrawColor(...BORDER);

    doc.roundedRect(
      box.x,
      partyY,
      boxWidth,
      30,
      2,
      2,
      "FD"
    );

    doc.setTextColor(...GREEN);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);

    doc.text(
      box.title,
      box.x + 4,
      partyY + 7
    );

    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);

    const wrapped = doc.splitTextToSize(
      box.value,
      boxWidth - 8
    );

    doc.text(
      wrapped,
      box.x + 4,
      partyY + 14
    );
  });

  // =========================================================
  // ITEMS
  // =========================================================

  const itemsStartY = 246;

  drawSectionTitle(
    "Invoice Items",
    MARGIN,
    itemsStartY
  );

  autoTable(doc, {
    startY: itemsStartY + 11,

    margin: {
      left: MARGIN,
      right: MARGIN,
    },

    head: [
      [
        "Description",
        "HS Code",
        "Package",
        "Qty",
        "Unit",
        "Unit Price",
        "Total",
      ],
    ],

    body: (invoice.items ?? []).map(
      (item) => [
        item.description ?? "-",
        item.hsCode ?? "-",
        item.packageType ?? "-",
        String(Number(item.quantity) || 0),
        item.unit ?? "-",
        formatMoney(item.unitPrice),
        formatMoney(item.total),
      ]
    ),

    theme: "grid",

    styles: {
      font: "helvetica",
      fontSize: 7.5,
      cellPadding: 3,
      textColor: DARK,
      lineColor: BORDER,
      lineWidth: 0.2,
      valign: "middle",
    },

    headStyles: {
      fillColor: NAVY,
      textColor: WHITE,
      fontStyle: "bold",
      fontSize: 7.5,
      halign: "center",
      valign: "middle",
    },

    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },

    columnStyles: {
      0: {
        cellWidth: 45,
        halign: "left",
      },

      1: {
        cellWidth: 21,
        halign: "center",
      },

      2: {
        cellWidth: 25,
        halign: "center",
      },

      3: {
        cellWidth: 14,
        halign: "center",
      },

      4: {
        cellWidth: 17,
        halign: "center",
      },

      5: {
        cellWidth: 28,
        halign: "right",
      },

      6: {
        cellWidth: 30,
        halign: "right",
      },
    },

    didParseCell: (data) => {
      if (
        data.section === "body" &&
        data.column.index === 6
      ) {
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  const lastAutoTable = (
    doc as jsPDF & {
      lastAutoTable?: {
        finalY: number;
      };
    }
  ).lastAutoTable;

  let finalY =
    lastAutoTable?.finalY ?? 260;

  // =========================================================
  // FINANCIAL SUMMARY
  // =========================================================

  if (finalY > 235) {
    doc.addPage();
    finalY = 20;
  }

  const summaryTop = finalY + 10;

  drawSectionTitle(
    "Financial Summary",
    112,
    summaryTop,
    83
  );

  // Summary background
  doc.setFillColor(...LIGHT_GRAY);
  doc.setDrawColor(...BORDER);

  doc.roundedRect(
    112,
    summaryTop + 10,
    83,
    43,
    2,
    2,
    "FD"
  );

  // Subtotal
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);

  doc.text(
    "Subtotal",
    117,
    summaryTop + 20
  );

  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");

  doc.text(
    formatMoney(invoice.subtotal),
    190,
    summaryTop + 20,
    {
      align: "right",
    }
  );

  // Freight
  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "normal");

  doc.text(
    "Freight",
    117,
    summaryTop + 30
  );

  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");

  doc.text(
    formatMoney(invoice.freight),
    190,
    summaryTop + 30,
    {
      align: "right",
    }
  );

  // Divider
  doc.setDrawColor(...BORDER);

  doc.line(
    117,
    summaryTop + 34,
    190,
    summaryTop + 34
  );

  // Grand Total
  doc.setFillColor(...NAVY);

  doc.roundedRect(
    115,
    summaryTop + 38,
    77,
    11,
    2,
    2,
    "F"
  );

  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  doc.text(
    "GRAND TOTAL",
    119,
    summaryTop + 45
  );

  doc.text(
    formatMoney(invoice.totalAmount),
    189,
    summaryTop + 45,
    {
      align: "right",
    }
  );

  // =========================================================
  // COMMERCIAL INFORMATION
  // =========================================================

  const commercialTop =
    summaryTop + 63;

  if (commercialTop > 255) {
    doc.addPage();
  }

  const actualCommercialTop =
    commercialTop > 255
      ? 20
      : commercialTop;

  drawSectionTitle(
    "Commercial Information",
    MARGIN,
    actualCommercialTop,
    85
  );

  drawLabelValue(
    "Payment Terms",
    invoice.paymentTerms ?? "-",
    MARGIN,
    actualCommercialTop + 17
  );

  drawLabelValue(
    "Incoterm",
    invoice.incoterm ?? "-",
    MARGIN + 58,
    actualCommercialTop + 17
  );

  drawLabelValue(
    "Commercial Reference",
    invoice.commercialReference ?? "-",
    MARGIN + 116,
    actualCommercialTop + 17
  );

  // =========================================================
  // REMARKS
  // =========================================================

  const remarksTop =
    actualCommercialTop + 34;

  drawSectionTitle(
    "Remarks",
    MARGIN,
    remarksTop,
    CONTENT_WIDTH
  );

  const remarks =
    invoice.remarks?.trim() ||
    "No remarks provided.";

  const wrappedRemarks =
    doc.splitTextToSize(
      remarks,
      CONTENT_WIDTH - 10
    );

  const remarksHeight =
    Math.max(
      25,
      Math.min(
        45,
        wrappedRemarks.length * 4.5 + 10
      )
    );

  doc.setFillColor(...LIGHT_GRAY);
  doc.setDrawColor(...BORDER);

  doc.roundedRect(
    MARGIN,
    remarksTop + 10,
    CONTENT_WIDTH,
    remarksHeight,
    2,
    2,
    "FD"
  );

  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text(
    wrappedRemarks,
    MARGIN + 5,
    remarksTop + 18
  );

  // =========================================================
  // SIGNATURE
  // =========================================================

  const signatureY =
    remarksTop +
    remarksHeight +
    25;

  if (signatureY > 270) {
    doc.addPage();
  }

  const actualSignatureY =
    signatureY > 270
      ? 35
      : signatureY;

  doc.setDrawColor(...BORDER);

  doc.line(
    135,
    actualSignatureY,
    190,
    actualSignatureY
  );

  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);

  doc.text(
    "Authorized Signature",
    162.5,
    actualSignatureY + 6,
    {
      align: "center",
    }
  );

  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);

  doc.text(
    "For ogwKayImpex",
    162.5,
    actualSignatureY + 11,
    {
      align: "center",
    }
  );

  // =========================================================
  // FOOTER ON EVERY PAGE
  // =========================================================

  const pageCount =
    doc.getNumberOfPages();

  for (
    let page = 1;
    page <= pageCount;
    page++
  ) {
    doc.setPage(page);

    // Footer divider
    doc.setDrawColor(...BORDER);

    doc.line(
      MARGIN,
      PAGE_HEIGHT - 17,
      PAGE_WIDTH - MARGIN,
      PAGE_HEIGHT - 17
    );

    // Brand
    doc.setTextColor(...NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);

    doc.text(
      "ogwKayImpex",
      MARGIN,
      PAGE_HEIGHT - 10
    );

    // Document
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "normal");

    doc.text(
      "Commercial Invoice",
      PAGE_WIDTH / 2,
      PAGE_HEIGHT - 10,
      {
        align: "center",
      }
    );

    // Page number
    doc.text(
      `Page ${page} of ${pageCount}`,
      PAGE_WIDTH - MARGIN,
      PAGE_HEIGHT - 10,
      {
        align: "right",
      }
    );
  }

  // =========================================================
  // SAVE PDF
  // =========================================================

  const fileName =
    `${invoice.invoiceNumber ?? "invoice"}.pdf`;

  doc.save(fileName);
}