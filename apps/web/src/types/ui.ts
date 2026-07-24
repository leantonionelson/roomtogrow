/**
 * UI-only state shapes (not CMS content).
 */
import type { MapMode } from "./content";

export type MapInteractionState = "idle" | "role_selected" | "node_selected";

/**
 * User context as passed through the navigator UI: the base UserContext
 * plus the selected persona. Built via spread, so all fields are optional.
 */
export interface NavigatorUserContext {
  currentRoleId?: string | null;
  mapMode?: MapMode;
  selectedPersonaId?: string | null;
}
