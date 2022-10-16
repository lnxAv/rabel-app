import { OrthographicCamera, Text, useScroll } from '@react-three/drei';
import { extend, ReactThreeFiber, ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { MeshLine, MeshLineMaterial } from 'meshline';
import React, { useEffect, useRef, useState } from 'react';
import { Box3, MathUtils, Vector3 } from 'three';

import { BoundaryHover } from '../../@components/r3fObjects/BoundaryHover';
import Globe from '../../@components/r3fObjects/globe';
import { GroupReffered, MeshReffered } from '../../@helpers/types';
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
const fontProps = {
  font: 'fonts/disket-mono-bold.woff',
  fontSize: 1,
  letterSpacing: -0.05,
  lineHeight: 0.7,
  strokeColor: 'white',
  strokeWidth: 0.01,
};

const SelectionArray = ['ABOUT', 'TOOLS', 'PRJCT', 'REACH'];

type TextBounds = {
  [k in string]: Box3;
};

const R3f: XR3f<any> = () => {
  const globeGroupRef = useRef<GroupReffered>(null);
  const textGroupRef = useRef<GroupReffered>(null);
  const textArrayRef = useRef<Array<MeshReffered>>([]);
  const textBoundsRef = useRef<TextBounds>({});
  const [defaultBox, setDefaultBox] = useState<Box3 | undefined>(undefined);
  const [defaultX, setDefaultX] = useState<Vector3 | undefined>(undefined);
  const defaultBoxTimeout = useRef<number | undefined | ReturnType<typeof setTimeout>>(undefined);
  const toVecRef = useRef<Vector3>(new Vector3(0));
  const fromVecRef = useRef<Vector3>(new Vector3(0));
  const data = useScroll();
  const selected = useRef<string>('');
  const [hovered, setHovered] = useState<string | null>(null);
  const [{ width, height }] = useThree((s) => [s.viewport, s.mouse]);

  const doGlobeFrame = (a: number, delta: number) => {
    if (!globeGroupRef.current) return;
    if (a < 0.001) {
      const defaultY = globeGroupRef.current.userData.defaultPosition[1];
      globeGroupRef.current.position.y = MathUtils.damp(
        globeGroupRef.current.position.y,
        defaultY,
        4,
        delta
      );
    } else {
      globeGroupRef.current.position.y = MathUtils.damp(
        globeGroupRef.current.position.y,
        -height * a + 0.5,
        2,
        delta
      );
    }
  };

  const doTextFrame = (a1: number, a2: number, topOffset: number, delta: number) => {
    if (!textGroupRef.current) return;
    // horizontal animation
    if (a1 < 0.001) {
      textGroupRef.current.position.x = MathUtils.damp(
        textGroupRef.current.position.x,
        width * 2,
        4,
        delta
      );
    } else {
      textGroupRef.current.position.x = MathUtils.damp(
        textGroupRef.current.position.x,
        (a1 - 1) * -width * 2,
        8,
        delta
      );
    }
    // vertical animation
    if (a2 < 0.001) {
      textArrayRef.current.forEach((textRef) => {
        /* eslint-disable no-param-reassign */
        textRef.position.y = MathUtils.damp(textRef.position.y, 0, 4, delta);
      });
    } else {
      textArrayRef.current.forEach((textRef, i) => {
        const isReady = textRef.position.y > 0.9 * -i;
        const isSelected = selected.current === textRef.userData.selection;
        if (
          a2 < 0.99 ||
          (!isSelected && !isReady) ||
          topOffset > textGroupRef.current.position.y - i - 1
        ) {
          textRef.position.y = MathUtils.damp(textRef.position.y, Math.max(-i, -i * a2), 8, delta);
        } else if (isSelected && topOffset < textGroupRef.current.position.y - i - 1) {
          textRef.position.y = MathUtils.damp(
            textRef.position.y,
            topOffset - textGroupRef.current.position.y + 1,
            9,
            delta
          );
        }
      });
    }
  };

  useEffect(() => {
    if (hovered) document.body.style.cursor = 'pointer';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  useFrame((time, delta) => {
    const a1 = data.range(0.5 / 6, 0.07); // right-to-left
    const a2 = data.range(0.5 / 6 + 0.035, 1.85 / 5 - (1 / 4 + 0.035)); // movr-to-bottom
    const a3 = data.curve(1 / 6, 0.3); // Move sphere
    const stickyOffset = -height * ((data.pages - 1) * data.offset) + height * data.offset;
    doGlobeFrame(a3, delta);
    doTextFrame(a1, a2, stickyOffset, delta);
  });

  const handleOnHovered = (e: ThreeEvent<PointerEvent>, v: string, index: number) => {
    setHovered(v);
    if (defaultBox) {
      setDefaultBox(undefined);
    }
    toVecRef.current = textArrayRef.current[index].position;
    fromVecRef.current = textArrayRef.current[index].position;
  };

  const handleOnHoveredLeave = (e: ThreeEvent<PointerEvent>, v: string, index: number) => {
    if (v === selected.current) {
      selected.current = v;
      setDefaultBox(textBoundsRef.current[v]);
      setDefaultX(textArrayRef.current[SelectionArray.indexOf(selected.current) || 0].position);
      clearTimeout(defaultBoxTimeout.current);
    } else {
      clearTimeout(defaultBoxTimeout.current);
      defaultBoxTimeout.current = setTimeout(() => {
        setDefaultBox(textBoundsRef.current[v]);
        setDefaultX(textArrayRef.current[SelectionArray.indexOf(selected.current) || 0].position);
      }, 500);
    }
    setHovered(null);
    fromVecRef.current = textArrayRef.current[index].position;
  };

  const handleOnSelected = (e: ThreeEvent<MouseEvent>, v: string, index: number) => {
    clearTimeout(defaultBoxTimeout.current);
    selected.current = v;
    setDefaultBox(textBoundsRef.current[v]);
    setDefaultX(textArrayRef.current[SelectionArray.indexOf(selected.current) || 0].position);
    fromVecRef.current = textArrayRef.current[index].position;
  };

  return (
    <>
      <OrthographicCamera />
      <Globe ref={globeGroupRef} globeText={hovered} />
      <group
        ref={textGroupRef}
        position={[width * 2, -height + 3, -1]}
        scale={[Math.min(height / 3, width / 3), height / 5, 1]}
      >
        {SelectionArray.map((v, i) => (
          <Text
            key={v}
            ref={(ref: MeshReffered) => (textArrayRef.current[i] = ref)}
            userData={{ selection: v }}
            position={[0, -i, 0]}
            renderOrder={-5}
            anchorX="center"
            anchorY="middle"
            onPointerUp={(e) => handleOnSelected(e, v, i)}
            onPointerEnter={(e) => handleOnHovered(e, v, i)}
            onPointerDown={(e) => handleOnHovered(e, v, i)}
            onPointerLeave={(e) => handleOnHoveredLeave(e, v, i)}
            onSync={(mesh) => {
              const blockBounds = { ...mesh.textRenderInfo.visibleBounds };
              textBoundsRef.current[v] = new Box3(
                new Vector3(blockBounds[0], blockBounds[1], 0),
                new Vector3(blockBounds[2], blockBounds[3], 0)
              );
              if (i === 0) {
                selected.current = v;
                setDefaultBox(textBoundsRef.current[v]);
                setDefaultX(mesh.position);
              }
            }}
            {...fontProps}
            fillOpacity={selected.current === v ? 1 : hovered === v ? 0.5 : 0}
            strokeOpacity={selected.current === v ? 1 : hovered === v ? 0.5 : 1}
          >
            {v}
          </Text>
        ))}
        <BoundaryHover
          box={hovered ? textBoundsRef.current[hovered] : defaultBox}
          to={hovered ? toVecRef.current : defaultX}
          from={!hovered ? fromVecRef.current : undefined}
        />
      </group>
    </>
  );
};

export default R3f;
