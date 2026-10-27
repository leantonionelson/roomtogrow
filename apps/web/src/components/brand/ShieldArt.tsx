import type { CSSProperties } from "react";
import { SHIELD_TILES } from "./shieldPaths";

export type ShieldTile = keyof typeof SHIELD_TILES;

/** Top-left corner of each tile inside the 86×92 shield grid. */
const TILE_ORIGIN: Record<ShieldTile, [number, number]> = {
  house: [0, 0],
  arch: [44.55, 0],
  leaf: [0, 44.59],
  person: [44.55, 44.59],
};

/** Campaign colourway from the design: one accent per tile. */
const TILE_COLOUR: Record<ShieldTile, string> = {
  house: "var(--brand-yellow)",
  arch: "var(--brand-blue)",
  leaf: "var(--brand-teal)",
  person: "var(--brand-orange)",
};

/**
 * The IHG University shield blown up as campaign line art — each tile in its
 * own accent colour, as on the hero and the film takeover.
 */
export function ShieldLineArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 85.8 92.31"
      className={className}
      aria-hidden
      focusable="false"
    >
      {(Object.keys(SHIELD_TILES) as ShieldTile[]).map((tile) => (
        <path key={tile} d={SHIELD_TILES[tile]} fill={TILE_COLOUR[tile]} />
      ))}
    </svg>
  );
}

/** A single shield tile, used as a line icon (inherits `currentColor`). */
export function ShieldTileIcon({
  tile,
  className = "",
  style,
}: {
  tile: ShieldTile;
  className?: string;
  style?: CSSProperties;
}) {
  const [x, y] = TILE_ORIGIN[tile];
  const h = tile === "leaf" || tile === "person" ? 47.72 : 41.26;
  return (
    <svg
      viewBox={`${x - 0.5} ${y - 0.5} 42.26 ${h + 1}`}
      className={className}
      style={style}
      aria-hidden
      focusable="false"
    >
      <path d={SHIELD_TILES[tile]} fill="currentColor" />
    </svg>
  );
}
