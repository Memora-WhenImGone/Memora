"use client";

const Clauses = [
  {
    title: "1. Who We Are",
    body: `Memora (“we”, “our”, or “us”) operates a secure digital vault platform that lets customers
    store, encrypt, and release sensitive documents to trusted contacts. We act as the data controller
    for personal information we collect about customers in the European Economic Area and the United Kingdom,
    and as the organization accountable under Canada’s Personal Information Protection and Electronic Documents Act (PIPEDA).`,
  },
  {
    title: "2. Data We Collect",
    body: `Account data (name, email address, authentication history), vault metadata (contact names, relationships,
    trigger preferences), audit and telemetry data (IP address, device headers), and encrypted files stored in AWS S3.
    Encrypted files remain unreadable to Memora—only you or your trusted contacts can decrypt them with the vault keys.`,
  },
  {
    title: "3. How We Use Personal Information",
    body: `We process personal information to: (a) authenticate you with email verification and multi-factor codes,
    (b) provision and secure vaults, (c) deliver transactional communications and trusted-contact invites,
    (d) detect fraudulent or unauthorized activity, and (e) comply with legal obligations.
    We do not sell customer data and only use it to run the Memora service.`,
  },
  {
    title: "4. Lawful Bases & PIPEDA Principles",
    body: `Under the GDPR we rely on contractual necessity to deliver core features, legitimate interest to improve and
    secure the platform, and consent for marketing communications. For PIPEDA, we follow the 10 Fair Information Principles:
    accountability, identifying purposes, consent, limiting collection, limiting use/disclosure, accuracy, safeguards,
    openness, individual access, and challenging compliance.`,
  },
  {
    title: "5. International Transfers",
    body: `We host infrastructure in the United States on AWS. When transferring personal data from the EEA/UK/Canada to the US,
    we use Standard Contractual Clauses (SCCs) and require downstream processors to follow equivalent safeguards.`,
  },
  {
    title: "6. Data Security",
    body: `Memora encrypts vault contents client-side with libsodium secretbox and protects vault master keys (DEKs) using
    a server-side key encryption key (KEK). We store hashed access tokens for trusted contacts, enforce HTTPS everywhere,
    and restrict AWS/S3 access via IAM. Security events are logged and reviewed regularly.`,
  },
  {
    title: "7. Data Retention",
    body: `Account data is retained while you maintain an account plus a short period to resolve disputes.
    Vault metadata can be deleted through the dashboard. Contact session tokens automatically expire via TTL indexes.
    We keep aggregated, non-identifying analytics indefinitely.`,
  },
  {
    title: "8. Your Rights",
    body: `Depending on your jurisdiction, you may request access, correction, deletion, restriction, portability,
    or objection to processing. Canadian residents can challenge compliance under PIPEDA’s accountability principle.
    Please contact privacy@mymemora.online to exercise any rights—we will respond within 30 days.`,
  },
  {
    title: "9. Subprocessors",
    body: `Key subprocessors include: AWS (infrastructure/S3), MongoDB Atlas, Mailtrap (transactional email), and Upstash (rate limiting, if enabled).
    Each vendor has signed data processing agreements with security safeguards consistent with GDPR and PIPEDA.`,
  },
  {
    title: "10. Children’s Data",
    body: `Memora is not directed to children under 16. If we learn we collected personal data from a minor without verified guardian consent,
    we will delete it promptly.`,
  },
  {
    title: "11. Changes to This Policy",
    body: `We may revise this policy to reflect product or regulatory updates. .`,
  },
 
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-base text-gray-600">
            We designed Memora to exceed GDPR and PIPEDA expectations. This document explains what information we
            collect, how we use it, and the controls you have over your data.
          </p>
        </header>

        <section className="space-y-8">
          {Clauses.map((Clause) => (
            <article
              key={Clause.title}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                {Clause.title}
              </h2>
              <p className="text-sm leading-6 whitespace-pre-line text-gray-700">
                {Clause.body}
              </p>
            </article>
          ))}
        </section>

       
      </div>
    </main>
  );
}

