"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import SideBar from "@/components/dashboard/SideBar";

export default function page(){
  const [items, setItems] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [vault, setVault] = useState(null);
  const [matrix, setMatrix] = useState({}); 
  const [q, setQ] = useState("");
  const [saving, setSaving] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [openId, setOpenId] = useState(null);

  async function load() {
    try {
      const [itemsRes, vaultRes] = await Promise.all([
        axios.get('/api/vault/items'),
        axios.get('/api/vault'),
      ]);
      const i = Array.isArray(itemsRes.data?.items) ? itemsRes.data.items : [];
      const v = vaultRes.data?.vault || null;
      setItems(i);
      setContacts(Array.isArray(v?.contacts) ? v.contacts : []);
      setVault(v);
      const m = {};
      i.forEach(it => { m[String(it.id)] = (it.assignedContactIds || []).map(String); });
      setMatrix(m);
    } catch {
      toast.error('Failed to load');
    }
  }

  useEffect(()=>{ load(); }, []);

  function isAssigned(itemId, contactId) {
    const list = matrix[String(itemId)] || [];
    return list.includes(String(contactId));
  }
  function setAssigned(itemId, contactId, checked) {
    setMatrix(prev => {
      const key = String(itemId);
      const list = Array.from(prev[key] || []);
      const cid = String(contactId);
      const has = list.includes(cid);
      const next = checked ? (has ? list : [...list, cid]) : list.filter(x=>x!==cid);
      return { ...prev, [key]: next };
    });
  }
  function setRow(itemId, value) {
    setMatrix(prev => {
      const key = String(itemId);
      if (value === true) {
        const next = { ...prev, [key]: contacts.map(c=>String(c._id||"")) };
        toast.success('Assigned to all contacts');
        return next;
      }
      if (value === false) {
        const next = { ...prev, [key]: [] };
        toast.success('Cleared assignments');
        return next;
      }
      return prev;
    });
  }

  const filtered = items.filter(it => (it.title||"").toLowerCase().includes(q.trim().toLowerCase()));

  async function releaseNow() {
    try {
      if (!confirm('Release vault now? This cannot be undone.')) return;
      toast('Releasing vault...');
      const r = await axios.post('/api/vault/release');
      setVault(r.data?.vault || vault);
      toast.success('Vault released');
    } catch (e) {
      toast.error('Failed to release');
    }
  }

  async function sendInvites() {
    setInviting(true);
    try {
      const r = await axios.post('/api/trusted-contact/send-invites');
      toast.success(`Invites sent: ${r.data?.invited || 0}`);
    } catch {
      toast.error('Failed to send invites');
    } finally {
      setInviting(false);
    }
  }

  async function saveAssignments() {
    setSaving(true);
    try {
      toast('Saving assignments...');
      await Promise.all(
        items.map(it => {
          const ids = matrix[String(it.id)] || [];
          return axios.patch(`/api/vault/items/${it.id}/share`, { assignedContactIds: ids });
        })
      );
      await load();
      toast.success('Assignments saved');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className='flex flex-row'>
      <SideBar />
      <div className="flex-1 p-4 sm:p-6 max-w-full bg-gray-50 min-h-screen">
        <div className="mb-4 space-y-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Digital Will</h1>
            <p className="text-sm text-gray-600">Assign items to trusted contacts for release</p>
          </div>
          <input
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            placeholder="Search items..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <button
              disabled={vault?.status === 'released'}
              onClick={releaseNow}
              className={`px-4 py-2 rounded-lg text-center ${vault?.status==='released' ? 'bg-gray-300 text-white' : 'bg-red-600 text-white hover:bg-red-700'}`}
            >
              {vault?.status==='released' ? 'Released' : 'Release Now'}
            </button>
            <button
              disabled={inviting}
              onClick={sendInvites}
              className={`px-4 py-2 rounded-lg border text-center ${inviting? 'bg-gray-200 text-gray-600' : 'bg-white text-gray-900 hover:bg-gray-50'}`}
            >
              {inviting? 'Sending...' : 'Send Invites'}
            </button>
            <button
              disabled={saving}
              onClick={saveAssignments}
              className={`px-4 py-2 rounded-lg border text-center ${saving? 'bg-gray-200 text-gray-600' : 'bg-white text-gray-900 hover:bg-gray-50'}`}
            >
              {saving? 'Saving...' : 'Save Assignments'}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map(it => {
            const assigned = matrix[String(it.id)] || [];
            const count = assigned.length;
            return (
              <div key={it.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-gray-900 font-medium truncate" title={it.title}>{it.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{it.type}</div>
                  </div>
                  <button className="text-sm px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50 shrink-0" onClick={() => setOpenId(openId === it.id ? null : it.id)}>
                    {openId === it.id ? 'Done' : 'Edit'}
                  </button>
                </div>
                <div className="mt-3 flex items-center flex-wrap gap-2">
                  <span className="text-sm text-gray-700">{count} of {contacts.length} assigned</span>
                  <div className="ml-auto flex gap-2 w-full sm:w-auto">
                    <button onClick={()=>setRow(it.id, true)} className="px-2 py-1 border rounded text-xs">All</button>
                    <button onClick={()=>setRow(it.id, false)} className="px-2 py-1 border rounded text-xs">None</button>
                  </div>
                </div>

                {openId === it.id && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {contacts.map(c => {
                        const cid = String(c._id||"");
                        const has = isAssigned(it.id, cid);
                        return (
                          <label key={c.email} className={`flex items-center gap-2 px-3 py-2 rounded-full border cursor-pointer select-none ${has? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                            <input type="checkbox" className="accent-gray-900" checked={has} onChange={(e)=>setAssigned(it.id, cid, e.target.checked)} />
                            <div className="h-7 w-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">
                              {(String(c.name||'').trim().split(/\s+/).slice(0,2).map(s=>s[0]).join('') || '?')}
                            </div>
                            <span className="text-sm text-gray-900 truncate max-w-[140px]" title={c.name}>{c.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-gray-600 text-sm">No items</div>
          )}
        </div>
      </div>
    </div>
  );
}