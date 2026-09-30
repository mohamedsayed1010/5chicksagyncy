// Coordinates the three work carousels so that only one video plays at a time:
// the active slide of the row closest to the viewport centre (or the row the user
// explicitly played, or the fullscreen slide). Videos only get a src while playing.
export function createPlaybackController() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const rows = [];
  let scrollFrame = 0;
  const controller = {
    rows,
    manualRow: null,
    dialog: null,
    reducedMotion
  };

  function getVisibleRow(row) {
    const card = row.cards[row.active];
    if (!card || !card.slide) return null;
    if (document.fullscreenElement === card.slide) return { row, distance: -1 };
    const rect = card.slide.getBoundingClientRect();
    const visible = Math.max(
      0,
      Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 80)
    );
    if (visible < Math.min(rect.height, innerHeight - 80) * 0.5) return null;
    return {
      row,
      distance: Math.abs((rect.top + rect.bottom) / 2 - (innerHeight + 80) / 2)
    };
  }

  function getPlaybackTarget() {
    if (document.hidden || controller.dialog?.open) return null;
    const candidates = rows
      .map(getVisibleRow)
      .filter(Boolean)
      .sort((a, b) => a.distance - b.distance);
    const full = candidates.find((candidate) => candidate.distance === -1);
    const manualRow = controller.manualRow;
    const row =
      full?.row ||
      (manualRow && getVisibleRow(manualRow) ? manualRow : candidates[0]?.row);
    if (
      !row ||
      row.transitioning ||
      row.userPaused ||
      (reducedMotion.matches && !row.manual)
    )
      return null;
    const card = row.cards[row.active];
    return card.error ? null : card.video;
  }

  function syncPlayback() {
    const target = getPlaybackTarget();
    let targetCard = null;
    rows.forEach((row) =>
      row.cards.forEach((card) => {
        const video = card.video;
        if (!video) return;
        if (video === target) {
          targetCard = card;
          return;
        }
        video.pause();
        if (video.hasAttribute('src')) {
          card.resumeTime = video.currentTime || 0;
          video.removeAttribute('src');
          video.load();
        }
      })
    );
    if (target && target.paused && !targetCard.pending) {
      targetCard.pending = true;
      if (!target.hasAttribute('src')) target.src = targetCard.src;
      target
        .play()
        .catch(() => {})
        .finally(() => {
          targetCard.pending = false;
        });
    }
  }

  function pauseOthers(video) {
    rows.forEach((row) =>
      row.cards.forEach((card) => {
        if (card.video && card.video !== video) card.video.pause();
      })
    );
  }

  function schedulePlayback() {
    if (!scrollFrame)
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        if (controller.manualRow && !getVisibleRow(controller.manualRow))
          controller.manualRow = null;
        syncPlayback();
      });
  }

  function register(row) {
    rows.push(row);
    return () => {
      const index = rows.indexOf(row);
      if (index !== -1) rows.splice(index, 1);
      if (controller.manualRow === row) controller.manualRow = null;
    };
  }

  // Page-level listeners; returns a cleanup function.
  function attach() {
    window.addEventListener('scroll', schedulePlayback, { passive: true });
    window.addEventListener('resize', schedulePlayback);
    document.addEventListener('visibilitychange', syncPlayback);
    document.addEventListener('fullscreenchange', syncPlayback);
    reducedMotion.addEventListener('change', syncPlayback);
    return () => {
      window.removeEventListener('scroll', schedulePlayback);
      window.removeEventListener('resize', schedulePlayback);
      document.removeEventListener('visibilitychange', syncPlayback);
      document.removeEventListener('fullscreenchange', syncPlayback);
      reducedMotion.removeEventListener('change', syncPlayback);
      cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
    };
  }

  return Object.assign(controller, {
    getPlaybackTarget,
    syncPlayback,
    pauseOthers,
    register,
    attach
  });
}
