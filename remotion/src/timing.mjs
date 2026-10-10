// Shared timing for compositions, captions (WebVTT) and tests. 30 fps, 1280×720.
export const FPS = 30, W = 1280, H = 720;
export const INTRO = 75, STEP = 105, OUTRO = 75; // frames
export const durationFor = steps => INTRO + steps * STEP + OUTRO;
export const stepStart = i => INTRO + i * STEP;
