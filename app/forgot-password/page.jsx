"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function page() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post("/api/forgot-password", { email });
      toast.success("If that account exists, we sent an email");
    } catch (error) {
      const msg = error?.response?.data?.message || "Request failed";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F1E2E] text-white flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-semibold">Memora</span>
        </div>

        <div className="max-w-md">
          <h2 className="text-4xl font-bold mb-4 leading-tight">Forgot Password</h2>
          <p className="text-gray-300 text-lg">
            Enter your email and we will send you a secure link to reset your password.
          </p>
        </div>
        <div className="h-8" />
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <span className="text-2xl font-semibold text-gray-900">Memora</span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset your password</h1>
            <p className="text-gray-600">We will email you a reset link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-500"
            >
              {isSubmitting ? "Sending link…" : "Send reset link"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Remembered it?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-700 font-medium">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}