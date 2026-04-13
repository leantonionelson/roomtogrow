import { useState, useEffect } from "react";
import { useId } from "react";
import { roles } from "../data/contentModel";

const TIME_OPTIONS = [
  { value: "10 minutes", label: "10m" },
  { value: "30 minutes", label: "30m" },
  { value: "1 hour", label: "1h" },
  { value: "Longer learning", label: "Longer" },
];

export default function NavigatorControls({
  onRoleChange,
  timeFilter,
  onTimeFilterChange,
  userContext,
}) {
  const [currentRoleId, setCurrentRoleId] = useState(
    userContext?.currentRoleId ?? ""
  );
  const timeId = useId();

  useEffect(() => {
    setCurrentRoleId(userContext?.currentRoleId ?? "");
  }, [userContext?.currentRoleId]);

  return (
    <div className="grid grid-cols-1 items-center gap-x-3 gap-y-2">
      <select
        value={currentRoleId}
        onChange={(e) => {
          const v = e.target.value;
          setCurrentRoleId(v);
          onRoleChange?.(v);
        }}
        className="w-full min-w-0 rounded border border-gray-400 bg-white px-2 py-1.5 text-sm text-gray-800"
        aria-label="Current role"
      >
        <option value="">Current role...</option>
        {roles.map((r) => (
          <option key={r.id} value={r.id}>
            {r.label}
          </option>
        ))}
      </select>

      <p className="text-xs text-gray-600">
        Use the map to <span className="font-medium">explore your next step</span>.
        After you choose a current role, picking a time below applies{" "}
        <span className="font-medium">start learning now</span> for that role.
      </p>

      <p className="text-xs text-gray-600">
        How much time do you have? Pick a slot to see learning that fits and to
        start at your level.
      </p>

      <div className="grid grid-cols-4 gap-2">
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
