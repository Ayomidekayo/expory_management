import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { Invoice } from "../types/invoice";

/*
=========================================================
PDF TYPES
=========================================================
*/

type InvoiceItemForPdf = {
  id?: string;
  itemDate?: string | Date | null;
  description?: string | null;
  hsCode?: string | null;
  packageType?: string | null;
  packages?: number | null;
  grossWeight?: number | string | null;
  netWeight?: number | string | null;
  quantity?: number | string | null;
  unit?: string | null;
  unitPrice?: number | string | null;
  total?: number | string | null;
 
};

type InvoicePaymentForPdf = {
  id: string;
  invoiceId?: string;
  invoiceItemId?: string | null;
  amount: number | string;
  description?: string | null;
  paymentDate?: string | Date | null;
  paymentMethod?: string | null;
  reference?: string | null;
  notes?: string | null;

  invoiceItem?: {
    id?: string;
    description?: string | null;
  } | null;
};

type InvoiceForPdf = Invoice & {
  items?: InvoiceItemForPdf[];

  payments?: InvoicePaymentForPdf[];

  otherCharges?: number | string | null;
  charges?: number | string | null;
};

/*
=========================================================
MAIN FUNCTION
=========================================================
*/

export function printInvoice(
  invoice: Invoice,
  invoicePayments?: InvoicePaymentForPdf[]
) {
  const data = invoice as InvoiceForPdf;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  /*
  =========================================================
  DESIGN
  =========================================================
  */

  const NAVY: [number, number, number] = [
    15,
    39,
    64,
  ];

  const DARK: [number, number, number] = [
    31,
    41,
    55,
  ];

  const GREEN: [number, number, number] = [
    5,
    150,
    105,
  ];

  const LIGHT_GREEN: [number, number, number] = [
    236,
    253,
    245,
  ];

  const LIGHT_GRAY: [number, number, number] = [
    248,
    250,
    252,
  ];

  const BORDER: [number, number, number] = [
    226,
    232,
    240,
  ];

  const MUTED: [number, number, number] = [
    100,
    116,
    139,
  ];

  const WHITE: [number, number, number] = [
    255,
    255,
    255,
  ];

  const RED: [number, number, number] = [
    185,
    28,
    28,
  ];

 

  const PAGE_WIDTH = 210;
  const PAGE_HEIGHT = 297;
  const MARGIN = 15;
  const CONTENT_WIDTH =
    PAGE_WIDTH - MARGIN * 2;

  const FOOTER_Y = PAGE_HEIGHT - 17;

  /*
  =========================================================
  DATA HELPERS
  =========================================================
  */

  const toNumber = (
    value:
      | number
      | string
      | null
      | undefined
  ): number => {
    const result = Number(value);

    return Number.isFinite(result)
      ? result
      : 0;
  };

  const formatNumber = (
    value:
      | number
      | string
      | null
      | undefined
  ) => {
    return toNumber(value).toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  const currency = String(
    data.currency || "NGN"
  ).toUpperCase();

  const currencyName = (() => {
    switch (currency) {
      case "USD":
        return "US Dollar";

      case "NGN":
        return "Nigerian Naira";

      case "XOF":
        return "West African CFA Franc";

      case "EUR":
        return "Euro";

      default:
        return currency;
    }
  })();

  /*
  =========================================================
  MONEY FORMAT
  =========================================================
  */

  const formatMoney = (
    value:
      | number
      | string
      | null
      | undefined
  ): string => {
    const amount = toNumber(value);

    try {
      if (currency === "XOF") {
        return new Intl.NumberFormat(
          "fr-FR",
          {
            style: "currency",
            currency: "XOF",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }
        ).format(amount);
      }

      return new Intl.NumberFormat(
        "en-US",
        {
          style: "currency",
          currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      ).format(amount);
    } catch {
      return `${currency} ${amount.toFixed(2)}`;
    }
  };

  /*
  =========================================================
  DATE FORMAT
  =========================================================
  */

  const formatDate = (
    value:
      | string
      | Date
      | null
      | undefined
  ): string => {
    if (!value) return "-";

    if (typeof value === "string") {
      const match = value.match(
        /^(\d{4})-(\d{2})-(\d{2})/
      );

      if (match) {
        const year = match[1];
        const month = Number(match[2]);
        const day = match[3];

        const months = [
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

        return `${day} ${
          months[month - 1] ?? ""
        } ${year}`;
      }
    }

    const date =
      value instanceof Date
        ? value
        : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return new Intl.DateTimeFormat(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(date);
  };

  /*
  =========================================================
  TIMESTAMP FORMAT
  =========================================================
  */

  const formatTimestamp = (
    value:
      | string
      | Date
      | null
      | undefined
  ): string => {
    if (!value) return "-";

    const date =
      value instanceof Date
        ? value
        : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return new Intl.DateTimeFormat(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(date);
  };

  /*
  =========================================================
  PAYMENT METHOD
  =========================================================
  */

  const formatPaymentMethod = (
    value?: string | null
  ) => {
    if (!value) return "—";

    return value
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(
        /\b\w/g,
        (char) => char.toUpperCase()
      );
  };

  /*
  =========================================================
  DATA
  =========================================================
  */

  const items =
    data.items ?? [];

  const payments =
    invoicePayments ?? data.payments ?? [];

  /*
  =========================================================
  PAYMENT CALCULATIONS
  =========================================================
  */

  const invoiceTotal = toNumber(
    data.totalAmount
  );

  const subtotal = toNumber(
    data.subtotal
  );

  const freight = toNumber(
    data.freight
  );

  const additionalCharges = toNumber(
    data.otherCharges ??
      data.charges
  );

  const totalPaid = payments.reduce(
    (sum, payment) =>
      sum + toNumber(payment.amount),
    0
  );

  const outstandingBalance = Math.max(
    invoiceTotal - totalPaid,
    0
  );

  /*
  =========================================================
  DERIVED PAYMENT STATUS
  =========================================================
  */

  const baseStatus = String(
    data.status || ""
  ).toUpperCase();

  let paymentStatus:
    | "PAID"
    | "PARTIALLY_PAID"
    | "UNPAID"
    | "CANCELLED";

  if (baseStatus === "CANCELLED") {
    paymentStatus = "CANCELLED";
  } else if (
    invoiceTotal > 0 &&
    outstandingBalance <= 0
  ) {
    paymentStatus = "PAID";
  } else if (totalPaid > 0) {
    paymentStatus =
      "PARTIALLY_PAID";
  } else {
    paymentStatus = "UNPAID";
  }

  /*
  =========================================================
  PAYMENT BY ITEM
  =========================================================
  */

  const getItemPaid = (
    itemId?: string
  ) => {
    if (!itemId) return 0;

    return payments
      .filter(
        (payment) =>
          payment.invoiceItemId ===
          itemId
      )
      .reduce(
        (sum, payment) =>
          sum + toNumber(payment.amount),
        0
      );
  };

  /*
  =========================================================
  DRAW SECTION TITLE
  =========================================================
  */

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

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(9);

    doc.text(
      title.toUpperCase(),
      x + 4,
      y + 5.3
    );
  };

  /*
  =========================================================
  DRAW LABEL / VALUE
  =========================================================
  */

  const drawLabelValue = (
    label: string,
    value: string,
    x: number,
    y: number,
    width = 55
  ) => {
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(9);

    doc.setTextColor(...MUTED);

    doc.text(
      label,
      x,
      y
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(9);

    doc.setTextColor(...DARK);

    const wrapped =
      doc.splitTextToSize(
        value || "-",
        width
      );

    doc.text(
      wrapped,
      x,
      y + 4.5
    );
  };

  /*
  =========================================================
  FOOTER
  =========================================================
  */

  const drawFooter = () => {
    doc.setDrawColor(...BORDER);

    doc.line(
      MARGIN,
      FOOTER_Y,
      PAGE_WIDTH - MARGIN,
      FOOTER_Y
    );

    doc.setTextColor(...NAVY);

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(9);

    doc.text(
      "ogwKayImpex",
      MARGIN,
      PAGE_HEIGHT - 10
    );

    doc.setTextColor(...MUTED);

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      "Commercial Invoice",
      PAGE_WIDTH / 2,
      PAGE_HEIGHT - 10,
      {
        align: "center",
      }
    );

    doc.text(
      `Page ${doc.getCurrentPageInfo().pageNumber}`,
      PAGE_WIDTH - MARGIN,
      PAGE_HEIGHT - 10,
      {
        align: "right",
      }
    );
  };

  /*
  =========================================================
  PAGE SPACE
  =========================================================
  */

  const ensureSpace = (
    requiredHeight: number,
    currentY: number
  ) => {
    if (
      currentY + requiredHeight >
      FOOTER_Y - 5
    ) {
      drawFooter();

      doc.addPage();

      return MARGIN;
    }

    return currentY;
  };

  /*
  =========================================================
  HEADER
  =========================================================
  */

  doc.setFillColor(...NAVY);

  doc.rect(
    0,
    0,
    PAGE_WIDTH,
    42,
    "F"
  );

  /*
  BRAND
  */

  doc.setTextColor(...WHITE);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(22);

  doc.text(
    "ogwKayImpex",
    MARGIN,
    17
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(10);

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

  /*
  TITLE
  */

  doc.setTextColor(...WHITE);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(17);

  doc.text(
    "COMMERCIAL INVOICE",
    PAGE_WIDTH - MARGIN,
    16,
    {
      align: "right",
    }
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(10);

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

  /*
  =========================================================
  INVOICE NUMBER + STATUS
  =========================================================
  */

  doc.setFillColor(
    ...LIGHT_GREEN
  );

  doc.roundedRect(
    MARGIN,
    48,
    CONTENT_WIDTH,
    17,
    2,
    2,
    "F"
  );

  doc.setTextColor(...MUTED);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(9);

  doc.text(
    "INVOICE NUMBER",
    MARGIN + 5,
    54
  );

  doc.setTextColor(...NAVY);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(12);

  doc.text(
    data.invoiceNumber ?? "-",
    MARGIN + 5,
    60
  );

  /*
  CURRENCY
  */

  doc.setFillColor(...WHITE);

  doc.setDrawColor(...BORDER);

  doc.roundedRect(
    PAGE_WIDTH - MARGIN - 67,
    52,
    34,
    8,
    4,
    4,
    "FD"
  );

  doc.setTextColor(...NAVY);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(9);

  doc.text(
    currency,
    PAGE_WIDTH - MARGIN - 50,
    57.3,
    {
      align: "center",
    }
  );

  /*
  STATUS COLORS
  */

  const statusConfig = {
    PAID: {
      background: [
        220,
        252,
        231,
      ] as [
        number,
        number,
        number
      ],
      text: [
        22,
        101,
        52,
      ] as [
        number,
        number,
        number
      ],
    },

    PARTIALLY_PAID: {
      background: [
        254,
        249,
        195,
      ] as [
        number,
        number,
        number
      ],
      text: [
        133,
        77,
        14,
      ] as [
        number,
        number,
        number
      ],
    },

    UNPAID: {
      background: [
        254,
        242,
        242,
      ] as [
        number,
        number,
        number
      ],
      text: [
        185,
        28,
        28,
      ] as [
        number,
        number,
        number
      ],
    },

    CANCELLED: {
      background: [
        241,
        245,
        249,
      ] as [
        number,
        number,
        number
      ],
      text: [
        71,
        85,
        105,
      ] as [
        number,
        number,
        number
      ],
    },
  };

  const statusStyle =
    statusConfig[paymentStatus];

  doc.setFillColor(
    ...statusStyle.background
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
    ...statusStyle.text
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(8);

  doc.text(
    paymentStatus.replaceAll(
      "_",
      " "
    ),
    PAGE_WIDTH - MARGIN - 16,
    57.3,
    {
      align: "center",
    }
  );

  /*
  =========================================================
  INVOICE INFORMATION
  =========================================================
  */

  drawSectionTitle(
    "Invoice Information",
    MARGIN,
    72
  );

  const infoY = 86;

  drawLabelValue(
    "Invoice Date",
    formatDate(
      data.invoiceDate
    ),
    MARGIN,
    infoY
  );

  drawLabelValue(
    "Currency",
    `${currency} — ${currencyName}`,
    MARGIN + 58,
    infoY,
    55
  );

  drawLabelValue(
    "Payment Terms",
    String(
      data.paymentTerms ?? "-"
    ),
    MARGIN + 116,
    infoY
  );

  drawLabelValue(
    "External Invoice No.",
    String(
      data.externalInvoiceNumber ??
        "-"
    ),
    MARGIN,
    infoY + 17
  );

  drawLabelValue(
    "Exchange Rate",
    String(
      data.exchangeRate ?? "-"
    ),
    MARGIN + 58,
    infoY + 17
  );

  drawLabelValue(
    "Commercial Reference",
    String(
      data.commercialReference ??
        "-"
    ),
    MARGIN + 116,
    infoY + 17
  );

  drawLabelValue(
    "Transport Units",
    String(
      data.transportUnits ?? "-"
    ),
    MARGIN,
    infoY + 34
  );

  drawLabelValue(
    "Created",
    formatTimestamp(
      data.createdAt
    ),
    MARGIN + 58,
    infoY + 34,
    55
  );

  drawLabelValue(
    "Updated",
    formatTimestamp(
      data.updatedAt
    ),
    MARGIN + 116,
    infoY + 34,
    55
  );

  /*
  =========================================================
  SHIPMENT INFORMATION
  =========================================================
  */

  drawSectionTitle(
    "Shipment Information",
    MARGIN,
    126
  );

  const shipmentY = 140;

  drawLabelValue(
    "Shipment Number",
    data.shipment
      ?.shipmentNumber ?? "-",
    MARGIN,
    shipmentY
  );

  drawLabelValue(
    "Booking Number",
    data.shipment
      ?.bookingNumber ?? "-",
    MARGIN + 58,
    shipmentY
  );

  drawLabelValue(
    "Incoterm",
    data.incoterm ?? "-",
    MARGIN + 116,
    shipmentY
  );

  drawLabelValue(
    "Shipping Line",
    data.shipment
      ?.shippingLine ?? "-",
    MARGIN,
    shipmentY + 17
  );

  drawLabelValue(
    "Vessel",
    data.shipment
      ?.vesselName ?? "-",
    MARGIN + 58,
    shipmentY + 17
  );

  drawLabelValue(
    "Voyage",
    data.shipment
      ?.voyageNumber ?? "-",
    MARGIN + 116,
    shipmentY + 17
  );

  drawLabelValue(
    "Port of Loading",
    data.shipment
      ?.portOfLoading ?? "-",
    MARGIN,
    shipmentY + 34,
    75
  );

  drawLabelValue(
    "Port of Discharge",
    data.shipment
      ?.portOfDischarge ?? "-",
    MARGIN + 116,
    shipmentY + 34,
    60
  );

  /*
  =========================================================
  PARTIES
  =========================================================
  */

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
        data.shipment?.client
          ?.companyName ?? "-",
    },

    {
      x:
        MARGIN +
        boxWidth +
        boxGap,
      title: "EXPORTER",
      value:
        data.shipment?.exporter
          ?.name ?? "-",
    },

    {
      x:
        MARGIN +
        (boxWidth +
          boxGap) *
          2,
      title: "CONSIGNEE",
      value:
        data.shipment?.consignee
          ?.name ?? "-",
    },
  ];

  partyBoxes.forEach(
    (box) => {
      doc.setFillColor(
        ...LIGHT_GRAY
      );

      doc.setDrawColor(
        ...BORDER
      );

      doc.roundedRect(
        box.x,
        partyY,
        boxWidth,
        25,
        2,
        2,
        "FD"
      );

      doc.setTextColor(
        ...MUTED
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(8);

      doc.text(
        box.title,
        box.x + 4,
        partyY + 6
      );

      doc.setTextColor(
        ...DARK
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(10);

      const wrapped =
        doc.splitTextToSize(
          box.value || "-",
          boxWidth - 8
        );

      doc.text(
        wrapped.slice(0, 3),
        box.x + 4,
        partyY + 12
      );
    }
  );

  /*
  =========================================================
  INVOICE ITEMS
  =========================================================
  */
// =========================================================
// INVOICE ITEMS
// =========================================================

let itemsY = ensureSpace(70, partyY + 25);

drawSectionTitle(
  "Invoice Items",
  MARGIN,
  itemsY
);

autoTable(doc, {
  startY: itemsY + 11,

  margin: {
    left: MARGIN,
    right: MARGIN,
    bottom: 25,
  },

  head: [
    [
      "#",
      "Item Date",
      "Description",
      "HS Code",
      "Package",
      "Qty",
      "Unit",
      "Unit Price",
      "Total",
    ],
  ],

  body: items.map((item, index) => [
    String(index + 1),

    // Item Date
    formatDate(item.itemDate),

    // Description
    item.description ?? "-",

    // HS Code
    item.hsCode ?? "-",

    // Package
    item.packageType ?? "-",

    // Quantity
    formatNumber(item.quantity),

    // Unit
    item.unit ?? "-",

    // Unit Price
    formatMoney(item.unitPrice),

    // Total
    formatMoney(item.total),
  ]),

  theme: "grid",

  styles: {
    font: "helvetica",

    // Increased data font size
    fontSize: 10,

    // Increased spacing for readability
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

    // Increased header font size
    fontSize: 10,

    halign: "center",
    valign: "middle",

    cellPadding: 3,
  },

  alternateRowStyles: {
    fillColor: LIGHT_GRAY,
  },

  columnStyles: {
    // #
    0: {
      cellWidth: 7,
      halign: "center",
    },

    // Item Date
    1: {
      cellWidth: 21,
      halign: "center",
    },

    // Description
    2: {
      cellWidth: 36,
      halign: "left",
    },

    // HS Code
    3: {
      cellWidth: 18,
      halign: "center",
    },

    // Package
    4: {
      cellWidth: 19,
      halign: "center",
    },

    // Qty
    5: {
      cellWidth: 15,
      halign: "center",
    },

    // Unit
    6: {
      cellWidth: 15,
      halign: "center",
    },

    // Unit Price
    7: {
      cellWidth: 24,
      halign: "right",
    },

    // Total
    8: {
      cellWidth: 25,
      halign: "right",
    },
  },

  didParseCell: (hookData) => {
    // Make Total column bold
    if (
      hookData.section === "body" &&
      hookData.column.index === 8
    ) {
      hookData.cell.styles.fontStyle = "bold";
    }

    // Make Item Date slightly stronger
    if (
      hookData.section === "body" &&
      hookData.column.index === 1
    ) {
      hookData.cell.styles.fontStyle = "bold";
    }
  },
});

  /*

  /*
  =========================================================
  FINANCIAL & PAYMENT SUMMARY
  =========================================================
  */



  // Position the financial summary AFTER the invoice items table.
  // Using the table's finalY prevents the summary card from overlapping
  // invoice rows when the item table becomes taller because of larger text.
  const invoiceItemsTableEndY =
    (
      doc as jsPDF & {
        lastAutoTable?: {
          finalY: number;
        };
      }
    ).lastAutoTable?.finalY ?? itemsY + 20;

  itemsY = ensureSpace(
    82,
    invoiceItemsTableEndY + 8
  );

  drawSectionTitle(
    "Financial & Payment Summary",
    MARGIN,
    itemsY
  );

  const summaryTop =
    itemsY + 12;

  /*
  LEFT PAYMENT POSITION CARD
  */

  const leftX = MARGIN;
  const cardGap = 5;
  const leftWidth = 100;
  const rightWidth =
    CONTENT_WIDTH -
    leftWidth -
    cardGap;

  doc.setFillColor(
    ...LIGHT_GREEN
  );

  doc.setDrawColor(
    ...BORDER
  );

  doc.roundedRect(
    leftX,
    summaryTop,
    leftWidth,
    65,
    2,
    2,
    "FD"
  );

  /*
  PAYMENT POSITION TITLE
  */

  doc.setTextColor(
    ...NAVY
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(10);

  doc.text(
    "PAYMENT POSITION",
    leftX + 5,
    summaryTop + 9
  );

  doc.setTextColor(
    ...MUTED
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(9);

  doc.text(
    `${payments.length} ${
      payments.length === 1
        ? "payment"
        : "payments"
    } recorded`,
    leftX + 5,
    summaryTop + 16
  );

  /*
  INVOICE TOTAL
  */

  doc.setTextColor(
    ...MUTED
  );

  doc.text(
    "Invoice Total",
    leftX + 5,
    summaryTop + 28
  );

  doc.setTextColor(
    ...NAVY
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    formatMoney(
      invoiceTotal
    ),
    leftX + leftWidth - 5,
    summaryTop + 28,
    {
      align: "right",
    }
  );

  /*
  TOTAL PAID
  */

  doc.setTextColor(
    ...MUTED
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    "Total Paid",
    leftX + 5,
    summaryTop + 40
  );

  doc.setTextColor(
    ...GREEN
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    formatMoney(
      totalPaid
    ),
    leftX + leftWidth - 5,
    summaryTop + 40,
    {
      align: "right",
    }
  );

  /*
  OUTSTANDING
  */

  doc.setTextColor(
    ...MUTED
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    "Outstanding",
    leftX + 5,
    summaryTop + 53
  );

  doc.setTextColor(
    ...(outstandingBalance > 0
      ? RED
      : GREEN)
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    formatMoney(
      outstandingBalance
    ),
    leftX + leftWidth - 5,
    summaryTop + 53,
    {
      align: "right",
    }
  );

  /*
  =========================================================
  RIGHT FINANCIAL BREAKDOWN
  =========================================================
  */

  const rightX =
    leftX +
    leftWidth +
    cardGap;

  doc.setFillColor(
    ...LIGHT_GRAY
  );

  doc.setDrawColor(
    ...BORDER
  );

  doc.roundedRect(
    rightX,
    summaryTop,
    rightWidth,
    65,
    2,
    2,
    "FD"
  );

  const rightLabelX =
    rightX + 5;

  const rightValueX =
    rightX +
    rightWidth -
    5;

  doc.setFontSize(9);

  /*
  SUBTOTAL
  */

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setTextColor(
    ...MUTED
  );

  doc.text(
    "Subtotal",
    rightLabelX,
    summaryTop + 10
  );

  doc.setTextColor(
    ...DARK
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    formatMoney(subtotal),
    rightValueX,
    summaryTop + 10,
    {
      align: "right",
    }
  );

  /*
  FREIGHT
  */

  doc.setTextColor(
    ...MUTED
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    "Freight",
    rightLabelX,
    summaryTop + 22
  );

  doc.setTextColor(
    ...DARK
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    formatMoney(freight),
    rightValueX,
    summaryTop + 22,
    {
      align: "right",
    }
  );

  /*
  ADDITIONAL CHARGES
  */

  if (
    additionalCharges !== 0
  ) {
    doc.setTextColor(
      ...MUTED
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      "Additional Charges",
      rightLabelX,
      summaryTop + 34
    );

    doc.setTextColor(
      ...DARK
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      formatMoney(
        additionalCharges
      ),
      rightValueX,
      summaryTop + 34,
      {
        align: "right",
      }
    );
  }

  /*
  DIVIDER
  */

  doc.setDrawColor(
    ...BORDER
  );

  doc.line(
    rightLabelX,
    summaryTop + 39,
    rightValueX,
    summaryTop + 39
  );

  /*
  INVOICE TOTAL
  */

  doc.setTextColor(
    ...NAVY
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(10);

  doc.text(
    "INVOICE TOTAL",
    rightLabelX,
    summaryTop + 51
  );

  doc.text(
    formatMoney(
      invoiceTotal
    ),
    rightValueX,
    summaryTop + 51,
    {
      align: "right",
    }
  );

  /*
  =========================================================
  PAYMENT TRANSACTIONS
  =========================================================
  */

  let paymentY =
    summaryTop + 76;

  paymentY = ensureSpace(
    payments.length > 0
      ? 55
      : 30,
    paymentY
  );

  drawSectionTitle(
    "Payment Transactions",
    MARGIN,
    paymentY
  );

  paymentY += 10;

  if (payments.length === 0) {
    doc.setFillColor(
      ...LIGHT_GRAY
    );

    doc.setDrawColor(
      ...BORDER
    );

    doc.roundedRect(
      MARGIN,
      paymentY,
      CONTENT_WIDTH,
      26,
      2,
      2,
      "FD"
    );

    doc.setTextColor(
      ...MUTED
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(10);

    doc.text(
      "No payments recorded for this invoice.",
      PAGE_WIDTH / 2,
      paymentY + 15,
      {
        align: "center",
      }
    );

    paymentY += 32;
  } else {
    autoTable(doc, {
      startY: paymentY,

      margin: {
        left: MARGIN,
        right: MARGIN,
        bottom: 25,
      },

      head: [
        [
          "#",
          "Payment",
          "Paid For",
          "Date",
          "Method",
          "Reference",
          "Amount",
        ],
      ],

      body: payments.map(
        (payment, index) => [
          String(index + 1),

          payment.description ||
            "Invoice Payment",

          payment.invoiceItem
            ?.description ||
            "General invoice payment",

          formatDate(
            payment.paymentDate
          ),

          formatPaymentMethod(
            payment.paymentMethod
          ),

          payment.reference ||
            "—",

          formatMoney(
            payment.amount
          ),
        ]
      ),

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 2.5,
        textColor: DARK,
        lineColor: BORDER,
        lineWidth: 0.2,
        valign: "middle",
      },

      headStyles: {
        fillColor: NAVY,
        textColor: WHITE,
        fontStyle: "bold",
        fontSize: 10,
        halign: "center",
      },

      alternateRowStyles: {
        fillColor: LIGHT_GRAY,
      },

      // Total width = 180mm (A4 content width).
      // Kept compact enough for the larger 10pt text.
      columnStyles: {
        0: {
          cellWidth: 7,
          halign: "center",
        },

        1: {
          cellWidth: 30,
        },

        2: {
          cellWidth: 38,
        },

        3: {
          cellWidth: 23,
          halign: "center",
        },

        4: {
          cellWidth: 22,
          halign: "center",
        },

        5: {
          cellWidth: 32,
        },

        6: {
          cellWidth: 28,
          halign: "right",
        },
      },

      didParseCell: (
        hookData
      ) => {
        if (
          hookData.section ===
            "body" &&
          hookData.column.index ===
            6
        ) {
          hookData.cell.styles.fontStyle =
            "bold";

          hookData.cell.styles.textColor =
            GREEN;
        }
      },
    });

    paymentY =
      (
        doc as jsPDF & {
          lastAutoTable?: {
            finalY: number;
          };
        }
      ).lastAutoTable
        ?.finalY ?? paymentY + 20;
  }

  /*
  =========================================================
  ITEM PAYMENT ALLOCATION
  =========================================================
  */

  if (
    items.length > 0 &&
    payments.some(
      (payment) =>
        payment.invoiceItemId
    )
  ) {
    paymentY += 10;

    paymentY = ensureSpace(
      50,
      paymentY
    );

    drawSectionTitle(
      "Payment Allocation by Item",
      MARGIN,
      paymentY
    );

    paymentY += 10;

    autoTable(doc, {
      startY: paymentY,

      margin: {
        left: MARGIN,
        right: MARGIN,
        bottom: 25,
      },

      head: [
        [
          "#",
          "Invoice Item",
          "Item Total",
          "Paid",
          "Balance",
        ],
      ],

      body: items.map(
        (item, index) => {
          const itemTotal =
            toNumber(
              item.total
            );

          const itemPaid =
            getItemPaid(
              item.id
            );

          const itemBalance =
            Math.max(
              itemTotal -
                itemPaid,
              0
            );

          return [
            String(index + 1),

            item.description ??
              "-",

            formatMoney(
              itemTotal
            ),

            formatMoney(
              itemPaid
            ),

            formatMoney(
              itemBalance
            ),
          ];
        }
      ),

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 2.5,
        textColor: DARK,
        lineColor: BORDER,
        lineWidth: 0.2,
      },

      headStyles: {
        fillColor: NAVY,
        textColor: WHITE,
        fontStyle: "bold",
        fontSize: 10,
      },

      alternateRowStyles: {
        fillColor: LIGHT_GRAY,
      },

      // Total width = 180mm (A4 content width).
      columnStyles: {
        0: {
          cellWidth: 9,
          halign: "center",
        },

        1: {
          cellWidth: 72,
        },

        2: {
          cellWidth: 33,
          halign: "right",
        },

        3: {
          cellWidth: 33,
          halign: "right",
        },

        4: {
          cellWidth: 33,
          halign: "right",
        },
      },

      didParseCell: (
        hookData
      ) => {
        if (
          hookData.section ===
            "body" &&
          hookData.column.index ===
            3
        ) {
          hookData.cell.styles.textColor =
            GREEN;
          hookData.cell.styles.fontStyle =
            "bold";
        }

        if (
          hookData.section ===
            "body" &&
          hookData.column.index ===
            4
        ) {
          hookData.cell.styles.textColor =
            RED;
          hookData.cell.styles.fontStyle =
            "bold";
        }
      },
    });

    paymentY =
      (
        doc as jsPDF & {
          lastAutoTable?: {
            finalY: number;
          };
        }
      ).lastAutoTable
        ?.finalY ?? paymentY + 20;
  }



  /*
  =========================================================
  AUTHORIZATION
  =========================================================
  */

  paymentY += 8;

  paymentY = ensureSpace(
    60,
    paymentY
  );

  drawSectionTitle(
    "Authorization",
    MARGIN,
    paymentY
  );

  const signatureY =
    paymentY + 38;

  const signatureWidth = 72;

  /*
  LEFT SIGNATURE
  */

  doc.setDrawColor(
    ...BORDER
  );

  doc.line(
    MARGIN,
    signatureY,
    MARGIN + signatureWidth,
    signatureY
  );

  doc.setTextColor(
    ...MUTED
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(9);

  doc.text(
    "Authorized Signature",
    MARGIN,
    signatureY + 5
  );

  /*
  RIGHT SIGNATURE
  */

  const rightSignatureX =
    PAGE_WIDTH -
    MARGIN -
    signatureWidth;

  doc.line(
    rightSignatureX,
    signatureY,
    PAGE_WIDTH - MARGIN,
    signatureY
  );

  doc.text(
    "Customer / Consignee",
    rightSignatureX,
    signatureY + 5
  );

  /*
  =========================================================
  FOOTER
  =========================================================
  */

  drawFooter();

  /*
  =========================================================
  SAVE PDF
  =========================================================
  */

  const safeInvoiceNumber =
    String(
      data.invoiceNumber ||
        "invoice"
    )
      .replace(
        /[<>:"/\\|?*]+/g,
        "-"
      )
      .trim();

  doc.save(
    `${safeInvoiceNumber}.pdf`
  );
}