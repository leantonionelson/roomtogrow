import { personas } from "../data/contentModel";

export default function PersonaToggle({
  selectedPersonaId,
  onSelectPersona,
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-600">
        Persona
      </span>
      <select
        value={selectedPersonaId}
        onChange={(e) => onSelectPersona(e.target.value)}
        className="max-w-xs rounded border border-gray-400 bg-white px-3 py-2 text-sm text-gray-800"
      >
        {personas.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
    </div>
  );
}
