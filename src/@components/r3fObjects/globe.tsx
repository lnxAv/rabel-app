import { Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useState } from 'react';

import CartesianShader from '../../@styles/shader/cartesian/component';
import AnimatedLine from './animatedLine';
import LoadingGlobe from './loadingGlobe';

/* eslint-enable no-unused-vars */
const sg = {
  radius: 1,
  widthSegment: 32,
  heightSegment: 15,
  phiStart: 0,
  phiLength: Math.PI * 2,
  thetaStart: 0,
  thetaLength: Math.PI,
};

const Globe = () => {
  const [num, setNum] = useState<number>(0);

  useFrame((time) => {
    const normaled = parseFloat(((Math.cos(time.clock.elapsedTime / 2) - 0) / (1 - 0)).toFixed(2));
    setNum(normaled <= 0 ? 1 + normaled : normaled);
  });

  const animatedLineWidth = (
    value: number,
    check: number,
    precision: number,
    width: number,
    minWidth: number = 0
  ) => {
    const precisionValidity = value >= check - precision && value <= check + precision;
    if (!precisionValidity) {
      return minWidth;
    }
    if (precision === 0) {
      return width;
    }
    const halfDistance = Math.abs(value - check);
    const distancePercentage = ((halfDistance / precision) * Math.PI) / 2;
    const newWidth = width * Math.cos(distancePercentage);
    return newWidth;
  };
  return (
    <group>
      <mesh rotation={[0, -0.6, 0]}>
        {/* @ts-ignore */}
        <Sphere scale={1} position={[0, 0, 0]} args={[...Object.values(sg)]}>
          <CartesianShader u={{ hue: [255, 0, 0], sharpness: 1 }} />
        </Sphere>
        <AnimatedLine
          amplitude={1.3}
          angle={180}
          scale={1}
          rotation={[0, 0, -Math.PI / 2]}
          position={[0, 0, 0]}
          color="red"
          opacity={0.6}
          dashArray={0.01}
          dashRatio={0.5}
          widthCallback={(p: number) =>
            animatedLineWidth(num, p, 0.01, Math.random() * 0.2, Math.random() * 0.01)
          }
        />
      </mesh>
      <LoadingGlobe phiLength={sg.phiLength} thetaLength={sg.thetaLength} />
    </group>
  );
};

export default Globe;
