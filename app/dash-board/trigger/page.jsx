"use client";

import { useEffect, useState } from "react";
import SideBar from "@/components/dashboard/SideBar";

export default function TriggersPage() {

  const [inactivityDays, setInactivityDays] = useState(90);
  const [warningDays, setWarningDays] = useState(3);
  const [name, setName] = useState("");

  async function load() {
    const response = await fetch("/api/vault");
    const data = await response.json();
    const vault = data.vault;

    if (vault) {
      setName(vault.name || "");
      setInactivityDays(vault.trigger?.inactivityDays || 90);
      setWarningDays(vault.trigger?.warningDays || 3);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    const body = {
      name: name || "My Vault",
      contacts: [],
      trigger: {
        inactivityDays,
        warningDays,
      },
    };

    const response = await fetch("/api/vault", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      alert("Trigger saved");
    }
  }

  return (
    <div className="flex flex-row">
      
      <SideBar />

      <div className="p-6 max-w-3xl mx-auto space-y-6">

        {}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h1 className="text-xl font-bold text-gray-900">
            Release Trigger
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Configure inactivity-based release
          </p>
        </div>

        {}
        <div className="rounded-xl border border-gray-200 bg-white p-6">

          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">
              Current inactivity
            </span>

            <span className="text-gray-900 font-medium">
              {inactivityDays} days
            </span>
          </div>

          <input
            type="range"
            min="7"
            max="365"
            value={inactivityDays}
            onChange={(e) =>
              setInactivityDays(parseInt(e.target.value))
            }
            className="w-full"
          />

          <label className="block text-sm font-semibold mt-4 mb-2 text-gray-900">
            Warning Days
          </label>

          <select
            value={warningDays}
            onChange={(e) =>
              setWarningDays(parseInt(e.target.value))
            }
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            {[1, 3, 7, 14, 30].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <button
            onClick={save}
            className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg"
          >
            Save
          </button>

        </div>
      </div>
    </div>
  );
}