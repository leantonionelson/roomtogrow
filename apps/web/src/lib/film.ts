/**
 * Self-hosted campaign film (public/video): the full 1080p cut for the
 * takeover, and for the hero a 5-second 720p teaser loop cut from the
 * moments before each on-screen caption appears (half speed, crossfaded), so
 * the cropped panel never cuts copy off.
 * Neither has an audio track. The single-file embed can't carry them, so it
 * points at the copies on the Netlify site.
 */
const VIDEO_BASE =
  import.meta.env.MODE === "embed"
    ? "https://ihgroomtogrow.netlify.app/video/"
    : `${import.meta.env.BASE_URL}video/`;

export const FILM_SRC = `${VIDEO_BASE}room-to-grow-film.mp4`;
export const LOOP_SRC = `${VIDEO_BASE}room-to-grow-loop.mp4`;
