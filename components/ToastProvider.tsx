"use client";
import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: { fontSize: "14px" },
        success: { iconTheme: { primary: "#111827", secondary: "#ffffff" } },
      }}
    />
  );
}

