export default function MobileDrawer({ open, onClose, hasContent, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <button
        type="button"
        aria-label="Close panel"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />
      <div
        className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-auto rounded-t-lg border border-gray-300 bg-white shadow-lg"
        role="dialog"
        aria-label="Detail panel"
      >
        <div className="sticky top-0 flex justify-end border-b border-gray-200 bg-white p-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
        <div className="min-h-[200px]">{children}</div>
      </div>
    </div>
  );
}
