import React from 'react';
import { XR3f } from '../x-page';

const R3f: XR3f<any> = () => {
  const x = 4;
  return <mesh key={x}>{x}</mesh>;
};

R3f.motion = {
  initial: {
    y: 0,
    x: -5,
    scale: 0,
  },
  animate: {
    y: 0,
    x: 0,
    scale: 1,
  },
  exit: {
    x: 5,
    y: 1,
    scale: 0,
  },
};

R3f.scrollControls = {
  pages: 2,
  damping: 4,
};

export default R3f;
