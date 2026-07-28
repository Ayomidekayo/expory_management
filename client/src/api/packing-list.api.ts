import api from "../lib/axios";
import type { PackingList, PackingListQuery } from "../types";

// export interface PackingList {
//   id: string;

//   shipmentId: string;

//   packingListNumber?: string;

//   grossWeight: number;

//   netWeight: number;

//   shipment: {
//     id: string;
//     shipmentNumber: string;
//     shipmentDate: string;
//     status: string;
//   };

//   createdAt: string;

//   updatedAt: string;
// }
interface PackingListListResponse {
  success: boolean;

  data: PackingList[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface PackingListResponse {
  success: boolean;

  data: PackingList;
}

export async function getPackingLists(
  params?: PackingListQuery
) {
  const { data } =
    await api.get<PackingListListResponse>(
      "/packing-lists",
      {
        params,
      }
    );

  return data;
}

export async function getPackingList(
  id: string
) {
  const { data } =
    await api.get<PackingListResponse>(
      `/packing-lists/${id}`
    );

  return data.data;
}

export async function createPackingList(
  payload: any
) {
  const { data } = await api.post(
    "/packing-lists",
    payload
  );

  return data.data;
}

export async function updatePackingList(
  id: string,
  payload: any
) {
  const { data } = await api.patch(
    `/packing-lists/${id}`,
    payload
  );

  return data.data;
}

export async function deletePackingList(
  id: string
) {
  await api.delete(
    `/packing-lists/${id}`
  );
}