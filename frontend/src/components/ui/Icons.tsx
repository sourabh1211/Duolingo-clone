// Hand-drawn SVG icons in the app's chunky, two-tone style.
type P = { className?: string; dim?: boolean; initial?: string };

export const FlameIcon = ({ className = "h-7 w-7", dim }: P) => (
  <svg viewBox="0 0 24 30" className={className} aria-hidden>
    <path d="M12 1c1 5 9 9 9 17a9 9 0 0 1-18 0c0-4 2-7 4-9 0 3 1 5 3 5-1-5 0-10 2-13z" fill={dim ? "#e5e5e5" : "#ff9600"} />
    <path d="M12 14c1 3 5 5 5 9a5 5 0 0 1-10 0c0-2 1-4 3-5 0 2 1 2 2 2-1-2-1-4 0-6z" fill={dim ? "#cfcfcf" : "#ffc800"} />
  </svg>
);

export const GemIcon = ({ className = "h-7 w-7" }: P) => (
  <svg viewBox="0 0 28 26" className={className} aria-hidden>
    <path d="M6 1h16l6 8-14 16L0 9z" fill="#1cb0f6" />
    <path d="M6 1h16l-3 8H9zM0 9h28L14 25z" fill="#49c0f8" opacity=".8" />
    <path d="M9 9h10l-5 16z" fill="#84d8ff" />
  </svg>
);

export const HeartIcon = ({ className = "h-7 w-7", dim }: P) => (
  <svg viewBox="0 0 28 25" className={className} aria-hidden>
    <path d="M14 25S0 16.5 0 7.5A7.5 7.5 0 0 1 14 4a7.5 7.5 0 0 1 14 3.5C28 16.5 14 25 14 25z" fill={dim ? "#e5e5e5" : "#ff4b4b"} />
    <ellipse cx="7.5" cy="7" rx="3" ry="2" fill="#fff" opacity={dim ? 0 : 0.5} transform="rotate(-30 7.5 7)" />
  </svg>
);

export const BoltIcon = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 20 28" className={className} aria-hidden>
    <path d="M12 0 0 16h8l-2 12 14-17h-8z" fill="#ffc800" />
  </svg>
);

