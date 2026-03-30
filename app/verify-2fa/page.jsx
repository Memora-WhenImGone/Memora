"use client";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ShieldCheck } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Page() {
  return (

    // Next js complains if we dont use suspense where laoding can happen
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    }>
      <VerifyTwoFactor />
    </Suspense>
  );
}

function VerifyTwoFactor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!email) router.replace("/sign-in");
  }, [email, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/verify-2fa", 
        { email, code }
      );
      if (res.status === 200) {
        toast.success("Signed in successfully");
        try {
          const vaultResponse = await axios.get("/api/vault");
          const vaultStatus = vaultResponse?.data?.vault?.status;
          if (vaultStatus === "active" || 
            vaultStatus === "released") {
            router.push("/dashboard");
          } else {
            router.push("/onboarding");
          }
        } catch {
          router.push("/onboarding");
        }
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Verification failed";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setIsSubmitting(true);
    try {
      await axios.post("/api/resend-2fa", { email });

      setCode("");

      toast.success("New code sent to your email");
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to resend code";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F1E2E] text-white flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-semibold">Memora</span>
        </div>

        <div className="max-w-md">
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            One more step to
            <br />
            secure access.
          </h2>
          <p className="text-gray-300 text-lg">
            We sent a verification code to your email to make sure it&#39;s really
            you.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Lock className="w-4 h-4" />
          <span>End-to-end encrypted • Bank-grade security</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <span className="text-2xl font-semibold text-gray-900">Memora</span>
          </div>

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Two-Factor Verification
            </h1>
            <p className="text-gray-600">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000000"
                autoFocus
                className="w-full h-14 text-center text-2xl font-semibold 
                tracking-[0.5em] border border-gray-300 rounded-lg bg-white text-gray-900
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500 text-center mt-3">
                Code expires in 10 minutes
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#0F1E2E] text-white font-medium rounded-lg hover:bg-[#1a2f45]
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Verifying…" : "Verify & Sign in"}
            </button>

            <div className="flex justify-between items-center text-sm">
              <button
                type="button"
                onClick={() => router.push("/sign-in")}
                className="text-gray-600 hover:text-gray-800"
              >
                Back to sign in
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={isSubmitting}
                className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
              >
                Resend code
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
