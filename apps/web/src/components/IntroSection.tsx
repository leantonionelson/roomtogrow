import { useSiteContent } from "../content/ContentProvider";
import { Reveal } from "./motion";

export default function IntroSection() {
  const { introBlock } = useSiteContent();
  return (
    <section id="orientation" className="bg-muted px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="text-pretty text-2xl font-normal leading-snug text-primary md:text-[2rem]">
            {introBlock.internalComms}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-sm leading-relaxed text-foreground/80">
            {introBlock.ihgUniversityExplanation}
          </p>
          {introBlock.journeyStartsHere ? (
            <p className="mt-3 text-pretty text-sm leading-relaxed text-foreground/80">
              {introBlock.journeyStartsHere}
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
