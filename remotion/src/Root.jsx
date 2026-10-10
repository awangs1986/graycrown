import React from 'react';
import { Composition } from 'remotion';
import { Example } from './Example.jsx';
import { FPS, W, H, durationFor } from './timing.mjs';
import { videos } from '../../web/courses/olympiad/course.mjs';
import { VISUAL_FOR } from './map.mjs';
export const RemotionRoot = () => <>{videos.map(v => <Composition key={v.id} id={v.id} component={Example} fps={FPS} width={W} height={H}
  durationInFrames={durationFor(v.captions.length)} defaultProps={{ lesson: { ...v, method: VISUAL_FOR[v.id].method }, visual: VISUAL_FOR[v.id].visual }} />)}</>;
