"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setEmailNotVerified(false);
    try {
      const res = await axios.post("/api/sign-in", { email, password });
      if (res.status === 200 && res.data.requiresTwoFactor) {
        toast.success("Verification code sent to your email");
        router.push(`/verify-2fa?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      const status = error?.response?.status;
      const msg = error?.response?.data?.message || "Sign in failed";
      if (status === 403) {
        setEmailNotVerified(true);
      } else {
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F1E2E] text-white flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-semibold">Memora</span>
        </div>

        <div className="max-w-md">
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Secure your legacy.
            <br />
            Protect what matters.
          </h2>
          <p className="text-gray-300 text-lg">
            A digital vault for your most sensitive information, released only
            when the time is right.
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600">Sign in to access your secure vault</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {emailNotVerified && (
              <div className="flex items-start gap-3 p-4 bg-red-50
              border border-red-300 rounded-lg text-red-700 text-sm">
                <span className="font-semibold shrink-0">Email not verified.</span>
                <span>Please check your inbox and verify your email before signing in.</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                className={`${inputClass} ${emailNotVerified ? "border-red-400 focus:ring-red-400" : ""}`}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailNotVerified(false); }}
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-900">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`${inputClass} pr-12`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#0F1E2E] text-white font-medium rounded-lg hover:bg-[#1a2f45]
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Do not have an account?{" "}
            <Link
              href="/sign-up"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
