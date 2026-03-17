import { useState } from "react";
import { useId } from "react";
import { roles } from "../data/contentModel";

const TIME_OPTIONS = [
  { value: "10 minutes", label: "10m" },
  { value: "30 minutes", label: "30m" },
  { value: "1 hour", label: "1h" },
  { value: "Longer learning", label: "Longer" },
];

export default function NavigatorControls({
  onFindRoute,
  timeFilter,
  onTimeFilterChange,
}) {
  const [fromRoleId, setFromRoleId] = useState("");
  const [toRoleId, setToRoleId] = useState("");
  const timeId = useId();

  const canFindRoute = fromRoleId && toRoleId;
  const handleFindRoute = () => {
    if (canFindRoute) onFindRoute(fromRoleId, toRoleId);
  };

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-2 items-center">
      {/* Row 1: two even cols for dropdowns */}
      <select
        value={fromRoleId}
        onChange={(e) => setFromRoleId(e.target.value)}
        className="rounded border border-gray-400 bg-white px-2 py-1.5 text-sm text-gray-800 w-full min-w-0"
        aria-label="Current role"
      >
        <option value="">From...</option>
        {roles.map((r) => (
          <option key={r.id} value={r.id}>
            {r.label}
          </option>
        ))}
      </select>
      <div className="flex items-center gap-1 min-w-0">
        <span className="text-gray-400 text-xs shrink-0" aria-hidden>→</span>
        <select
          value={toRoleId}
          onChange={(e) => setToRoleId(e.target.value)}
          className="rounded border border-gray-400 bg-white px-2 py-1.5 text-sm text-gray-800 w-full min-w-0"
          aria-label="Destination role"
        >
          <option value="">To...</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* Find Route: full width */}
      <div className="col-span-2">
        <button
          type="button"
          onClick={handleFindRoute}
          disabled={!canFindRoute}
          className="w-full rounded border border-gray-400 bg-gray-800 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500"
        >
          Find Route
        </button>
      </div>

      {/* Time: definition in its own row */}
      <p className="col-span-2 text-xs text-gray-600">
        How much time do you have? Choose to see learning that fits your availability.
      </p>

      {/* Time buttons: spread evenly in their own row */}
      <div className="col-span-2 grid grid-cols-4 gap-2">
        {TIME_OPTIONS.map(({ value, label }) => {
          const optId = `${timeId}-${value.replace(/\s+/g, "-")}`;
          const isChecked = timeFilter === value;
          return (
            <label
              key={value}
              htmlFor={optId}
              className={`flex cursor-pointer items-center justify-center rounded border px-2 py-1.5 text-xs transition-colors ${
                isChecked
                  ? "border-gray-700 bg-gray-800 text-white"
                  : "border-gray-400 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <input
                id={optId}
                type="radio"
                name={timeId}
                value={value}
                checked={isChecked}
                onChange={() => onTimeFilterChange(value)}
                className="sr-only"
              />
              {label}
            </label>
          );
        })}
      </div>
    </div>
  );
}
