import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { PackingList } from "../types/packing-list";

export function printPackingList(
  packingList: PackingList
) {
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
  const CONTENT_WIDTH =
    PAGE_WIDTH - MARGIN * 2;

  // =========================================================
  // HELPERS
  // =========================================================

  const formatNumber = (
    value: number | string | null | undefined
  ) => {
    const number = Number(value);

    if (Number.isNaN(number)) {
      return "0";
    }

    return number.toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });
  };

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
        month = String(
          date.getMonth() + 1
        ).padStart(2, "0");
        day = String(
          date.getDate()
        ).padStart(2, "0");
      }
    } else {
      if (Number.isNaN(value.getTime())) {
        return "-";
      }

      year = String(value.getFullYear());
      month = String(
        value.getMonth() + 1
      ).padStart(2, "0");
      day = String(
        value.getDate()
      ).padStart(2, "0");
    }

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

    const monthIndex =
      Number(month) - 1;

    if (
      !year ||
      !month ||
      !day ||
      monthIndex < 0 ||
      monthIndex > 11
    ) {
      return "-";
    }

    return `${day} ${months[monthIndex]} ${year}`;
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

    doc.setTextColor(...DARK);
  };

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

  // Packing List title
  doc.setTextColor(...WHITE);
  doc.setFont(
    "helvetica",
    "bold"
  );
  doc.setFontSize(17);

  doc.text(
    "PACKING LIST",
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
    "Official Shipping Document",
    PAGE_WIDTH - MARGIN,
    22,
    {
      align: "right",
    }
  );

  // =========================================================
  // PACKING LIST NUMBER / DOCUMENT TYPE
  // =========================================================

  doc.setFillColor(...LIGHT_GREEN);

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
    "PACKING LIST NUMBER",
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
    packingList.packingListNumber ??
      "-",
    MARGIN + 5,
    60
  );

  // Document type badge
  doc.setFillColor(...NAVY);

  doc.roundedRect(
    PAGE_WIDTH - MARGIN - 32,
    52,
    27,
    8,
    4,
    4,
    "F"
  );

  doc.setTextColor(...WHITE);
  doc.setFont(
    "helvetica",
    "bold"
  );
  doc.setFontSize(8);

  doc.text(
    "PACKING LIST",
    PAGE_WIDTH - MARGIN - 18.5,
    57.3,
    {
      align: "center",
    }
  );

  // =========================================================
  // PACKING INFORMATION
  // =========================================================

  drawSectionTitle(
    "Packing Information",
    MARGIN,
    72
  );

  const infoY = 86;

  drawLabelValue(
    "Packing Date",
    formatDate(
      packingList.packingDate
    ),
    MARGIN,
    infoY
  );

  drawLabelValue(
    "Shipment Number",
    packingList.shipment
      ?.shipmentNumber ?? "-",
    MARGIN + 58,
    infoY
  );

  drawLabelValue(
    "Total Packages",
    formatNumber(
      packingList.totalPackages
    ),
    MARGIN + 116,
    infoY
  );

  drawLabelValue(
    "Gross Weight",
    `${formatNumber(
      packingList.grossWeight
    )} KG`,
    MARGIN,
    infoY + 17
  );

  drawLabelValue(
    "Net Weight",
    `${formatNumber(
      packingList.netWeight
    )} KG`,
    MARGIN + 58,
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
    packingList.shipment
      ?.shipmentNumber ?? "-",
    MARGIN,
    shipmentY
  );

  drawLabelValue(
    "Exporter",
    packingList.shipment
      ?.exporter?.name ?? "-",
    MARGIN + 58,
    shipmentY
  );

  drawLabelValue(
    "Consignee",
    packingList.shipment
      ?.consignee?.name ?? "-",
    MARGIN + 116,
    shipmentY
  );

  // =========================================================
  // PARTIES
  // =========================================================

  drawSectionTitle(
    "Parties",
    MARGIN,
    166
  );

  const partyY = 179;

  const boxWidth = 87;
  const boxGap = 6;

  const partyBoxes = [
    {
      x: MARGIN,
      title: "EXPORTER",
      value:
        packingList.shipment
          ?.exporter?.name ?? "-",
    },

    {
      x:
        MARGIN +
        boxWidth +
        boxGap,
      title: "CONSIGNEE",
      value:
        packingList.shipment
          ?.consignee?.name ?? "-",
    },
  ];

  partyBoxes.forEach((box) => {
    doc.setFillColor(...LIGHT_GRAY);
    doc.setDrawColor(...BORDER);

    doc.roundedRect(
      box.x,
      partyY,
      boxWidth,
      27,
      2,
      2,
      "FD"
    );

    doc.setTextColor(...GREEN);
    doc.setFont(
      "helvetica",
      "bold"
    );
    doc.setFontSize(9);

    doc.text(
      box.title,
      box.x + 5,
      partyY + 7
    );

    doc.setTextColor(...DARK);
    doc.setFont(
      "helvetica",
      "bold"
    );
    doc.setFontSize(9);

    const wrapped =
      doc.splitTextToSize(
        box.value,
        boxWidth - 10
      );

    doc.text(
      wrapped,
      box.x + 5,
      partyY + 14
    );
  });

  // =========================================================
  // ITEMS
  // =========================================================

  const itemsStartY = 216;

  drawSectionTitle(
    "Packing List Items",
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
      "Item Date",
      "Description",
      "Package",
      "Packages",
      "Net Weight",
      "Remarks",
    ],
  ],

  body: (
    packingList.items ?? []
  ).map((item) => [
    formatDate(item.itemDate),
    item.description ?? "-",
    item.packageType ?? "-",
    formatNumber(item.packages),
    formatNumber(item.netWeight),
    item.remarks ?? "-",
  ]),

  theme: "grid",

  styles: {
    font: "helvetica",
    fontSize: 10,
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
    fontSize: 10,
    halign: "center",
    valign: "middle",
  },

  alternateRowStyles: {
    fillColor: [
      248,
      250,
      252,
    ],
  },

  columnStyles: {
    // Item Date
    0: {
      cellWidth: 22,
      halign: "center",
    },

    // Description
    1: {
      cellWidth: 43,
      halign: "left",
    },

    // Package
    2: {
      cellWidth: 30,
      halign: "center",
    },

    // Packages
    3: {
      cellWidth: 20,
      halign: "center",
    },

    // Net Weight
    4: {
      cellWidth: 27,
      halign: "right",
    },

    // Remarks
    5: {
      cellWidth: 38,
      halign: "left",
    },
  },

  didParseCell: (data) => {
    if (
      data.section === "body" &&
      (
        data.column.index === 3 ||
        data.column.index === 4
      )
    ) {
      data.cell.styles.fontStyle = "bold";
    }

    // Make Item Date slightly stronger
    if (
      data.section === "body" &&
      data.column.index === 0
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
    lastAutoTable?.finalY ??
    235;

  // =========================================================
  // SUMMARY
  // =========================================================

  if (finalY > 245) {
    doc.addPage();
    finalY = 20;
  }

  const summaryTop =
    finalY + 10;

  drawSectionTitle(
    "Weight & Package Summary",
    MARGIN,
    summaryTop,
    85
  );

  doc.setFillColor(...LIGHT_GRAY);
  doc.setDrawColor(...BORDER);

  doc.roundedRect(
    MARGIN,
    summaryTop + 10,
    85,
    43,
    2,
    2,
    "FD"
  );

  // Total Packages
  doc.setFont(
    "helvetica",
    "normal"
  );
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);

  doc.text(
    "Total Packages",
    MARGIN + 5,
    summaryTop + 20
  );

  doc.setTextColor(...DARK);
  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    formatNumber(
      packingList.totalPackages
    ),
    MARGIN + 80,
    summaryTop + 20,
    {
      align: "right",
    }
  );

  // Gross Weight
  doc.setTextColor(...MUTED);
  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    "Gross Weight",
    MARGIN + 5,
    summaryTop + 30
  );

  doc.setTextColor(...DARK);
  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    `${formatNumber(
      packingList.grossWeight
    )} KG`,
    MARGIN + 80,
    summaryTop + 30,
    {
      align: "right",
    }
  );

  // Divider
  doc.setDrawColor(...BORDER);

  doc.line(
    MARGIN + 5,
    summaryTop + 34,
    MARGIN + 80,
    summaryTop + 34
  );

  // Net Weight
  doc.setTextColor(...MUTED);
  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    "Net Weight",
    MARGIN + 5,
    summaryTop + 44
  );

  doc.setTextColor(...DARK);
  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    `${formatNumber(
      packingList.netWeight
    )} KG`,
    MARGIN + 80,
    summaryTop + 44,
    {
      align: "right",
    }
  );

  // =========================================================
  // MARKS & NUMBERS
  // =========================================================

  const marksTop =
    summaryTop + 63;

  if (marksTop > 245) {
    doc.addPage();
  }

  const actualMarksTop =
    marksTop > 245
      ? 20
      : marksTop;

  drawSectionTitle(
    "Marks & Numbers",
    MARGIN,
    actualMarksTop,
    CONTENT_WIDTH
  );

  const marks =
    packingList.marksAndNumbers
      ?.trim() || "-";

  const wrappedMarks =
    doc.splitTextToSize(
      marks,
      CONTENT_WIDTH - 10
    );

  const marksHeight =
    Math.max(
      25,
      Math.min(
        45,
        wrappedMarks.length *
          4.5 +
          10
      )
    );

  doc.setFillColor(...LIGHT_GRAY);
  doc.setDrawColor(...BORDER);

  doc.roundedRect(
    MARGIN,
    actualMarksTop + 10,
    CONTENT_WIDTH,
    marksHeight,
    2,
    2,
    "FD"
  );

  doc.setTextColor(...DARK);
  doc.setFont(
    "helvetica",
    "normal"
  );
  doc.setFontSize(10);

  doc.text(
    wrappedMarks,
    MARGIN + 5,
    actualMarksTop + 18
  );

  // =========================================================
  // REMARKS
  // =========================================================

  const remarksTop =
    actualMarksTop +
    10 +
    marksHeight +
    10;

  if (remarksTop > 250) {
    doc.addPage();
  }

  const actualRemarksTop =
    remarksTop > 250
      ? 20
      : remarksTop;

  drawSectionTitle(
    "Remarks",
    MARGIN,
    actualRemarksTop,
    CONTENT_WIDTH
  );

  const remarks =
    packingList.remarks
      ?.trim() ||
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
        wrappedRemarks.length *
          4.5 +
          10
      )
    );

  doc.setFillColor(...LIGHT_GRAY);
  doc.setDrawColor(...BORDER);

  doc.roundedRect(
    MARGIN,
    actualRemarksTop + 10,
    CONTENT_WIDTH,
    remarksHeight,
    2,
    2,
    "FD"
  );

  doc.setTextColor(...DARK);
  doc.setFont(
    "helvetica",
    "normal"
  );
  doc.setFontSize(10);

  doc.text(
    wrappedRemarks,
    MARGIN + 5,
    actualRemarksTop + 18
  );

  // =========================================================
  // SIGNATURE
  // =========================================================

  const signatureY =
    actualRemarksTop +
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
  doc.setFont(
    "helvetica",
    "normal"
  );
  doc.setFontSize(9);

  doc.text(
    "Authorized Signature",
    162.5,
    actualSignatureY + 6,
    {
      align: "center",
    }
  );

  doc.setTextColor(...DARK);
  doc.setFont(
    "helvetica",
    "bold"
  );
  doc.setFontSize(10);

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

    // Document
    doc.setTextColor(...MUTED);
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      "Packing List",
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
    `${
      packingList.packingListNumber ??
      "packing-list"
    }.pdf`;

  doc.save(fileName);
}