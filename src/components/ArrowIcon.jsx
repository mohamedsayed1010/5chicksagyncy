const PATHS = {
  '↗': 'M5 19 19 5M5 5h14v14',
  '↘': 'M5 5 19 19M5 19h14V5',
  '↓': 'M12 4v16m-7-7 7 7 7-7',
  '↑': 'M12 20V4m-7 7 7-7 7 7',
  '←': 'M20 12H4m7-7-7 7 7 7',
  '→': 'M4 12h16m-7-7 7 7-7 7',
  '↳': 'M6 4v13h14m-6-6 6 6-6 6'
};

// Inline SVG replacement for the arrow glyphs used across the site.
export default function ArrowIcon({ char }) {
  const directional = char === '↗' || char === '↘';
  return (
    <svg
      viewBox="0 0 24 24"
      className={directional ? 'arrow-icon directional-icon' : 'arrow-icon'}
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[char]} />
    </svg>
  );
}

// Turns a plain string such as "Explore work ↓" into text + inline arrow icons.
export function withIcons(text) {
  return text
    .split(/([↗↘↓↑←→↳])/)
    .filter(Boolean)
    .map((part, index) =>
      PATHS[part] ? <ArrowIcon key={index} char={part} /> : part
    );
}
