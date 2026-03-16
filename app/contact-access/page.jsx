"use client";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { FileText, Download, Loader2, Lock, AlertTriangle, Check } from "lucide-react";

function ContactAccessInner() {
  const search = useSearchParams();
  const initialToken = useMemo(() => search.get("token") || "", [search]);

  const [token, setToken] = useState(initialToken);
  const [privateKeyB64, setPrivateKeyB64] = useState("");
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [contactName, setContactName] = useState("");
  const [items, setItems] = useState([]);
  const [dekB64, setDekB64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [downloading, setDownloading] = useState(null);

  async function unlock() {
    if (!token.trim()) {
      setIsError(true);
      return setStatus("Paste your invite token.");
    }
    if (!privateKeyB64.trim()) {
      setIsError(true);
      return setStatus("Paste your private key.");
    }

    setLoading(true);
    setIsError(false);
    setStatus("");
    setItems([]);
    setDekB64(null);

    try {
      setLoadingStep("Authenticating...");
      const authRes = await axios.post("/api/trusted-contact/authenticate", {
        token: token.trim(),
      });
      const authData = authRes.data;

      if (!authData.encryptedDEK) {
        throw new Error("No encrypted key on file — ask the vault owner to resend invites.");
      }

      setContactName(authData.contactName || "");

      setLoadingStep("Unlocking vault key...");
      const sodium = await import("libsodium-wrappers");
      await sodium.ready;

      const s = sodium.default;
      const sk = s.from_base64(privateKeyB64.trim(), s.base64_variants.ORIGINAL);
      const pk = s.crypto_scalarmult_base(sk);
      const sealed = s.from_base64(authData.encryptedDEK, s.base64_variants.ORIGINAL);
      const dek = s.crypto_box_seal_open(sealed, pk, sk);
      const unlockedDekB64 = s.to_base64(dek, s.base64_variants.ORIGINAL);

      setDekB64(unlockedDekB64);

      setLoadingStep("Loading your items...");
      const itemsRes = await axios.post("/api/trusted-contact/items", {
        token: token.trim(),
      });

      const rawItems = Array.isArray(itemsRes.data.items) ? itemsRes.data.items : [];

      const enriched = await Promise.all(
        rawItems.map(async (it) => {
          const id = String(it._id || it.id);

          try {
            const fRes = await axios.get(`/api/trusted-contact/items/${id}`, {
              params: { token: token.trim() },
            });

            return {
              ...it,
              id,
              files: Array.isArray(fRes.data.files) ? fRes.data.files : [],
            };
          } catch {
            return {
              ...it,
              id,
              files: [],
            };
          }
        })
      );

      setItems(enriched);

      if (enriched.length === 0) {
        setIsError(false);
        setStatus("No items have been assigned to you yet.");
      }
    } catch (e) {
      setIsError(true);
      setStatus(e.message || "Something went wrong.");
      setDekB64(null);
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  }

  async function download(file) {
    if (!dekB64) return;

    setDownloading(String(file._id));

    try {
      const res = await axios.get(
        `/api/trusted-contact/files/${file._id}/download`,
        {
          params: { token: token.trim() },
          responseType: "arraybuffer",
        }
      );

      const bytes = new Uint8Array(res.data);
      let finalBytes = bytes;

      if (file.encAlg === "secretbox" && file.encNonce) {
        const sodium = await import("libsodium-wrappers");
        await sodium.ready;

        const s = sodium.default;
        const nonce = s.from_base64(file.encNonce, s.base64_variants.ORIGINAL);
        const dek = s.from_base64(dekB64, s.base64_variants.ORIGINAL);
        finalBytes = s.crypto_secretbox_open_easy(bytes, nonce, dek);
      }

      const blob = new Blob([finalBytes], {
        type: file.contentType || "application/octet-stream",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.originalName || "file";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setIsError(true);
      setStatus(e.message || "Download failed");
    } finally {
      setDownloading(null);
    }
  }

  const typeColors = {
    document: "bg-blue-50 text-blue-700",
    credential: "bg-purple-50 text-purple-700",
    note: "bg-amber-50 text-amber-700",
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-start justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-lg space-y-5">
        <div className="text-center space-y-1 mb-2">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gray-900 mb-3">
            <Lock className="w-6 h-6 text-white" strokeWidth={1.8} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Memora</h1>

          <p className="text-sm text-gray-500">
            {contactName ? (
              <>
                Welcome back,{" "}
                <span className="font-semibold text-gray-800">{contactName}</span>
              </>
            ) : (
              "Secure vault access for trusted contacts"
            )}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-gray-800">Access your shared files</h2>
            <p className="text-xs text-gray-500">
              Both values are in the invite email you received.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Invite Token
              </label>
              <input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your token here"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 
                focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Private Key
              </label>
              <textarea
                value={privateKeyB64}
                onChange={(e) => setPrivateKeyB64(e.target.value)}
                placeholder="Paste your private key here"
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono bg-gray-50 
                focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 transition resize-none"
              />
            </div>
          </div>

          <button
            onClick={unlock}
            disabled={loading}
            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm 
            font-medium transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{loadingStep || "Working..."}</span>
              </>
            ) : dekB64 ? (
              "Refresh"
            ) : (
              "Unlock & View Files"
            )}
          </button>

          {status && !loading && (
            <div
              className={`flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm ${
                isError ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
              }`}
            >
              {isError ? (
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              ) : (
                <Check className="w-4 h-4 mt-0.5 shrink-0" />
              )}
              <span>{status}</span>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">
              {items.length} item{items.length !== 1 ? "s" : ""} shared with you
            </p>

            {items.map((it) => (
              <div
                key={it.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="px-5 py-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{it.title}</p>
                    {it.description && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {it.description}
                      </p>
                    )}
                  </div>

                  <span
                    className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                      typeColors[it.type] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {it.type}
                  </span>
                </div>

                {it.files.length === 0 ? (
                  <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
                    No files attached
                  </div>
                ) : (
                  <div className="border-t border-gray-100 divide-y divide-gray-50">
                    {it.files.map((f) => (
                      <div
                        key={String(f._id)}
                        className="px-5 py-3 flex items-center gap-3"
                      >
                        <FileText className="w-4 h-4 text-gray-400 shrink-0" />

                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 truncate">
                            {f.originalName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {Math.round((f.size || 0) / 1024)} KB
                            {f.encAlg ? " · encrypted" : ""}
                          </p>
                        </div>

                        <button
                          onClick={() => download(f)}
                          disabled={downloading === String(f._id)}
                          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition"
                        >
                          {downloading === String(f._id) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                          {downloading === String(f._id) ? "Saving..." : "Download"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pb-4">
          Your private key never leaves your device.
        </p>
      </div>
    </main>
  );
}
export default function ContactAccessPage() {
  return (
    <Suspense fallback={<div />}> 
      <ContactAccessInner />
    </Suspense>
  );
}