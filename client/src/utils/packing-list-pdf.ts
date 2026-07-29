import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { PackingList } from "../types/packing-list";

export function printPackingList(
  packingList: PackingList
) {
  const doc = new jsPDF();

  // ==========================================
  // Header
  // ==========================================

  doc.setFontSize(18);

  doc.text(
    "EXPORT SERVICES",
    105,
    20,
    { align: "center" }
  );

  doc.setFontSize(15);

  doc.text(
    "PACKING LIST",
    105,
    30,
    { align: "center" }
  );

  doc.line(15, 35, 195, 35);

  // ==========================================
  // Basic Information
  // ==========================================

  doc.setFontSize(11);

  doc.text(
    `Packing List No: ${packingList.packingListNumber ?? "-"}`,
    15,
    45
  );

  doc.text(
    `Shipment No: ${packingList.shipment?.shipmentNumber ?? "-"}`,
    15,
    52
  );

  doc.text(
    `Packing Date: ${
      packingList.packingDate
        ? new Date(packingList.packingDate).toLocaleDateString()
        : "-"
    }`,
    15,
    59
  );

  doc.text(
    `Exporter: ${
      packingList.shipment?.exporter?.name ?? "-"
    }`,
    15,
    72
  );

  doc.text(
    `Consignee: ${
      packingList.shipment?.consignee?.name ?? "-"
    }`,
    15,
    80
  );

  // ==========================================
  // Items Table
  // ==========================================

  autoTable(doc, {
    startY: 90,

    head: [[
      "Description",
      "Package",
      "Packages",
      "Gross",
      "Net",
    ]],

    body: (packingList.items ?? []).map((item) => [
      item.description ?? "-",
      item.packageType ?? "-",
      item.packages ?? 0,
      item.grossWeight ?? 0,
      item.netWeight ?? 0,
    ]),
  });

  const finalY =
    (doc as jsPDF & {
      lastAutoTable: { finalY: number };
    }).lastAutoTable.finalY + 15;

  // ==========================================
  // Summary
  // ==========================================

  doc.text(
    `Total Packages: ${packingList.totalPackages ?? 0}`,
    15,
    finalY
  );

  doc.text(
    `Gross Weight: ${packingList.grossWeight ?? 0} KG`,
    15,
    finalY + 8
  );

  doc.text(
    `Net Weight: ${packingList.netWeight ?? 0} KG`,
    15,
    finalY + 16
  );

  // ==========================================
  // Marks & Numbers
  // ==========================================

  doc.text(
    "Marks & Numbers",
    15,
    finalY + 32
  );

  doc.rect(
    15,
    finalY + 36,
    180,
    22
  );

  doc.text(
    packingList.marksAndNumbers ?? "-",
    20,
    finalY + 46
  );

  // ==========================================
  // Remarks
  // ==========================================

  doc.text(
    "Remarks",
    15,
    finalY + 70
  );

  doc.rect(
    15,
    finalY + 74,
    180,
    25
  );

  doc.text(
    packingList.remarks ?? "-",
    20,
    finalY + 84
  );

  // ==========================================
  // Signature
  // ==========================================

  doc.line(
    135,
    finalY + 125,
    190,
    finalY + 125
  );

  doc.text(
    "Authorized Signature",
    138,
    finalY + 132
  );

  // ==========================================
  // Save
  // ==========================================

  doc.save(
    `${packingList.packingListNumber ?? "packing-list"}.pdf`
  );
}