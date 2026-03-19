import axios from "axios";
import { encryptFileWithDEK } from "@/utils/crypto";

export async function fetchVaultItem(itemId) {
  const response = await axios.get(`/api/vault/items/${itemId}`);
  return response.data;
}

export async function fetchVaultContacts() {
  const response = await axios.get("/api/vault");
  return response.data?.vault?.contacts ?? [];
}

export async function fetchDataEncryptionKey() {
  const response = await axios.get("/api/vault/dek");
  return response.data?.dekB64 ?? null;
}

export async function patchVaultItem(itemId, payload) {
  return axios.patch(`/api/vault/items/${itemId}`, payload);
}

export async function patchItemAssignees(itemId, assignedContactIds) {
  return axios.patch(`/api/vault/items/${itemId}/share`, { assignedContactIds });
}

export async function uploadEncryptedFile(itemId, file, dekBase64) {
  const formData = new FormData();
  formData.append("itemId", itemId);

  if (dekBase64) {
    const { cipherBlob, nonceBase64 } = await encryptFileWithDEK(file, dekBase64);
    const encryptedFile = new File([cipherBlob], file.name, { type: file.type });
    formData.append("file", encryptedFile);
    formData.append("encAlg", "secretbox");
    formData.append("encNonce", nonceBase64);
    formData.append("encVersion", "1");
  } else {
    formData.append("file", file);
  }

  return axios.post("/api/files/upload", formData);
}

export async function deleteFile(fileId) {
  return axios.delete(`/api/files/${fileId}`);
}
