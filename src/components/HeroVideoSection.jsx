import { strapline } from "../data/contentModel";

export default function HeroVideoSection({
  onStartExploring,
  onLeaderMode,
}) {
  return (
    <section
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden border-b border-gray-300 bg-gray-300"
      aria-label="Hero"
    >
      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="max-w-3xl text-2xl font-medium text-gray-800 md:text-4xl lg:text-5xl">
          {strapline.headline}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-gray-700 md:text-lg">
          {strapline.intro}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onStartExploring}
            className="rounded border border-gray-600 bg-gray-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Start Exploring
          </button>
          <button
            type="button"
            onClick={onLeaderMode}
            className="rounded border border-gray-400 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-100"
          >
            I'm developing my team
          </button>
        </div>
        <button
          type="button"
          aria-label="Play campaign video"
          className="mt-12 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-700 bg-white/90 shadow-lg hover:bg-white"
        >
          <span
            className="ml-1 h-0 w-0 border-y-8 border-l-[14px] border-y-transparent border-l-gray-800"
            aria-hidden
          />
        </button>
      </div>
    </section>
  );
}
