// Marquee strip. Items come from the "ticker" section; hidden items are skipped.
function TickerText({ items }) {
  return (
    <span>
      {items.map((item, i) => [
        (i === 0 ? '' : ' ') + item.text + ' ',
        <b key={i}>✳</b>
      ])}
      {/* The trailing space is part of the loop spacing between the two copies. */}
      {' '}
    </span>
  );
}

export default function Ticker({ section }) {
  const items = (section.items || []).filter((item) => item.enabled !== false && item.text);
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        <TickerText items={items} />
        <TickerText items={items} />
      </div>
    </div>
  );
}
