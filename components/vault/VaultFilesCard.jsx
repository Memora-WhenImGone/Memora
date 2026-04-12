"use client";

import { Download, FileText, Trash2 } from "lucide-react";

function FileRow({ file, onDelete }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-3">
        <FileText className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-800">{file.originalName ?? file.key}</span>
      </div>
      <div className="flex items-center gap-3">
        {/* <a
          href={`/api/files/${file._id}/download`}
          className="text-gray-600 hover:text-gray-900"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </a> */}
        <button onClick={onDelete} className="text-red-500 hover:text-red-600" title="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function VaultFilesCard({ files, onDeleteFile }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-900">Files</h2>
      </div>

      <div className="space-y-2">
        {files.length === 0 && <div className="text-sm text-gray-600">No files</div>}
        {files.map((file) => (
          <FileRow key={file._id} file={file} onDelete={() => onDeleteFile(file._id)} />
        ))}
      </div>
    </div>
  );
}
