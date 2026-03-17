import {
  getProgrammeById,
  getStoryById,
  getRoleLabel,
  getRoleById,
  personas,
} from "../data/contentModel";

const CARD_CLASS =
  "rounded-lg border border-gray-300 bg-white p-4 shadow-sm";
const DETAIL_BLOCK_CLASS = "rounded-lg border border-gray-200 bg-gray-50 p-3";

export default function RoutePanel({
  selectedNodeId,
  selectedStoryId,
  selectedProgrammeId,
  currentRoute,
  selectedPersonaId,
  leaderMode,
  onClose,
}) {
  const persona = personas.find((p) => p.id === selectedPersonaId);
  const isLeaderFocus =
    leaderMode ||
    ["growth_guides", "future_builders", "promoters"].includes(
      selectedPersonaId
    );

  if (selectedStoryId) {
    const story = getStoryById(selectedStoryId);
    if (!story) return <EmptyPanel onClose={onClose} />;
    const imgSrc = `https://placehold.co/400x200/e8e8e8/525252?text=${encodeURIComponent(story.name)}`;
    return (
      <div className={`flex flex-col gap-3 ${CARD_CLASS}`}>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="self-end text-sm text-gray-600 underline"
          >
            Close
          </button>
        )}
        <img
          src={imgSrc}
          alt=""
          className="w-full rounded-md object-cover"
        />
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium text-gray-800">{story.name}</h3>
          <p className="text-sm text-gray-600">{story.pathDescription}</p>
          <div className={DETAIL_BLOCK_CLASS}>
            <p className="text-sm text-gray-700">{story.shortStory}</p>
          </div>
        </div>
      </div>
    );
  }

  let programme = null;
  let selectedRoleId = null;

  if (selectedProgrammeId) {
    programme = getProgrammeById(selectedProgrammeId);
  } else if (selectedNodeId && currentRoute?.steps) {
    const step = currentRoute.steps.find((s) => s.id === selectedNodeId);
    if (step?.programmeId) {
      programme = getProgrammeById(step.programmeId);
    } else if (step?.roleId) {
      selectedRoleId = step.roleId;
    }
  }

  if (programme) {
    const imgSrc = `https://placehold.co/400x200/e8e8e8/525252?text=${encodeURIComponent(programme.title)}`;
    return (
      <div className={`flex flex-col gap-3 ${CARD_CLASS}`}>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="self-end text-sm text-gray-600 underline"
          >
            Close
          </button>
        )}
        <img
          src={imgSrc}
          alt=""
          className="w-full rounded-md object-cover"
        />
        <h3 className="text-lg font-medium text-gray-800">{programme.title}</h3>
        <div className={DETAIL_BLOCK_CLASS}>
          <p className="text-xs font-medium text-gray-600">Who it's for</p>
          <p className="mt-0.5 text-sm text-gray-700">{programme.whoItsFor}</p>
        </div>
        <div className={DETAIL_BLOCK_CLASS}>
          <p className="text-xs font-medium text-gray-600">Skills developed</p>
          <p className="mt-0.5 text-sm text-gray-700">
            {programme.skillsDeveloped}
          </p>
        </div>
        <div className={DETAIL_BLOCK_CLASS}>
          <p className="text-xs font-medium text-gray-600">What to expect</p>
          <p className="mt-0.5 text-sm text-gray-700">
            {programme.whatToExpect}
          </p>
        </div>
        <div className={DETAIL_BLOCK_CLASS}>
          <p className="text-xs font-medium text-gray-600">Time commitment</p>
          <p className="mt-0.5 text-sm text-gray-700">
            {programme.timeCommitment}
          </p>
        </div>
        <div className={DETAIL_BLOCK_CLASS}>
          <p className="text-xs font-medium text-gray-600">Next step</p>
          <p className="mt-0.5 text-sm text-gray-700">{programme.nextStep}</p>
        </div>
        {persona && (
          <div className={DETAIL_BLOCK_CLASS}>
            <p className="text-xs italic text-gray-600">
              {isLeaderFocus
                ? persona.panelFocusLeader
                : persona.panelFocusSelf}
            </p>
          </div>
        )}
        <button
          type="button"
          className="self-start rounded border border-gray-600 bg-gray-700 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Explore programme
        </button>
      </div>
    );
  }

  if (selectedRoleId) {
    const role = getRoleById(selectedRoleId);
    const roleLabel = role?.label ?? getRoleLabel(selectedRoleId);
    const imgSrc = `https://placehold.co/400x200/e8e8e8/525252?text=${encodeURIComponent(roleLabel)}`;
    return (
      <div className={`flex flex-col gap-3 ${CARD_CLASS}`}>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="self-end text-sm text-gray-600 underline"
          >
            Close
          </button>
        )}
        <img
          src={imgSrc}
          alt=""
          className="w-full rounded-md object-cover"
        />
        <h3 className="text-lg font-medium text-gray-800">{roleLabel}</h3>
        {role?.overview && (
          <div className={DETAIL_BLOCK_CLASS}>
            <p className="text-sm text-gray-700">{role.overview}</p>
          </div>
        )}
        {role?.quote && (
          <blockquote className={`${DETAIL_BLOCK_CLASS} border-l-4 border-gray-400 pl-3 italic text-gray-700`}>
            <p className="text-sm">"{role.quote}"</p>
            {role.quoteAuthor && (
              <cite className="mt-1 block text-xs not-italic text-gray-600">
                — {role.quoteAuthor}
              </cite>
            )}
          </blockquote>
        )}
        <p className="text-xs text-gray-600">
          Select a programme step on your route to see the learning that gets you to the next role.
        </p>
        {persona && (
          <div className={DETAIL_BLOCK_CLASS}>
            <p className="text-xs italic text-gray-600">
              {isLeaderFocus
                ? persona.panelFocusLeader
                : persona.panelFocusSelf}
            </p>
          </div>
        )}
      </div>
    );
  }

  return <EmptyPanel onClose={onClose} />;
}

function EmptyPanel({ onClose }) {
  return (
    <div className={`flex flex-col gap-3 ${CARD_CLASS}`}>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="self-end text-sm text-gray-600 underline"
        >
          Close
        </button>
      )}
      <div className={DETAIL_BLOCK_CLASS}>
        <p className="text-sm text-gray-600">
          Select a node on the map, a story pin, or a programme card to see
          details here.
        </p>
      </div>
    </div>
  );
}
