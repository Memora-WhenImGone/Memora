"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import SideBar from "@/components/dashboard/SideBar";
import Link from "next/link";

export default function Page() {
  const [contacts, setContacts] = useState([]);
  const [vaultName, setVaultName] = useState("");
  const [vaultStatus, setVaultStatus] = useState("");
  const [trigger, setTrigger] = useState({
    inactivityDays: 90,
    warningDays: 3,
  });
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    relationship: "",
  });

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  async function load() {
    try {
      const response = await axios.get("/api/vault");
      const vault = response.data?.vault;
      if (vault) {
        setVaultName(vault.name || "");
        setVaultStatus(vault.status || "");
        setTrigger(vault.trigger || { inactivityDays: 90, warningDays: 3 });
        setContacts(Array.isArray(vault.contacts) ? vault.contacts : []);
      }
    } catch {
      toast.error("Failed to load contacts");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addContact() {
    const name = newContact.name.trim();
    const email = newContact.email.trim();
    const relationship = newContact.relationship.trim();

    if (!name || !email || !relationship) {
      toast.error("All fields are required");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const alreadyExists = contacts.some(
      (c) => c.email?.toLowerCase() === email.toLowerCase(),
    );

    if (alreadyExists) {
      toast.error("This email is already added");
      return;
    }

    try {
      const updatedContacts = [
        ...contacts.map((c) => ({
          name: c.name,
          email: c.email,
          relationship: c.relationship,
        })),
        {
          name,
          email,
          relationship,
        },
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
        .map((c) => ({
          name: c.name,
          email: c.email,
          relationship: c.relationship,
        }));

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

  return (
    <div className="flex flex-row">
      <SideBar />
      <div className="flex-1 min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Trusted Contacts
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage the people who can access your vault
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded px-2 py-1 text-xs font-medium ${
                vaultStatus === "released"
                  ? "bg-green-100 text-green-700"
                  : vaultStatus === "active"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
              }`}
            >
              {vaultStatus || "unknown"}
            </span>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            Add Contact
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              placeholder="Name"
              value={newContact.name}
              onChange={(e) =>
                setNewContact({ ...newContact, name: e.target.value })
              }
              className="rounded-lg border border-gray-300 px-4 py-2"
            />

            <input
              type="email"
              placeholder="Email"
              value={newContact.email}
              onChange={(e) =>
                setNewContact({ ...newContact, email: e.target.value })
              }
              className="rounded-lg border border-gray-300 px-4 py-2"
            />

            <select
              value={newContact.relationship}
              onChange={(e) =>
                setNewContact({ ...newContact, relationship: e.target.value })
              }
              className="rounded-lg border border-gray-300 px-4 py-2"
            >
              <option value="">Relationship</option>
              {[
                "Parent",
                "Sibling",
                "Spouse",
                "Child",
                "Friend",
                "Lawyer",
                "Other",
              ].map((rel) => (
                <option key={rel} value={rel}>
                  {rel}
                </option>
              ))}
            </select>

            <button
              onClick={addContact}
              className="rounded-lg bg-gray-900 px-4 py-2 text-white"
            >
              Add
            </button>
          </div>
        </div>

        <div className="mt-4 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
          {contacts.map((contact, index) => (
            <div
              key={(contact._id || contact.email || index) + ""}
              className="flex items-center justify-between p-4"
            >
              <div>
                <p className="font-semibold text-gray-900">{contact.name}</p>
                <p className="text-sm text-gray-600">
                  {contact.email} • {contact.relationship}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {contact._id ? (
                  <Link
                    href={`/dashboard/contacts/${contact._id}`}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    View
                  </Link>
                ) : (
                  <span className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-400">
                    View
                  </span>
                )}

                <button
                  onClick={() => removeContact(contact._id, index)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {contacts.length === 0 && (
            <div className="p-4 text-gray-600">No contacts</div>
          )}
        </div>
      </div>
    </div>
  );
}
