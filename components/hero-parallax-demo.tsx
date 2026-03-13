"use client";
import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";

export default function HeroParallaxDemo() {
  return <HeroParallax products={features} />;
}

export const features = [
  { title: "Access Policies", link: "#", thumbnail: "/hero/access-policies.jpg" },
  { title: "Digital Will", link: "#", thumbnail: "/hero/digital-will.jpg" },
  { title: "Digital Legacy Concept", link: "#", thumbnail: "/hero/DigitalLegacyConcept.png" },
  { title: "Encrypted Storage", link: "#", thumbnail: "/hero/encrypted-storage.jpg" },
  { title: "Family", link: "#", thumbnail: "/hero/family.png" },
  { title: "Files Images", link: "#", thumbnail: "/hero/files-images.png" },
  { title: "Legacy", link: "#", thumbnail: "/hero/legacy.png" },
  { title: "Peace", link: "#", thumbnail: "/hero/peace.png" },
  { title: "Trusted Contacts", link: "#", thumbnail: "/hero/rusted-contacts.jpg" },
  { title: "Secure Vault", link: "#", thumbnail: "/hero/secure-vault.jpg" },
  { title: "Security", link: "#", thumbnail: "/hero/security.png" },
  { title: "Smart Triggers", link: "#", thumbnail: "/hero/smart-triggers.jpg" },
  { title: "Code  Vault", link: "#", thumbnail: "/hero/code.png" },
  { title: "Code  Tr iggers", link: "#", thumbnail: "/hero/code-2.png" },
  { title: "Code  Dashboard", link: "#", thumbnail: "/hero/code-3.png" },
];
