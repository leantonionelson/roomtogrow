import { sellingPoints } from "../data/contentModel";

const CARD_WIDTH = 280;
const GAP = 16;

export default function SellingPointsGrid() {
  const scroll = (dir) => {
    const el = document.getElementById("selling-points-carousel");
    if (!el) return;
    const step = (CARD_WIDTH + GAP) * (dir === "next" ? 1 : -1);
    el.scrollBy({ left: step, behavior: "smooth" });
  };

  return (
    <>
    <section className="border-b border-gray-300 bg-gray-50 px-4 py-8">
      <h2 className="mb-4 text-lg font-medium text-gray-800">
        Why Room to Grow
      </h2>
      <div className="relative">
        <div
          id="selling-points-carousel"
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scroll-smooth md:snap-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {sellingPoints.map((point, i) => (
            <div
              key={point}
              className="card flex min-w-[260px] max-w-[260px] flex-shrink-0 snap-start flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm md:min-w-[280px] md:max-w-[280px]"
            >
              <img
                src={`https://placehold.co/400x200/e8e8e8/525252?text=Benefit+${i + 1}`}
                alt=""
                className="h-32 w-full object-cover md:h-36"
              />
              <div className="flex flex-1 flex-col p-4">
                <p className="text-sm font-medium text-gray-800">{point}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => scroll("prev")}
          aria-label="Previous"
          className="absolute left-0 top-1/2 hidden -translate-y-1/2 rounded border border-gray-400 bg-white/95 p-1.5 shadow-sm md:block"
        >
          <span className="block h-0 w-0 border-y-[5px] border-y-transparent border-r-[6px] border-r-gray-700" />
        </button>
        <button
          type="button"
          onClick={() => scroll("next")}
          aria-label="Next"
          className="absolute right-0 top-1/2 hidden -translate-y-1/2 rounded border border-gray-400 bg-white/95 p-1.5 shadow-sm md:block"
        >
          <span className="block h-0 w-0 border-y-[5px] border-y-transparent border-l-[6px] border-l-gray-700" />
        </button>
      </div>
    </section>
    <section className="border-y border-gray-300 bg-white px-4 py-10 pb-20 mb-10">
      <h2 className="mb-5 text-center text-lg font-medium text-gray-800">
        Path Finder
      </h2>
      <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-gray-700">
        Use the cards above to explore how Room to Grow supports your growth.
        Each card highlights a different way the tool helps you connect learning
        to career progression—whether you're planning your own path or
        supporting your team.
      </p>
    </section>
  </>
  );
}
