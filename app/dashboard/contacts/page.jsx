"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import SideBar from "@/components/dashboard/SideBar";
import Link from "next/link";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [vaultName, setVaultName] = useState("");
  const [vaultStatus, setVaultStatus] = useState("");
  const [trigger, setTrigger] = useState({ inactivityDays: 90, warningDays: 3 });
  const [newContact, setNewContact] = useState({ name: "", email: "", relationship: "" });
  const [sending, setSending] = useState(false);
  const [releasing, setReleasing] = useState(false);

  async function load() {
    try {
      const response = await axios.get("/api/vault");
      const vault = response.data?.vault;
      if (vault) {
        setVaultName(vault.name || "");
        setVaultStatus(vault.status || "");
        setTrigger(vault.trigger || trigger);
        setContacts(Array.isArray(vault.contacts) ? vault.contacts : []);
      }
    } catch {
      toast.error("Failed to load contacts");
    }
  }

  useEffect(() => { load(); }, []);

  async function addContact() {
    if (!newContact.name || !newContact.email || !newContact.relationship) return;
    try {
      const updatedContacts = [
        ...contacts.map((c) => ({ name: c.name, email: c.email, relationship: c.relationship })),
        { name: newContact.name, email: newContact.email, relationship: newContact.relationship },
      ];
      await axios.post("/api/vault", {
        name: vaultName || "My Vault",
        contacts: updatedContacts,
        trigger,
      });
      setNewContact({ name: "", email: "", relationship: "" });
      toast.success("Contact added");
      load();
    } catch {
      toast.error("Failed to add contact");
    }
  }

  async function removeContact(contactId, index) {
    try {
      const updatedContacts = contacts
        .filter((_, i) => i !== index)
        .map((c) => ({ name: c.name, email: c.email, relationship: c.relationship }));
      await axios.post("/api/vault", {
        name: vaultName || "My Vault",
        contacts: updatedContacts,
        trigger,
      });
      toast.success("Contact removed");
      load();
    } catch {
      toast.error("Failed to remove");
    }
  }

  async function sendInvites() {
    setSending(true);
    try {
      const res = await axios.post("/api/trusted-contact/send-invites");
      const { invited, emailed, skipped } = res.data;
      toast.success(`Invites sent: ${invited} invited, ${emailed} emailed, ${skipped} skipped`);
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to send invites");
    } finally {
      setSending(false);
    }
  }

  async function releaseVault() {
    if (!confirm("Release vault? Contacts will be able to access their assigned items.")) return;
    setReleasing(true);
    try {
      await axios.post("/api/vault/release");
      toast.success("Vault released");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to release vault");
    } finally {
      setReleasing(false);
    }
  }

  return (
    <div className="flex flex-row">
      <SideBar />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">

        <div className="rounded-xl border border-gray-200 bg-white p-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Trusted Contacts</h1>
            <p className="text-sm text-gray-600 mt-1">Manage the people who can access your vault</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded font-medium ${
              vaultStatus === "released" ? "bg-green-100 text-green-700" :
              vaultStatus === "active" ? "bg-blue-100 text-blue-700" :
              "bg-gray-100 text-gray-600"
            }`}>
              {vaultStatus || "unknown"}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 mt-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Add Contact</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              placeholder="Name"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              placeholder="Email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <select
              value={newContact.relationship}
              onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Relationship</option>
              {["Parent", "Sibling", "Spouse", "Child", "Friend", "Lawyer", "Other"].map((rel) => (
                <option key={rel} value={rel}>{rel}</option>
              ))}
            </select>
            <button onClick={addContact} className="px-4 py-2 bg-gray-900 text-white rounded-lg">Add</button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-200 mt-4">
          {contacts.map((contact, index) => (
            <div key={(contact._id || contact.email || index) + ""} className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold text-gray-900">{contact.name}</p>
                <p className="text-sm text-gray-600">{contact.email} • {contact.relationship}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs rounded ${
                  contact.status === "verified" ? "bg-green-100 text-green-700" :
                  contact.status === "invited" ? "bg-blue-100 text-blue-700" :
                  "bg-orange-100 text-orange-700"
                }`}>
                  {contact.status || "pending"}
                </span>
                {contact._id ? (
                  <Link href={`/dashboard/contacts/${contact._id}`} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    View
                  </Link>
                ) : (
                  <span className="px-3 py-2 border border-gray-200 text-gray-400 rounded-lg text-sm">View</span>
                )}
                <button onClick={() => removeContact(contact._id, index)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  Remove
                </button>
              </div>
            </div>
          ))}
          {contacts.length === 0 && <div className="p-4 text-gray-600">No contacts</div>}
        </div>

        {contacts.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-5 mt-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">Send Invites</p>
              <p className="text-xs text-gray-600 mt-0.5">Generate tokens and email private keys to all contacts. 
                Run this after your vault is activated.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={sendInvites}
                disabled={sending}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Invites"}
              </button>
              {vaultStatus !== "released" && (
                <button
                  onClick={releaseVault}
                  disabled={releasing}
                  className="px-4 py-2 border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg text-sm disabled:opacity-50"
                >
                  {releasing ? "Releasing..." : "Release Vault"}
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
