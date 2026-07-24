import { useState } from "react";
import { useSiteContent, useT } from "../content/ContentProvider";

export default function PersonaQualifier({
  selectedPersonaId,
  onSelectPersona,
}: {
  selectedPersonaId: string | null;
  onSelectPersona: (personaId: string) => void;
}) {
  const { personas, personaQualifyingQuestions } = useSiteContent();
  const t = useT();
  const [showQuiz, setShowQuiz] = useState(false);
  const question = personaQualifyingQuestions[0];
  const persona = selectedPersonaId
    ? personas.find((p) => p.id === selectedPersonaId)
    : null;

  const showQuestion = !selectedPersonaId || showQuiz;

  if (showQuestion) {
    return (
      <div>
        <div className="flex flex-col gap-1.5 pb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t("pq.kicker")}
          </span>
          <p className="text-base font-semibold tracking-tight text-foreground">
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
              className="rounded-lg border bg-card px-3.5 py-2.5 text-left text-sm text-foreground transition-colors hover:border-ring hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
      <span className="text-xs font-medium text-muted-foreground">
        {t("navigator.tailored")}
      </span>
      <p className="text-sm text-foreground">{persona?.description}</p>
      <button
        type="button"
        onClick={() => setShowQuiz(true)}
        className="mt-1 text-left text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
      >
        {t("navigator.change")}
      </button>
    </div>
  );
}
