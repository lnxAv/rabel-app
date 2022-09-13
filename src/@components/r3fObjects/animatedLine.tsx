import { extend, MeshProps, ReactThreeFiber } from '@react-three/fiber';
import { MeshLine, MeshLineMaterial } from 'meshline';
import React from 'react';
import { Vector3 } from 'three';

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

type Props = {
  resolution?: number;
  amplitude?: number;
  angle?: number;
  color?: string | number | THREE.Color;
  opacity?: number;
  lineWidth?: number;
  dashArray?: number;
  dashRatio?: number;
  depthTest?: boolean;
  widthCallback?: (p: number) => any;
} & MeshProps;

const AnimatedLine = ({
  resolution = 100,
  amplitude = 1,
  angle = 360,
  color,
  opacity = 1,
  lineWidth = 1,
  dashArray = 0,
  dashRatio = 0,
  depthTest = false,
  widthCallback,
  ...props
}: Props) => {
  // Thank you Mr. doob
  const size = angle / resolution;
  const points = [];
  for (let i = 0; i <= resolution; i += 1) {
    const segment = (i * size * Math.PI) / 180;
    points.push(new Vector3(Math.cos(segment) * amplitude, 0, Math.sin(segment) * amplitude));
  }

  return (
    <mesh {...props}>
      <meshLine
        attach="geometry"
        widthCallback={widthCallback}
        // @ts-ignore --Vector3 are best for this useCase
        points={points}
      />
      <meshLineMaterial
        attach="material"
        transparent
        depthTest={depthTest}
        lineWidth={lineWidth}
        color={color}
        opacity={opacity}
        dashArray={dashArray}
        dashRatio={dashRatio}
      />
    </mesh>
  );
};

export default AnimatedLine;
