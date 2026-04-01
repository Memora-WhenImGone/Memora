import Link from "next/link";

const siteLinks = [
  { label: "Home", href: "/" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Contact Us", href: "/contact" },
  { label: "Engineering", href: "/security" },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-4 text-sm text-gray-600">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {siteLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-gray-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-center text-sm font-medium text-gray-600">
            Built with care by Palak, Bilal, Vanshika, and Soni.
          </p>
        </div>
      </div>
    </footer>
  );
}
