"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

function ContactPortalInner() {
  const searchParams = useSearchParams();
  const portalToken = searchParams.get("token") || "";

  const [token, setToken] = useState(portalToken);
  const [privateKeyBase64, setPrivateKeyBase64] = useState("");
  const [encryptedDEK, setEncryptedDEK] = useState(null);
  const [contactPublicKey, setContactPublicKey] = useState(null);
  const [contactName, setContactName] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [derivedDekBase64, setDerivedDekBase64] = useState("");
  const [sharedItems, setSharedItems] = useState([]);
  const [filesByItem, setFilesByItem] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (portalToken && portalToken !== token) setToken(portalToken);
  }, [portalToken]);

  async function authenticate() {
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("/api/trusted-contact/authenticate", { token });
      const data = res.data;
      setEncryptedDEK(data.encryptedDEK || null);
      setContactPublicKey(data.publicKey || null);
      setContactName(data.contactName || "");
      setMessage(data.encryptedDEK ? "Authenticated. Paste your private key to unlock." : "Authenticated. No DEK available yet.");
    } catch (e) {
      const msg = e.response?.data?.message || e.message || "Failed to authenticate";
      toast.error(msg);
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  }

  async function unlock() {
    if (!privateKeyBase64.trim()) return toast.error("Paste your private key (Base64)");
    if (!encryptedDEK) return toast.error("Authenticate first to get the encrypted DEK");
    try {
      const sodium = await import("libsodium-wrappers");
      await sodium.ready;
      const s = sodium.default;
      const sealed = s.from_base64(encryptedDEK, s.base64_variants.ORIGINAL);
      const sk = s.from_base64(privateKeyBase64.trim(), s.base64_variants.ORIGINAL);
      const pk = contactPublicKey
        ? s.from_base64(contactPublicKey, s.base64_variants.ORIGINAL)
        : s.crypto_scalarmult_base(sk);
      const dek = s.crypto_box_seal_open(sealed, pk, sk);
      setDerivedDekBase64(s.to_base64(dek, s.base64_variants.ORIGINAL));
      setIsUnlocked(true);
      toast.success("Unlocked");
    } catch {
      toast.error("Invalid private key — cannot decrypt");
    }
  }

  async function loadItems() {
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("/api/trusted-contact/items", { token });
      const items = Array.isArray(res.data?.items) ? res.data.items : [];
      setSharedItems(items);
      if (!items.length) setMessage("No assigned items or vault not released.");
    } catch (e) {
      const msg = e.response?.data?.message || e.message || "Failed to load items";
      toast.error(msg);
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  }

  async function loadFilesFor(itemId) {
    try {
      const res = await axios.get(`/api/trusted-contact/items/${itemId}`, { params: { token } });
      setFilesByItem((prev) => ({ ...prev, [String(itemId)]: Array.isArray(res.data?.files) ? res.data.files : [] }));
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || "Failed to load files");
    }
  }

  async function downloadFile(file, itemId) {
    if (!isUnlocked || !derivedDekBase64) return toast.error("Unlock with your private key first");
    try {
      const res = await axios.get(
        `/api/trusted-contact/files/${file._id}/download`,
        { params: { token }, responseType: "arraybuffer" }
      );
      const cipher = new Uint8Array(res.data);

      if (file.encAlg === "secretbox" && file.encNonce) {
        const sodium = await import("libsodium-wrappers");
        await sodium.ready;
        const s = sodium.default;
        const nonce = s.from_base64(file.encNonce, s.base64_variants.ORIGINAL);
        const dek = s.from_base64(derivedDekBase64, s.base64_variants.ORIGINAL);
        const plain = s.crypto_secretbox_open_easy(cipher, nonce, dek);
        const blob = new Blob([plain], { type: file.contentType || "application/octet-stream" });
        triggerDownload(blob, file.originalName || "file.bin");
      } else {
        const blob = new Blob([cipher], { type: file.contentType || "application/octet-stream" });
        triggerDownload(blob, file.originalName || "file.bin");
      }
    } catch (e) {
      toast.error(e.message || "Download failed");
    }
  }

  function triggerDownload(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h1 className="text-xl font-bold text-gray-900">Trusted Contact Portal</h1>
          <p className="text-sm text-gray-600 mt-1">Use your invite token and private key to access shared vault items.</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Token</label>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your token from the invite email"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={authenticate}
              disabled={loading || !token}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? "Working..." : "Authenticate"}
            </button>
            <button
              onClick={loadItems}
              disabled={loading || !token}
              className="px-4 py-2 border border-gray-300 bg-white rounded-lg disabled:opacity-50"
            >
              View Items
            </button>
          </div>

          {message && <div className="text-sm text-gray-700">{message}</div>}

          {contactName && (
            <div className="text-sm text-gray-600">Signed in as: <span className="font-medium text-gray-900">{contactName}</span></div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Private Key (Base64 — from your invite email)</label>
            <textarea
              value={privateKeyBase64}
              onChange={(e) => setPrivateKeyBase64(e.target.value)}
              rows={3}
              placeholder="Paste your private key here"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={unlock}
              disabled={!encryptedDEK || !privateKeyBase64.trim()}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg disabled:opacity-50"
            >
              Unlock
            </button>
            {isUnlocked && (
              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-medium">Unlocked</span>
            )}
          </div>
          <p className="text-xs text-gray-500">Your private key stays in your browser — it is never sent to the server.</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="text-sm font-semibold text-gray-900 mb-3">Shared Items</div>
          {sharedItems.length === 0 && (
            <div className="text-sm text-gray-600">No shared items. Click "View Items" after authenticating.</div>
          )}
          <div className="space-y-3">
            {sharedItems.map((it) => {
              const itemId = String(it._id || it.id);
              const files = filesByItem[itemId] || null;
              return (
                <div key={itemId} className="rounded-lg border border-gray-200">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{it.title}</div>
                      <div className="text-xs text-gray-500 capitalize">{it.type}</div>
                    </div>
                    <button
                      onClick={() => loadFilesFor(itemId)}
                      className="px-3 py-1.5 border border-gray-300 rounded text-xs bg-white hover:bg-gray-50"
                    >
                      Load Files
                    </button>
                  </div>
                  {files && (
                    <div className="divide-y border-t border-gray-100">
                      {files.length === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-600">No files</div>
                      )}
                      {files.map((f) => (
                        <div key={String(f._id)} className="px-4 py-3 flex items-center justify-between gap-2">
                          <div className="text-sm text-gray-800 truncate">
                            {f.originalName}
                            <span className="ml-2 text-xs text-gray-500">({Math.round((f.size || 0) / 1024)} KB)</span>
                            {f.encAlg && <span className="ml-2 text-xs text-green-600">encrypted</span>}
                          </div>
                          <button
                            disabled={!isUnlocked}
                            onClick={() => downloadFile(f, itemId)}
                            className="px-3 py-1.5 border border-gray-300 rounded text-xs bg-white 
                            hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={!isUnlocked ? "Unlock first" : "Download"}
                          >
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPortal() {
  return (
    <Suspense fallback={<div />}> 
      <ContactPortalInner />
    </Suspense>
  );
}
