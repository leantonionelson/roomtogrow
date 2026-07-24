export default function StoryPin({
  storyId,
  name,
  pathDescription,
  onClick,
  isHighlight = false,
}: {
  storyId: string;
  name: string;
  pathDescription: string;
  onClick: (storyId: string) => void;
  isHighlight?: boolean;
}) {
  const imgSrc = `https://placehold.co/400x200/e8e8e8/525252?text=${encodeURIComponent(name + " – Success story")}`;
  return (
    <button
      type="button"
      onClick={() => onClick(storyId)}
      className={`flex min-h-[44px] min-w-[44px] flex-shrink-0 flex-col items-center gap-1 rounded-full p-1 shadow-sm transition-all hover:opacity-100 hover:ring-2 hover:ring-gray-400 hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 ${
        isHighlight
          ? "opacity-100 shadow-md ring-2 ring-gray-400/60"
          : "opacity-90"
      }`}
      aria-label={`Story: ${name}, ${pathDescription}`}
    >
      <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm animate-pulse">
        <img
          src={imgSrc}
          alt=""
          className="h-full w-full object-cover"
        />
      </span>
      <span className="max-w-[72px] truncate text-center text-xs font-medium text-gray-800">
        {name}
      </span>
    </button>
  );
}
