import { programmes } from "../data/contentModel";

const JOURNEY_IDS = [
  "journey_supervisor",
  "journey_manager",
  "journey_senior_manager",
  "journey_gm",
];
const DIPLOMA_IDS = [
  "leadership_diplomas",
  "hospitality_diploma_3",
  "hospitality_diploma_4",
  "hospitality_diploma_5",
];

function ProgrammeCard({ programme, onClick }) {
  const imgSrc = `https://placehold.co/400x200/e8e8e8/525252?text=${encodeURIComponent(programme.title)}`;
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col overflow-hidden rounded-lg border border-gray-300 bg-white text-left shadow-sm transition-colors hover:bg-gray-50"
    >
      <img
        src={imgSrc}
        alt=""
        className="h-32 w-full object-cover md:h-36"
      />
      <div className="flex flex-1 flex-col p-4">
        <span className="text-sm font-medium text-gray-800">
          {programme.title}
        </span>
      </div>
    </button>
  );
}

export default function ProgrammeCards({ onSelectProgramme, openDrawer }) {
  const journeyProgrammes = programmes.filter((p) => JOURNEY_IDS.includes(p.id));
  const diplomaProgrammes = programmes.filter((p) => DIPLOMA_IDS.includes(p.id));

  return (
    <section className="border-b border-gray-300 bg-white px-4 py-8">
      <h2 className="mb-2 text-lg font-medium text-gray-800">
        Programme Explorer
      </h2>
      <p className="mb-6 text-sm text-gray-600">
        Prefer browsing? Select a programme to see details in the panel.
      </p>

      <div className="mb-8">
        <h3 className="mb-3 text-sm font-medium text-gray-700">
          Journey programmes
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {journeyProgrammes.map((p) => (
            <ProgrammeCard
              key={p.id}
              programme={p}
              onClick={() => {
                onSelectProgramme(p.id);
                openDrawer?.();
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-700">
          Diploma programmes
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {diplomaProgrammes.map((p) => (
            <ProgrammeCard
              key={p.id}
              programme={p}
              onClick={() => {
                onSelectProgramme(p.id);
                openDrawer?.();
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
