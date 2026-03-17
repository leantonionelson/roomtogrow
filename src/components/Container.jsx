/**
 * Centered container for content that should not be full width.
 * Use for intro, selling points, FAQ, footer, and similar sections.
 */
export default function Container({ children, className = "" }) {
  return (
    <div
      className={`mx-auto min-w-0 w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
