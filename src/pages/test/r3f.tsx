import { OrthographicCamera } from '@react-three/drei';
import { extend, ReactThreeFiber } from '@react-three/fiber';
import { MeshLine, MeshLineMaterial } from 'meshline';
import React, { useEffect } from 'react';

import Globe from '../../@components/r3fObjects/globe';
import { XR3f } from '../x-page';

extend({ MeshLine, MeshLineMaterial });

/* eslint-disable no-unused-vars */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLine: ReactThreeFiber.Object3DNode<MeshLine, typeof MeshLine>;
      meshLineMaterial: ReactThreeFiber.Object3DNode<MeshLineMaterial, typeof MeshLineMaterial>;
    }
  }
}
/* eslint-enable no-unused-vars */

const R3f: XR3f<any> = () => {
  useEffect(() => {});
  return (
    <>
      <OrthographicCamera />
      <Globe />
    </>
  );
};

R3f.scrollControls = {
  pages: 2,
  damping: 10,
};

export default R3f;
