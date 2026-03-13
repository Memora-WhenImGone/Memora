"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function page() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setStatus("error");
        setMessage("Missing token");
        toast.error("Missing token");
        return;
      }

      setStatus("loading");

      try {
        const res = await axios.get(
          `/api/verify-email?token=${encodeURIComponent(token)}`
        );

        if (res.status === 200) {
          setStatus("success");
          setMessage("Email verified successfully");
          toast.success("Email verified");
        } else {
          setStatus("error");
          setMessage("Verification failed");
        }
      } catch (error) {
        setStatus("error");
        const msg =
          error?.response?.data?.message || "Verification failed";
        setMessage(msg);
        toast.error(msg);
      }
    }

    verifyEmail();
  }, [token]);

  let heading = "Verify email";

  if (status === "loading") {
    heading = "Verifying your email...";
  } else if (status === "success") {
    heading = "You're verified!";
  } else if (status === "error") {
    heading = "Verification issue";
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F1E2E] text-white flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-semibold">Memora</span>
        </div>

        <div className="max-w-md">
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Verify your email
          </h2>
          <p className="text-gray-300 text-lg">
            We are confirming your address to secure your account.
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
              {heading}
            </h1>
            <p className="text-gray-600 min-h-6">{message}</p>
          </div>

          {status === "success" && (
            <div className="space-y-4">
              <Link
                href="/sign-in"
                className="block w-full text-center py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
              >
                Continue to sign in
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <p className="text-center text-sm text-gray-600">
                The verification link may be invalid or expired. You can
                request a new link from your account settings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}