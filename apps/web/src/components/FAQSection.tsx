import type { ReactNode } from "react";
import { Minus, Plus } from "lucide-react";
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
  const answered = faqs.filter((faq) => faq.answer.trim());
  return (
    // On desktop the band starts inside the section above (its FAQ strip), so
    // the top padding here is reduced to keep ~96px before the heading.
    <section id="faq" className="bg-muted px-4 pb-16 pt-16 md:pb-24 md:pt-10">
      <div className="mx-auto max-w-xl">
        <Reveal>
          <h2 className="text-center text-2xl font-normal text-primary md:text-[2rem]">
            {t("faq.heading")}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <Accordion
            type="single"
            collapsible
            defaultValue={answered[0]?.id}
            className="mt-12"
          >
            {answered.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border-b border-primary/70 last:border-b-0"
              >
                <AccordionTrigger className="items-center justify-center gap-3 py-4 text-center text-sm font-semibold text-foreground hover:no-underline hover:text-primary **:data-[slot=accordion-trigger-icon]:hidden">
                  <span>{faq.question}</span>
                  {/* Plus / minus marks each question as expandable. */}
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/40 text-primary transition-colors group-hover/accordion-trigger:border-primary group-aria-expanded/accordion-trigger:border-primary group-aria-expanded/accordion-trigger:bg-primary group-aria-expanded/accordion-trigger:text-primary-foreground"
                    aria-hidden
                  >
                    <Plus className="h-3.5 w-3.5 group-aria-expanded/accordion-trigger:hidden" />
                    <Minus className="hidden h-3.5 w-3.5 group-aria-expanded/accordion-trigger:block" />
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-center text-sm leading-relaxed text-foreground/80">
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