export const CrownIcon = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 28 22" className={className} aria-hidden>
    <path d="M2 6l6 5 6-9 6 9 6-5-3 14H5z" fill="#ffc800" stroke="#e5a400" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export const StarIcon = ({ className = "h-9 w-9", color = "#fff" }: P & { color?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.2 1.3-6.6L2.5 9.3l6.6-.8z" fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export const BookIcon = ({ className = "h-9 w-9", color = "#fff" }: P & { color?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M3 5c3-1.5 6-1.5 9 .5v14c-3-2-6-2-9-.5zM21 5c-3-1.5-6-1.5-9 .5v14c3-2 6-2 9-.5z" fill={color} />
  </svg>
);

export const DumbbellIcon = ({ className = "h-9 w-9", color = "#fff" }: P & { color?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <g fill={color}>
      <rect x="1" y="9" width="3" height="6" rx="1.2" />
      <rect x="4" y="6" width="4" height="12" rx="1.5" />
      <rect x="7" y="10.5" width="10" height="3" rx="1" />
      <rect x="16" y="6" width="4" height="12" rx="1.5" />
      <rect x="20" y="9" width="3" height="6" rx="1.2" />
    </g>
  </svg>
);

export const TrophyIcon = ({ className = "h-9 w-9", color = "#fff" }: P & { color?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path
      d="M7 3h10v6a5 5 0 0 1-10 0zM7 5H3v2a4 4 0 0 0 4 4M17 5h4v2a4 4 0 0 1-4 4M10 14h4v3h-4zM7 18h10v3H7z"
      fill={color}
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const LockIcon = ({ className = "h-8 w-8", color = "#afafaf" }: P & { color?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <rect x="4" y="10" width="16" height="12" rx="3" fill={color} />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke={color} strokeWidth="3" />
  </svg>
);

export const CheckIcon = ({ className = "h-8 w-8", color = "#fff" }: P & { color?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M4 12.5l5 5L20 6.5" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CloseIcon = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const SpeakerIcon = ({ className = "h-7 w-7" }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M3 9h4l5-4v14l-5-4H3z" fill="currentColor" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

export const ChestIcon = ({ className = "h-8 w-8" }: P) => (
  <svg viewBox="0 0 32 28" className={className} aria-hidden>
    <path d="M2 10a8 8 0 0 1 8-8h12a8 8 0 0 1 8 8v2H2z" fill="#cd7900" />
    <rect x="2" y="12" width="28" height="14" rx="2" fill="#ff9600" />
    <rect x="13" y="9" width="6" height="8" rx="1.5" fill="#ffc800" />
  </svg>
);

/* Sidebar navigation icons */
export const NavHome = ({ className = "h-8 w-8" }: P) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden>
    <path d="M4 15 16 4l12 11v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" fill="#ff9600" />
    <path d="M2 16 16 3l14 13" fill="none" stroke="#ff4b4b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="12.5" y="19" width="7" height="10" rx="1.5" fill="#cd7900" />
  </svg>
);
export const NavLeague = ({ className = "h-8 w-8" }: P) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden>
    <path d="M16 2 28 6v9c0 7-5 12-12 15C9 27 4 22 4 15V6z" fill="#ffc800" />
    <path d="M16 6l8 2.7V15c0 4.6-3.2 8-8 10.3z" fill="#e5a400" />
  </svg>
);
export const NavQuests = ({ className = "h-8 w-8" }: P) => <ChestIcon className={className} />;
export const NavShop = ({ className = "h-8 w-8" }: P) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden>
    <path d="M5 11h22l-2 17H7z" fill="#ff4b4b" />
    <path d="M11 13V9a5 5 0 0 1 10 0v4" fill="none" stroke="#ea2b2b" strokeWidth="3" strokeLinecap="round" />
    <path d="M5 11h22l-.6 5H5.6z" fill="#ea2b2b" opacity=".35" />
  </svg>
);
export const NavProfile = ({ className = "h-8 w-8", initial = "" }: P & { initial?: string }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden>
    <circle cx="16" cy="16" r="13" fill="none" stroke="rgb(var(--muted))" strokeWidth="2" strokeDasharray="4 3" />
    <text x="16" y="20.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="rgb(var(--muted))">{initial}</text>
    <circle cx="26" cy="6" r="3.5" fill="#ff4b4b" />
  </svg>
);
export const NavSounds = ({ className = "h-8 w-8" }: P) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden>
    <path d="M3 16c4-7 9-9 13-6 4-3 9-1 13 6-4 7-9 9-13 9s-9-2-13-9z" fill="#ff4b4b" />
    <path d="M7 16c3-2 6-3 9-2 3-1 6 0 9 2-3 3-6 4-9 4s-6-1-9-4z" fill="#fff" />
    <path d="M9 16h14" stroke="#ea2b2b" strokeWidth="1.5" />
  </svg>
);
export const NotebookIcon = ({ className = "h-7 w-7" }: P) => (
  <svg viewBox="0 0 28 28" className={className} aria-hidden>
    <rect x="6" y="3" width="17" height="22" rx="3" fill="#fff" />
    <path d="M10 9h9M10 13h9M10 17h9M10 21h5" stroke="#58a700" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 8h4M4 13h4M4 18h4" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);
export const ArrowLeftIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M20 12H5m6-7-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const ShieldLockIcon = ({ className = "h-14 w-14" }: P) => (
  <svg viewBox="0 0 40 44" className={className} aria-hidden>
    <path d="M20 2 37 7v13c0 11-7 18-17 22C10 38 3 31 3 20V7z" fill="rgb(var(--locked))" />
    <path d="M20 6 33 10v10c0 8-5 14-13 17-8-3-13-9-13-17V10z" fill="rgb(var(--soft) / .18)" />
    <circle cx="20" cy="19" r="3.5" fill="rgb(var(--locked-icon))" />
    <rect x="17.5" y="20" width="5" height="8" rx="2" fill="rgb(var(--locked-icon))" />
  </svg>
);
export const NavMore = ({ className = "h-8 w-8" }: P) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden>
    <circle cx="16" cy="16" r="14" fill="#1cb0f6" />
    <circle cx="10" cy="16" r="2.4" fill="#fff" />
    <circle cx="16" cy="16" r="2.4" fill="#fff" />
    <circle cx="22" cy="16" r="2.4" fill="#fff" />
  </svg>
);
