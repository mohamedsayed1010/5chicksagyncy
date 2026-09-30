import { createContext, useContext, useEffect, useState } from 'react';
import { createPlaybackController } from '../hooks/playbackController.js';

// One video playback controller for the whole site (only one video plays at a time), plus the
// portfolio dialog, which pauses playback while it is open.
const PlaybackContext = createContext(null);
const DialogContext = createContext(null);

export function PlaybackProvider({ children }) {
  const [controller] = useState(() => (typeof window === 'undefined' ? null : createPlaybackController()));
  const [dialog, setDialog] = useState({ open: () => {}, element: null });
  useEffect(() => controller?.attach(), [controller]);
  return (
    <PlaybackContext.Provider value={controller}>
      <DialogContext.Provider value={{ dialog, setDialog }}>{children}</DialogContext.Provider>
    </PlaybackContext.Provider>
  );
}

// During the build-time render there is no window; carousels only use the controller in effects.
const SERVER_CONTROLLER = { register: () => () => {}, reducedMotion: { matches: false }, syncPlayback() {}, pauseOthers() {}, getPlaybackTarget: () => null };
export const usePlayback = () => useContext(PlaybackContext) || SERVER_CONTROLLER;
export const usePortfolioDialog = () => useContext(DialogContext);
