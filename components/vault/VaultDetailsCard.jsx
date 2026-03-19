"use client";

export default function VaultDetailsCard({ description, onDescriptionChange }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-3">Description</h2>
      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        rows={4}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        placeholder="Add a description..."
      />
    </div>
  );
}
