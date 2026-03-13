"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import SideBar from "@/components/dashboard/SideBar";
import Link from "next/link";

export default function ContactsPage() {

  const [contacts, setContacts] = useState([]);
  const [vaultName, setVaultName] = useState("");
  const [trigger, setTrigger] = useState({
    inactivityDays: 90,
    warningDays: 3,
  });

  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    relationship: "",
  });

  async function load() {
    try {
      const response = await axios.get("/api/vault");
      const vault = response.data?.vault;

      if (vault) {
        setVaultName(vault.name || "");
        setTrigger(vault.trigger || trigger);
        setContacts(Array.isArray(vault.contacts) ? vault.contacts : []);
      }

    } catch {
      toast.error("Failed to load contacts");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function removeContact(index) {
    try {

      const updatedContacts = contacts.filter((_, i) => i !== index);
      setContacts(updatedContacts);

      const body = {
        name: vaultName || "My Vault",
        contacts: updatedContacts,
        trigger,
      };

      await axios.post("/api/vault", body);

      toast.success("Contact removed");

    } catch {
      toast.error("Failed to remove");
    }
  }

  async function addContact() {

    if (
      !newContact.name ||
      !newContact.email ||
      !newContact.relationship
    ) {
      return;
    }

    try {

      const updatedContacts = [
        ...contacts,
        { ...newContact },
      ];

      setContacts(updatedContacts);

      const body = {
        name: vaultName || "My Vault",
        contacts: updatedContacts,
        trigger,
      };

      await axios.post("/api/vault", body);

      setNewContact({
        name: "",
        email: "",
        relationship: "",
      });

      toast.success("Contact added");

    } catch {
      toast.error("Failed to add contact");
    }
  }

  return (
    <div className="flex flex-row">

      <SideBar />

      <div className="flex-1 p-6 bg-gray-50 min-h-screen">

        {}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h1 className="text-xl font-bold text-gray-900">
            Trusted Contacts
          </h1>

          <p className="text-sm text-gray-600 mt-1">
            Manage the people who can access your vault
          </p>
        </div>

        {}
        <div className="rounded-xl border border-gray-200 bg-white p-5 mt-4">

          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Add Contact
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">

            <input
              placeholder="Name"
              value={newContact.name}
              onChange={(e) =>
                setNewContact({
                  ...newContact,
                  name: e.target.value,
                })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />

            <input
              placeholder="Email"
              value={newContact.email}
              onChange={(e) =>
                setNewContact({
                  ...newContact,
                  email: e.target.value,
                })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />

            <select
              value={newContact.relationship}
              onChange={(e) =>
                setNewContact({
                  ...newContact,
                  relationship: e.target.value,
                })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg"
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
              className="px-4 py-2 bg-gray-900 text-white rounded-lg"
            >
              Add
            </button>

          </div>
        </div>

        {}
        <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-200 mt-4">

          {contacts.map((contact, index) => (

            <div
              key={(contact._id || contact.email || index) + ""}
              className="flex items-center justify-between p-4"
            >

              <div>
                <p className="font-semibold text-gray-900">
                  {contact.name}
                </p>

                <p className="text-sm text-gray-600">
                  {contact.email} • {contact.relationship}
                </p>
              </div>

              <div className="flex items-center gap-2">

                <span className="px-2 py-0.5 text-xs rounded bg-orange-100 text-orange-700">
                  {contact.status || "pending"}
                </span>

                {contact._id ? (
                  <Link
                    href={`/dash-board/contacts/${contact._id}`}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    View
                  </Link>
                ) : (
                  <span className="px-3 py-2 border border-gray-200 text-gray-400 rounded-lg">
                    View
                  </span>
                )}

                <button
                  onClick={() => removeContact(index)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

          {contacts.length === 0 && (
            <div className="p-4 text-gray-600">
              No contacts
            </div>
          )}

        </div>

      </div>
    </div>
  );
}