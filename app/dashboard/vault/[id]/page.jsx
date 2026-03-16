"use client";
import { useEffect, useState } from "react";
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

  async function load(){
    const r = await axios.get(`/api/vault/items/${id}`);
    const j = r.data;
    setItem(j.item);
    setFiles(j.files||[]);
    setTitle(j.item?.title||"");
    setDescription(j.item?.description||"");
    setSelectedContacts(((j.item?.assignedContactIds)||[]).map(String));
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
    }
  }
  async function upload(e){
    const f = e.target.files?.[0]; if(!f) return;
    if ((selectedContacts||[]).length < 1) { toast.error('Assign to at least one contact first'); return; }
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

    try { fd.append('assignedContactIds', JSON.stringify(selectedContacts)); } catch {}
    try {
      await axios.post("/api/files/upload", fd);
      toast.success('Upload complete');
      load();
    } catch {
      toast.error('Upload failed');
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

  async function saveAssignees(){
    try {
      await axios.patch(`/api/vault/items/${id}/share`, { assignedContactIds: selectedContacts });
      toast.success('Assignees updated');
      load();
    } catch {
      toast.error('Failed to update assignees');
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
              <button onClick={save} className="px-3 py-2 border border-gray-300 rounded-lg">Save</button>
              <label className="px-3 py-2 border border-gray-300 rounded-lg cursor-pointer">Upload<input type="file" onChange={upload} className="hidden"/></label>
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
            <button onClick={saveAssignees} className="px-3 py-2 border border-gray-300 rounded-lg">Save</button>
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
