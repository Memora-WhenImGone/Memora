"use client"; // I did not made layout.tsx as a client component. As a good engineering practice made a component for recat hot toast.
import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return <Toaster position="top-right" />;
}

