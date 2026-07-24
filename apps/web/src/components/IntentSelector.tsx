import { ArrowRight, BookOpen, Compass, UsersRound } from "lucide-react";
import type { IntentValue } from "../types/content";
import { useSiteContent, useT } from "../content/ContentProvider";
import { Reveal } from "./motion";

const INTENT_ICONS: Record<IntentValue, typeof Compass> = {
  selfGrowth: Compass,
  developingTeam: UsersRound,
  learnAbout: BookOpen,
};

export default function IntentSelector({
  onSelectIntent,
}: {
  onSelectIntent: (value: IntentValue) => void;
}) {
  const { intentSelector } = useSiteContent();
  const t = useT();
  return (
    <section
      className="border-b bg-background px-4 py-14 md:py-16"
      aria-labelledby="intent-selector-heading"
    >
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <h2
            id="intent-selector-heading"
            className="text-center text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
          >
            {intentSelector.question}
          </h2>
          <p className="mt-3 text-center text-sm text-muted-foreground md:text-base">
            {intentSelector.microcopy}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {intentSelector.options.map((opt, i) => {
            const Icon = INTENT_ICONS[opt.value] ?? Compass;
            return (
              <Reveal key={opt.value} delay={i * 110}>
                <button
                  type="button"
                  onClick={() => onSelectIntent(opt.value)}
                  className="group flex h-full w-full flex-col items-start gap-4 rounded-2xl border bg-card p-5 text-left shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="flex-1 text-sm font-medium leading-snug text-foreground">
                    {opt.label}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted/70 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    {t("intent.getStarted")}
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180"
                      aria-hidden
                    />
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
