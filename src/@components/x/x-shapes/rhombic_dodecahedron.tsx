import { Line } from '@react-three/drei';
import { MeshProps } from '@react-three/fiber';
import React, { forwardRef } from 'react';

import { GroupReffered, MeshReffered } from '../../../@helpers/types';

export const args: PolyhedronArgs = {
  vertices: [
    [1, 1, 1], // 0
    [1, 1, -1], // 1
    [1, -1, 1], // 2
    [1, -1, -1], // 3
    [-1, 1, 1], // 4
    [-1, 1, -1], // 5
    [-1, -1, 1], // 6
    [-1, -1, -1], // 7
    [2, 0, 0], // 8
    [-2, 0, 0], // 9
    [0, 2, 0], // 10
    [0, -2, 0], // 11
    [0, 0, 2], // 12
    [0, 0, -2], // 13
  ],
  indices: [
    // Top
    12, 2, 0, 8, 0, 2, 12, 6, 2, 11, 2, 6, 12, 4, 6, 9, 6, 4, 12, 0, 4, 10, 4, 0,
    // Sides
    11, 3, 2, 8, 2, 3, 8, 1, 0, 10, 0, 1, 10, 5, 4, 9, 4, 5, 9, 7, 6, 11, 6, 7,
    // Bottom
    13, 3, 7, 11, 7, 3, 13, 1, 3, 8, 3, 1, 13, 5, 1, 10, 1, 5, 13, 7, 5, 9, 5, 7,
  ],
  indicesLines: [
    // Line 1
    [0, 10, 4, 12, 0, 8, 3],
    // Line 2
    [1, 10, 5, 13, 1, 8, 2],
    // Line 3
    [6, 12, 2, 11, 6, 9, 5],
    // Line 4
    [7, 13, 3, 11, 7, 9, 4],
  ],
  radius: 1,
  detail: 0,
};

export const RhombicDodecaedron = forwardRef<MeshReffered, MeshProps & PolyhedronType>(
  ({ radius = args.radius, detail = args.detail, ...props }, ref) => (
    <mesh ref={ref} {...props}>
      <polyhedronBufferGeometry args={[args.vertices.flat(), args.indices, radius, detail]} />
      {props.children}
    </mesh>
  )
);

export const RhombicDodecaedronLines = forwardRef<GroupReffered, LineType>(
  ({ children, ...props }, ref) => (
    <group ref={ref}>
      {args.indicesLines?.map((value, index) => {
        const points = value.map((indice) => args.vertices[indice]);
        return <Line key={`line-${index}`} points={points} {...props} />;
      })}
      {children}
    </group>
  )
);
