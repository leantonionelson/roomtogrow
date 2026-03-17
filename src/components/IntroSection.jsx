import { introBlock } from "../data/contentModel";

export default function IntroSection() {
  return (
    <section
      id="orientation"
      className="border-y border-gray-300 bg-white px-4 py-8 mt-10"
    >
      <div className="mx-auto max-w-2xl space-y-4">
        <p className="text-gray-700">{introBlock.internalComms}</p>
        <p className="text-gray-700">{introBlock.ihgUniversityExplanation}</p>
        <p className="text-gray-700">{introBlock.journeyStartsHere}</p>
      </div>
    </section>
  );
}
