"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import SideBar from "@/components/dashboard/SideBar";
import toast from "react-hot-toast";

export default function Page() {

  const { id } = useParams();

  const [contact, setContact] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {

        const vaultRes = await axios.get("/api/vault");
        const vault = vaultRes.data?.vault;

        const foundContact = (vault.contacts).find(
          (c) => c._id === id
        );

        setContact(foundContact);

        const itemsRes = await axios.get("/api/vault/items");
        const vaultItems = itemsRes.data.items;

        const filteredItems = vaultItems.filter((item) =>
          item.assignedTo && item.assignedTo.includes(id)
        );

        setItems(filteredItems);

      } catch (error) {
        toast.error("Failed to load contact");
      }
    })();
  }, [id]);

  if (!contact) {
    return (
      <div className="flex flex-row">
        <SideBar />
        <div className="flex-1 p-6">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row">

      <SideBar />

      <div className="flex-1 p-6 max-w-4xl mx-auto space-y-6">

        <div className="rounded-xl border border-gray-200 bg-white p-6">

          <h1 className="text-xl font-bold text-gray-900">
            {contact.name}
          </h1>

          <p className="text-sm text-gray-600">
            {contact.email} • {contact.relationship}
          </p>

          <div className="mt-2">
            <span className="px-2 py-0.5 text-xs rounded bg-orange-100 text-orange-700">
              {contact.status || "pending"}
            </span>
          </div>

        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">

          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Shared Items (Read-only)
          </h2>

          <div className="space-y-2">

            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >

                <div>
                  <p className="font-semibold text-gray-900">
                    {it.title}
                  </p>

                  <p className="text-sm text-gray-600">
                    {it.type}
                  </p>
                </div>

                <span className="text-xs text-gray-600">
                  Updated {new Date(it.updatedAt).toLocaleDateString()}
                </span>

              </div>
            ))}

            {items.length === 0 && (
              <div className="text-gray-600">
                No items
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}