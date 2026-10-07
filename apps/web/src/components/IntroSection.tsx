import { useSiteContent, useT } from "../content/ContentProvider";
import { Reveal } from "./motion";

export default function IntroSection() {
  const { introBlock } = useSiteContent();
  const t = useT();
  return (
    <section id="orientation" className="px-4 py-16 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <span className="rounded-full bg-muted px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t("about.kicker")}
          </span>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="text-gradient-brand mt-6 text-pretty text-2xl font-semibold leading-snug tracking-tight md:text-3xl">
            {introBlock.internalComms}
          </h2>
        </Reveal>
        <Reveal delay={220}>
          <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
            {introBlock.ihgUniversityExplanation}
          </p>
          {introBlock.journeyStartsHere ? (
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              {introBlock.journeyStartsHere}
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
