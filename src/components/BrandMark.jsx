export default function BrandMark({ size = 20, stroke = "#b8863e", strokeWidth = 6 }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <circle cx="50" cy="50" r="42" fill="none" stroke={stroke} strokeWidth={strokeWidth} />
      <line x1="50" y1="4" x2="50" y2="26" stroke={stroke} strokeWidth={strokeWidth} />
      <line x1="50" y1="74" x2="50" y2="96" stroke={stroke} strokeWidth={strokeWidth} />
      <line x1="4" y1="50" x2="26" y2="50" stroke={stroke} strokeWidth={strokeWidth} />
      <line x1="74" y1="50" x2="96" y2="50" stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  );
}
