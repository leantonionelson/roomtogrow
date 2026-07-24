import { useState } from "react";
import { roles } from "../data/contentModel";

export default function NavigatorSearchBar({
  onFindRoute,
}: {
  onFindRoute: (fromRoleId: string, toRoleId: string) => void;
}) {
  const [fromRoleId, setFromRoleId] = useState("");
  const [toRoleId, setToRoleId] = useState("");

  const canFindRoute = fromRoleId && toRoleId;
  const handleFindRoute = () => {
    if (canFindRoute) onFindRoute(fromRoleId, toRoleId);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="flex items-center gap-1.5">
        <span className="text-xs text-gray-500 shrink-0">From</span>
        <select
          value={fromRoleId}
          onChange={(e) => setFromRoleId(e.target.value)}
          className="rounded border border-gray-400 bg-white px-2 py-1.5 text-sm text-gray-800 min-w-0 max-w-[140px]"
        >
          <option value="">Select...</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </label>
      <span className="text-gray-400 text-xs" aria-hidden>→</span>
      <label className="flex items-center gap-1.5">
        <span className="text-xs text-gray-500 shrink-0">To</span>
        <select
          value={toRoleId}
          onChange={(e) => setToRoleId(e.target.value)}
          className="rounded border border-gray-400 bg-white px-2 py-1.5 text-sm text-gray-800 min-w-0 max-w-[140px]"
        >
          <option value="">Select...</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        onClick={handleFindRoute}
        disabled={!canFindRoute}
        className="rounded border border-gray-400 bg-gray-800 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500"
      >
        Find Route
      </button>
    </div>
  );
}
