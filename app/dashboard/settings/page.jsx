"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Settings as Cog, Users, Bell, AlertTriangle } from "lucide-react";
import SideBar from "@/components/dashboard/SideBar";

export default function SettingsPage() {
  const [vault, setVault] = useState(null);
  const [name, setName] = useState("");
  const [inactivityDays, setInactivityDays] = useState(90);
  const [warningDays, setWarningDays] = useState(3);
  const [editingName, setEditingName] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState(false);

  async function load() {
    try {
      const r = await axios.get("/api/vault");
      const v = r.data?.vault;
      if (v) {
        setVault(v);
        setName(v.name || "");
        setInactivityDays(v.trigger?.inactivityDays || 90);
        setWarningDays(v.trigger?.warningDays || 3);
      }
    } catch {
      toast.error("Failed to load settings");
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function saveName() {
    try {
      const body = {
        name,
        contacts: vault?.contacts || [],
        trigger: { inactivityDays, warningDays },
      };
      await axios.post("/api/vault", body);
      setEditingName(false);
      toast.success("Vault name saved");
      load();
    } catch {
      toast.error("Failed to save name");
    }
  }

  async function saveTrigger() {
    try {
      const body = {
        name: name || vault?.name || "",
        contacts: vault?.contacts || [],
        trigger: { inactivityDays, warningDays },
      };
      await axios.post("/api/vault", body);
      setEditingTrigger(false);
      toast.success("Trigger saved");
      load();
    } catch {
      toast.error("Failed to save trigger");
    }
  }

  async function deleteVault() {
    if (!confirm("Delete this vault and all associated data?")) return;
    try {
      await axios.delete("/api/vault");
      toast.success("Vault deleted");
      window.location.href = "/dashboard";
    } catch {
      toast.error("Failed to delete");
    }
  }

  const accepted = (vault?.contacts || []).filter(
    (c) => c.status === "verified",
  ).length;
  const pending = (vault?.contacts || []).length - accepted;

  return (
    <div className="flex flex-row min-h-screen bg-gray-50">
      <SideBar />
      <div className="flex-1 p-6 w-full max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-100 p-2.5">
                <Cog className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Vault Name
                </h2>
                {!editingName ? (
                  <p className="text-sm text-gray-700 mt-1">{name || "-"}</p>
                ) : (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={saveName}
                      className="px-3 py-2 bg-gray-900 text-white rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setName(vault?.name || "");
                        setEditingName(false);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
            {!editingName && (
              <button
                onClick={() => setEditingName(true)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-100 p-2.5">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Trusted Contacts
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {accepted} accepted, {pending} pending
                </p>
              </div>
            </div>
            <a
              href="/dashboard/contacts"
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              Manage
            </a>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-100 p-2.5">
                <Bell className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Trigger Settings
                </h2>
                {!editingTrigger ? (
                  <p className="text-sm text-gray-600 mt-1">
                    Inactivity: {inactivityDays} days • Warning: {warningDays}{" "}
                    days
                  </p>
                ) : (
                  <div className="mt-3">
                    <label className="block text-sm font-semibold mb-2 text-gray-900">
                      Inactivity Days
                    </label>
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
                    <div className="text-sm text-gray-600 mt-2">
                      {inactivityDays} days
                    </div>
                    <label className="block text-sm font-semibold mt-4 mb-2 text-gray-900">
                      Warning Days
                    </label>
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
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={saveTrigger}
                        className="px-3 py-2 bg-gray-900 text-white rounded-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setInactivityDays(
                            vault?.trigger?.inactivityDays || 90,
                          );
                          setWarningDays(vault?.trigger?.warningDays || 3);
                          setEditingTrigger(false);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {!editingTrigger && (
              <button
                onClick={() => setEditingTrigger(true)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-base font-semibold text-red-700">
                Danger Zone
              </h2>
              <p className="text-sm text-red-700/90 mt-1">
                Permanently delete this vault and all associated data. This
                action cannot be undone.
              </p>
              <button
                onClick={deleteVault}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete Vault
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
