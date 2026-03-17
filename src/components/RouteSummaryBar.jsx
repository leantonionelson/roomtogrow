import { getRoleLabel, personas } from "../data/contentModel";

export default function RouteSummaryBar({ route, selectedPersonaId }) {
  if (!route) return null;

  const fromLabel = getRoleLabel(route.fromRoleId);
  const toLabel = getRoleLabel(route.toRoleId);
  const stepCount = route.steps?.length ?? route.estimatedSteps ?? 0;
  const personaLabel = selectedPersonaId
    ? personas.find((p) => p.id === selectedPersonaId)?.label ?? selectedPersonaId
    : null;

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <span className="font-medium text-gray-800">
        {fromLabel} → {toLabel}
      </span>
      {personaLabel && (
        <span className="text-gray-600">Persona: {personaLabel}</span>
      )}
      <span className="text-gray-600">Route: {stepCount} steps</span>
      <span className="text-gray-600">Learning style: {route.timeStyle}</span>
    </div>
  );
}
