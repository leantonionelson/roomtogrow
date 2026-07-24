/**
 * Directed edges for the Growth Navigator pyramid map.
 * Kept separate from the canvas so path logic in contentModel stays in sync.
 */
import type { MapConnector } from "../types/content";

export const MAP_CONNECTORS: MapConnector[] = [
  { id: "frontline->journey_supervisor", fromId: "frontline", toId: "journey_supervisor", type: "core" },
  { id: "journey_supervisor->supervisor", fromId: "journey_supervisor", toId: "supervisor", type: "core" },
  { id: "supervisor->journey_manager", fromId: "supervisor", toId: "journey_manager", type: "core" },
  { id: "journey_manager->manager", fromId: "journey_manager", toId: "manager", type: "core" },
  { id: "manager->journey_senior_manager", fromId: "manager", toId: "journey_senior_manager", type: "core" },
  { id: "journey_senior_manager->senior_manager", fromId: "journey_senior_manager", toId: "senior_manager", type: "core" },
  { id: "senior_manager->journey_gm", fromId: "senior_manager", toId: "journey_gm", type: "core" },
  { id: "journey_gm->general_manager", fromId: "journey_gm", toId: "general_manager", type: "core" },

  { id: "supervisor->hospitality_diploma_3", fromId: "supervisor", toId: "hospitality_diploma_3", type: "diplomaPath" },
  { id: "hospitality_diploma_3->manager", fromId: "hospitality_diploma_3", toId: "manager", type: "diplomaPath" },
  { id: "manager->hospitality_diploma_4", fromId: "manager", toId: "hospitality_diploma_4", type: "diplomaPath" },
  { id: "hospitality_diploma_4->senior_manager", fromId: "hospitality_diploma_4", toId: "senior_manager", type: "diplomaPath" },
  { id: "senior_manager->hospitality_diploma_5", fromId: "senior_manager", toId: "hospitality_diploma_5", type: "diplomaPath" },
  { id: "hospitality_diploma_5->general_manager", fromId: "hospitality_diploma_5", toId: "general_manager", type: "diplomaPath" },

  { id: "journey_supervisor->frontline", fromId: "journey_supervisor", toId: "frontline", type: "fallback" },
  { id: "journey_manager->supervisor", fromId: "journey_manager", toId: "supervisor", type: "fallback" },
  { id: "journey_senior_manager->manager", fromId: "journey_senior_manager", toId: "manager", type: "fallback" },
  { id: "journey_gm->senior_manager", fromId: "journey_gm", toId: "senior_manager", type: "fallback" },
];
