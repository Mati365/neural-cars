export {default as toRadians} from './toRadians';
export {default as vec2} from './vec2';
export {default as line} from './line';

export const clamp = (min, max, number) => (
  Math.min(Math.max(number, min), max)
);
