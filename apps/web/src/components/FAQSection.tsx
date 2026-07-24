import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSiteContent, useT } from "../content/ContentProvider";
import { Reveal } from "./motion";

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
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="rounded-2xl border bg-card px-5 shadow-xs transition-shadow hover:shadow-md"
              >
                <AccordionTrigger className="py-4 text-sm font-medium text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
