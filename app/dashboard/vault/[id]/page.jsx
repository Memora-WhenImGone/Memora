"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import SideBar from "@/components/dashboard/SideBar";
import VaultAssigneesCard from "@/components/vault/VaultAssigneesCard";
import VaultDetailsCard from "@/components/vault/VaultDetailsCard";
import VaultFilesCard from "@/components/vault/VaultFilesCard";
import VaultItemHeader from "@/components/vault/VaultItemHeader";
import {
  deleteFile,
  fetchDataEncryptionKey,
  fetchVaultContacts,
  fetchVaultItem,
  patchItemAssignees,
  patchVaultItem,
  uploadEncryptedFile,
} from "@/utils/vaultClient";

const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;

export default function VaultItemPage() {
  const { id: itemId } = useParams();

  const [vaultItem, setVaultItem] = useState(null);
  const [files, setFiles] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [dekBase64, setDekBase64] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedContactIds, setSelectedContactIds] = useState([]);

  const [isSaving, setIsSaving] = useState(false);
  const [isSavingAssignees, setIsSavingAssignees] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadPageData();
  }, [itemId]);

  useEffect(() => {
    loadDek();
  }, []);

  async function loadPageData() {
    const { item, files: itemFiles } = await fetchVaultItem(itemId);
    const loadedContacts = await fetchVaultContacts();

    setVaultItem(item);
    setFiles(itemFiles ?? []);
    setTitle(item?.title ?? "");
    setDescription(item?.description ?? "");
    setSelectedContactIds((item?.assignedTo ?? []).map(String));
    setContacts(loadedContacts);
  }

  async function loadDek() {
    try {
      const dek = await fetchDataEncryptionKey();
      setDekBase64(dek);
    } catch {
      setDekBase64(null);
    }
  }

  async function handleSave(silent = false) {
    try {
      setIsSaving(true);
      const payload = {
        title,
        description,
        tags: vaultItem?.tags ?? [],
      };

      await patchVaultItem(itemId, payload);
      if (!silent) toast.success("Saved");
      loadPageData();
    } catch {
      toast.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveAssignees(silent = false) {
    try {
      setIsSavingAssignees(true);
      await patchItemAssignees(itemId, selectedContactIds);
      if (!silent) toast.success("Assignees updated");
      loadPageData();
    } catch {
      if (!silent) toast.error("Failed to update assignees");
    } finally {
      setIsSavingAssignees(false);
    }
  }

  async function handleUpload(event) {
    const input = event.target;
    const fileList = Array.from(input.files ?? []);
    if (fileList.length === 0) return;
    const oversizedFiles = fileList.filter((file) => file.size > MAX_FILE_SIZE_BYTES);
    if (oversizedFiles.length > 0) {
      toast.error(`Max file size is 4MB.`);
      return;
    }
    if (selectedContactIds.length < 1) {
      toast.error("Assign to at least one contact first");
      return;
    }

    try {
      setIsUploading(true);

      await handleSave(true);
      await handleSaveAssignees(true);

      for (const file of fileList) {
        try {
          await uploadEncryptedFile(itemId, file, dekBase64);
        } catch {
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      toast.success("Upload complete");
      loadPageData();
    } catch {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
      try {
        event.target.value = "";
      } catch {

      }
    }
  }

  async function handleDeleteFile(fileId) {
    if (!confirm("Delete file?")) return;
    try {
      await deleteFile(fileId);
      toast.success("File deleted");
      loadPageData();
    } catch {
      toast.error("Failed to delete");
    }
  }

  function handleToggleContact(contactId, checked) {
    setSelectedContactIds((prev) =>
      checked ? Array.from(new Set([...prev, contactId])) : prev.filter((id) => id !== contactId)
    );
  }

  function handleBack() {
    if (typeof window !== "undefined") {
      window.history.back();

    }
  }

  if (!vaultItem) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="flex flex-row">
      <SideBar />
      <div className="flex-1 p-6 max-w-5xl mx-auto space-y-6">
        <VaultAssigneesCard
          contacts={contacts}
          selectedContactIds={selectedContactIds}
          isSaving={isSavingAssignees}
          onToggleContact={handleToggleContact}
          onSave={() => handleSaveAssignees(false)}
          onBack={handleBack}
        />

        <VaultDetailsCard description={description} onDescriptionChange={setDescription} />

        <VaultItemHeader
          item={vaultItem}
          title={title}
          isSaving={isSaving}
          isUploading={isUploading}
          hasNoAssignees={selectedContactIds.length < 1}
          onTitleChange={setTitle}
          onSave={handleSave}
          onUpload={handleUpload}
        />

        <VaultFilesCard files={files} onDeleteFile={handleDeleteFile} />

      </div>
    </div>
  );
}


