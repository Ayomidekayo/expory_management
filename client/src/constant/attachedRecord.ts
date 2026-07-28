export const attachedRecord =
  document.shipment
    ? {
        label: "Shipment",
        value:
          document.shipment
            .shipmentNumber,
      }
    : document.allocation
    ? {
        label: "Allocation",
        value:
          document.allocation
            .allocationNumber,
      }
    : document.container
    ? {
        label: "Container",
        value:
          document.container
            .containerNumber,
      }
    : document.packingList
    ? {
        label: "Packing List",
        value:
          document.packingList
            .packingListNumber,
      }
    : document.invoice
    ? {
        label: "Invoice",
        value:
          document.invoice
            .invoiceNumber,
      }
    : document.transit
    ? {
        label: "Transit",
        value:
          document.transit
            .transitNumber,
      }
    : null;