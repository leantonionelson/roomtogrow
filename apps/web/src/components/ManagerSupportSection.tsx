import { CheckCircle2, HeartHandshake, ListChecks } from "lucide-react";
import { useSiteContent, useT } from "../content/ContentProvider";
import Container from "./Container";
import { Reveal } from "./motion";

export default function ManagerSupportSection() {
  const { managerGuidance, leaderActionSteps } = useSiteContent();
  const t = useT();
  return (
    <section
      className="border-y bg-background px-4 py-14 md:py-16"
      aria-labelledby="manager-support-heading"
    >
      <Container>
        <Reveal>
          <span className="rounded-full bg-muted px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t("managers.kicker")}
          </span>
          <h2
            id="manager-support-heading"
            className="text-gradient-brand mt-4 text-2xl font-semibold tracking-tight md:text-3xl"
          >
            {t("managers.heading")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            {t("managers.sub")}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Reveal>
          <div className="h-full rounded-2xl border bg-card p-6 shadow-xs transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
                <HeartHandshake className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="text-sm font-semibold text-foreground">
                {t("managers.col1")}
              </h3>
            </div>
            <ul className="mt-5 space-y-3.5">
              {managerGuidance.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2
                    className="mt-0.5 h-4.5 w-4.5 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          </Reveal>

          <Reveal delay={130}>
          <div className="h-full rounded-2xl border bg-card p-6 shadow-xs transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
                <ListChecks className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="text-sm font-semibold text-foreground">
                {t("managers.col2")}
              </h3>
            </div>
            <ol className="mt-5 space-y-3.5">
              {leaderActionSteps.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
