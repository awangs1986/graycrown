// English · Comic City uses the shared comic kit with its default places, cast and props.
import { createComicKit, basePlaces } from '../shared/comic-kit.mjs';
export { muddle } from '../shared/comic-kit.mjs';
const kit = createComicKit();
export const places = basePlaces;
export const { castNames, propNames, propsFor, comicPanel } = kit;
