import type { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSiteContent, useT } from "../content/ContentProvider";
import { Reveal } from "./motion";

/** `[label](https://…)` in an answer becomes a link; everything else is text. */
const LINK_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

function AnswerText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK_PATTERN)) {
    parts.push(text.slice(last, match.index));
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
      >
        {match[1]}
      </a>,
    );
    last = match.index + match[0].length;
  }
  parts.push(text.slice(last));
  return <p className="whitespace-pre-line">{parts}</p>;
}

export default function FAQSection() {
  const { faqs } = useSiteContent();
  const t = useT();
  return (
    <section id="faq" className="bg-muted/40 px-4 py-16 md:py-20">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <div className="text-center">
            <span className="rounded-full bg-background px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground shadow-xs">
              {t("faq.kicker")}
            </span>
            <h2 className="text-gradient-brand mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
              {t("faq.heading")}
            </h2>
          </div>
        </Reveal>
        <Reveal delay={140}>
          <Accordion type="single" collapsible className="mt-8 gap-2.5">
            {faqs
              .filter((faq) => faq.answer.trim())
              .map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="rounded-2xl border bg-card px-5 shadow-xs transition-shadow hover:shadow-md"
                >
                  <AccordionTrigger className="py-4 text-sm font-medium text-foreground">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                    <AnswerText text={faq.answer} />
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
