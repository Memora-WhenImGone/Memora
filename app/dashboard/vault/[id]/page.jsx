"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Eye, EyeOff, Upload, FileText, Trash2, Download, ArrowLeft } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import SideBar from "@/components/dashboard/SideBar";

export default function page(){
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [files, setFiles] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [secretPlain, setSecretPlain] = useState("");
  const [dekB64, setDekB64] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingAssignees, setSavingAssignees] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function load(){
    const r = await axios.get(`/api/vault/items/${id}`);
    const j = r.data;
    setItem(j.item);
    setFiles(j.files||[]);
    setTitle(j.item?.title||"");
    setDescription(j.item?.description||"");
    setSelectedContacts(((j.item?.assignedTo)||[]).map(String));
    const v = await axios.get('/api/vault');
    setContacts(v.data?.vault?.contacts||[]);
  }
  useEffect(()=>{ load(); }, [id]);
  async function loadDek(){
    try{
      const r = await axios.get('/api/vault/dek');
      setDekB64(r.data?.dekB64||null);
    }catch{}
  }
  useEffect(()=>{ loadDek(); },[]);

  async function save(){
    try {
      setSaving(true);
      const payload = { title, description, tags: item?.tags||[] };
      if (secretPlain && dekB64) {
        try {
          const sodium = await import('libsodium-wrappers'); await sodium.ready; const s = sodium.default;
          const dek = Uint8Array.from(atob(dekB64), c=>c.charCodeAt(0));
          const nonce = s.randombytes_buf(s.crypto_secretbox_NONCEBYTES);
          const cipher = s.crypto_secretbox_easy(new TextEncoder().encode(secretPlain), nonce, dek);
          payload.secret = { alg: 'secretbox', nonce: s.to_base64(nonce, s.base64_variants.ORIGINAL), enc: s.to_base64(cipher, s.base64_variants.ORIGINAL) };
        } catch {}
      }
      await axios.patch(`/api/vault/items/${id}`, payload);
      toast.success('Saved');
      load();
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  }
  const metaDirty = useMemo(()=>{
    if (!item) return false;
    return (title !== (item.title||"")) || (description !== (item.description||""));
  }, [item, title, description]);

  const assigneesDirty = useMemo(()=>{
    if (!item) return false;
    const current = (item.assignedTo||[]).map(String).sort().join(',');
    const selected = (selectedContacts||[]).map(String).sort().join(',');
    return current !== selected;
  }, [item, selectedContacts]);

  async function upload(e){
    const list = Array.from(e.target.files||[]);
    if (list.length === 0) return;
    if ((selectedContacts||[]).length < 1) { toast.error('Assign to at least one contact first'); return; }

    try {
      setUploading(true);
      if (metaDirty) {
        await save();
      }
      if (assigneesDirty) {
        await saveAssignees(true);
      }

      for (const f of list) {
        const fd = new FormData();
        try{
          if (dekB64) {
            const sodium = await import('libsodium-wrappers'); await sodium.ready; const s = sodium.default;
            const dek = Uint8Array.from(atob(dekB64), c=>c.charCodeAt(0));
            const ab = await f.arrayBuffer(); const nonce = s.randombytes_buf(s.crypto_secretbox_NONCEBYTES);
            const cipher = s.crypto_secretbox_easy(new Uint8Array(ab), nonce, dek);
            const blob = new Blob([cipher], { type: f.type || 'application/octet-stream' });
            fd.append('file', new File([blob], f.name, { type: f.type }));
            fd.append('encAlg', 'secretbox');
            fd.append('encNonce', s.to_base64(nonce, s.base64_variants.ORIGINAL));
            fd.append('encVersion', '1');
          } else {
            fd.append('file', f);
          }
        } catch { fd.append('file', f); }
        fd.append("itemId", id);
        await axios.post("/api/files/upload", fd);
      }
      toast.success('Upload complete');
      load();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      try { e.target.value = ""; } catch {}
    }
  }
  async function delFile(fileId){
    if(!confirm('Delete file?')) return;
    try {
      await axios.delete(`/api/files/${fileId}`);
      toast.success('File deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  }

  async function saveAssignees(silent=false){
    try {
      setSavingAssignees(true);
      await axios.patch(`/api/vault/items/${id}/share`, { assignedContactIds: selectedContacts });
      if (!silent) toast.success('Assignees updated');
      load();
    } catch {
      if (!silent) toast.error('Failed to update assignees');
    } finally {
      setSavingAssignees(false);
    }
  }

  if(!item) return <div className="p-6">Loading...</div>;
  return (
    <div className="flex flex-row">
      <SideBar />
      <div className="flex-1 p-6 max-w-5xl mx-auto space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-100 p-2.5"><FileText className="h-5 w-5 text-gray-600" /></div>
              <div>
                <input value={title} onChange={(e)=>setTitle(e.target.value)} className="text-xl font-bold text-gray-900 bg-transparent outline-none" />
                <div className="flex items-center gap-2 mt-1">
                  <span className="capitalize text-sm text-gray-600">{item.type}</span>
                  {(item.tags||[]).map((t)=> (<span key={t} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{t}</span>))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <button onClick={()=>history.back()} className="px-3 py-2 border border-gray-300 rounded-lg flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button onClick={save} disabled={saving} className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50">{saving? 'Saving...' : 'Save'}</button>
              <label className={`px-3 py-2 border border-gray-300 rounded-lg cursor-pointer ${((selectedContacts||[]).length<1)||uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>Upload<input type="file" multiple onChange={upload} disabled={((selectedContacts||[]).length<1)||uploading} className="hidden"/></label>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-900">How it works</p>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="p-3 rounded-lg border border-amber-200 bg-white">
              <p className="font-semibold">1) Add details</p>
              <p className="text-gray-600 mt-1">Set title and description, then Save.</p>
              {metaDirty && <p className="text-amber-700 mt-1">Unsaved changes</p>}
            </div>
            <div className="p-3 rounded-lg border border-amber-200 bg-white">
              <p className="font-semibold">2) Assign contacts</p>
              <p className="text-gray-600 mt-1">Choose who can access this item.</p>
              {assigneesDirty ? <p className="text-amber-700 mt-1">Unsaved selection</p> : <p className="text-gray-600 mt-1">Selected: {(selectedContacts||[]).length}</p>}
            </div>
            <div className="p-3 rounded-lg border border-amber-200 bg-white">
              <p className="font-semibold">3) Upload files</p>
              <p className="text-gray-600 mt-1">Files are encrypted with your vault key.</p>
              {uploading && <p className="text-amber-700 mt-1">Uploading…</p>}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Description</h2>
          <textarea value={description} onChange={(e)=>setDescription(e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Add a description..." />
          <div className="mt-4">
            <label className="text-sm font-semibold text-gray-900 mr-2">Secret</label>
            <div className="flex items-center gap-2">
              <input type={showSecret ? 'text' : 'password'} value={secretPlain} onChange={(e)=>setSecretPlain(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" placeholder="Enter secret (optional)" />
              <button onClick={()=>setShowSecret(!showSecret)} className="px-2 py-2 border border-gray-300 rounded-lg">
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Files</h2>
          </div>
          <div className="space-y-2">
            {files.map(f => (
              <div key={f._id} className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-800">{f.originalName || f.key}</span>
                </div>
                <div className="flex items-center gap-3">
                  <a href={`/api/files/${f._id}/download`} className="text-gray-600 hover:text-gray-900" title="Download"><Download className="w-4 h-4" /></a>
                  <button onClick={()=>delFile(f._id)} className="text-red-500 hover:text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
            {files.length===0 && <div className="text-sm text-gray-600">No files</div>}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Share with contacts</h2>
            <button onClick={()=>saveAssignees(false)} disabled={savingAssignees} className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50">{savingAssignees? 'Saving...' : 'Save'}</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {contacts.map(c => {
              const cid = String(c._id||"");
              const checked = selectedContacts.includes(cid);
              return (
                <label key={cid} className="flex items-center gap-2 text-sm text-gray-800">
                  <input type="checkbox" checked={checked} onChange={(e)=>{
                    if(e.target.checked) setSelectedContacts(Array.from(new Set([...selectedContacts, cid])));
                    else setSelectedContacts(selectedContacts.filter(x=>x!==cid));
                  }} />
                  <span>{c.name} <span className="text-gray-500">({c.email})</span></span>
                </label>
              );
            })}
            {contacts.length===0 && <div className="text-gray-600">No contacts</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
