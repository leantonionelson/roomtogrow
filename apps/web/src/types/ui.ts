/**
 * UI-only state shapes (not site content).
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
  /**
   * True when the role was inferred from a programme because the visitor
   * hasn't chosen one: it anchors the route on the map but is never shown
   * as "You are here" or used to describe the visitor.
   */
  roleInferred?: boolean;
  selectedPersonaId?: string | null;
}
