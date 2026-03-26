"use client";
import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";

export default function HeroParallaxDemo() {
  return <HeroParallax products={features} />;
}

export const features = [
  { title: "Access Policies", link: "#", thumbnail: "/hero/access-policies.webp" },
  { title: "Digital Will", link: "#", thumbnail: "/hero/digital-will.webp" },
  { title: "Digital Legacy Concept", link: "#", thumbnail: "/hero/DigitalLegacyConcept.webp" },
  { title: "Encrypted Storage", link: "#", thumbnail: "/hero/encrypted-storage.webp" },
  { title: "Family", link: "#", thumbnail: "/hero/family.webp" },
  { title: "Files Images", link: "#", thumbnail: "/hero/files-images.webp" },
  { title: "Legacy", link: "#", thumbnail: "/hero/legacy.webp" },
  { title: "Peace", link: "#", thumbnail: "/hero/peace.webp" },
  { title: "Trusted Contacts", link: "#", thumbnail: "/hero/rusted-contacts.webp" },
  { title: "Secure Vault", link: "#", thumbnail: "/hero/secure-vault.webp" },
  { title: "Security", link: "#", thumbnail: "/hero/security.webp" },
  { title: "Smart Triggers", link: "#", thumbnail: "/hero/smart-triggers.webp" },
  { title: "Code  Vault", link: "#", thumbnail: "/hero/code.webp" },
  { title: "Code  Tr iggers", link: "#", thumbnail: "/hero/code-2.webp" },
  { title: "Code  Dashboard", link: "#", thumbnail: "/hero/code-3.webp" },
];
