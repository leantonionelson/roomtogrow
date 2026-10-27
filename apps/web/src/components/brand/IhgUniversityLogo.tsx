import logoLight from "../../assets/brand/ihg-university-light.svg";
import logoDark from "../../assets/brand/ihg-university-dark.svg";

/** IHG University lockup (shield + wordmark, text outlined from Graphik Wide). */
export default function IhgUniversityLogo({
  tone = "light",
  className = "",
}: {
  /** "light" = white artwork for dark backgrounds. */
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <img
      src={tone === "light" ? logoLight : logoDark}
      alt="IHG University"
      className={className}
      width={413}
      height={92}
    />
  );
}
