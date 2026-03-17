import { useState } from "react";
import {
  personas,
  personaQualifyingQuestions,
} from "../data/contentModel";

export default function PersonaQualifier({
  selectedPersonaId,
  onSelectPersona,
}) {
  const [showQuiz, setShowQuiz] = useState(false);
  const question = personaQualifyingQuestions[0];
  const persona = selectedPersonaId
    ? personas.find((p) => p.id === selectedPersonaId)
    : null;

  const showQuestion = !selectedPersonaId || showQuiz;

  if (showQuestion) {
    return (
      <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-1.5 pb-3">
          <span className="text-xs font-medium text-gray-600">
            So we can tailor your experience
          </span>
          <p className="text-sm font-medium text-gray-800">
            {question.question}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {question.options.map((opt) => (
            <button
              key={opt.personaId}
              type="button"
              onClick={() => {
                onSelectPersona(opt.personaId);
                setShowQuiz(false);
              }}
              className="rounded border border-gray-400 bg-white px-3 py-2.5 text-left text-sm text-gray-800 transition-colors hover:border-gray-600 hover:bg-gray-50"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-600">
        Tailored for you
      </span>
      <p className="text-sm text-gray-800">
        {persona?.description}
      </p>
      <button
        type="button"
        onClick={() => setShowQuiz(true)}
        className="mt-1 text-left text-xs font-medium text-blue-600 underline hover:text-blue-800"
      >
        Change
      </button>
    </div>
  );
}
