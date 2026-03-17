export default function Footer() {
  return (
    <footer className="border-t border-gray-300 bg-gray-100 px-4 py-6">
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <a href="#faq" className="underline hover:text-gray-800">
          FAQ
        </a>
        <a href="#accessibility" className="underline hover:text-gray-800">
          Accessibility
        </a>
        <a href="#privacy" className="underline hover:text-gray-800">
          Privacy
        </a>
        <a href="#legal" className="underline hover:text-gray-800">
          Legal
        </a>
      </div>
    </footer>
  );
}
