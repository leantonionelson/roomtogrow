import { useState, useEffect } from "react";
import type { UserContext } from "../types/content";
import { useSiteContent, useT } from "../content/ContentProvider";


export default function NavigatorControls({
  onRoleChange,
  userContext,
}: {
  onRoleChange?: (roleId: string) => void;
  userContext: UserContext | null;
}) {
  const { roles } = useSiteContent();
  const t = useT();
  // Only a role the visitor chose; an inferred route anchor isn't theirs.
  const chosenRoleId = userContext?.roleInferred ? "" : (userContext?.currentRoleId ?? "");
  const [currentRoleId, setCurrentRoleId] = useState(chosenRoleId);

  useEffect(() => {
    setCurrentRoleId(chosenRoleId);
  }, [chosenRoleId]);

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
    </div>
  );
}
