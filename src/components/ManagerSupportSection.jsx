import { managerGuidance, leaderActionSteps } from "../data/contentModel";
import Container from "./Container";

export default function ManagerSupportSection() {
  return (
    <section
      className="border-y border-gray-300 bg-white px-4 py-10"
      aria-labelledby="manager-support-heading"
    >
      <Container>
        <h2
          id="manager-support-heading"
          className="text-xl font-medium text-gray-800 md:text-2xl"
        >
          Supporting your team
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">
          As a manager or leader, you can make a real difference to how your
          team grows. Here’s how.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              How to support development
            </h3>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-gray-700">
              {managerGuidance.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              4 steps you can take now
            </h3>
            <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-gray-700">
              {leaderActionSteps.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
