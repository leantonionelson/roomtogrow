import { Fragment } from "react";
import type { CSSProperties } from "react";
import type { IntentValue } from "../types/content";
import { useSiteContent, useT } from "../content/ContentProvider";
import { Reveal } from "./motion";
import { ShieldTileIcon } from "./brand/ShieldArt";
import type { ShieldTile } from "./brand/ShieldArt";

/** Each intent owns a shield tile and an accent (design: "each has its own colour"). */
const INTENT_STYLE: Record<IntentValue, { tile: ShieldTile; colour: string }> = {
  selfGrowth: { tile: "person", colour: "var(--brand-orange)" },
  developingTeam: { tile: "arch", colour: "var(--brand-blue)" },
  learnAbout: { tile: "leaf", colour: "var(--brand-teal)" },
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
      className="bg-background px-4 py-16 md:py-24"
      aria-labelledby="intent-selector-heading"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2
            id="intent-selector-heading"
            className="text-center text-2xl font-normal text-primary md:text-[2rem]"
          >
            {intentSelector.question}
          </h2>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            {intentSelector.microcopy}
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-12 flex flex-col items-stretch justify-center gap-6 sm:flex-row sm:gap-0">
            {intentSelector.options.map((opt, i) => {
              const style = INTENT_STYLE[opt.value] ?? INTENT_STYLE.selfGrowth;
              return (
                <Fragment key={opt.value}>
                  {i > 0 && (
                    <span
                      className="hidden w-px self-stretch bg-primary/60 sm:block"
                      aria-hidden
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => onSelectIntent(opt.value)}
                    style={{ "--intent": style.colour } as CSSProperties}
                    className="group flex items-start gap-4 rounded-xl px-4 py-2 text-start text-brand-gray transition-colors duration-300 hover:text-(--intent) focus-visible:text-(--intent) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-w-56 sm:px-8 md:px-10 [@media(hover:none)]:text-(--intent)"
                  >
                    <ShieldTileIcon tile={style.tile} className="h-14 w-auto shrink-0" />
                    <span className="flex flex-col items-start gap-3 pt-1">
                      <span className="max-w-40 text-sm leading-snug">{opt.label}</span>
                      <span className="translate-y-1 rounded-full bg-(--intent) px-3.5 py-1 text-xs font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
                        {t("intent.getStarted")}
                      </span>
                    </span>
                  </button>
                </Fragment>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
