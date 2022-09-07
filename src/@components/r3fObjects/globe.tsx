import { Sphere } from '@react-three/drei';
import { extend, ReactThreeFiber, useFrame } from '@react-three/fiber';
import { MeshLine, MeshLineMaterial } from 'meshline';
import React, { useEffect, useRef, useState } from 'react';
import { Vector3 } from 'three';
import CartesianShader from '../../@styles/shader/cartesian/component';

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
const sg = {
  radius: 1,
  widthSegment: 32,
  heightSegment: 15,
  phiStart: 0,
  phiLength: Math.PI * 2,
  thetaStart: 0,
  thetaLength: Math.PI,
};

const DemiSphere = () => {
  const [num, setNum] = useState<number>(0);
  const ref = useRef<MeshLine>(null);
  // Thank you Mr. doob
  const resolution = 100;
  const amplitude = 1.3;
  const size = 180 / resolution;
  const points = [];
  for (let i = 0; i <= resolution; i += 1) {
    const segment = (i * size * Math.PI) / 180;
    points.push(new Vector3(Math.cos(segment) * amplitude, 0, Math.sin(segment) * amplitude));
  }
  useFrame((time) => {
    const normaled = parseFloat(((Math.cos(time.clock.elapsedTime / 2) - 0) / (1 - 0)).toFixed(2));
    setNum(normaled <= 0 ? 1 + normaled : normaled);
  });
  const animatedWidth = (
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
    <mesh scale={1} rotation={[0, 0, -Math.PI / 2]} position={[0, 0, 0]}>
      <meshLine
        ref={ref}
        attach="geometry"
        widthCallback={(p: number) =>
          animatedWidth(num, p, 0.02, Math.random() * 2, Math.random() * 0.03)
        }
        // @ts-ignore --Vector3 are best for this useCase
        points={points}
      />
      <meshLineMaterial
        attach="material"
        transparent
        depthTest={false}
        lineWidth={0.1}
        color="red"
        opacity={0.8}
        dashArray={0}
        dashRatio={0}
      />
    </mesh>
  );
};

const Globe = () => {
  useEffect(() => {});
  return (
    <group>
      <mesh rotation={[0, -0.6, 0]}>
        {/* @ts-ignore */}
        <Sphere scale={1} position={[0, 0, 0]} args={[...Object.values(sg)]}>
          <CartesianShader u={{ hue: [255, 0, 0], sharpness: 1 }} />
        </Sphere>
        <DemiSphere />
        {/* @ts-ignore */}
      </mesh>
    </group>
  );
};

export default Globe;
