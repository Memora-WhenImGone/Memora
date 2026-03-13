export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-center text-sm text-gray-600">
          © {year} Memora — Secure your legacy. Built by the
          {" "}
          <a href="#team" className="underline hover:text-gray-900">Memora Team</a>.
        </p>
      </div>
    </footer>
  );
}
