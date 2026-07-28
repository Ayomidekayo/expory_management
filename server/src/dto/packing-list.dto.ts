export interface CreatePackingListDto {
  shipmentId: string;

  packingListNumber?: string;

  grossWeight: number;

  netWeight: number;
}

export interface UpdatePackingListDto {
  shipmentId?: string;

  packingListNumber?: string;

  grossWeight?: number;

  netWeight?: number;
}