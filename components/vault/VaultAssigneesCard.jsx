"use client";

export default function VaultAssigneesCard({
  contacts,
  selectedContactIds,
  isSaving,
  onToggleContact,
  onSave,
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-900">Share with contacts</h2>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {contacts.length === 0 && <div className="text-gray-600">No contacts</div>}
        {contacts.map((contact) => {
          const contactId = String(contact._id ?? "");
          const isSelected = selectedContactIds.includes(contactId);

          return (
            <label key={contactId} className="flex items-center gap-2 text-sm text-gray-800">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onToggleContact(contactId, e.target.checked)}
              />
              <span>
                {contact.name} <span className="text-gray-500">({contact.email})</span>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
