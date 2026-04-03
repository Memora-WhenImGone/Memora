"use client";

import { FileText } from "lucide-react";

export default function VaultItemHeader({
  item,
  title,
  isSaving,
  isUploading,
  hasNoAssignees,
  onTitleChange,
  onSave,
  onUpload,
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gray-100 p-2.5">
            <FileText className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="text-xl font-bold text-gray-900 bg-transparent outline-none"
            />
            <div className="flex items-center gap-2 mt-1">
              <span className="capitalize text-sm text-gray-600">{item.type}</span>
              {(item.tags ?? []).map((tag) => (
                <span key={tag} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex gap-2 items-center">
            <button
              onClick={onSave}
              disabled={isSaving}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>

            <label
              className={`px-3 py-2 border border-gray-300 rounded-lg cursor-pointer ${
                hasNoAssignees || isUploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Upload
              <input
                type="file"
                multiple
                onChange={onUpload}
                disabled={hasNoAssignees || isUploading}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">Max file size 4MB.</p>
        </div>
      </div>
    </div>
  );
}
