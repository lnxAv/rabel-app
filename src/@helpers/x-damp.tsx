import { MathUtils } from 'three';

type XDamp = (
  from: number,
  to: number,
  lambda: number,
  delta: number,
  fixPrecision?: number,
  onFix?: (to?: number) => void
) => number;

export const xDamp: XDamp = (
  from,
  to,
  lambda,
  delta,
  fixPrecision = 0.000001,
  onFix = () => {}
) => {
  if (from === to) return from;
  const result = MathUtils.damp(from, to, 4, delta);
  if (Math.abs(to) - Math.abs(result) < fixPrecision) {
    onFix(to);
    return to;
  }
  return result;
};
export default xDamp;
