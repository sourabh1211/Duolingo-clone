/** "Pip", the app's own mascot: a round fox. Original artwork, so no trademark issues. */
type Mood = "happy" | "sad" | "cheer" | "think";

export function Mascot({ mood = "happy", className = "h-28 w-28" }: { mood?: Mood; className?: string }) {
  const eyeY = mood === "sad" ? 52 : 48;
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Pip the fox">
      {/* tail */}
      <path d="M92 92c18-4 24-22 18-34-2 14-12 20-22 20z" fill="#ff9600" />
      <path d="M108 66c-1 8-6 13-12 15l6 4c6-4 8-12 6-19z" fill="#fff" />
      {/* body */}
      <ellipse cx="60" cy="96" rx="30" ry="20" fill="#ff9600" />
      <ellipse cx="60" cy="100" rx="17" ry="14" fill="#fff4e0" />
      {/* arms */}
      {mood === "cheer" ? (
        <>
          <path d="M32 86 18 64" stroke="#cd7900" strokeWidth="9" strokeLinecap="round" />
          <path d="M88 86l14-22" stroke="#cd7900" strokeWidth="9" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M34 90l-6 12" stroke="#cd7900" strokeWidth="9" strokeLinecap="round" />
          <path d="M86 90l6 12" stroke="#cd7900" strokeWidth="9" strokeLinecap="round" />
        </>
      )}
      {/* ears */}
      <path d="M26 30 30 4l22 18z" fill="#ff9600" />
      <path d="M94 30 90 4 68 22z" fill="#ff9600" />
      <path d="M31 24 33 11l10 9z" fill="#4b4b4b" />
      <path d="M89 24 87 11l-10 9z" fill="#4b4b4b" />
      {/* head */}
      <path d="M60 14c26 0 40 18 40 36 0 18-18 28-40 28S20 68 20 50c0-18 14-36 40-36z" fill="#ff9600" />
      <path d="M60 46c14 0 26 8 30 18-6 9-17 14-30 14s-24-5-30-14c4-10 16-18 30-18z" fill="#fff4e0" />
      {/* eyes */}
      <ellipse cx="45" cy={eyeY} rx="7" ry={mood === "cheer" ? 3 : 8} fill="#4b4b4b" />
      <ellipse cx="75" cy={eyeY} rx="7" ry={mood === "cheer" ? 3 : 8} fill="#4b4b4b" />
      {mood !== "cheer" && (
        <>
          <circle cx="47" cy={eyeY - 3} r="2.4" fill="#fff" />
          <circle cx="77" cy={eyeY - 3} r="2.4" fill="#fff" />
        </>
      )}
      {mood === "sad" && (
        <>
          <path d="M36 38l14 4M84 38l-14 4" stroke="#4b4b4b" strokeWidth="3" strokeLinecap="round" />
          <path d="M80 58c2 4 2 7 0 9-2-2-2-5 0-9z" fill="#1cb0f6" />
        </>
      )}
      {/* nose + mouth */}
      <ellipse cx="60" cy="60" rx="5" ry="3.5" fill="#4b4b4b" />
      {mood === "sad" ? (
        <path d="M53 70q7-5 14 0" fill="none" stroke="#4b4b4b" strokeWidth="2.5" strokeLinecap="round" />
      ) : (
        <path d="M52 65q8 8 16 0" fill={mood === "cheer" ? "#ff4b4b" : "none"} stroke="#4b4b4b" strokeWidth="2.5" strokeLinecap="round" />
      )}
    </svg>
  );
}
