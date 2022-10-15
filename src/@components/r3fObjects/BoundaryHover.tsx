import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import { Box3, MathUtils, Vector3 } from 'three';

import { GroupReffered, MeshReffered } from '../../@helpers/types';

type Props = {
  from?: Vector3;
  to?: Vector3;
  box?: Box3;
};

// Order:
// top-left: 0 - top-right: 1 - bottom right: 2 - bottom left: 3
const defaultBoundary = [
  { x: -0.2, y: 0.2 },
  { x: 0.2, y: 0.2 },
  { x: 0.2, y: 0 },
  { x: -0.2, y: 0 },
];

const basicVector = new Vector3(0);

export const BoundaryHover = ({ from, to, box }: Props) => {
  const [boundaryCenterDone, setBoundaryCenterDone] = useState<boolean>(true);
  const [boundaryBorderDone, setBoundaryBorderDone] = useState<boolean>(true);
  const boxSize = useRef<Vector3>(basicVector.clone());
  const boundaryRef = useRef<Array<MeshReffered>>([]);
  const boundaryGroupRef = useRef<GroupReffered>(null);
  const boundaryBorderGoals = useRef<Array<{ x: number; y: number }>>(defaultBoundary);

  const getBoundaryBorderGoals = (index: number) => {
    const x = boxSize.current.x / 2;
    const y = boxSize.current.y / 2;
    switch (index) {
      case 0:
        return { x: -x, y };
        break;
      case 1:
        return { x, y };
        break;
      case 2:
        return { x, y: 0 };
        break;
      case 3:
        return { x: -x, y: 0 };
        break;
      default:
        return { x: 0, y: 0 };
        break;
    }
  };

  useEffect(() => {
    if (box) {
      box.getSize(boxSize.current);
      boundaryBorderGoals.current = boundaryRef.current.map((elem, i) => getBoundaryBorderGoals(i));
      setBoundaryBorderDone(false);
    } else {
      boundaryBorderGoals.current = defaultBoundary;
      setBoundaryBorderDone(false);
    }
  }, [box]);

  useEffect(() => {
    if (from && boundaryGroupRef.current) {
      boundaryGroupRef.current.position.x = from.x;
      boundaryGroupRef.current.position.y = from.y;
      setBoundaryCenterDone(false);
    }
  }, [from]);

  useEffect(() => {
    if (to) {
      setBoundaryCenterDone(false);
    }
  }, [to]);

  const doBoundsFrame = (delta: number) => {
    if (!boundaryBorderDone) {
      // Move the boundary's border (boundaryBox)
      let defaultTotal = 0;
      boundaryRef.current.forEach((elem, i) => {
        if (elem.position.x === boundaryBorderGoals?.current?.[i].x) {
          defaultTotal++;
        } else {
          // eslint-disable-next-line no-param-reassign
          elem.position.x = MathUtils.damp(
            elem.position.x,
            boundaryBorderGoals.current[i].x,
            5,
            delta
          );
          // eslint-disable-next-line no-param-reassign
          elem.position.y = MathUtils.damp(
            elem.position.y,
            boundaryBorderGoals.current[i].y,
            5,
            delta
          );
        }

        if (defaultTotal >= defaultBoundary.length) {
          // If all 4 positions are done, stop loop
          setBoundaryBorderDone(true);
        }
      });
    }

    if (!boundaryCenterDone) {
      // Move the boundary's center (from - to)
      if (boundaryGroupRef.current && to) {
        boundaryGroupRef.current.position.x = MathUtils.damp(
          boundaryGroupRef.current.position.x,
          to.x,
          8,
          delta
        );
        boundaryGroupRef.current.position.y = MathUtils.damp(
          boundaryGroupRef.current.position.y,
          to.y,
          10,
          delta
        );
      }
    }
  };

  useFrame((time, delta) => {
    doBoundsFrame(delta);
  });

  return (
    <group ref={boundaryGroupRef} position={[0, 0, 0]}>
      {defaultBoundary.map((pos, i) => (
        <mesh
          key={i}
          ref={(element) => {
            if (element) {
              boundaryRef.current[i] = element;
            }
          }}
          position={[pos.x, pos.y, 0]}
        >
          <Html style={{ pointerEvents: 'none' }}>
            <div
              style={{
                content: ' ',
                position: 'absolute',
                height: `${boxSize.current.y * 110}px`, // 100%
                top: `-${boxSize.current.y * 10}px`, // 10%
                width: '10px',
                margin: `0 ${boxSize.current.x * 2 * (i === 1 || i === 2 ? 1 : -2)}px`, // 2%
                borderLeft: `${i === 0 || i === 3 ? '5px solid white' : 'none'}`,
                borderRight: `${i === 1 || i === 2 ? '5px solid white' : 'none'}`,
                borderBottom: `${i === 2 || i === 3 ? '5px solid white' : 'none'}`,
                borderTop: `${i === 0 || i === 1 ? '5px solid white' : 'none'}`,
              }}
            />
          </Html>
        </mesh>
      ))}
    </group>
  );
};

export default BoundaryHover;
