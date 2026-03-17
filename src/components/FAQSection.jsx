import { useState } from "react";
import { faqs } from "../data/contentModel";

export default function FAQSection() {
  const [openId, setOpenId] = useState(null);

  return (
    <section id="faq" className="border-b border-gray-300 bg-gray-50 px-4 py-8">
      <h2 className="mb-4 text-center text-lg font-medium text-gray-800">
        Frequently asked questions
      </h2>
      <div className="mx-auto max-w-2xl space-y-2">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="rounded border border-gray-300 bg-white"
          >
            <button
              type="button"
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
              aria-expanded={openId === faq.id}
            >
              {faq.question}
              <span className="text-gray-500">
                {openId === faq.id ? "−" : "+"}
              </span>
            </button>
            {openId === faq.id && (
              <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-700">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
