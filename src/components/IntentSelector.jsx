import { intentSelector } from "../data/contentModel";

export default function IntentSelector({ onSelectIntent }) {
  return (
    <section
      className="border-b border-gray-300 bg-white px-4 py-10 md:py-12"
      aria-labelledby="intent-selector-heading"
    >
      <div className="mx-auto max-w-3xl">
        <h2
          id="intent-selector-heading"
          className="text-center text-xl font-medium text-gray-800 md:text-2xl"
        >
          {intentSelector.question}
        </h2>
        <p className="mt-3 text-center text-sm text-gray-600 md:text-base">
          {intentSelector.microcopy}
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
          {intentSelector.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelectIntent(opt.value)}
              className="min-w-[240px] flex-1 rounded-lg border-2 border-gray-300 bg-gray-50 px-6 py-5 text-left text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:max-w-[280px]"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
