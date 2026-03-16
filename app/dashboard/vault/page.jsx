'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "@/components/dashboard/SideBar";

export default function page() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({ type: "document", title: "", description: "" });

  async function load() {
    setLoading(true);
    try {
      const r = await axios.get('/api/vault/items');
      setItems(Array.isArray(r.data?.items) ? r.data.items : []);
    } catch {
      setItems([]);
    } finally { setLoading(false); }
  }

  async function createItem() {
    if (!newItem.title) return;
    await axios.post('/api/vault/items', { type: newItem.type, title: newItem.title, description: newItem.description });
    setNewItem({ type: 'document', title: '', description: '' });
    load();
  }

  useEffect(()=>{ load(); }, []);

  return (
    <div className="flex flex-row">
      <SideBar />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h1 className="text-xl font-bold text-gray-900">Vault Items</h1>
          <p className="text-sm text-gray-600 mt-1">Create items, assign contacts, and upload files securely.</p>
        </div>

        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 mt-4">
          <p className="text-sm font-medium text-amber-900">Recommended flow</p>
          <ol className="mt-2 list-decimal list-inside text-sm text-amber-900 space-y-1">
            <li>Create a new item below.</li>
            <li>Open the item to add details and assign contacts.</li>
            <li>Upload files to that item. Files are encrypted at rest.</li>
          </ol>
          <p className="text-xs text-amber-800 mt-2">Need contacts first? Go to <a className="underline" href="/dashboard/contacts">Contacts</a>.</p>
        </div>


        <div className="rounded-xl border border-gray-200 bg-white p-5 mt-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">New Item</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <select value={newItem.type} onChange={(e)=>setNewItem({ ...newItem, type: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg">
              <option value="document">Document</option>
              <option value="credential">Credential</option>
              <option value="note">Note</option>
            </select>
            <input placeholder="Title (e.g., Passport, Bank login, Will)" value={newItem.title} onChange={(e)=>setNewItem({ ...newItem, title: e.target.value })} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" />
            <button onClick={createItem} disabled={!newItem.title} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50">Create</button>
          </div>
          <p className="text-xs text-gray-500 mt-2">You can assign contacts and upload files after creating the item.</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-200 mt-4">
          {loading && <div className="p-4 text-gray-600">Loading...</div>}
          {!loading && items.map(it => (
            <a key={it.id} href={`/dashboard/vault/${it.id}`} className="flex items-center justify-between p-4 hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{it.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="capitalize text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">{it.type}</span>
                  <span className="text-xs text-gray-600">Files: {it.fileCount}</span>
                </div>
              </div>
              <span className="text-xs text-gray-600">{new Date(it.updatedAt).toLocaleString()}</span>
            </a>
          ))}
          {!loading && items.length===0 && (
            <div className="p-4 text-gray-600">
              No items yet. Create your first item above, then open it to assign contacts and upload files.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

