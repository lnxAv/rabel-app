import { MathUtils } from 'three';

type XDamp = (
  from: number,
  to: number,
  lambda: number,
  delta: number,
  precision?: number
) => number;

/* function precisionRound(number: number, precision: number) {
  // https://stackoverflow.com/questions/1458633/how-to-deal-with-floating-point-number-precision-in-javascript
  const factor = 10 ** precision;
  const n = precision < 0 ? number : 0.01 / factor + number;
  return Math.round(n * factor) / factor;
} */

export const xDamp: XDamp = (from, to, lambda, delta) => {
  if (from === to) return from;
  const result = MathUtils.damp(from, to, lambda, delta);
  return result;
};
export default xDamp;
