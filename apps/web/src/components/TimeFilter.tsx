import { useId } from "react";

const TIME_OPTIONS = [
  { value: "10 minutes", label: "10m" },
  { value: "30 minutes", label: "30m" },
  { value: "1 hour", label: "1h" },
  { value: "Longer learning", label: "Longer" },
];

export default function TimeFilter({
  timeFilter,
  onTimeFilterChange,
}: {
  timeFilter: string | null;
  onTimeFilterChange: (value: string) => void;
}) {
  const nameId = useId();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 shrink-0">Time</span>
      <div className="flex flex-wrap gap-1">
        {TIME_OPTIONS.map(({ value, label }) => {
          const optId = `${nameId}-${value.replace(/\s+/g, "-")}`;
          const isChecked = timeFilter === value;
          return (
            <label
              key={value}
              htmlFor={optId}
              className={`flex cursor-pointer items-center rounded border px-2 py-1 text-xs transition-colors ${
                isChecked
                  ? "border-gray-700 bg-gray-800 text-white"
                  : "border-gray-400 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <input
                id={optId}
                type="radio"
                name={nameId}
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
