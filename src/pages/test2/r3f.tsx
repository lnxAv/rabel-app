import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';

import { MeshReffered } from '../../@helpers/types';
import { XR3f } from '../x-page';

function R3f(): XR3f<any> {
  const mesh = useRef<MeshReffered>(null);
  useFrame((t, d) => {
    if (mesh.current) {
      mesh.current.rotation.x += mesh.current.rotation.y + 2 * d;
    }
  });
  return (
    <mesh ref={mesh}>
      <tetrahedronBufferGeometry />
      <meshNormalMaterial />
    </mesh>
  );
}

R3f.motion = {
  initial: {
    x: -5,
    y: -1,
    scale: 0,
  },
  animate: {
    y: 0,
    x: 0,
    scale: 1,
  },
  exit: {
    x: 5,
    scale: 0,
  },
};

R3f.scrollControls = {
  pages: 0,
};

export default R3f;
