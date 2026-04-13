"use client";

import { useEffect, useState } from "react";
import SideBar from "@/components/dashboard/SideBar";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function TriggersPage() {

  const [inactivityDays, setInactivityDays] = useState(90);
  const [warningDays, setWarningDays] = useState(3);
  const [name, setName] = useState("");
  const [contacts, setContacts] = useState([]);
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const response = await axios.get("/api/vault");
      const vault = response.data.vault;
      if (vault) {
        setName(vault.name || "Give a name to your vault");
        setInactivityDays(vault.trigger?.inactivityDays || 90);
        setWarningDays(vault.trigger?.warningDays || 3);
        setContacts(
          Array.isArray(vault.contacts)
            ? vault.contacts.map((c) => ({
                name: c.name,
                email: c.email,
                relationship: c.relationship,
              }))
            : [],
        );
      }
    } catch {
      toast.error("Failed to load vault");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
      if (warningDays >= inactivityDays) {
    toast.error("Warning days must be less than release days");
    return;
  }
    const body = {
      name: name || "My Vault",
      contacts,
      trigger: { inactivityDays, warningDays },
    };

    try {
      setSaving(true);
      await axios.post("/api/vault", body);
      toast.success("Trigger saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-row">
      
      <SideBar />

      <div className="p-6 max-w-4xl w-full mx-auto space-y-6">

        {}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Release Trigger
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Configure when to release based on inactivity and send advance warnings.
          </p>
        </div>

        {}
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Vault Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Vault"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/40"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Release after inactivity</span>
              <span className="text-gray-900 font-medium">{inactivityDays} days</span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="7"
                max="365"
                value={inactivityDays}
                onChange={(e) => setInactivityDays(parseInt(e.target.value))}
                className="w-full accent-red-400"
              />
              <input
                type="number"
                min={7}
                max={365}
                value={inactivityDays}
                onChange={(e) => {
                  const v = parseInt(e.target.value || "0", 10);
                  if (!Number.isNaN(v)) setInactivityDays(Math.max(7, Math.min(365, v)));
                }}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-right"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>7 days</span>
              <span>365 days</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mt-4 mb-2 text-gray-900">Warning Days</label>
            <div className="flex items-center gap-3">
              <select
                value={warningDays}
                onChange={(e) => setWarningDays(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                {[1, 3, 7, 14, 30].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500">Send a reminder before release.</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={save}
              disabled={saving}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
