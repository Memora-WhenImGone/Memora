"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Missing or invalid token");
    }
  }, [token]);

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  async function handleSubmit(e) {
    e.preventDefault();

    if (!token) {
      toast.error("Missing token");
      return;
    }

    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post(`/api/reset-password?token=${token}`, {
        password: password,
      });

      if (res.status === 200) {
        toast.success("Password updated");
        router.push("/sign-in");
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Reset failed";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F1E2E] text-white flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-semibold">Memora</span>
        </div>

        <div className="max-w-md">
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Set a new password
          </h2>
          <p className="text-gray-300 text-lg">
            Create a strong password to secure your account.
          </p>
        </div>

        <div className="h-8"></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <span className="text-2xl font-semibold text-gray-900">
              Memora
            </span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Reset password
            </h1>
            <p className="text-gray-600">Enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                New password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className={inputClass + " pr-12"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Confirm password
              </label>
              <input
                type="password"
                placeholder="Re-enter your password"
                className={inputClass}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update password"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Have an account?{" "}
            <Link
              href="/sign-in"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}