import { useState, useEffect } from "react";
import { useId } from "react";
import type { UserContext } from "../types/content";
import { useSiteContent, useT } from "../content/ContentProvider";

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
}: {
  onRoleChange?: (roleId: string) => void;
  timeFilter: string | null;
  onTimeFilterChange: (value: string) => void;
  userContext: UserContext | null;
}) {
  const { roles } = useSiteContent();
  const t = useT();
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
        className="w-full min-w-0 rounded-lg border bg-card px-2.5 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Current role"
      >
        <option value="">{t("controls.currentRole")}</option>
        {roles.map((r) => (
          <option key={r.id} value={r.id}>
            {r.label}
          </option>
        ))}
      </select>

      <p className="text-xs text-muted-foreground">{t("controls.explainer")}</p>

      <p className="text-xs text-muted-foreground">
        {t("controls.timeQuestion")}
      </p>

      <div className="grid grid-cols-4 gap-2">
        {TIME_OPTIONS.map(({ value, label }) => {
          const optId = `${timeId}-${value.replace(/\s+/g, "-")}`;
          const isChecked = timeFilter === value;
          return (
            <label
              key={value}
              htmlFor={optId}
              className={`flex cursor-pointer items-center justify-center rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors ${
                isChecked
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-muted/60"
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
