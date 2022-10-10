import { OrthographicCamera, useScroll } from '@react-three/drei';
import { extend, ReactThreeFiber, useFrame, useThree } from '@react-three/fiber';
import { MeshLine, MeshLineMaterial } from 'meshline';
import React, { useEffect, useRef, useState } from 'react';
import { MathUtils } from 'three';

import Globe from '../../@components/r3fObjects/globe';
import { GroupReffered } from '../../@helpers/types';
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
  const globeRef = useRef<GroupReffered>(null);
  const data = useScroll();
  const { width, height } = useThree((s) => s.viewport);

  const doGlobeFrame = (a: number, delta: number) => {
    if (!globeRef.current) return;
    if (a < 0.001) {
      const defaultY = globeRef.current.userData.defaultPosition[1];
      globeRef.current.position.y = MathUtils.damp(globeRef.current.position.y, defaultY, 4, delta);
    } else {
      globeRef.current.position.y = MathUtils.damp(
        globeRef.current.position.y,
        -height * a - 5,
        4,
        delta
      );
    }
  };

  useFrame((time, delta) => {
    const a1 = data.range(1 / 4, 0.07).toPrecision(2); // right-to-left
    const a2 = data.range(1 / 4 + 0.035, 1.85 / 4 - (1 / 4 + 0.035)).toPrecision(2); // movr-to-bottom
    const a3 = data.curve(1.5 / 4 + 0.035, 0.3); // Move sphere
    doGlobeFrame(a3, delta);
  });
  useEffect(() => {});

  return (
    <>
      <OrthographicCamera />
      <Globe ref={globeRef} />
    </>
  );
};

export default R3f;
