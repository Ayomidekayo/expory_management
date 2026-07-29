import axiosInstance from "../lib/axios";

import type {
  Document,
  DocumentQuery,
  UpdateDocumentDto,
} from "../types/document";

/*
===========================================
API URL
===========================================
*/

const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:5000";

/*
===========================================
HELPERS
===========================================
*/



export function getFileUrl(fileUrl: string) {
  if (!fileUrl) return "";

  if (fileUrl.startsWith("http")) {
    return fileUrl;
  }

  const base = API_URL.replace("/api", "");

  return `${base}${fileUrl}`;
}

/*
===========================================
RESPONSES
===========================================
*/

interface DocumentListResponse {
  success: boolean;

  data: Document[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface DocumentResponse {
  success: boolean;

  data: Document;
}

/*
===========================================
GET ALL
===========================================
*/

export async function getDocuments(
  params?: DocumentQuery
) {
  const { data } =
    await axiosInstance.get<DocumentListResponse>(
      "/documents",
      {
        params,
      }
    );

  return data;
}

/*
===========================================
GET ONE
===========================================
*/

export async function getDocument(
  id: string
) {
  const { data } =
    await axiosInstance.get<DocumentResponse>(
      `/documents/${id}`
    );

  return data;
}

/*
===========================================
CREATE
===========================================
*/

export async function createDocument(
  payload: FormData
) {
  const { data } =
    await axiosInstance.post<DocumentResponse>(
      "/documents",
      payload,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  return data;
}

/*
===========================================
UPDATE
===========================================
*/

export async function updateDocument({
  id,
  payload,
}: {
  id: string;
  payload: UpdateDocumentDto;
}) {
  const { data } =
    await axiosInstance.patch<DocumentResponse>(
      `/documents/${id}`,
      payload
    );

  return data;
}

/*
===========================================
DELETE
===========================================
*/

export async function deleteDocument(
  id: string
) {
  const { data } =
    await axiosInstance.delete(
      `/documents/${id}`
    );

  return data;
}

/*
===========================================
VIEW DOCUMENT
===========================================
*/

export function viewDocument(
  fileUrl: string
) {
  window.open(
    getFileUrl(fileUrl),
    "_blank"
  );
}

/*
===========================================
DOWNLOAD DOCUMENT
===========================================
*/

export function downloadDocument(
  fileUrl: string,
  fileName: string
) {
  const link =
    document.createElement("a");

  link.href =
    getFileUrl(fileUrl);
console.log(getFileUrl)
  link.download = fileName;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}