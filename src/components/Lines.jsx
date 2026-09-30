import { Fragment } from 'react';

// Renders CMS text where "\n" means a line break: "A\nB" → A<br />B (empty parts render nothing).
export default function Lines({ text }) {
  return String(text ?? '')
    .split('\n')
    .map((part, i) => (
      <Fragment key={i}>
        {i > 0 && <br />}
        {part || null}
      </Fragment>
    ));
}
